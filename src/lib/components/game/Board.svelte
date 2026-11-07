<script lang="ts">
	import {
		boardConfigs,
		FieldType,
		getFieldIndexOnSide,
		getSideIndex,
		getStreetColorSetIndex
	} from '$lib';
	import { engine, getFieldTypeIndex, getPropertyOwner, playerOwnsColorSet } from '$lib/engine';
	import { getThemePropertiesKey, theme, themes } from '$lib/theme';
	import { get } from 'svelte/store';
	import Select from '../general/Select.svelte';
	import Figure from './Figure.svelte';
	import GameField from './GameField.svelte';
	import Floating from '../general/Floating.svelte';
	import {
		detectOverflow,
		type Middleware,
		type MiddlewareReturn,
		type Placement
	} from '@floating-ui/dom';
	import './board.css';
	import PropertyCard from './PropertyCard.svelte';
	import Button from '../general/Button.svelte';
	import { p2p } from '$lib/p2p';

	let {
		onMortage,
		onPayMortage,
		onBuyHouse,
		onSellHouse,
		onBuyHotel,
		onSellHotel
	}: {
		onMortage: (propertyId: App.Data.GameState.Street['id']) => unknown;
		onPayMortage: (propertyId: App.Data.GameState.Street['id']) => unknown;
		onBuyHouse: (propertyId: App.Data.GameState.Street['id']) => unknown;
		onSellHouse: (propertyId: App.Data.GameState.Street['id']) => unknown;
		onBuyHotel: (propertyId: App.Data.GameState.Street['id']) => unknown;
		onSellHotel: (propertyId: App.Data.GameState.Street['id']) => unknown;
	} = $props();

	let fields = $state(
		engine.board.fieldTypeOrder.map((type, fieldIndex) => ({
			type,
			fieldIndex,
			typeIndex: getFieldTypeIndex(engine.board, type, fieldIndex)
		}))
	);

	let currentFieldId: App.Data.GameState.Street['id'] = $state('');
	let currentFieldStreetOwnership: App.Data.GameState.Street | undefined = $state();
	let currentFieldRailroadOwnership: App.Data.GameState.Railroad | undefined = $state();
	let currentFieldUtililtyOwnership: App.Data.GameState.Utility | undefined = $state();
	let currentFieldOwned: boolean = $state(false);
	let currentFieldColorSetIndex: number = $state(-1);
	let fieldMenuVisible = $state(false);
	let currentPlacement: Placement = $state('top');

	engine.subscribe(updateFieldData);
	p2p.subscribe(updateFieldData);

	function openFieldMenu(fieldIndex: number, typeIndex: number, type: FieldType) {
		if ([FieldType.Street, FieldType.Railroad, FieldType.Utility].indexOf(type) === -1) {
			return;
		}
		currentFieldId = `${type}-${typeIndex}`;
		const sideIndex = getSideIndex(engine.board, fieldIndex);
		const sideMap = ['bottom', 'left', 'top', 'right'] satisfies Placement[];
		currentPlacement = sideMap[sideIndex];
		fieldMenuVisible = true;
		updateFieldData();
	}

	function updateFieldData() {
		currentFieldStreetOwnership = $engine.streets.find((street) => street.id === currentFieldId);
		currentFieldRailroadOwnership = $engine.railroads.find(
			(railroad) => railroad.id === currentFieldId
		);
		currentFieldUtililtyOwnership = $engine.utilities.find(
			(utility) => utility.id === currentFieldId
		);
		currentFieldOwned =
			!!$p2p.peer?.id &&
			(currentFieldStreetOwnership?.ownerId === $p2p.peer.id ||
				currentFieldRailroadOwnership?.ownerId === $p2p.peer.id ||
				currentFieldUtililtyOwnership?.ownerId === $p2p.peer.id);
		currentFieldColorSetIndex = currentFieldStreetOwnership
			? getStreetColorSetIndex(engine.board, currentFieldId)
			: -1;
	}
</script>

<Floating
	referenceId={currentFieldId}
	boundaryId="boundary"
	bind:visible={fieldMenuVisible}
	placement={currentPlacement}
	closable
	class="floating-property-card"
>
	{#snippet children()}
		<PropertyCard id={currentFieldId}>
			{#snippet actions()}
				{#if true || currentFieldOwned}
					{#if currentFieldStreetOwnership && currentFieldColorSetIndex}
						<Button
							onclick={() => onMortage(currentFieldId)}
							disabled={currentFieldStreetOwnership.isMortgaged}>Mortage</Button
						>
						<Button
							onclick={() => onPayMortage(currentFieldId)}
							disabled={!currentFieldStreetOwnership.isMortgaged}>Pay Mortage</Button
						>
						{#if playerOwnsColorSet($engine, engine.board, $p2p.peer?.id ?? '', currentFieldColorSetIndex)}
							<Button
								onclick={() => onBuyHouse(currentFieldId)}
								disabled={currentFieldStreetOwnership.amountOfHouses <
									engine.settings.hotels.housesRequired &&
									currentFieldStreetOwnership.amountOfHotels === 0}>Buy House</Button
							>
							<Button
								onclick={() => onSellHouse(currentFieldId)}
								disabled={currentFieldStreetOwnership.amountOfHouses < 1}>Sell House</Button
							>
							<Button
								onclick={() => onBuyHotel(currentFieldId)}
								disabled={engine.settings.hotels.maxPerStreet >=
									currentFieldStreetOwnership.amountOfHotels}>Buy Hotel</Button
							>
							<Button
								onclick={() => onSellHotel(currentFieldId)}
								disabled={currentFieldStreetOwnership.amountOfHotels < 1}>Sell Hotel</Button
							>
						{/if}
					{:else if currentFieldRailroadOwnership}
						<Button
							onclick={() => onMortage(currentFieldId)}
							disabled={currentFieldRailroadOwnership.isMortgaged}>Mortage</Button
						>
						<Button
							onclick={() => onPayMortage(currentFieldId)}
							disabled={!currentFieldRailroadOwnership.isMortgaged}>Pay Mortage</Button
						>
					{:else if currentFieldUtililtyOwnership}
						<Button
							onclick={() => onMortage(currentFieldId)}
							disabled={currentFieldUtililtyOwnership.isMortgaged}>Mortage</Button
						>
						<Button
							onclick={() => onPayMortage(currentFieldId)}
							disabled={!currentFieldUtililtyOwnership.isMortgaged}>Pay Mortage</Button
						>
					{/if}
				{/if}
			{/snippet}
		</PropertyCard>
	{/snippet}
</Floating>

<div id="board-wrapper" style="background-color: {$theme.colors.background};">
	<Select
		label="Theme"
		items={themes}
		value={$theme}
		getKey={(theme) => theme.id}
		getText={(theme) => theme.name}
		onchange={(i) => (i ? theme.set(i) : {})}
		class="fixed top-2 right-2 z-10"
	/>
	<div
		id="board"
		style="background-color: {$theme.colors.board}; border-color: {$theme.colors
			.border}; color: {$theme.colors.text};"
	>
		{#each fields as field, index (index)}
			<GameField
				{...field}
				onclick={() => openFieldMenu(field.fieldIndex, field.typeIndex, field.type)}
			/>
		{/each}
		<div id="boundary"></div>
		{#each $engine.players as player (player.id)}
			<Figure {...player} />
		{/each}
		<div style="grid-area: f41;" class="deck chance">
			<div>
				<div></div>
				<div></div>
				<div></div>
				<div style={$theme.properties.chance.styleCard}>
					<img src={$theme.properties.chance.imageCard} alt={$theme.properties.chance.name} />
					<p>{$theme.properties.chance.name}</p>
				</div>
			</div>
		</div>
		<div style="grid-area: f42;" class="deck community-chest">
			<div>
				<div></div>
				<div></div>
				<div></div>
				<div style={$theme.properties.communityChest.styleCard}>
					<img
						src={$theme.properties.communityChest.imageCard}
						alt={$theme.properties.communityChest.name}
					/>
					<p>{$theme.properties.communityChest.name}</p>
				</div>
			</div>
		</div>
		<div style="grid-area: f43;" id="branding">
			<div>
				<img src={$theme.branding.image} alt={$theme.branding.name} />
				<h1 style={$theme.branding.style}>{$theme.branding.name}</h1>
				<p>{$theme.branding.slogan}</p>
			</div>
		</div>
	</div>
</div>
