<script lang="ts">
	import { FieldType, getStreetIndex } from '$lib';
	import { engine } from '$lib/engine';
	import { getThemePropertiesKey, theme } from '$lib/theme';
	import { util } from 'peerjs';

	let {
		id
	}: {
		id: App.Data.GameState.Street['id'];
	} = $props();

	let street: App.Data.Theme.Street | undefined = $state();
	let streetIndex: number | undefined = $state();
	let railroad: App.Data.Theme.Railroad | undefined = $state();
	let utility: App.Data.Theme.Utility | undefined = $state();
	let price: number | undefined = $state();
	$effect(() => {
		const split = id.split('-');
		if (split.length < 2) return;
		const type = split[0] as FieldType | undefined;
		if (!type) return;
		const typeIndex = Number(split[1]);
		switch (type) {
			case FieldType.Street:
				street = $theme.properties.streets[typeIndex];
				streetIndex = getStreetIndex(engine.board, id);
				railroad = undefined;
				utility = undefined;
				price = engine.settings.streets[typeIndex].price;
				break;
			case FieldType.Railroad:
				railroad = $theme.properties.railroads[typeIndex];
				price = engine.settings.railroads.price;
				street = undefined;
				utility = undefined;
				break;
			case FieldType.Utility:
				utility = $theme.properties.utilities[typeIndex];
				price = engine.settings.utilities.price;
				street = undefined;
				railroad = undefined;
				break;
		}
	});
</script>

{#if street && price}
	{#if streetIndex !== undefined}
		<div class="h-16 w-full" style="background-color: {$theme.colors.streets[streetIndex]};">
			<h1 class="text-center text-xl leading-15 font-bold uppercase">{street.name}</h1>
		</div>
		<div>
			{#each Array(engine.settings.hotels.housesRequired) as _, index}
				<li>
					<p>With {index + 1} houses</p>
					<p>
						{engine.settings.streets[streetIndex].rentPerHouseFixed[index]}
					</p>
				</li>
			{/each}
		</div>
	{/if}
{:else if railroad}
	<img src={railroad.image} alt={railroad.name} />
	<h3>{railroad.name}</h3>
{:else if utility}
	<img src={utility.image} alt={utility.name} />
	<h3>{utility.name}</h3>
{/if}
<h2>{$theme.currency}{price}</h2>
