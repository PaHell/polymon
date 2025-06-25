<script lang="ts">
	import {
		arrow as arrowMiddleware,
		computePosition,
		type ComputePositionConfig
	} from '@floating-ui/dom';
	import { onMount, type Snippet } from 'svelte';
	import Button from './Button.svelte';
	import { icons } from './Icon.svelte';
	import { clickOutside } from '../use';
	import './floating.css';

	let {
		referenceId,
		visible = $bindable(),
		closable = false,
		placement,
		strategy,
		middleware,
		class: classes,
		children
	}: Omit<ComputePositionConfig, 'platform'> & {
		referenceId: string;
		visible: boolean;
		closable: boolean;
		class?: string;
		children: Snippet<[]>;
	} = $props();

	let arrowStyle = $state('');
	let menuStyle = $state('');
	let menu: HTMLElement;
	let arrow: HTMLElement;

	update();
	onMount(update);
	$effect(update);

	export function update() {
		if (!menu || !referenceId) {
			return;
		}
		const reference = document.getElementById(referenceId);
		if (!reference) {
			return;
		}
		computePosition(reference, menu, {
			placement,
			strategy,
			middleware: [
				arrowMiddleware({
					padding: 4,
					element: arrow
				}),
				...(middleware ?? [])
			]
		}).then((res) => {
			menuStyle += `
				top: ${res.y}px;
				left: ${res.x}px;
				position: ${res.strategy};
			`;
			const bottom = res.placement.substring(0, 6) === 'bottom';
			const left = res.placement.substring(0, 4) === 'left';
			if (res.middlewareData.arrow?.x) {
				arrowStyle = `
					left: ${res.middlewareData.arrow.x}px;
					${bottom ? 'top' : 'bottom'}: ${res.middlewareData.arrow.y ?? 0};
				`;
			} else if (res.middlewareData.arrow?.y) {
				arrowStyle = `
					top: ${res.middlewareData.arrow.y}px;
					${left ? 'right' : 'left'}: ${res.middlewareData.arrow.x ?? 0};
				`;
			} else {
				arrowStyle = '';
			}
		});
	}
</script>

<svelte:window onresize={update} onscroll={update} />

<menu
	bind:this={menu}
	class="floating floating-placement-{placement}"
	class:invisible={!visible}
	style={menuStyle}
	use:clickOutside={() => (visible = closable ? false : visible)}
>
	<div bind:this={arrow} class="floating-arrow" style={arrowStyle}>
		<svg fill="black" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M12.7181 0C16 0 19.9628 12 24.3096 12C28.6565 12 -3.22027 12 1.12658 12C5.47344 12 9.43623 0 12.7181 0Z"
			/>
		</svg>
	</div>
	<div class="floating-content {classes ?? ''}">
		{#if closable}
			<Button icon={icons.close} onclick={() => (visible = false)} />
		{/if}
		{@render children()}
	</div>
</menu>
