<script lang="ts">
	import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import './select.css';
	import Icon from './Icon.svelte';
	import { onMount, type Snippet } from 'svelte';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import Select from './Select.svelte';

	type T = $$Generic<number | string>;
	type EnumEntry<T> = [string | number, T | string];

	let {
		entries = $bindable(),
		value = $bindable(),
		search = $bindable(''),
		opened = $bindable(false),
		onchange,
		beforeItem,
		afterItem,
		...others
	}: {
		class?: string;
		icon?: string;
		label: string;
		entries: EnumEntry<T>[];
		value: T | null | undefined;
		search?: string;
		opened?: boolean;
		onchange?: (value: T | null | undefined) => void;
		beforeItem?: Snippet<[T]>;
		afterItem?: Snippet<[T]>;
	} = $props();

	let internalValue: EnumEntry<T> | undefined = $state();

	$effect(() => {
		value = entries.find((entry) => entry[0] === value)?.[0] ?? undefined;
	});
</script>

<Select
	{...others}
	bind:opened
	bind:items={entries}
	bind:value={internalValue}
	getKey={(i) => i[0]}
	getText={(i) => i[1]?.toString()}
	onchange={(item) => {
		value = item?.[0];
		if (onchange) onchange(value);
	}}
>
	{#snippet beforeItem({ item })}
		{@render beforeItem?.(item[0])}
	{/snippet}
	{#snippet afterItem({ item })}
		{@render afterItem?.(item[0])}
	{/snippet}
</Select>
