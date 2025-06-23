<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import './checkbox.css';

	let {
		id,
		class: classes,
		value = $bindable(),
		variant = 'checkbox',
		label,
		hideLabel = false,
		children,
		...others
	}: Omit<HTMLInputAttributes, 'value' | 'checked'> & {
		value: boolean;
		variant?: 'checkbox' | 'toggle';
		label: string;
		hideLabel?: boolean;
	} = $props();

	let ref: HTMLInputElement | undefined = $state(undefined);
	let internalId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;

	function internalOnChange(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (others.onchange) {
			others.onchange(event);
		}
	}
</script>

<div {id} class="checkbox checkbox-{variant} {classes ?? ''}">
	<input
		bind:this={ref}
		{...others}
		id={internalId}
		type="checkbox"
		onchange={internalOnChange}
		bind:checked={value}
	/>
	<svg viewBox="0 0 14 14" fill="none">
		{#if ref?.indeterminate}
			<path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		{:else if value === true}
			<path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		{/if}
	</svg>
	<label for={internalId}>
		{#if !hideLabel}
			<span>{label}</span>
		{/if}
		{#if others.required}
			<span class="text-red-500">*</span>
		{/if}
		{@render children?.()}
	</label>
</div>
