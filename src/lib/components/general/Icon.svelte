<script lang="ts" module>
	export const icons = {
		add: 'add-line',
		back: 'arrow-left-line',
		close: 'close-line',
		code: 'code-s-slash-line',
		user: 'user-line',
		join: 'user-add-line',
		bot: 'robot-2-line',
		ready: 'checkbox-circle-line',
		unready: 'checkbox-blank-circle-line'
	};
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import './icon.css';

	let {
		name,
		...others
	}: Omit<HTMLAttributes<HTMLElement>, 'children'> & {
		name: string;
	} = $props();
</script>

<i {...others} class="icon ri-{name} {others.class ?? ''}"></i>
