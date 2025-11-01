<template>
    <div v-if="element?.type === 'table'">
        <div class="flex items-center justify-between mt-3">
            <h2 class="font-semibold mb-2">Table Input</h2>
            <button type="button" @click="remove"
                class="px-3 py-2 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Delete</button>
        </div>

        <label class="block mb-1">Label</label>
        <input v-model="element.label" @input="update('label', element.label)" class="w-full border p-1 mb-2" />

        <label class="block mb-1">Name</label>
        <input v-model="element.name" @input="updateName" class="w-full border p-1 mb-2" />

        <label class="block mb-1">Classes</label>
        <input v-model="element.class" @input="update('class', element.class)" class="w-full border p-1 mb-4" />

        <label class="block mb-1">Jumlah Kolom</label>
        <input type="number" class="w-full border p-1 mb-2" v-model.number="columnCount" @input="setColumnCount"
            min="1" />

        <label class="block mb-1">Nama Kolom</label>
        <div v-for="(col, idx) in element.columns" :key="idx" class="flex gap-2 mb-2">
            <input v-model="element.columns[idx]" @input="updateColumnName(idx, element.columns[idx])"
                class="w-full border p-1" />
        </div>

        <fieldset class="mb-4 mt-4 p-2 border rounded">
            <legend class="text-sm font-medium mb-2">Conditional Visibility</legend>
            <label class="flex items-center gap-2 mb-2">Has visibility? 
                <input type="checkbox" :checked="!!element.visibility" @change="e => {if (!e.target.checked) update('visibility', undefined); else update ('visibility', { showIf: {all : [ {field: '', op: '==', value: ''}]}, else: 'hide'}) }"/>
            </label>

            <div v-if="element.visibility?.showIf?.all" class="space-y-2">
                <div v-for="(cond, i) in element.visibility.showIf.all" :key="i" class="flex gap-2 items-center">
                    <input v-model="element.visibility.showIf.all[i].field" @input="update('visibility', element.visibility)" placeholder="field name" class="border p-1 w-1/3"/>
                    <select v-model="element.visibility.showIf.all[i].op" @change="update('visibility', element.visibility)" class="border p-1">
                        <option value="==">==</option>
                        <option value="!=">!=</option>
                        <option value=">">&gt;</option>
                        <option value="<">&lt;</option>
                        <option value=">=">&gt;=</option>
                        <option value="<=">&lt;=</option>
                    </select>
                    <input v-model="element.visibility.showIf.all[i].value" @input="update('visibility', element.visibility)" placeholder="value" class="border p-1 w-1/3">
                    <button type="button" @click="() => { element.visibility.showIf.all.splice(i,1); update('visibility', element.visibility)}" class="text-red-500">X</button>
                </div>
                <button type="button" @click="() => { element.visibility.showIf.all.push({ field: '', op: '==', value: '' }); update('visibility', element.visibility) }" class="text-blue-500">+ Add Condition</button>
                <div class="mt-2">
                    <label class="block text-sm">Else action</label>
                    <select v-model="element.visibility.else" @change="update('visibility', element.visibility)" class="border p-1">
                        <option value="show">Show</option>
                        <option value="hide">Hide</option>
                    </select>
                </div>
            </div>
        </fieldset>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBuilderStore } from '@/stores/builder'
const props = defineProps({ element: Object })
const store = useBuilderStore()

function update(key, value) {
    if (store.selectedColumnFieldInfo) {
        store.updateSelectedColumnFieldProperty(key, value)
    } else {
        store.updateSelectedProperty(key, value)
    }
}

function updateName(e) {
    const val = e.target.value
    if (!store.isNameUnique(val, props.element.id)) {
        alert('Name harus unik')
        return
    }
    update('name', val)
}

const columnCount = ref(props.element.columns?.length || 1)

function setColumnCount() {
    const count = Math.max(1, columnCount.value)
    const current = props.element.columns || []
    const updated = [...current.slice(0, count)]
    while (updated.length < count) {
        updated.push(`Kolom ${updated.length + 1}`)
    }
    update('columns', updated)
}

function updateColumnName(idx, val) {
    props.element.columns[idx] = val
}

function remove() {
    if (store.selectedColumnFieldInfo) {

        // Hapus dari kolom tertentu
        const { colIndex, fieldId, parentId } = store.selectedColumnFieldInfo
        const parent = store.elements.find(el => el.id === parentId)

        if (parent && parent.columns?.[colIndex]) {
            console.log(parent.columns[colIndex]);
            parent.columns[colIndex] = parent.columns[colIndex].filter(el => el.id !== fieldId)

            store.selectedColumnFieldInfo = null
        }
    } else {
        // Kalau bukan di kolom, hapus langsung dari root
        store.deleteSelectedElement()
    }
}
</script>
  
