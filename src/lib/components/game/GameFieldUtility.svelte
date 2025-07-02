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
</script>

{#if utility?.image}
	<img src={utility.image} alt={utility.name} />
{/if}
<div class="details" title={JSON.stringify({ index, typeIndex, utility }, null, 4)}>
	<p>{utility?.name}</p>
	<p>{$theme.currency}{engine.settings.utilities.price}</p>
</div>
