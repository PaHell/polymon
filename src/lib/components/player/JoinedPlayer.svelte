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
		onKick: onremove,
		...others
	}: HTMLAttributes<HTMLElement> &
		App.Data.Player & {
			onKick?: MouseEventHandler<HTMLButtonElement>;
			onFigureChange?: (figureId: string) => void | Promise<void>;
			onToggleReady?: () => void | Promise<void>;
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
			onclick={onremove}
		/>
	{/if}
	<h4 class="text-2xl">{$p2p.identities[id]}</h4>
	<Select
		label="Figure"
		value={figure}
		items={figures}
		getKey={(item) => item.id}
		getText={(item) => item.name}
		onchange={(item) => (figureId = item?.id ?? '')}
	>
		{#snippet beforeItem({ item })}
			{#if item.isUrl}
				<img src={item.value} alt={item.name} class="size-6" />
			{:else}
				<Icon name={item.value} class="size-6" />
			{/if}
		{/snippet}
	</Select>
	<Icon name={isReady ? icons.ready : icons.unready} class="!text-[3rem]" />
</div>
