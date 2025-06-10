<script lang="ts">
	import './game-field.css';
	import { FieldType, fieldTypeClassMap, fieldTypeOrder, type Field } from '$lib';
	import GameFieldImage from './GameFieldImage.svelte';
	import Icon from '../general/Icon.svelte';
	import { theme } from '$lib/theme';
	import GameFieldStreet from './GameFieldStreet.svelte';

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
		<p>{$theme.properties.communityChest.name}</p>
	{:else if field.type === FieldType.Chance}
		<p>{$theme.properties.chance.name}</p>
	{:else if field.type === FieldType.Jail}
		<p>{$theme.properties.jail.name}</p>
	{:else if field.type === FieldType.GoToJail}
		<p>{$theme.properties.goToJail.name}</p>
	{:else if field.type === FieldType.FreeParking}
		<p>{$theme.properties.freeParking.name}</p>
	{:else if field.type === FieldType.Railroad}
		<p>{$theme.properties.railroads[Math.trunc(index / 10)].name}</p>
		<p>Price: {field.price}{$theme.currency}</p>
	{:else if field.type === FieldType.Utility}
		<p>{$theme.properties.utilities[index < fieldTypeOrder.length / 2 ? 0 : 1].name}</p>
		<p>Price: {field.price}{$theme.currency}</p>
	{:else if field.type === FieldType.IncomeTax}
		<p>{$theme.properties.incomeTax.name}</p>
		<p>Pay {field.toPayFixed}{$theme.currency} or {field.toPayPercentage * 100}%</p>
	{:else if field.type === FieldType.LuxuryTax}
		<p>{$theme.properties.luxuryTax.name}</p>
		<p>Pay {field.toPay}{$theme.currency}</p>
	{/if}
</div>
