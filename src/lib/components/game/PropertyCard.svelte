<script lang="ts">
	import { colors, FieldType, getStreetColorSetIndex, PlayerColor } from '$lib';
	import { engine, getPropertyOwner } from '$lib/engine';
	import { getThemePropertiesKey, theme } from '$lib/theme';
	import { util } from 'peerjs';
	import Icon from '../general/Icon.svelte';
	import './property-card.css';
	import Button from '../general/Button.svelte';
	import { p2p } from '$lib/p2p';
	import type { Snippet } from 'svelte';

	let {
		id,
		actions
	}: {
		id: App.Data.GameState.Street['id'];
		actions: Snippet<[]>;
	} = $props();

	let ownerId: App.Data.GameState.Street['ownerId'] | null = $state();
	let street: App.Data.Theme.Street | undefined = $state();
	let streetColorSetIndex: number | undefined = $state();
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
			case FieldType.Railroad:
			case FieldType.Utility:
				ownerId = getPropertyOwner($engine, id);
			case FieldType.Street:
				street = $theme.properties.streets[typeIndex];
				streetColorSetIndex = getStreetColorSetIndex(engine.board, id);
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
	{#if streetColorSetIndex !== undefined}
		<div
			class="h-16 w-full"
			style="background-color: {$theme.colors.streets[streetColorSetIndex]};"
		>
			<h1 class="text-center text-xl leading-15 font-bold uppercase">{street.name}</h1>
		</div>
		{#if ownerId}
			<div class="flex items-center justify-between gap-x-[2px] py-2">
				<p>Owner</p>
				<div class="flex items-center gap-x-[2px]">
					<div
						class="size-[16px] rounded-sm border-[2px] border-black"
						style="background-color: {colors[
							$engine.players.find((p) => p.id === ownerId)?.color ?? PlayerColor.Red
						]};"
					></div>
					<p>{$p2p.identities[ownerId] ?? ownerId}</p>
				</div>
			</div>
			<hr class="border-t-[2px] border-black" />
		{/if}
		<div class="rent-cost-list pt-2">
			<p>Rent</p>
			<div></div>
			<p>{$theme.currency}{engine.settings.streets[streetColorSetIndex].rentBase}</p>
			<p>Rent with color set</p>
			<div></div>
			<p>
				{$theme.currency}{engine.settings.streets[streetColorSetIndex].rentBase *
					engine.settings.ownedColorSetRentMultiplier}
			</p>
		</div>
		<div class="rent-cost-list pt-1 pb-2">
			{#each Array(engine.settings.hotels.housesRequired) as _, index}
				<p class="flex items-center gap-[4px]">
					Rent with {index + 1}
				</p>
				<img src={$theme.images.house} alt="House" class="block size-[24px]" />
				<p>
					{$theme.currency}{engine.settings.streets[streetColorSetIndex].rentPerHouseFixed[index]}
				</p>
			{/each}
			{#each Array(engine.settings.hotels.maxPerStreet) as _, index}
				<p class="flex items-center gap-[4px]">
					Rent with {index + 1}
				</p>
				<img src={$theme.images.hotel} alt="Hotel" class="size-[24px]" />
				<p>
					{$theme.currency}{engine.settings.streets[streetColorSetIndex].rentPerHotelFixed[index]}
				</p>
			{/each}
		</div>
		<hr class="border-t-[2px] border-black" />
		<div class="building-cost-list py-2">
			<p>Houses cost</p>
			<p>{$theme.currency}{engine.settings.houses.pricePerColorSet[streetColorSetIndex]} each</p>
			<p>Hotels cost</p>
			<p>{$theme.currency}{engine.settings.hotels.pricePerColorSet[streetColorSetIndex]} each</p>
			<div></div>
			<p>(plus {engine.settings.hotels.housesRequired} Houses)</p>
		</div>
		<hr class="border-t-[2px] border-black" />
		<div class="flex flex-wrap gap-4 pt-2">
			{@render actions()}
		</div>
	{/if}
{:else if railroad}
	<img src={railroad.image} alt={railroad.name} />
	<h3>{railroad.name}</h3>
{:else if utility}
	<img src={utility.image} alt={utility.name} />
	<h3>{utility.name}</h3>
{/if}
