<script lang="ts">
	import { boardConfigs, FieldType, getFieldIndexOnSide, getSideIndex } from '$lib';
	import { engine, getFieldTypeIndex } from '$lib/engine';
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

	let fields = $state(
		engine.board.fieldTypeOrder.map((type, fieldIndex) => ({
			type,
			fieldIndex,
			typeIndex: getFieldTypeIndex(engine.board, type, fieldIndex)
		}))
	);

	let currentFieldId: App.Data.GameState.Street['id'] = $state('');
	let fieldMenuVisible = $state(false);
	let currentPlacement: Placement = $state('top');

	function openFieldMenu(fieldIndex: number, typeIndex: number, type: FieldType) {
		if ([FieldType.Street, FieldType.Railroad, FieldType.Utility].indexOf(type) === -1) {
			return;
		}
		currentFieldId = `${type}-${typeIndex}`;
		const sideIndex = getSideIndex(engine.board, fieldIndex);
		const sideMap = ['bottom', 'left', 'top', 'right'] satisfies Placement[];
		currentPlacement = sideMap[sideIndex];
		fieldMenuVisible = true;
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
		<PropertyCard id={currentFieldId} />
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
