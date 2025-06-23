<script lang="ts">
	import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import './select.css';
	import Icon from './Icon.svelte';
	import { onMount, type Snippet } from 'svelte';
	import Button from './Button.svelte';
	import Input from './Input.svelte';

	type T = $$Generic;

	let {
		icon,
		label,
		items = $bindable(),
		value = $bindable(),
		search = $bindable(''),
		opened = $bindable(false),
		getKey = (item: T) => item as unknown as string | number,
		getText = (item: T) => item as unknown as string,
		onchange,
		beforeItem,
		afterItem,
		...others
	}: Omit<HTMLAttributes<HTMLElement>, 'children' | 'onchange'> & {
		icon?: string;
		label: string;
		items: T[];
		value: T | null | undefined;
		search?: string;
		getKey?: (item: T) => string | number;
		getText?: (item: T) => string;
		opened?: boolean;
		onchange?: (value: T | null | undefined) => void;
		beforeItem?: Snippet<
			[
				{
					item: T;
					index: number;
				}
			]
		>;
		afterItem?: Snippet<
			[
				{
					item: T;
					index: number;
				}
			]
		>;
	} = $props();

	let isSearching = $state(false);
	let refInput: Input | null = null;

	onMount(() => {
		if (!refInput) return;
		restoreSearchValue();
		if (others.autofocus) setOpen(true);
	});

	let filteredItems = $derived(() =>
		items.filter((item) => {
			const text = getText(item).toUpperCase();
			return text.includes(search.toUpperCase());
		})
	);

	function restoreSearchValue(): void {
		if (!search && value) {
			search = getText(value);
		}
	}

	function isActive(item: T): boolean {
		if (!value) return false;
		return getKey(value) === getKey(item);
	}

	function setOpen(open: boolean): void {
		opened = open;
		isSearching = false;
		if (opened && refInput) {
			refInput.selectAll();
		}
		if (!opened) {
			restoreSearchValue();
		}
	}
</script>

<div
	{...others}
	class="select {others.class ?? ''}"
	onfocusout={(e) => {
		const related = e.relatedTarget as HTMLElement | null;
		if (!related || !e.currentTarget.contains(related)) {
			setOpen(false);
		}
	}}
>
	<div class="relative">
		<div class="flex items-center">
			{#if value}
				{@render beforeItem?.({ item: value, index: -1 })}
			{/if}

			{#if icon}
				<Icon
					name={icon}
					class="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
					data-slot="icon"
				/>
			{/if}
			<Input
				bind:this={refInput}
				{label}
				hideLabel
				placeholder={label}
				bind:value={search}
				id="combobox"
				class="flex-1 [&>div>input]:!rounded-e-none"
				type="text"
				role="combobox"
				aria-controls="options"
				aria-expanded="false"
				onfocus={() => setOpen(true)}
				oninput={() => (isSearching = true)}
			/>
			{#if value}
				{@render afterItem?.({ item: value, index: -1 })}
			{/if}
			<Button
				variant="secondary"
				class="!rounded-s-none"
				type="button"
				onclick={() => setOpen(!opened)}
			>
				<svg
					class="size-5 text-gray-400"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
					data-slot="icon"
				>
					<path
						fill-rule="evenodd"
						d="M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z"
						clip-rule="evenodd"
					/>
				</svg>
			</Button>
		</div>

		<ul
			class="absolute top-12 z-10 flex max-h-56 w-full flex-col overflow-auto rounded-md bg-gray-600 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm"
			class:hidden={!opened}
			id="options"
			role="listbox"
		>
			<!--
        Combobox option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

        Active: "text-white bg-indigo-600 outline-hidden", Not Active: "text-gray-900"
      -->
			{#each isSearching ? filteredItems() : items as item, index (index)}
				<Button
					variant={isActive(item) ? 'primary' : 'secondary'}
					class="relative !rounded-none"
					id="option-{index}"
					role="option"
					aria-selected={isActive(item)}
					tabindex={-1}
					onclick={() => {
						value = item;
						search = getText(item);
						onchange?.(item);
						setOpen(false);
					}}
				>
					<div class="flex items-center">
						<!-- Selected: "font-semibold" -->
						{@render beforeItem?.({ item, index })}
						<span class="truncate" class:font-semibold={isActive(item)}>{getText(item)}</span>
						{@render afterItem?.({ item, index })}
					</div>

					<!--
          Checkmark, only display for selected option.

          Active: "text-white", Not Active: "text-indigo-600"
        -->
					{#if isActive(item)}
						<span class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
							<svg
								class="size-5"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
								data-slot="icon"
							>
								<path
									fill-rule="evenodd"
									d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
									clip-rule="evenodd"
								/>
							</svg>
						</span>
					{/if}
				</Button>
			{/each}

			<!-- More items... -->
		</ul>
	</div>
</div>
