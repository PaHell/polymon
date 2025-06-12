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

	let { index, ...field }: Field & { type: FieldType.Utility; index: number } = $props();

	let utility: App.Data.Railroad | undefined = $state();
	$effect(() => {
		const half = Math.trunc(index / fieldTypeOrder.length);
		utility = $theme.properties.utilities[half] ?? null;
	});
</script>

{#if utility?.image}
	<img src={utility.image} alt={utility.name} />
{/if}
<div class="details">
	<p>{utility?.name}</p>
	{#if field.price}
		<p>{$theme.currency}{field.price}</p>
	{/if}
</div>
