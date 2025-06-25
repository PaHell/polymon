<script lang="ts">
	import { boardConfigs, FieldType, getFieldIndexOnSide, getSideIndex } from '$lib';
	import { engine, getFieldTypeIndex } from '$lib/engine';
	import { theme, themes } from '$lib/theme';
	import { get } from 'svelte/store';
	import Select from '../general/Select.svelte';
	import Figure from './Figure.svelte';
	import GameField from './GameField.svelte';
	import Floating from '../general/Floating.svelte';
	import type { Placement } from '@floating-ui/dom';

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
		const fieldIndexSide = getFieldIndexOnSide(engine.board, fieldIndex);
		const lengthX = engine.board.lengthX;
		const lengthY = (engine.board.fieldTypeOrder.length - 2 * lengthX) / 2;
		const sideIndex = getSideIndex(engine.board, fieldIndex);
		const sideMap = [
			{ name: 'bottom', length: lengthX, start: '-start', end: '-end' },
			{ name: 'left', length: lengthY, start: '-start', end: '-end' },
			{ name: 'top', length: lengthX, start: '-end', end: '-start' },
			{ name: 'right', length: lengthY, start: '-end', end: '-start' }
		] satisfies {
			name: Placement;
			length: number;
			start: string;
			end: string;
		}[];

		const side = sideMap[sideIndex];
		currentPlacement = side.name;

		if (fieldIndexSide === 1) {
			currentPlacement += side.start;
		} else if (fieldIndexSide === side.length - 1) {
			currentPlacement += side.end;
		}
		fieldMenuVisible = true;
	}
</script>

<Floating
	referenceId={currentFieldId}
	bind:visible={fieldMenuVisible}
	placement={currentPlacement}
	closable
	class="h-72 w-48"
>
	{#snippet children()}
		<p>{currentFieldId}</p>
		<p>{currentPlacement}</p>
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
