<script lang="ts">
	import './modal.css';
	import Icon, { icons } from './Icon.svelte';
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';
	import Link from './Link.svelte';

	let {
		opened = $bindable(true),
		size = 'default',
		title,
		primary = 'Ok',
		secondary = 'Discard',
		onPrimary,
		onClose,
		hrefClose,
		hideClose = false,
		disableBackdropClose = false,
		actions,
		header,
		body,
		footer
	}: {
		opened?: boolean;
		size?: 'dialog' | 'default' | 'fullscreen';
		title: string;
		primary?: string;
		secondary?: string;
		onPrimary: () => unknown;
		onClose?: () => unknown;
		hrefClose?: string;
		hideClose?: boolean;
		disableBackdropClose?: boolean;
		actions?: Snippet<[]>;
		header?: Snippet<[]>;
		body: Snippet<[]>;
		footer?: Snippet<[]>;
	} = $props();
</script>

{#if opened}
	<div class="modal-container">
		<menu class="modal modal-{size}">
			<header>
				<div class="flex items-center">
					<h6 class="flex-1 truncate">{title}</h6>
					<div class="flex shrink-0 items-center">
						{@render actions?.()}
						{#if !hideClose}
							{#if hrefClose}
								<Link href={hrefClose} icon={icons.close} label="" onclick={onClose} />
							{:else if onClose}
								<Button variant="secondary" icon={icons.close} onclick={onClose} title="Close" />
							{/if}
						{/if}
					</div>
				</div>
				{@render header?.()}
			</header>
			<main>
				{@render body()}
			</main>
			<footer class="flex items-center justify-between">
				{@render footer?.()}
				<div class="flex flex-1 items-center justify-end space-x-2">
					{#if hrefClose}
						<Link href={hrefClose} label={secondary} onclick={onClose} />
					{:else if onClose}
						<Button variant="secondary" onclick={onClose}>{secondary}</Button>
					{/if}
					<Button variant="primary" onclick={onPrimary}>{primary}</Button>
				</div>
			</footer>
		</menu>
	</div>
{/if}
