<script lang="ts">
	import { PUBLIC_COPYRIGHT } from '$env/static/public';
	import Link from '$lib/components/general/Link.svelte';
</script>

<div class="space-y-6">
	<Link href="/start/host" label="Host Game" />
	<Link href="/start/join" label="Join Game" />
</div>

<p class="mt-10 text-center text-sm/6 text-gray-400">
	{PUBLIC_COPYRIGHT}
</p>
