<script lang="ts">
	import './game-field.css';
	import {
		FieldType,
		fieldTypeClassMap,
		fieldTypeOrder,
		streetColorOrder,
		type Field,
		type StreetField
	} from '$lib';
	import GameFieldImage from './GameFieldImage.svelte';
	import Icon from '../general/Icon.svelte';
	import { theme } from '$lib/theme';

	let { type, name, color, price, index }: StreetField & { index: number } = $props();

	let street: App.Data.Property | undefined = $state();
	$effect(() => {
		const quarter = Math.floor(index / 5);
		const subset = fieldTypeOrder.slice(quarter * 5, index + 1);
		const streetIndex = subset.filter((t) => t === FieldType.Street).length - 1;

		const streetKey = streetColorOrder[quarter];
		const streets = $theme.properties.streets[streetKey];

		street = streets?.[streetIndex] ?? null;
	});
</script>

<div
	class="buildings"
	style="background-color: {$theme.colors.streets[Math.trunc(index / 5)]};"
></div>
<h5 class="">{street?.name}</h5>
{#if price}
	<p class="price">{price}{$theme.currency}</p>
{/if}
