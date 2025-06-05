<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import './input.css';
	import Icon from './Icon.svelte';

	let {
		id,
		class: classes,
		value = $bindable(),
		icon,
		label,
		hideLabel = false,
		children,
		...others
	}: HTMLInputAttributes & {
		icon?: string;
		label: string;
		hideLabel?: boolean;
	} = $props();

	let internalId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;
</script>

<div {id} class="input {classes ?? ''}">
	{#if !hideLabel}
		<label for={internalId}>
			<span>{label}</span>
			{#if others.required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}
	<div>
		{#if icon}
			<Icon name={icon} />
		{/if}
		<input id={internalId} bind:value {...others} />
		{@render children?.()}
	</div>
</div>
