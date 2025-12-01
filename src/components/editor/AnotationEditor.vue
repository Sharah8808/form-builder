<template>
	<div>
		<div class="flex items-center justify-between mt-3">
			<h2 class="font-semibold mb-2">Image Anotator</h2>
			<button
				type="button"
				@click="remove"
				class="px-3 py-2 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
			>
				Delete
			</button>
		</div>

		<label class="block text-sm mb-1">Label</label>
		<input
			@input="update('label', element.label)"
			v-model="element.label"
			class="w-full border p-1 mb-4"
		/>

		<label class="block text-sm mb-1">Name</label>
		<input
			@input="update('name', element.name)"
			v-model="element.name"
			class="w-full border p-1 mb-4"
		/>

		<label class="block text-sm mb-1">Src</label>
		<input
			@input="update('src', element.src)"
			v-model="element.src"
			class="w-full border p-1 mb-4"
		/>

		<label class="block mb-1">Width</label>
		<input
			v-model="element.width"
			placeholder="%, px, pt, ect.."
			@input="update('width', element.width)"
			class="w-full border p-1 mb-4"
		/>

		<label class="block mb-1">Height</label>
		<input
			v-model="element.height"
			placeholder="%, px, pt, ect.."
			@input="update('height', element.height)"
			class="w-full border p-1 mb-4"
		/>

		<label class="block mb-1">Classes</label>
		<input
			v-model="element.class"
			@input="update('class', element.class)"
			class="w-full border p-1 mb-4"
		/>

		<!-- Allowed annotation types -->
		<fieldset class="mb-4 p-2 border rounded">
			<legend class="text-sm font-medium mb-1">
				Tipe Anotasi Diizinkan
			</legend>
			<div class="grid grid-cols-2 gap-1 text-xs">
				<label
					v-for="opt in typeOptions"
					:key="opt.value"
					class="flex items-center gap-2"
				>
					<input
						type="checkbox"
						:value="opt.value"
						v-model="selectedTypes"
					/>
					<span>{{ opt.label }}</span>
				</label>
			</div>
			<p class="mt-1 text-[10px] text-gray-500">
				Jika tidak diubah, semua tipe akan diizinkan.
			</p>
		</fieldset>

		<!-- Allowed annotation colors -->
		<fieldset class="mb-4 p-2 border rounded">
			<legend class="text-sm font-medium mb-1">
				Warna Anotasi Diizinkan
			</legend>
			<div class="grid grid-cols-2 gap-1 text-xs">
				<label
					v-for="opt in colorOptions"
					:key="opt.value"
					class="flex items-center gap-2"
				>
					<input
						type="checkbox"
						:value="opt.value"
						v-model="selectedColors"
					/>
					<span>{{ opt.label }}</span>
				</label>
			</div>
			<p class="mt-1 text-[10px] text-gray-500">
				Jika tidak diubah, semua warna akan diizinkan.
			</p>
		</fieldset>

		<fieldset class="mb-4 p-2 border rounded">
			<legend class="text-sm font-medium mb-2">
				Conditional Visibility
			</legend>
			<label class="flex items-center gap-2 mb-2"
				>Has visibility?
				<input
					type="checkbox"
					:checked="!!element.visibility"
					@change="
						(e) => {
							if (!e.target.checked)
								update('visibility', undefined);
							else
								update('visibility', {
									showIf: {
										all: [
											{ field: '', op: '==', value: '' },
										],
									},
									else: 'hide',
								});
						}
					"
				/>
			</label>

			<div v-if="element.visibility?.showIf?.all" class="space-y-2">
				<div
					v-for="(cond, i) in element.visibility.showIf.all"
					:key="i"
					class="flex gap-2 items-center"
				>
					<input
						v-model="element.visibility.showIf.all[i].field"
						@input="update('visibility', element.visibility)"
						placeholder="field name"
						class="border p-1 w-1/3"
					/>
					<select
						v-model="element.visibility.showIf.all[i].op"
						@change="update('visibility', element.visibility)"
						class="border p-1"
					>
						<option value="==">==</option>
						<option value="!=">!=</option>
						<option value=">">&gt;</option>
						<option value="<">&lt;</option>
						<option value=">=">&gt;=</option>
						<option value="<=">&lt;=</option>
					</select>
					<input
						v-model="element.visibility.showIf.all[i].value"
						@input="update('visibility', element.visibility)"
						placeholder="value"
						class="border p-1 w-1/3"
					/>
					<button
						type="button"
						@click="
							() => {
								element.visibility.showIf.all.splice(i, 1);
								update('visibility', element.visibility);
							}
						"
						class="text-red-500"
					>
						X
					</button>
				</div>
				<button
					type="button"
					@click="
						() => {
							element.visibility.showIf.all.push({
								field: '',
								op: '==',
								value: '',
							});
							update('visibility', element.visibility);
						}
					"
					class="text-blue-500"
				>
					+ Add Condition
				</button>
				<div class="mt-2">
					<label class="block text-sm">Else action</label>
					<select
						v-model="element.visibility.else"
						@change="update('visibility', element.visibility)"
						class="border p-1"
					>
						<option value="show">Show</option>
						<option value="hide">Hide</option>
					</select>
				</div>
			</div>
		</fieldset>
	</div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useBuilderStore } from "@/stores/builder";
const store = useBuilderStore();
const props = defineProps({
	element: Object,
});

const typeOptions = [
	{ value: "check", label: "Centang" },
	{ value: "text", label: "Teks" },
	{ value: "mark", label: "Silang" },
	{ value: "circle", label: "Lingkaran" },
	{ value: "draw", label: "Arsir" },
];

const colorOptions = [
	{ value: "red", label: "Merah" },
	{ value: "black", label: "Hitam" },
	{ value: "green", label: "Hijau" },
	{ value: "blue", label: "Biru" },
	{ value: "yellow", label: "Kuning" },
];

// default: kalau JSON belum punya allowedTypes/allowedColors,
// anggap semua diizinkan (behavior lama)
const selectedTypes = ref(
	Array.isArray(props.element.allowedTypes) &&
		props.element.allowedTypes.length
		? [...props.element.allowedTypes]
		: typeOptions.map((o) => o.value)
);

const selectedColors = ref(
	Array.isArray(props.element.allowedColors) &&
		props.element.allowedColors.length
		? [...props.element.allowedColors]
		: colorOptions.map((o) => o.value)
);

function update(key, value) {
	if (key === "name") {
		if (!store.isNameUnique(value, props.element.id)) {
			props.element.name = "";
			alert("Name must be unique!"); // Atau pakai toast nanti
			return;
		}
	}
	if (store.selectedColumnFieldInfo) {
		store.updateSelectedColumnFieldProperty(key, value);
	} else {
		store.updateSelectedProperty(key, value);
	}
}

watch(
	selectedTypes,
	(val) => {
		update("allowedTypes", val);
	},
	{ deep: true }
);

watch(
	selectedColors,
	(val) => {
		update("allowedColors", val);
	},
	{ deep: true }
);

function remove() {
	if (store.selectedColumnFieldInfo) {
		// Hapus dari kolom tertentu
		const { colIndex, fieldId, parentId } = store.selectedColumnFieldInfo;
		const parent = store.elements.find((el) => el.id === parentId);

		if (parent && parent.columns?.[colIndex]) {
			console.log(parent.columns[colIndex]);
			parent.columns[colIndex] = parent.columns[colIndex].filter(
				(el) => el.id !== fieldId
			);

			store.selectedColumnFieldInfo = null;
		}
	} else {
		// Kalau bukan di kolom, hapus langsung dari root
		store.deleteSelectedElement();
	}
}
</script>
