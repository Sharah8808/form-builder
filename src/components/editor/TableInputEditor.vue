<template>
	<div v-if="element?.type === 'table'">
		<div class="flex items-center justify-between mt-3">
			<h2 class="font-semibold mb-2">Table Input</h2>
			<button
				type="button"
				@click="remove"
				class="px-3 py-2 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
			>
				Delete
			</button>
		</div>

		<!-- Basic props -->
		<label class="block mb-1">Label</label>
		<input
			v-model="element.label"
			@input="update('label', element.label)"
			class="w-full border p-1 mb-2"
		/>

		<label class="block mb-1">Name</label>
		<input
			:value="element.name"
			@input="updateName"
			class="w-full border p-1 mb-2"
		/>

		<label class="block mb-1">Classes</label>
		<input
			v-model="element.class"
			@input="update('class', element.class)"
			class="w-full border p-1 mb-4"
		/>

		<!-- Columns -->
		<label class="block mb-1">Jumlah Kolom</label>
		<input
			type="number"
			class="w-full border p-1 mb-2"
			v-model.number="columnCount"
			@input="setColumnCount"
			min="1"
		/>

		<label class="block mb-1">Nama Kolom</label>
		<div
			v-for="(col, idx) in element.columns"
			:key="idx"
			class="flex gap-2 mb-2"
		>
			<input
				v-model="element.columns[idx]"
				@input="updateColumnName(idx, element.columns[idx])"
				class="w-full border p-1"
			/>
		</div>

		<!-- Rows editor -->
		<fieldset class="mb-4 mt-4 p-2 border rounded">
			<legend class="text-sm font-medium mb-2">Rows (Isi Tabel)</legend>

			<div
				v-if="!element.rows || !element.rows.length"
				class="text-xs text-gray-500 mb-2"
			>
				Belum ada baris. Klik tombol di bawah untuk menambah baris.
			</div>

			<div
				v-for="(row, rowIndex) in element.rows"
				:key="rowIndex"
				class="border rounded p-2 mb-2 bg-white"
			>
				<div class="flex items-center justify-between mb-2">
					<span class="font-semibold text-sm"
						>Row {{ rowIndex + 1 }}</span
					>
					<button
						type="button"
						class="text-xs text-red-600 hover:underline"
						@click="removeRow(rowIndex)"
					>
						Hapus baris
					</button>
				</div>

				<div class="space-y-2">
					<div
						v-for="(cell, colIndex) in row"
						:key="colIndex"
						class="flex items-top gap-2"
					>
						<span class="w-1/4 text-[11px] text-gray-600 font-bold">
							{{
								element.columns?.[colIndex] ||
								"Kolom " + (colIndex + 1)
							}}
						</span>

						<div class="grid grid-cols-1 gap-1 flex-1">
							<!-- pilih tipe cell -->
							<select
								v-model="cell.type"
								@change="onCellTypeChanged(rowIndex, colIndex)"
								class="border p-1 text-xs"
							>
								<option value="text">Text</option>
								<option value="input">Input</option>
								<option value="checkbox">Checkbox</option>
								<option value="radio">Radio</option>
								<option value="empty">Kosong</option>
							</select>

							<!-- TEXT -->
							<input
								v-if="cell.type === 'text'"
								class="border p-1 text-xs"
								v-model="cell.text"
								placeholder="Isi teks cell"
								@input="onCellChanged()"
							/>

							<!-- INPUT biasa -->
							<div
								v-else-if="cell.type === 'input'"
								class="flex gap-1"
							>
								<input
									class="border p-1 text-xs flex-1"
									v-model="cell.label"
									placeholder="Label"
									@input="onCellChanged()"
								/>
								<input
									class="border p-1 text-xs w-28"
									v-model="cell.name"
									placeholder="Name"
									@input="onCellChanged()"
								/>
							</div>

							<!-- CHECKBOX / RADIO: pakai options[0] -->
							<div
								v-else-if="
									cell.type === 'checkbox' ||
									cell.type === 'radio'
								"
								class="flex flex-col gap-1"
							>
								<div class="grid grid-cols-1 gap-1">
									<input
										class="border p-1 text-xs w-28"
										v-model="cell.name"
										placeholder="group name"
										@input="onCellChanged()"
									/>
									<input
										class="border p-1 text-xs flex-1"
										v-model="cell.options[0].label"
										placeholder="option label"
										@input="syncOptionValue(cell)"
									/>
									<input
										class="border p-1 text-xs w-28"
										v-model="cell.options[0].value"
										placeholder="option value"
										@input="onCellChanged()"
									/>
								</div>
								<small class="text-[10px] text-gray-500">
									JSON: { type: "{{ cell.type }}", name,
									options: [ { label, value } ] }
								</small>
							</div>

							<!-- EMPTY -->
							<span
								v-else
								class="text-[11px] italic text-gray-400"
							>
								(kosong)
							</span>
						</div>
					</div>
				</div>
			</div>

			<button
				type="button"
				@click="addRow"
				class="mt-1 inline-flex items-center px-3 py-1 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700"
			>
				+ Tambah Baris
			</button>
		</fieldset>

		<!-- Conditional Visibility (unchanged) -->
		<fieldset class="mb-4 mt-4 p-2 border rounded">
			<legend class="text-sm font-medium mb-2">
				Conditional Visibility
			</legend>
			<label class="flex items-center gap-2 mb-2">
				Has visibility?
				<input
					type="checkbox"
					:checked="!!element.visibility"
					@change="toggleVisibility"
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
						@click="removeCondition(i)"
						class="text-red-500 text-sm"
					>
						X
					</button>
				</div>
				<button
					type="button"
					@click="addCondition"
					class="text-blue-500 text-xs"
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
import { ref } from "vue";
import { useBuilderStore } from "@/stores/builder";

const props = defineProps({ element: Object });
const element = props.element;
const store = useBuilderStore();

function update(key, value) {
	if (store.selectedColumnFieldInfo) {
		store.updateSelectedColumnFieldProperty(key, value);
	} else {
		store.updateSelectedProperty(key, value);
	}
}

function updateName(e) {
	const val = e.target.value;
	if (!store.isNameUnique(val, props.element.id)) {
		alert("Name harus unik");
		e.target.value = props.element.name || "";
		return;
	}
	update("name", val);
}

const columnCount = ref(props.element.columns?.length || 1);

function makeDefaultCell() {
	return {
		type: "text",
		text: "",
	};
}

function normalizeRowsForColumnChange(newColumns) {
	const colCount = newColumns.length;
	if (!element.rows || !Array.isArray(element.rows)) return;

	element.rows = element.rows.map((row) => {
		const current = Array.isArray(row) ? row : [];
		const updated = current.slice(0, colCount);
		while (updated.length < colCount) {
			updated.push(makeDefaultCell());
		}
		return updated;
	});

	update("rows", element.rows);
}

function setColumnCount() {
	const count = Math.max(1, columnCount.value);
	const current = element.columns || [];
	const updated = [...current.slice(0, count)];
	while (updated.length < count) {
		updated.push(`Kolom ${updated.length + 1}`);
	}
	element.columns = updated;
	update("columns", element.columns);
	normalizeRowsForColumnChange(updated);
}

function updateColumnName(idx, val) {
	element.columns[idx] = val;
	update("columns", element.columns);
}

function addRow() {
	const colCount = element.columns?.length || 1;
	const newRow = Array.from({ length: colCount }, () => makeDefaultCell());
	if (!element.rows) element.rows = [];
	element.rows.push(newRow);
	update("rows", element.rows);
}

function ensureCheckboxOrRadioShape(cell) {
	if (!cell.name) cell.name = "";
	// pastikan options array ada dan minimal 1 elemen
	if (!Array.isArray(cell.options) || !cell.options.length) {
		const baseLabel = cell.label || cell.text || "";
		const val =
			(baseLabel || "")
				.toLowerCase()
				.replace(/\s+/g, "_")
				.replace(/[^a-z0-9_]/g, "") || "";
		cell.options = [
			{
				name: cell.name || val,
				label: baseLabel,
				value: val,
			},
		];
	} else {
		// kalau sudah ada options, sync label/value root ke options[0]
		const opt = cell.options[0];
		if (cell.label && !opt.label) opt.label = cell.label;
		if (cell.value && !opt.value) opt.value = cell.value;
		if (!opt.name) opt.name = cell.name || opt.value || "";
	}

	// bersihin root supaya JSON akhir bersih
	delete cell.label;
	delete cell.value;
	delete cell.text;
}

function ensureInputShape(cell) {
	if (!cell.label) cell.label = cell.text || "";
	if (!("value" in cell)) cell.value = "";
	if (!cell.name) cell.name = "";
	delete cell.text;
	delete cell.options;
}

function ensureTextShape(cell) {
	if (!cell.text) cell.text = cell.label || cell.value || "";
	delete cell.label;
	delete cell.value;
	delete cell.options;
	delete cell.name;
}

function removeRow(rowIndex) {
	if (!element.rows) return;
	element.rows.splice(rowIndex, 1);
	update("rows", element.rows);
}

function onCellChanged() {
	// cukup push ke store supaya reactive
	update("rows", element.rows);
}

function onCellTypeChanged(rowIndex, colIndex) {
	const cell = element.rows?.[rowIndex]?.[colIndex];
	if (!cell) return;

	if (cell.type === "checkbox" || cell.type === "radio") {
		ensureCheckboxOrRadioShape(cell);
	} else if (cell.type === "input") {
		ensureInputShape(cell);
	} else if (cell.type === "text") {
		ensureTextShape(cell);
	} else if (cell.type === "empty") {
		// kosongkan semua selain type
		Object.keys(cell).forEach((k) => {
			if (k !== "type") delete cell[k];
		});
	}

	update("rows", element.rows);
}

// kalau label option diganti, auto isi value kalau masih kosong
function syncOptionValue(cell) {
	if (!cell.options || !cell.options[0]) return;
	const opt = cell.options[0];
	if (!opt.value) {
		opt.value = (opt.label || "")
			.toLowerCase()
			.replace(/\s+/g, "_")
			.replace(/[^a-z0-9_]/g, "");
	}
	onCellChanged();
}

function toggleVisibility(e) {
	if (!e.target.checked) {
		update("visibility", undefined);
	} else {
		update("visibility", {
			showIf: { all: [{ field: "", op: "==", value: "" }] },
			else: "hide",
		});
	}
}

function addCondition() {
	element.visibility.showIf.all.push({ field: "", op: "==", value: "" });
	update("visibility", element.visibility);
}

function removeCondition(i) {
	element.visibility.showIf.all.splice(i, 1);
	update("visibility", element.visibility);
}

function remove() {
	if (store.selectedColumnFieldInfo) {
		const { colIndex, fieldId, parentId } = store.selectedColumnFieldInfo;
		const parent = store.elements.find((el) => el.id === parentId);

		if (parent && parent.columns?.[colIndex]) {
			parent.columns[colIndex] = parent.columns[colIndex].filter(
				(el) => el.id !== fieldId
			);
			store.selectedColumnFieldInfo = null;
		}
	} else {
		store.deleteSelectedElement();
	}
}
</script>
