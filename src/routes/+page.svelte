<script lang="ts">
	import { analyticsInit } from '../modules/analytics';
	import { onMount } from 'svelte';
	import type { Component, Project, ShoppingListItem } from './+page.ts';

	onMount(() => {
		analyticsInit();
	});

	let project: Project = {
		name: '',
		quantity: 1,
		components: [
			{
				name: '',
				boltWidth: null,
				height: null,
				width: null,
				quantity: null,
				orientation: ''
			}
		]
	};

	let shoppingList: ShoppingListItem[] | undefined = [];

	function deleteComponent(e: Event, selectedIndex: number) {
		e.preventDefault();
		return (project.components = project.components.filter((_, i) => i !== selectedIndex));
	}

	function generateShoppingList(e: Event) {
		e.preventDefault();
		if (!isFormValid()) {
			console.error('Form is not valid. Please fill all required fields.');
			return;
		}

		let shoppingList: ShoppingListItem[] = [];
		project.components.forEach((component) => shoppingList.push(calculateFabricLength(component)));

		setTimeout(() => {
			let list = document.getElementById('list');
			if (list) {
				list.scrollIntoView({ behavior: 'smooth' });
			}
		}, 100);
		return shoppingList;
	}

	function calculateFabricLength(component: Component) {
		let length = 0;

		if (!component.quantity) {
			return {
				name: component.name,
				length: 0,
				quantity: 0
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
			if (!component.boltWidth || !component.height || !component.width || !component.quantity)
				return 0;
			let columnsWidthAligned = Math.floor(component.boltWidth / component.width);
			let rowsWidthAligned = Math.ceil(
				(component.quantity * project.quantity) / columnsWidthAligned
			);
			let totalLengthWidthAligned = rowsWidthAligned * component.height;
			return totalLengthWidthAligned;
		}

		function calculateHeightAligned() {
			if (!component.boltWidth || !component.height || !component.width || !component.quantity)
				return 0;
			let columnsHeightAligned = Math.floor(component.boltWidth / component.height);
			let rowsHeightAligned = Math.ceil(
				(component.quantity * project.quantity) / columnsHeightAligned
			);
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
			quantity: component.quantity * project.quantity
		};
	}

	function isFormValid() {
		if (!project.name || !project.quantity) {
			return false;
		}
		for (let component of project.components) {
			if (
				!component.name ||
				!component.boltWidth ||
				!component.height ||
				!component.width ||
				!component.quantity ||
				!component.orientation
			) {
				return false;
			}
		}
		return true;
	}

	function resetPage(e: Event) {
		e.preventDefault();
		project = {
			name: '',
			quantity: 1,
			components: [
				{
					name: '',
					boltWidth: null,
					height: null,
					width: null,
					quantity: null,
					orientation: ''
				}
			]
		};

		shoppingList = [];
	}

	let copied = false;

	async function exportList(e: Event) {
		e.preventDefault();
		if (!shoppingList || shoppingList.length === 0) return;
		let listText = shoppingList.map((item) => `${item.name}, ${item.length} inches`).join('\n');
		await navigator.clipboard.writeText(listText);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000); // Hide the popup after 2 seconds
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<form class="flex w-full flex-col items-center gap-5 p-5">
	<section class="flex w-full flex-col items-center gap-2">
		<div class="flex items-center gap-2">
			<input
				bind:value={project.name}
				class="input input-ghost input-lg w-48 rounded-lg font-serif lg:w-64"
				type="text"
				placeholder="My Project"
				required
			/>
			<span class="text-xl">x</span>
			<input
				bind:value={project.quantity}
				class="input input-ghost input-lg w-20 rounded-lg lg:w-28"
				type="number"
				required
			/>
		</div>
	</section>
	<section class="flex w-full flex-col items-center gap-5">
		<h2 class="font-serif text-xl">Components</h2>
		<div
			class="flex w-full flex-col items-center gap-5 lg:max-w-4xl lg:flex-row lg:flex-wrap lg:justify-center"
		>
			{#each project.components as component, i}
				<div
					class="relative flex w-full max-w-sm animate-fade-in flex-col rounded-box bg-secondary p-10"
				>
					<button
						class="btn btn-square btn-ghost btn-sm absolute left-1 top-1"
						on:click={(e) => deleteComponent(e, i)}
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
						<div class="xs:flex-row flex w-full flex-col items-center justify-between">
							<label class="xs:items-start flex w-full flex-col items-center">
								<div class="label">
									<span class="label-text">Width of Bolt (in):</span>
								</div>
								<input
									bind:value={component.boltWidth}
									class="input w-28 rounded-lg"
									type="number"
									required
								/>
							</label>
							<label class="xs:items-start flex w-full flex-col items-center">
								<div class="label">
									<span class="label-text">Quantity:</span>
								</div>
								<input
									bind:value={component.quantity}
									class="input w-28 rounded-lg"
									type="number"
									required
								/>
							</label>
						</div>
						<div class="xs:flex-row flex w-full flex-col items-center justify-between">
							<label class="xs:items-start flex w-full flex-col items-center">
								<div class="label">
									<span class="label-text">Height (in):</span>
								</div>
								<input
									bind:value={component.height}
									class="input w-28 rounded-lg"
									type="number"
									required
								/>
							</label>
							<label class="xs:items-start flex w-full flex-col items-center">
								<div class="label">
									<span class="label-text">Width (in):</span>
								</div>
								<input
									bind:value={component.width}
									class="input w-28 rounded-lg"
									type="number"
									required
								/>
							</label>
						</div>
						<select
							bind:value={component.orientation}
							class="select select-bordered mt-4 w-full max-w-xs rounded-lg"
							required
						>
							<option disabled selected value="">Orientation</option>
							<option value="efficient">Most efficient use of fabric</option>
							<option value="vertical">Height is aligned with Width of Bolt</option>
							<option value="horizontal">Height is aligned with Length of Bolt</option>
						</select>
					</div>
				</div>
			{/each}
		</div>
		<button
			class="btn btn-square btn-ghost"
			on:click={() =>
				(project.components = [
					...project.components,
					{
						name: '',
						boltWidth: 0,
						height: 0,
						width: 0,
						quantity: 0,
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
			on:click={(e) => (shoppingList = generateShoppingList(e))}
			>{shoppingList && shoppingList.length > 0
				? 'Refresh shopping list'
				: 'Generate shopping list'}</button
		>
	</section>

	{#if shoppingList && shoppingList.length > 0}
		<section id="list" class="flex animate-fade-in flex-col items-center gap-5 overflow-x-auto">
			<h2>
				Shopping List for {project.quantity + ' '}{project.name
					? project.name
					: '...'}{project.quantity > 1 ? 's' : ''}
			</h2>
			<table class="table table-xs md:table-lg">
				<!-- head -->

				<thead>
					<tr>
						<th>Name</th>
						<th>Quantity to Make</th>
						<th>Total Length Needed</th>
					</tr>
				</thead>
				<tbody>
					{#each shoppingList ?? [] as item}
						<tr>
							<td>{item.name}</td>
							<td>{item.quantity}</td>
							<td>{item.length} inches</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<div class="flex gap-3">
				{#if copied}
					<div class="toast toast-top toast-start">
						<div class="alert alert-info">
							<span>Copied to clipboard!</span>
						</div>
					</div>
				{/if}
				<button on:click={(e) => exportList(e)} class="btn btn-accent">Copy List</button>
				<button on:click={(e) => resetPage(e)} class="btn btn-primary">New Project</button>
			</div>
		</section>
	{/if}
</form>
