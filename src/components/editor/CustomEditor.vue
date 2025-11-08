<template>
    <div class="flex items-center justify-between mt-3">
        <h2 class="font-semibold mb-2">Text Input</h2>
        <button type="button" @click="remove"
            class="px-3 py-2 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Delete</button>
    </div>
    <div class="flex items-center justify-between mt-3">
        <label class="flex items-center gap-2">
            <input type="checkbox" :checked="element.required" @change="e => update('required', e.target.checked)"
                class="checkbox" />
            Required
        </label>
        <label class="flex items-center gap-2">
            <input type="checkbox" :checked="element.horizontal" @change="e => update('horizontal', e.target.checked)"
                class="checkbox" />
            Horizontal
        </label>
    </div>

    <label class="block mb-1">Label</label>
    <input v-model="element.label" @input="update('label', element.label)" class="w-full border p-1 mb-4" />

    <label class="block mb-1">Name</label>
    <input v-model="element.name" @input="update('name', element.name)" class="w-full border p-1 mb-4" />


    <label class="block mb-1">Classes</label>
    <input v-model="element.class" @input="update('class', element.class)" class="w-full border p-1 mb-4" />

    <hr>

    <label class="block mb-1">Element Id</label>
    <input v-model="element.elementId" @input="update('elementId', element.elementId)" class="w-full border p-1 mb-4" />

    <label class="block mb-1">Element Class</label>
    <input v-model="element.elementClass" @input="update('elementClass', element.elementClass)" class="w-full border p-1 mb-4" />

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
</template>

<script setup>
import { useBuilderStore } from '@/stores/builder'

const props = defineProps({
    element: Object
})

const store = useBuilderStore()

function update(key, value) {
    if (key === 'name') {
        if (!store.isNameUnique(value, props.element.id)) {
            props.element.name = ''
            alert('Name must be unique!')  // Atau pakai toast nanti
            return;
        }
    }
    if (store.selectedColumnFieldInfo) {
        store.updateSelectedColumnFieldProperty(key, value)
    } else {
        store.updateSelectedProperty(key, value)
    }
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