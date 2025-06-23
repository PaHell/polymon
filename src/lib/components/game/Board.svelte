<script lang="ts">
	import type { Field } from '$lib';
	import { engine } from '$lib/engine';
	import { theme, themes } from '$lib/theme';
	import Select from '../general/Select.svelte';
	import Figure from './Figure.svelte';
	import GameField from './GameField.svelte';

	let {
		fields = []
	}: {
		fields: Field[];
	} = $props();
</script>

<div id="board-wrapper" style="background-color: {$theme.colors.background};">
	<Select
		label="Theme"
		items={themes}
		value={$theme}
		getKey={(theme) => theme.id}
		getText={(theme) => theme.name}
		onchange={(i) => (i ? theme.set(i) : {})}
		class="fixed top-2 right-2 z-10"
	/>
	<div
		id="board"
		style="background-color: {$theme.colors.board}; border-color: {$theme.colors
			.border}; color: {$theme.colors.text};"
	>
		{#each fields as field, index (index)}
			<GameField {index} {...field} />
		{/each}
		{#each $engine.players as player (player.id)}
			<Figure {...player} />
		{/each}
		<div style="grid-area: f41;" class="deck chance">
			<div>
				<div></div>
				<div></div>
				<div></div>
				<div style={$theme.properties.chance.styleCard}>
					<img src={$theme.properties.chance.imageCard} alt={$theme.properties.chance.name} />
					<p>{$theme.properties.chance.name}</p>
				</div>
			</div>
		</div>
		<div style="grid-area: f42;" class="deck community-chest">
			<div>
				<div></div>
				<div></div>
				<div></div>
				<div style={$theme.properties.communityChest.styleCard}>
					<img
						src={$theme.properties.communityChest.imageCard}
						alt={$theme.properties.communityChest.name}
					/>
					<p>{$theme.properties.communityChest.name}</p>
				</div>
			</div>
		</div>
		<div style="grid-area: f43;" id="branding">
			<div>
				<img src={$theme.branding.image} alt={$theme.branding.name} />
				<h1 style={$theme.branding.style}>{$theme.branding.name}</h1>
				<p>{$theme.branding.slogan}</p>
			</div>
		</div>
	</div>
</div>
