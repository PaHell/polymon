<script lang="ts">
	import type { HTMLAttributes, MouseEventHandler } from 'svelte/elements';
	import './joined-player.css';
	import Button from '../general/Button.svelte';
	import Icon, { icons } from '../general/Icon.svelte';
	import { p2p } from '$lib/p2p';
	import { colors, PlayerColor } from '$lib';
	import SelectEnum from '../general/SelectEnum.svelte';

	let {
		id,
		name,
		color,
		onColorChange,
		onRemove
	}: App.Data.Game.Bot & {
		onColorChange?: (color: PlayerColor | null | undefined) => unknown;
		onRemove?: MouseEventHandler<HTMLButtonElement> | null | undefined;
	} = $props();
</script>

<div class="joined-player">
	{#if $p2p.isHost}
		<Button
			variant="secondary"
			icon={icons.close}
			class="button-kick-player"
			value="Kick"
			hideValue
			onclick={onRemove}
		/>
	{/if}
	<div class="flex items-center space-x-2">
		<Icon name={icons.bot} />
		<h4 class="text-2xl">{name}</h4>
	</div>
	<SelectEnum
		label="Color"
		bind:value={color}
		entries={Object.entries(PlayerColor)}
		onchange={onColorChange}
	>
		{#snippet beforeItem(item)}
			<div class="h-4 w-4" style="background-color: {colors[item]};"></div>
		{/snippet}
	</SelectEnum>
</div>
