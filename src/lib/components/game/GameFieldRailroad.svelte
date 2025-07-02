<script lang="ts">
	import './game-field.css';
	import { FieldType, fieldTypeClassMap, getSideIndex } from '$lib';
	import GameFieldImage from './GameFieldImage.svelte';
	import Icon from '../general/Icon.svelte';
	import { theme, themes } from '$lib/theme';
	import { engine, getFieldTypeIndex } from '$lib/engine';

	let { index, typeIndex }: { index: number; typeIndex: number } = $props();

	let railroad: App.Data.Theme.Railroad | undefined = $derived(
		$theme.properties.railroads[typeIndex]
	);
</script>

{#if railroad?.image}
	<img src={railroad.image} alt={railroad.name} />
{/if}
<div class="details" title={JSON.stringify({ index, typeIndex, railroad }, null, 4)}>
	<p>{railroad?.name}</p>
	<p>{$theme.currency}{engine.settings.railroads.price}</p>
</div>
