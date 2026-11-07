<script lang="ts">
	import './game-field.css';
	import { colors, FieldType, fieldTypeClassMap } from '$lib';
	import GameFieldImage from './GameFieldImage.svelte';
	import Icon from '../general/Icon.svelte';
	import { theme } from '$lib/theme';
	import { engine, getFieldTypeIndex, getPropertyOwner } from '$lib/engine';

	let { type, typeIndex }: { type: FieldType; typeIndex: number } = $props();

	let ownerId = $derived(getPropertyOwner($engine, type + '-' + typeIndex));
	let owner = $derived(ownerId ? $engine.players.find((p) => p.id === ownerId) : undefined);
</script>

{#if owner}
	<div class="owner">
		<div style="background-color: {colors[owner.color]}"></div>
	</div>
{/if}
