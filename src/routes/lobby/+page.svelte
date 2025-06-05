<script lang="ts">
	import { goto } from '$app/navigation';
	import { botNames } from '$lib';
	import Chat from '$lib/components/chat/Chat.svelte';
	import Button from '$lib/components/general/Button.svelte';
	import Checkbox from '$lib/components/general/Checkbox.svelte';
	import { icons } from '$lib/components/general/Icon.svelte';
	import Input from '$lib/components/general/Input.svelte';
	import Bot from '$lib/components/player/Bot.svelte';
	import JoinedPlayer from '$lib/components/player/JoinedPlayer.svelte';
	import { p2p, peerIdentities, username } from '$lib/p2p';

	const MAX_PLAYERS = 5;
	let lobbyCode = $state('1234-5678');
	let isReady = $state(false);
	let chatMessages: {
		userId: string;
		message: string;
	}[] = $state([]);
	let chatValue = $state('');

	let players: App.Data.Player[] = $state([]);
	let bots: App.Data.Bot[] = $state([]);

	peerIdentities.subscribe((identities) => {
		players = [
			...Object.entries(identities).map(([id, name]) => ({
				id,
				name,
				figureId: '',
				isReady: false,
				isBot: false
			}))
		];
	});

	p2p.registerHandler<string, string>('/chat', (data, conn) => {
		chatMessages.push({
			userId: conn,
			message: data
		});
		return data;
	});

	function copyLobbyCode() {
		navigator.clipboard
			.writeText(lobbyCode)
			.then(() => {})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	}

	function toggleReady() {
		isReady = !isReady;
		console.log(`Player is now ${isReady ? 'ready' : 'not ready'}`);
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
			figureId: ''
		});
		console.log(`Bot added: ${botName} (${botId})`);
	}

	function onRemoveBot(botId: string) {
		bots = bots.filter((bot) => bot.id !== botId);
		console.log(`Bot removed: ${botId}`);
	}

	async function onChatMessageSend(value: string) {
		const response = await p2p.sendRequest<string, string>('/chat', chatValue);
		chatValue = '';
		console.log(`Chat message sent: ${value} -> ${response}`);
	}
</script>

<div id="lobby">
	<header>
		<Button variant="secondary" icon={icons.back} onclick={leaveLobby}>Leave</Button>
		<div class="control-group">
			<Input
				icon={icons.code}
				label="Lobby Code"
				hideLabel
				bind:value={lobbyCode}
				name="query"
				class="flex-1"
			/>
			<Button variant="secondary" icon="clipboard" onclick={copyLobbyCode}>Copy</Button>
		</div>
	</header>
	<main>
		<div>
			{#each players as player (player.id)}
				<JoinedPlayer {...player} />
			{/each}
			{#each bots as bot (bot.id)}
				<Bot {...bot} onremove={() => onRemoveBot(bot.id)} />
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
			<Checkbox label="Ready" bind:value={isReady} onclick={toggleReady} />
		</div>
		<div></div>
	</footer>
</div>
