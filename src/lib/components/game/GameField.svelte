<script lang="ts">
	import './game-field.css';
	import { FieldType, fieldTypeClassMap, fieldTypeOrder, type Field } from '$lib';
	import GameFieldImage from './GameFieldImage.svelte';
	import Icon from '../general/Icon.svelte';
	import { theme } from '$lib/theme';
	import GameFieldStreet from './GameFieldStreet.svelte';
	import GameFieldRailroad from './GameFieldRailroad.svelte';
	import GameFieldUtility from './GameFieldUtility.svelte';

	let {
		index,
		...field
	}: Field & {
		index: number;
	} = $props();
</script>

<div
	class="game-field {fieldTypeClassMap[field.type]} field-layout-{Math.trunc(index / 10)}"
	style="grid-area: f{index + 1};"
>
	{#if field.type === FieldType.Go}
		<p>Start</p>
		<p>Collect {field.toEarn}{$theme.currency}</p>
	{:else if field.type === FieldType.Street}
		<GameFieldStreet {index} {...field} />
	{:else if field.type === FieldType.CommunityChest}
		<img src={$theme.properties.communityChest.image} alt="Community Chest" />
		<div class="details">
			<p>{$theme.properties.communityChest.name}</p>
		</div>
	{:else if field.type === FieldType.Chance}
		<img src={$theme.properties.chance.image} alt="Chance" />
		<div class="details">
			<p>{$theme.properties.chance.name}</p>
		</div>
	{:else if field.type === FieldType.Jail}
		<div class="details">
			<p>{$theme.properties.jail.name}</p>
		</div>
	{:else if field.type === FieldType.GoToJail}
		<div class="details">
			<p>{$theme.properties.goToJail.name}</p>
		</div>
	{:else if field.type === FieldType.FreeParking}
		<div class="details">
			<p>{$theme.properties.freeParking.name}</p>
		</div>
	{:else if field.type === FieldType.Railroad}
		<GameFieldRailroad {index} {...field} />
	{:else if field.type === FieldType.Utility}
		<GameFieldUtility {index} {...field} />
	{:else if field.type === FieldType.IncomeTax}
		<div class="details">
			<p>{$theme.properties.incomeTax.name}</p>
			<p>{$theme.currency}{field.toPayFixed} <br />or<br /> {field.toPayPercentage * 100}%</p>
		</div>
	{:else if field.type === FieldType.LuxuryTax}
		<div class="details">
			<p>{$theme.properties.luxuryTax.name}</p>
			<p>{$theme.currency}{field.toPay}</p>
		</div>
	{/if}
</div>
