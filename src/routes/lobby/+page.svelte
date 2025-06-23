<script lang="ts">
	import { goto } from '$app/navigation';
	import { botNames, PlayerColor, settings } from '$lib';
	import Chat from '$lib/components/chat/Chat.svelte';
	import Button from '$lib/components/general/Button.svelte';
	import Checkbox from '$lib/components/general/Checkbox.svelte';
	import Dialog from '$lib/components/general/Dialog.svelte';
	import { icons } from '$lib/components/general/Icon.svelte';
	import Input from '$lib/components/general/Input.svelte';
	import Bot from '$lib/components/player/Bot.svelte';
	import JoinedPlayer from '$lib/components/player/JoinedPlayer.svelte';
	import { createGame } from '$lib/game';
	import { p2p, username } from '$lib/p2p';

	const MAX_PLAYERS = 5;
	let chatMessages: {
		userId: string;
		message: string;
	}[] = $state([]);
	let chatValue = $state('');

	let players: App.Data.Game.Player[] = $state([]);
	let bots: App.Data.Game.Bot[] = $state([]);
	let kickPlayerId: string | undefined = $state();
	let kickDialogOpened = $state(false);
	let disconnectedDialogOpened = $state(false);
	let kickReason = $state('');

	p2p.subscribe(({ peer, connectedLobbyCode, identities }) => {
		if (!peer || !connectedLobbyCode) {
			disconnectedDialogOpened = true;
			return;
		}
		players = [
			...Object.entries(identities).map(([id]) => ({
				id,
				color: PlayerColor.Blue,
				isReady: false
			}))
		];
	});

	p2p.registerHandler<string, string>('/chat', (data, peerId) => {
		console.log(`Chat message from ${peerId}: ${data}`);
		chatMessages.push({
			userId: peerId,
			message: data
		});
		return data;
	});

	p2p.registerHandler<string, void>('/kick-reason', (data, peerId) => {
		console.log(`Player ${peerId} kicked with reason: ${data}`);
		kickReason = data;
	});

	p2p.registerHandler<App.Data.Game.Player, void>('/update-player', (data, peerId) => {
		const index = players.findIndex((p) => p.id === peerId);
		console.log(`before ${JSON.stringify(players[index], null, 4)}}`);
		console.log(`Updating player ${data.id} (${data.isReady ? 'ready' : 'not ready'})`);
		if (index === -1) return;
		players[index] = data;
		console.log(`after ${JSON.stringify(players[index], null, 4)}}`);
	});

	p2p.registerHandler<App.Data.Game.Player[], void>('/start-game', (data) => {
		console.log('Game started with players:', data);
		players = data;
		createGame(players, bots, $settings);
		goto('/game');
	});

	function copyLobbyCode() {
		navigator.clipboard
			.writeText($p2p.connectedLobbyCode ?? '')
			.then(() => {})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	}

	function toggleReady() {
		const meIndex = players.findIndex((p) => p.id === $p2p.peer?.id);
		console.log(`Player is now ${players[meIndex].isReady ? 'ready' : 'not ready'}`);
		if (meIndex === -1) return;
		players[meIndex].isReady = !players[meIndex].isReady;
		p2p.broadcastRequest<App.Data.Game.Player, void>('/update-player', players[meIndex]);
	}

	function leaveLobby() {
		// Logic to leave the lobby
		console.log('Leaving lobby');
		goto('/start');
	}

	async function onBotAdd() {
		const botId = crypto.randomUUID();
		let botName = '';
		do {
			botName = botNames[Math.floor(Math.random() * botNames.length)];
		} while (bots.some((b) => b.name === botName));
		bots.push({
			id: botId,
			name: botName,
			color: PlayerColor.Blue
		});
		console.log(`Bot added: ${botName} (${botId})`);
	}

	function onRemoveBot(botId: string) {
		bots = bots.filter((bot) => bot.id !== botId);
		console.log(`Bot removed: ${botId}`);
	}

	async function onChatMessageSend(value: string) {
		const response = await p2p.broadcastRequest<string, string>('/chat', chatValue);
		chatValue = '';
		console.log(`Chat message sent: ${value} -> ${response}`);
	}

	function onKickButton(playerId: App.Data.Game.Player['id']) {
		kickPlayerId = playerId;
		kickDialogOpened = true;
	}

	function onKickPlayerConfirm() {
		if (!kickPlayerId) return;
		console.log(`Kicking player: ${kickPlayerId}`);
		p2p.sendRequest<string, void>('/kick-reason', kickPlayerId, kickReason);
		p2p.disconnectFromPeer(kickPlayerId);
		kickDialogOpened = false;
		kickPlayerId = undefined;
	}

	function onColorChange(playerIdx: number, color: PlayerColor) {
		console.log(`before ${JSON.stringify(players[playerIdx], null, 4)}}`);
		players[playerIdx].color = color;
		console.log(`Player ${players[playerIdx].id} changed color to ${color}`);
		p2p.broadcastRequest<App.Data.Game.Player, void>('/update-player', players[playerIdx]);
	}

	function onStartGame() {
		console.log('Starting game with players:', players);
		p2p.broadcastRequest<App.Data.Game.Player[], void>('/start-game', players);
		goto('/game');
	}
</script>

<Dialog
	bind:opened={kickDialogOpened}
	title="Kick Player '{kickPlayerId ? $p2p.identities[kickPlayerId] : 'Unknown'}'"
	primary="Remove"
	secondary="Keep"
	onPrimary={onKickPlayerConfirm}
	onSecondary={() => (kickDialogOpened = false)}
>
	{#snippet body()}
		<p>Are you sure you want to remove this player?</p>
		<Input label="Reason (optional)" bind:value={kickReason} placeholder="Reason" />
	{/snippet}
</Dialog>
<Dialog
	bind:opened={disconnectedDialogOpened}
	title="Disconnected"
	primary="Ok"
	onPrimary={() => {
		disconnectedDialogOpened = false;
		goto('/start');
	}}
>
	{#snippet body()}
		{#if kickReason}
			<p>You have been kicked from the lobby.</p>
			<p>Reason: {kickReason}</p>
		{:else}
			<p>You have been removed from the lobby.</p>
		{/if}
	{/snippet}
</Dialog>
<div id="lobby">
	<header>
		<Button variant="secondary" icon={icons.back} onclick={leaveLobby}>Leave</Button>
		<div class="control-group">
			<Input
				icon={icons.code}
				label="Lobby Code"
				hideLabel
				value={$p2p.connectedLobbyCode}
				class="flex-1"
				readonly
			/>
			<Button variant="secondary" icon="clipboard" onclick={copyLobbyCode}>Copy</Button>
		</div>
	</header>
	<code>{JSON.stringify($p2p.identities)}</code>
	<main>
		<div>
			{#each players as player, index (player.id)}
				<JoinedPlayer
					{...player}
					onKick={onKickButton}
					onColorChange={(color) => onColorChange(index, color)}
				/>
			{/each}
			{#each bots as bot (bot.id)}
				<Bot {...bot} onRemove={() => onRemoveBot(bot.id)} />
			{/each}
			{#if players.length + bots.length < MAX_PLAYERS}
				<div>
					<Button variant="secondary" icon={icons.add} onclick={onBotAdd}>Add Bot</Button>
				</div>
			{/if}
		</div>
	</main>
	<footer>
		<div>
			<Chat items={chatMessages} bind:value={chatValue} onsend={onChatMessageSend} />
		</div>
		<div>
			{#if $p2p.isHost}
				<Button
					variant="primary"
					icon={icons.add}
					disabled={players.filter((p) => $p2p.peer?.id !== p.id).some((p) => !p.isReady)}
					onclick={onStartGame}>Start Game</Button
				>
			{:else}
				<Checkbox
					label="Ready"
					value={players.find((p) => p.id === $p2p.peer?.id)?.isReady}
					onclick={toggleReady}
				/>
			{/if}
		</div>
		<div></div>
	</footer>
</div>
