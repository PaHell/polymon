<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import './button.css';
	import Icon from './Icon.svelte';

	let {
		variant = 'primary',
		icon,
		children,
		...others
	}: HTMLButtonAttributes & {
		variant?: 'primary' | 'secondary';
		icon?: string;
		hideValue?: boolean;
	} = $props();
</script>

<button {...others} class="button button-{variant} {others.class ?? ''}">
	{#if icon}
		<Icon name={icon} />
	{/if}
	{@render children?.()}
</button>
