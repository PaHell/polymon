<script lang="ts">
	import { PUBLIC_APP_TITLE } from '$env/static/public';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col justify-center bg-gray-800 px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<img
			class="mx-auto h-10 w-auto"
			src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
			alt={PUBLIC_APP_TITLE}
		/>
		<h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
			{PUBLIC_APP_TITLE}
		</h2>
	</div>

	<div class="mt-10 space-y-6 sm:mx-auto sm:w-full sm:max-w-sm">
		{@render children()}
	</div>
</div>
