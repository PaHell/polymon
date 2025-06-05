<script lang="ts">
	import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import './chat.css';
	import Input from '../general/Input.svelte';
	import Message from './Message.svelte';

	let {
		items,
		value = $bindable(),
		opened = $bindable(false),
		onsend,
		...others
	}: HTMLAttributes<HTMLDivElement> & {
		items: {
			userId: string;
			message: string;
		}[];
		value: string;
		opened?: boolean;
		onsend: (value: string) => Promise<void> | void;
	} = $props();

	async function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && value.trim() !== '') {
			await onsend(value);
			value = '';
			event.preventDefault();
		}
	}
</script>

<div {...others} class="chat {others.class ?? ''}">
	{#if opened}
		<menu>
			{#each items as item, index (index)}
				<Message {...item} />
			{/each}
		</menu>
	{/if}
	<Input
		label="Messgae"
		bind:value
		hideLabel
		onfocus={() => (opened = true)}
		onblur={() => (opened = false)}
		onkeydown={onKeydown}
	/>
</div>
