<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';

	let props: HTMLImgAttributes = $props();
</script>

<div class="field-image">
	<img {...props} />
</div>
