<script lang="ts">
	import type { HTMLAttributes, MouseEventHandler } from 'svelte/elements';
	import './joined-player.css';
	import Button from '../general/Button.svelte';
	import Input from '../general/Input.svelte';
	import Icon, { icons } from '../general/Icon.svelte';
	import { p2p } from '$lib/p2p';
	import Select from '../general/Select.svelte';
	import { figures } from '$lib';

	let {
		id,
		figureId,
		isReady,
		onKick,
		onFigureChange,
		...others
	}: HTMLAttributes<HTMLElement> &
		App.Data.Player & {
			onKick: (playerId: string) => unknown;
			onFigureChange: (figureId: string) => unknown;
		} = $props();

	let figure: App.Data.Figure | undefined = $state();
	$effect(() => {
		figure = figures.find((f) => f.id === figureId);
	});
</script>

<div {...others} class="joined-player {others.class ?? ''}">
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
	{id}
	<h4 class="text-2xl">{$p2p.identities[id]}</h4>
	{#if $p2p.peer?.id === id}
		<Select
			label="Figure"
			value={figure}
			items={figures}
			getKey={(item) => item.id}
			getText={(item) => item.name}
			onchange={(item) => (item?.id ? onFigureChange(item.id) : {})}
		>
			{#snippet beforeItem({ item })}
				{#if item.isUrl}
					<img src={item.value} alt={item.name} class="size-6" />
				{:else}
					<Icon name={item.value} class="size-6" />
				{/if}
			{/snippet}
		</Select>
	{:else if figure}
		{#if figure.isUrl}
			<img src={figure.value} alt={figure.name} class="size-6" />
		{:else}
			<Icon name={figure.value} class="size-6" />
		{/if}
		<p>{figure.name}</p>
	{/if}
	{#if true || $p2p.peer?.id !== id}
		<Icon name={isReady ? icons.ready : icons.unready} class="!text-[3rem]" />
	{/if}
</div>
