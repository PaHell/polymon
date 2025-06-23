<script lang="ts">
	import { colors, FieldType, fieldTypeOrder, settings } from '$lib';
	import { engine, getFieldTypeIndex } from '$lib/engine';
	import { p2p } from '$lib/p2p';
	import { theme } from '$lib/theme';
	import Button from '../general/Button.svelte';
	import Checkbox from '../general/Checkbox.svelte';
	import Input from '../general/Input.svelte';
	import InputNumber from '../general/InputNumber.svelte';

	let player: App.Data.GameState.Player = $props();
	let lastDice: number[] = $state([0, 0]);
	let height = $state(100);

	const identity = $derived($p2p.identities?.[player.id]);
	const properties = $derived({
		streets: $engine.streets.filter((p) => p.ownerId === player.id),
		railroads: $engine.railroads.filter((p) => p.ownerId === player.id),
		utilities: $engine.utilities.filter((p) => p.ownerId === player.id)
	});

	async function rollDice() {
		await engine.rollDice(player.id).then((dice) => {
			console.log('Dice rolled:', dice);
			if (!dice || dice.length !== 2) return;
			lastDice = [dice[0], dice[1]];
		});
	}

	async function buyLandedProperty() {
		engine.buyLandedProperty(player.id);
	}

	async function startAuction() {
		engine.startAuction(player.id);
	}

	async function endTurn() {
		engine.endTurn(player.id);
	}
</script>

<div bind:clientHeight={height} class="player" class:active={$engine.currentPlayerId === player.id}>
	<header style="width: {height}px;">
		<h5 class="player-turn-order">{player.turnOrder + 1}</h5>
		<div class="player-color" style="background-color: {colors[player.color]};"></div>
		<h5 class="player-username">{identity?.username ?? player.id}</h5>
		<h4 class="player-balance">{$theme.currency}{player.balance}</h4>
	</header>
	<main>
		<p>UserID: {player.id}</p>
		<p>Color: {player.color}</p>
		<p>Username: {identity?.username}</p>
		<p>Seed: {identity?.seed}</p>
		<p>Position: {player.position}</p>
		<p>Streets: {properties.streets.length}</p>
		<p>Railroads: {properties.railroads.length}</p>
		<p>Utilities: {properties.utilities.length}</p>
		<Checkbox value={player.isInJail} label="In Jail" disabled />
		<p>Jail Cards: {player?.jailCards}</p>
		<p>Turns in Jail: {player?.turnsInJail}</p>
		<p>Last Dice: {lastDice.join('  ')}</p>
		<Button onclick={rollDice}>Roll Dice</Button>
		<Button onclick={buyLandedProperty}>Buy Landed Property</Button>
		<Button onclick={startAuction}>Start Auction</Button>
		<Button onclick={endTurn}>End Turn</Button>
	</main>
</div>
