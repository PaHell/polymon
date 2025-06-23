<script lang="ts">
	import { colors, FieldType, fieldTypeOrder } from '$lib';
	import { engine } from '$lib/engine';
	import { p2p } from '$lib/p2p';
	import { theme } from '$lib/theme';
	import { on } from 'svelte/events';

	let player: App.Data.GameState.Player = $props();

	let ref: HTMLDivElement | null = null;
	let top = $state(0);
	let left = $state(0);

	engine.subscribe(calculatePosition);
	$effect(calculatePosition);

	function calculatePosition() {
		if (!ref || !player) return;
		const players = $engine.players;
		const playersOnSameField = players.filter((p) => p.position === player.position);
		const playerIndex = playersOnSameField.findIndex((p) => p.id === player.id);
		const fieldRect = document
			.getElementsByClassName('game-field')
			[player.position].getBoundingClientRect();
		const figureRect = ref.getBoundingClientRect();
		let _top = fieldRect.top + fieldRect.height / 2 - figureRect.height / 2;
		let _left = fieldRect.left + fieldRect.width / 2 - figureRect.width / 2;
		const side = Math.trunc(player.position / 10);
		// Special Positions
		if (fieldTypeOrder[player.position] === FieldType.Jail) {
			if (player.isInJail) {
				// If the player is in jail, position the figure on the jail field
				_top = _top + 5 + Math.trunc(playerIndex / 2) * (figureRect.height + 2);
				_left = _left - 38 + (playerIndex % 2) * (figureRect.width + 2);
			} else {
				// If the player is not in jail, position the figure on the "Just Visiting" field
				_top = _top - 45 + (playerIndex % 2 == 0 ? playerIndex * (figureRect.height / 2 + 2) : 0);
				_left =
					_left + 45 - (playerIndex % 2 == 1 ? (playerIndex + 1) * (figureRect.width / 2 + 2) : 0);
			}
		}
		// Animate the figure to the new position
		const animateX = side === 0 || side === 2;
		if (animateX) {
			top = _top;
			setTimeout(() => {
				left = _left;
			}, 300);
		} else {
			left = _left;
			setTimeout(() => {
				top = _top;
			}, 300);
		}
	}

	const indentity = $derived($p2p.identities?.[player.id]);
	const properties = $derived({
		streets: $engine.streets.filter((p) => p.ownerId === player.id),
		railroads: $engine.railroads.filter((p) => p.ownerId === player.id),
		utilities: $engine.utilities.filter((p) => p.ownerId === player.id)
	});
</script>

<svelte:window on:resize={calculatePosition} />

<div
	bind:this={ref}
	class="figure"
	style="top: {top}px; left: {left}px; background-color: {colors[player.color]};"
></div>
