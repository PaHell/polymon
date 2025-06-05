<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import './button.css';

	let {
		variant = 'primary',
		label,
		icon,
		children,
		...others
	}: HTMLAnchorAttributes & {
		variant?: 'primary' | 'secondary' | 'link';
		label: string;
		icon?: string;
		hideValue?: boolean;
	} = $props();
</script>

<a {...others} class="button button-{variant} {others.class ?? ''}">
	{label}
	{@render children?.()}
</a>
