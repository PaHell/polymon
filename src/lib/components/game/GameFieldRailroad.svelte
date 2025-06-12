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
	import { theme, themes } from '$lib/theme';

	let { index, ...field }: Field & { type: FieldType.Railroad; index: number } = $props();

	let railroad: App.Data.Railroad | undefined = $state();
	$effect(() => {
		const side = Math.trunc(index / 10);
		railroad = $theme.properties.railroads[side] ?? null;
	});
</script>

{#if railroad?.image}
	<img src={railroad.image} alt={railroad.name} />
{/if}
<div class="details">
	<p>{railroad?.name}</p>
	{#if field.price}
		<p>{$theme.currency}{field.price}</p>
	{/if}
</div>
