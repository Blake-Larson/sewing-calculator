<script lang="ts">
	import { analyticsInit } from '../modules/analytics';
	import { onMount } from 'svelte';
	import type { Component, Project, ShoppingListItem } from './+page.ts';

	onMount(() => {
		analyticsInit();
	});

	let project: Project = {
		name: '',
		number: 1,
		components: [
			{
				name: '',
				boltWidth: null,
				height: null,
				width: null,
				number: null,
				orientation: ''
			}
		]
	};

	let shoppingList: ShoppingListItem[] | undefined = [];

	function deleteComponent(selectedIndex: number) {
		return (project.components = project.components.filter((_, i) => i !== selectedIndex));
	}

	function generateShoppingList() {
		if (!isFormValid()) {
			console.error('Form is not valid. Please fill all required fields.');
			return;
		}

		let shoppingList: ShoppingListItem[] = [];
		project.components.forEach((component) => shoppingList.push(calculateFabricLength(component)));
		console.log(shoppingList);
		return shoppingList;
	}

	function calculateFabricLength(component: Component) {
		let length = 0;

		if (!component.number) {
			return {
				name: component.name,
				length: 0,
				amount: 0
			};
		}

		if (component.orientation === 'efficient') {
			length = calculateEfficient();
		} else if (component.orientation === 'vertical') {
			length = calculateHeightAligned();
		} else if (component.orientation === 'horizontal') {
			length = calculateWidthAligned();
		}

		function calculateWidthAligned() {
			if (!component.boltWidth || !component.height || !component.width || !component.number)
				return 0;
			let columnsWidthAligned = Math.floor(component.boltWidth / component.width);
			let rowsWidthAligned = Math.ceil((component.number * project.number) / columnsWidthAligned);
			let totalLengthWidthAligned = rowsWidthAligned * component.height;
			return totalLengthWidthAligned;
		}

		function calculateHeightAligned() {
			if (!component.boltWidth || !component.height || !component.width || !component.number)
				return 0;
			let columnsHeightAligned = Math.floor(component.boltWidth / component.height);
			let rowsHeightAligned = Math.ceil((component.number * project.number) / columnsHeightAligned);
			let totalLengthHeightAligned = rowsHeightAligned * component.width;
			return totalLengthHeightAligned;
		}

		function calculateEfficient() {
			let totalLengthWidthAligned = calculateWidthAligned();
			let totalLengthHeightAligned = calculateHeightAligned();

			let minimumFabricLength = Math.min(totalLengthWidthAligned, totalLengthHeightAligned);
			return Math.ceil(minimumFabricLength);
		}

		return {
			name: component.name,
			length: length,
			amount: component.number * project.number
		};
	}

	function isFormValid() {
		if (!project.name || !project.number) {
			return false;
		}
		for (let component of project.components) {
			if (
				!component.name ||
				!component.boltWidth ||
				!component.height ||
				!component.width ||
				!component.number ||
				!component.orientation
			) {
				return false;
			}
		}
		return true;
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<form class="flex w-full flex-col gap-5 p-5">
	<div class="flex w-full flex-col items-center gap-2">
		<div class="flex gap-2 items-center">
			<input
				bind:value={project.name}
				class="input w-full max-w-xs rounded-lg input-ghost input-lg"
				type="text"
				placeholder="My Project"
				required
			/>
			<span>x</span>
			<input bind:value={project.number} class="input w-20 rounded-lg" type="number" required />
		</div>
	</div>
	<div class="flex w-full flex-col items-center gap-5">
		<h2>Components</h2>
		{#each project.components as component, i}
			<div class="relative flex w-full max-w-sm flex-col rounded-box bg-secondary p-10">
				<button
					type="button"
					class="btn btn-square btn-ghost btn-sm absolute left-1 top-1"
					on:click={() => deleteComponent(i)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>

				<div class="flex w-full flex-col items-center gap-2">
					<input
						bind:value={component.name}
						class="input input-bordered w-full max-w-xs rounded-lg"
						type="text"
						placeholder="Name"
						required
					/>
					<label class="form-control w-full max-w-xs flex-row justify-end">
						<div class="label">
							<span class="label-text">Width of Bolt(in):</span>
						</div>
						<input
							bind:value={component.boltWidth}
							class="input w-20 rounded-lg"
							type="number"
							required
						/>
					</label>
					<label class="form-control w-full max-w-xs flex-row justify-end">
						<div class="label">
							<span class="label-text">Number needed for one project:</span>
						</div>
						<input
							bind:value={component.number}
							class="input w-20 rounded-lg"
							type="number"
							required
						/>
					</label>
					<label class="form-control w-full max-w-xs flex-row justify-end">
						<div class="label">
							<span class="label-text">Height(in):</span>
						</div>
						<input
							bind:value={component.height}
							class="input w-20 rounded-lg"
							type="number"
							required
						/>
					</label>
					<label class="form-control w-full max-w-xs flex-row justify-end">
						<div class="label">
							<span class="label-text">Width(in):</span>
						</div>
						<input
							bind:value={component.width}
							class="input w-20 rounded-lg"
							type="number"
							required
						/>
					</label>
					<select
						bind:value={component.orientation}
						class="select select-bordered w-full max-w-xs rounded-lg"
						required
					>
						<option disabled selected value="">Orientation</option>
						<option value="efficient">Most efficient</option>
						<option value="vertical">Height is vertical</option>
						<option value="horizontal">Height is horizontal</option>
					</select>
				</div>
			</div>
		{/each}
		<button
			type="button"
			class="btn btn-square btn-ghost"
			on:click={() =>
				(project.components = [
					...project.components,
					{
						name: '',
						boltWidth: 0,
						height: 0,
						width: 0,
						number: 0,
						orientation: ''
					}
				])}
			><svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-8 w-8"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
				/>
			</svg>
		</button>
		<button
			type="submit"
			class="btn btn-primary"
			on:click={() => (shoppingList = generateShoppingList())}>Generate shopping list</button
		>
	</div>

	{#if shoppingList && shoppingList.length > 0}
		<div class="flex w-full flex-col gap-5">
			<h2>
				Shopping List for {project.number + ' '}{project.name
					? project.name
					: '...'}{project.number > 1 ? 's' : ''}
			</h2>
			<ul>
				{#each shoppingList ?? [] as item}
					<li>{item.amount} x {item.name}: {item.length} inches</li>
				{/each}
			</ul>
		</div>
	{/if}
</form>
