<script lang="ts">
	import type { Snippet } from 'svelte';
	import Modal from './Modal.svelte';

	let {
		opened = $bindable(false),
		primary = 'Ok',
		secondary = 'Discard',
		onSecondary,
		...others
	}: {
		opened: boolean;
		title: string;
		primary?: string;
		secondary?: string;
		onPrimary: () => unknown;
		onSecondary?: () => unknown;
		actions?: Snippet<[]>;
		header?: Snippet<[]>;
		body: Snippet<[]>;
		footer?: Snippet<[]>;
	} = $props();
</script>

<Modal
	{...others}
	size="dialog"
	bind:opened
	{primary}
	{secondary}
	onClose={onSecondary}
	hideClose
	disableBackdropClose
/>
