<script lang="ts">
	import './game-field.css';
	import { FieldType, fieldTypeClassMap } from '$lib';
	import GameFieldImage from './GameFieldImage.svelte';
	import Icon from '../general/Icon.svelte';
	import { theme, themes } from '$lib/theme';
	import { engine, getFieldTypeIndex } from '$lib/engine';
	import { util } from 'peerjs';

	let { index, typeIndex }: { index: number; typeIndex: number } = $props();

	let utility: App.Data.Theme.Utility | undefined = $derived(
		$theme.properties.utilities[typeIndex]
	);
	let price: number | undefined = $derived(engine.settings.priceUtilities[typeIndex]);
</script>

{#if utility?.image}
	<img src={utility.image} alt={utility.name} />
{/if}
<div class="details" title={JSON.stringify({ index, typeIndex, utility, price }, null, 4)}>
	<p>{utility?.name}</p>
	{#if engine.settings.priceStreets}
		<p>{$theme.currency}{price}</p>
	{/if}
</div>
