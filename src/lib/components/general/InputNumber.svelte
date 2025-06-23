<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Input from './Input.svelte';

	let {
		value = $bindable(),
		...others
	}: Omit<HTMLInputAttributes, 'value'> & {
		value?: number;
		icon?: string;
		label: string;
		hideLabel?: boolean;
	} = $props();
</script>

<Input {...others} bind:value />
