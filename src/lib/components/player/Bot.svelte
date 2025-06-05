<script lang="ts">
	import type { HTMLAttributes, MouseEventHandler } from 'svelte/elements';
	import './joined-player.css';
	import Button from '../general/Button.svelte';
	import Input from '../general/Input.svelte';
	import Icon, { icons } from '../general/Icon.svelte';
	import { p2p, peerIdentities } from '$lib/p2p';
	import Select from '../general/Select.svelte';
	import { figures } from '$lib';

	let {
		id,
		name,
		figureId,
		onremove,
		...others
	}: HTMLAttributes<HTMLElement> &
		App.Data.Bot & {
			onremove?: MouseEventHandler<HTMLButtonElement> | null | undefined;
		} = $props();

	let figure: App.Data.Figure | undefined = $state();
	$effect(() => {
		figure = figures.find((f) => f.id === figureId);
	});
</script>

<div {...others} class="joined-player {others.class ?? ''}">
	{#if p2p.isHost()}
		<Button
			variant="secondary"
			icon={icons.close}
			class="button-kick-player"
			value="Kick"
			hideValue
			onclick={onremove}
		/>
	{/if}
	<div class="flex items-center space-x-2">
		<Icon name={icons.bot} />
		<h4 class="text-2xl">{name}</h4>
	</div>
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
</div>
