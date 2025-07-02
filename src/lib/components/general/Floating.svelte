<script lang="ts">
	import {
		arrow as arrowMiddleware,
		computePosition,
		detectOverflow,
		type ComputePositionConfig,
		type Middleware,
		type MiddlewareReturn
	} from '@floating-ui/dom';
	import { onMount, type Snippet } from 'svelte';
	import Button from './Button.svelte';
	import { icons } from './Icon.svelte';
	import { clickOutside } from '../use';
	import './floating.css';

	const detectOverflowMiddleware: Middleware = {
		name: 'detect-oveflow',
		async fn(state) {
			const boundaryElement = boundaryId ? document.getElementById(boundaryId) : null;
			if (!boundaryElement) {
				boundaryOverflowX = 0;
				boundaryOverflowY = 0;
				return { data: {} } satisfies MiddlewareReturn;
			}
			const overflow = await detectOverflow(state, {
				boundary: boundaryElement
			});

			if (['t', 'b'].find((dir) => state.placement.startsWith(dir))) {
				let x = overflow.right > 0 ? overflow.right : overflow.left;
				if (overflow.right < 0 && overflow.left < 0) x = 0;
				if (x > 0) x += 2;
				if (overflow.left > 0) x *= -1;
				boundaryOverflowY = 0;
				boundaryOverflowX = x;
			}

			if (['l', 'r'].find((dir) => state.placement.startsWith(dir))) {
				let y = overflow.top > 0 ? overflow.top : overflow.bottom;
				if (overflow.bottom < 0 && overflow.top < 0) y = 0;
				if (y > 0) y += 2;
				if (overflow.top > 0) y *= -1;
				boundaryOverflowX = 0;
				boundaryOverflowY = y;
			}

			return { data: {} } satisfies MiddlewareReturn;
		}
	};

	let {
		referenceId,
		boundaryId,
		visible = $bindable(),
		closable = false,
		placement,
		strategy,
		middleware,
		class: classes,
		children
	}: Omit<ComputePositionConfig, 'platform'> & {
		referenceId: string;
		boundaryId?: string;
		visible: boolean;
		closable: boolean;
		class?: string;
		children: Snippet<[]>;
	} = $props();

	let arrowStyle = $state('');
	let menuStyle = $state('');
	let menu: HTMLElement;
	let arrow: HTMLElement;
	let boundaryOverflowX: number = 0;
	let boundaryOverflowY: number = 0;

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
				detectOverflowMiddleware,
				...(middleware ?? [])
			]
		}).then((res) => {
			menuStyle += `
				top: ${Math.round(res.y - boundaryOverflowY)}px;
				left: ${Math.round(res.x - boundaryOverflowX)}px;
				position: ${res.strategy};
			`;
			const bottom = res.placement.substring(0, 6) === 'bottom';
			const left = res.placement.substring(0, 4) === 'left';
			if (res.middlewareData.arrow?.x) {
				arrowStyle = `
					left: ${res.middlewareData.arrow.x + boundaryOverflowX}px;
					${bottom ? 'top' : 'bottom'}: ${res.middlewareData.arrow.y ?? 0};
				`;
			} else if (res.middlewareData.arrow?.y) {
				arrowStyle = `
					top: ${res.middlewareData.arrow.y + boundaryOverflowY}px;
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
