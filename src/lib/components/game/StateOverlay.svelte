<script lang="ts">
	import { engine } from '$lib/engine';
	import './state-overlay.css';
</script>

<div id="state-overlay">
	<div>
		<pre>{JSON.stringify($engine, null, 4)}</pre>
	</div>
</div>
