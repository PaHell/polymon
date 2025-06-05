<script lang="ts">
	import { p2p } from '$lib/p2p';
	import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

	let {
		userId,
		message,
		...others
	}: HTMLAttributes<HTMLParagraphElement> & {
		userId: string;
		message: string;
	} = $props();
</script>

<p {...others} class="message {others.class ?? ''}">
	<span class="opacity-50">[{$p2p.identities[userId]}]:</span>
	<span>{message}</span>
</p>
