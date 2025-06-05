<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { PUBLIC_COPYRIGHT } from '$env/static/public';
	import Button from '$lib/components/general/Button.svelte';
	import Checkbox from '$lib/components/general/Checkbox.svelte';
	import { icons } from '$lib/components/general/Icon.svelte';
	import Input from '$lib/components/general/Input.svelte';
	import Link from '$lib/components/general/Link.svelte';
	import { p2p, username } from '$lib/p2p';

	let lobbyCode = $state('1234-5678');
	let allowConnections = $state(true);
	let publicLobby = $state(false);

	function copyLobbyCode() {
		navigator.clipboard
			.writeText(lobbyCode)
			.then(() => {})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	}

	async function hostLobby() {
		// Logic to start the game with the current settings
		console.log('Hosting lobby with code:', lobbyCode);
		console.log('Username:', $username);
		console.log('Allow Connections:', allowConnections);
		console.log('Public Lobby:', publicLobby);
		//host(lobbyCode);
		await p2p.connectToBroker(lobbyCode);
		p2p.listenForConnections();
		await goto('/lobby');
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

	<div class="control-group">
		<Input
			icon={icons.code}
			label="Lobby Code"
			bind:value={lobbyCode}
			name="query"
			class="flex-1"
		/>
		<Button variant="secondary" icon="clipboard" onclick={copyLobbyCode}>Copy</Button>
	</div>

	<Checkbox label="Allow Connections" bind:value={allowConnections} />

	<Checkbox
		label="Public Lobby"
		checked={allowConnections && publicLobby}
		disabled={!allowConnections}
		onchange={() => (publicLobby = !publicLobby)}
	/>

	<Button variant="primary" icon={icons.add} onclick={hostLobby}>Host</Button>
</div>

<p class="mt-10 text-center text-sm/6 text-gray-400">
	{PUBLIC_COPYRIGHT}
</p>
