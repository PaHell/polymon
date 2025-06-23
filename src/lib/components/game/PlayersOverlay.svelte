<script lang="ts">
	import { engine } from '$lib/engine';
	import { p2p } from '$lib/p2p';
	import Player from './Player.svelte';
	import './player-overlay.css';
</script>

<div id="players-overlay">
	<div>
		{#each $engine.players
			.sort((a, b) => a.turnOrder - b.turnOrder)
			.slice(0, Math.floor($engine.players.length / 2)) as player}
			<Player {...player} />
		{/each}
	</div>
	<div>
		{#each $engine.players
			.sort((a, b) => a.turnOrder - b.turnOrder)
			.slice(Math.floor($engine.players.length / 2)) as player}
			<Player {...player} />
		{/each}
	</div>
</div>
