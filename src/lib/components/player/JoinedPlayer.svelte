<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import './joined-player.css';
	import Button from '../general/Button.svelte';
	import Icon, { icons } from '../general/Icon.svelte';
	import { p2p } from '$lib/p2p';
	import Select from '../general/Select.svelte';
	import SelectEnum from '../general/SelectEnum.svelte';
	import { colors, PlayerColor } from '$lib';

	let {
		id,
		color,
		isReady,
		onKick,
		onColorChange
	}: App.Data.Game.Player & {
		onKick: (playerId: string) => unknown;
		onColorChange: (color: PlayerColor | null | undefined) => unknown;
	} = $props();
</script>

<div class="joined-player">
	{#if $p2p.isHost && id !== $p2p.peer?.id}
		<Button
			variant="secondary"
			icon={icons.close}
			class="button-kick-player"
			value="Kick"
			hideValue
			onclick={() => onKick(id)}
		/>
	{/if}
	<p>id: {id}</p>
	<p>seed: {$p2p.identities[id].seed}</p>
	<h4 class="text-2xl">{$p2p.identities[id].username}</h4>
	{#if $p2p.peer?.id === id}
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
	{:else}
		<div class="h-4 w-4" style="background-color: {color};"></div>
		<p>{color}</p>
	{/if}
	{#if true || $p2p.peer?.id !== id}
		<Icon name={isReady ? icons.ready : icons.unready} class="!text-[3rem]" />
	{/if}
</div>
