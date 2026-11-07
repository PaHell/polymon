<script lang="ts">
	import './game-field.css';
	import { colors, FieldType, fieldTypeClassMap } from '$lib';
	import GameFieldImage from './GameFieldImage.svelte';
	import Icon from '../general/Icon.svelte';
	import { theme } from '$lib/theme';
	import { engine, getFieldTypeIndex, getPropertyOwner } from '$lib/engine';
	import FieldOwnerDisplay from './FieldOwnerDisplay.svelte';

	let { index, typeIndex }: { index: number; typeIndex: number } = $props();

	let street: App.Data.Theme.Street | undefined = $derived($theme.properties.streets[typeIndex]);
</script>

<div
	class="buildings"
	style="background-color: {$theme.colors.streets[Math.trunc(index / 5)]};"
></div>
<div class="details" title={JSON.stringify({ index, typeIndex, street }, null, 4)}>
	<p>{street?.name}</p>
	<p>{$theme.currency}{engine.settings.streets[typeIndex].price}</p>
</div>
<FieldOwnerDisplay type={FieldType.Street} {typeIndex} />
