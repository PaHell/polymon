<script lang="ts">
	import './game-field.css';
	import { FieldType, fieldTypeClassMap } from '$lib';
	import GameFieldImage from './GameFieldImage.svelte';
	import Icon from '../general/Icon.svelte';
	import { theme } from '$lib/theme';
	import GameFieldStreet from './GameFieldStreet.svelte';
	import GameFieldRailroad from './GameFieldRailroad.svelte';
	import GameFieldUtility from './GameFieldUtility.svelte';
	import { engine } from '$lib/engine';
	import { get } from 'svelte/store';
	import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

	let {
		fieldIndex,
		typeIndex,
		type,
		...others
	}: HTMLAttributes<HTMLButtonElement> & {
		fieldIndex: number;
		typeIndex: number;
		type: FieldType;
	} = $props();
</script>

<button
	id={type + '-' + typeIndex}
	type="button"
	class="game-field {fieldTypeClassMap[type]} field-layout-{Math.trunc(fieldIndex / 10)}"
	style="grid-area: f{fieldIndex + 1};"
	{...others}
>
	{#if type === FieldType.Go}
		<div>
			<p>
				Collect<br />{engine.settings.goSalary}{$theme.currency}
				{$theme.properties.go.salary}<br />as you pass
			</p>
			<p>{$theme.properties.go.name}</p>
		</div>
		<img src={$theme.properties.go.image} alt={$theme.properties.go.name} />
	{:else if type === FieldType.Street}
		<GameFieldStreet index={fieldIndex} {typeIndex} />
	{:else if type === FieldType.CommunityChest}
		<img
			src={$theme.properties.communityChest.imageField}
			alt={$theme.properties.communityChest.name}
		/>
		<div class="details">
			<p>{$theme.properties.communityChest.name}</p>
		</div>
	{:else if type === FieldType.Chance}
		<img src={$theme.properties.chance.imageField} alt={$theme.properties.chance.name} />
		<div class="details">
			<p>{$theme.properties.chance.name}</p>
		</div>
	{:else if type === FieldType.Jail}
		<p>{$theme.properties.justVisiting.row1}</p>
		<p>{$theme.properties.justVisiting.row2}</p>
		<div style="background-image: url({$theme.properties.jail.background});">
			<img src={$theme.properties.jail.image} alt={$theme.properties.jail.name} />
			<p>{$theme.properties.jail.name}</p>
		</div>
	{:else if type === FieldType.GoToJail}
		<div>
			<p>{$theme.properties.goToJail.name}</p>
			<img
				src={$theme.properties.goToJail.image}
				alt="{$theme.properties.goToJail.name} {$theme.properties.jail.name}"
			/>
			<p>{$theme.properties.jail.name}</p>
		</div>
	{:else if type === FieldType.FreeParking}
		<div>
			<p>{$theme.properties.freeParking.row1}</p>
			<img
				src={$theme.properties.freeParking.image}
				alt="{$theme.properties.freeParking.row1} {$theme.properties.freeParking.row2}"
			/>
			<p>{$theme.properties.freeParking.row2}</p>
		</div>
	{:else if type === FieldType.Railroad}
		<GameFieldRailroad index={fieldIndex} {typeIndex} />
	{:else if type === FieldType.Utility}
		<GameFieldUtility index={fieldIndex} {typeIndex} />
	{:else if type === FieldType.IncomeTax}
		<div class="details">
			<p>{$theme.properties.incomeTax.name}</p>
			<p>{$theme.currency}{engine.settings.incomeTax}</p>
		</div>
	{:else if type === FieldType.LuxuryTax}
		<div class="details">
			<p>{$theme.properties.luxuryTax.name}</p>
			<p>{$theme.currency}{engine.settings.luxuryTax}</p>
		</div>
	{/if}
</button>
