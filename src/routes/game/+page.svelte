<script lang="ts">
	import {
		earnGo,
		FieldType,
		fieldTypeOrder,
		payIncomeTaxFixed,
		payIncomeTaxPercentage,
		payLuxuryTax,
		pricesByIndex,
		streetColorOrder,
		type Field
	} from '$lib';
	import GameField from '$lib/components/game/GameField.svelte';
	import Select from '$lib/components/general/Select.svelte';
	import { theme, themes } from '$lib/theme';

	const fields = fieldTypeOrder.map((type, i) => {
		switch (type) {
			case FieldType.Go:
				return { type, toEarn: earnGo } satisfies Field;
			case FieldType.Street:
				return {
					type,
					name: 'street-' + (i + 1),
					price: pricesByIndex[i],
					color: streetColorOrder[Math.trunc(i / 5)]
				} satisfies Field;
			case FieldType.CommunityChest:
			case FieldType.Chance:
			case FieldType.Jail:
			case FieldType.GoToJail:
			case FieldType.FreeParking:
				return { type } satisfies Field;
			case FieldType.Railroad:
				return { type, name: 'railroad-' + (i + 1), price: pricesByIndex[i] } satisfies Field;
			case FieldType.Utility:
				return { type, name: 'utility-' + (i + 1), price: pricesByIndex[i] } satisfies Field;
			case FieldType.IncomeTax:
				return {
					type,
					toPayFixed: payIncomeTaxFixed,
					toPayPercentage: payIncomeTaxPercentage
				} satisfies Field;
			case FieldType.LuxuryTax:
				return { type, toPay: payLuxuryTax } satisfies Field;
		}
	});
</script>

<div id="game" style="background-color: {$theme.colors.background};">
	<Select
		label="Theme"
		items={themes}
		value={$theme}
		getKey={(theme) => theme.id}
		getText={(theme) => theme.name}
		onchange={(i) => (i ? theme.set(i) : {})}
		class="fixed top-2 right-2 z-10"
	/>
	<div
		id="gameboard"
		style="background-color: {$theme.colors.board}; border-color: {$theme.colors
			.border}; color: {$theme.colors.text};"
	>
		{#each fields as field, index (index)}
			<GameField {index} {...field} />
		{/each}
		<div style="grid-area: f41;" class="deck chance">
			<div>{$theme.properties.chance.name}</div>
		</div>
		<div style="grid-area: f42;" class="deck community-chest">
			<div>{$theme.properties.communityChest.name}</div>
		</div>
		<div style="grid-area: f43;" id="branding">
			<div>
				<h1 style={$theme.branding.style}>{$theme.branding.name}</h1>
				<p>{$theme.branding.slogan}</p>
			</div>
		</div>
	</div>
</div>
