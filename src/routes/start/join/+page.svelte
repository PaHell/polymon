<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_COPYRIGHT } from '$env/static/public';
	import Button from '$lib/components/general/Button.svelte';
	import { icons } from '$lib/components/general/Icon.svelte';
	import Input from '$lib/components/general/Input.svelte';
	import Link from '$lib/components/general/Link.svelte';
	import { p2p, username } from '$lib/p2p';

	let lobbyCode = $state('1234-5678');

	async function joinLobby() {
		// Logic to join the lobby with the provided code
		console.log('Joining lobby with code:', lobbyCode);
		console.log('Username:', $username);
		try {
			await p2p.connectToBroker();
			await p2p.connectToPeer(lobbyCode);
			//await connect(lobbyCode);
			await goto('/lobby');
		} catch (error) {
			console.error('Failed to join lobby:', error);
			alert('Failed to join lobby. Please check the code and try again.');
		}
	}
</script>

<div class="space-y-6">
	<Link variant="secondary" href="/start" icon={icons.back} label="Back" />

	<Input
		icon={icons.user}
		label="My username"
		value={$username}
		onchange={(e) => username.set(e.currentTarget.value)}
		type="text"
	/>

	<Input icon={icons.code} label="Lobby Code" bind:value={lobbyCode} name="query" class="flex-1" />

	<Button variant="primary" icon="clipboard" onclick={joinLobby}>Join</Button>
</div>

<p class="mt-10 text-center text-sm/6 text-gray-400">
	{PUBLIC_COPYRIGHT}
</p>
