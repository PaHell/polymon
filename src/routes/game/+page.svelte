<script lang="ts">
	import { defaultGameSettings, FieldType, PlayerColor } from '$lib';
	import Board from '$lib/components/game/Board.svelte';
	import GameField from '$lib/components/game/GameField.svelte';
	import Player from '$lib/components/game/Player.svelte';
	import PlayersOverlay from '$lib/components/game/PlayersOverlay.svelte';
	import StateOverlay from '$lib/components/game/StateOverlay.svelte';
	import Checkbox from '$lib/components/general/Checkbox.svelte';
	import Select from '$lib/components/general/Select.svelte';
	import { engine, getFieldTypeIndex } from '$lib/engine';
	import { p2p } from '$lib/p2p';
	import { theme, themes } from '$lib/theme';
	import { get } from 'svelte/store';

	let playerLastDices: Record<App.Data.GameState.Player['id'], number[]> = $state({});
	if (!$engine) {
		engine
			.initialize(
				[
					{
						id: 'local-player',
						seed: 'local-player',
						color: PlayerColor.Red,
						isReady: true
					},
					{
						id: 'remote-player',
						seed: 'remote-player',
						color: PlayerColor.Blue,
						isReady: true
					},
					{
						id: 'remote-player-2',
						seed: 'remote-player-2',
						color: PlayerColor.Green,
						isReady: true
					},
					{
						id: 'remote-player-3',
						seed: 'remote-player-3',
						color: PlayerColor.Yellow,
						isReady: true
					}
				],
				[],
				defaultGameSettings
			)
			.then((result) => {
				playerLastDices = Object.entries(result.dices).reduce(
					(acc, [playerId, dices]) => ({
						...acc,
						[playerId]: dices
					}),
					{}
				);
			})
			.catch((error) => {
				throw new Error(`Failed to initialize the game engine: ${error}`);
			});
	}
</script>

{#if $engine}
	<Board />
	<PlayersOverlay />
	<StateOverlay />
{/if}
