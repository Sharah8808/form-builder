<template>
    <div v-if="element.type === 'date'" class="p-2 bg-white "
        :class="{ 'shadow-lg ring-blue-400': element.id === store.selectedElementId }" @click="selected(element.id)">
        <div v-if="element.horizontal">

            <div class="flex items-center">
                <label v-if="!element.required" :for="element.name" class="block mr-2 text-sm font-medium">{{
                    element.label
                }}</label>
                <label v-else :for="element.name" class="block mr-2 text-sm font-medium text-red-500">*{{
                    element.label }}</label>
                <span v-if="element.prepend"
                    class="inline-flex items-center px-2 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 py-1 mt-1 ">
                    {{ element.prepend }}
                </span>
                <input class="border px-2 py-1 mt-1 w-full" :required="element.required" :type="element.inputType"
                    :name="element.name" :placeholder="element.placeholder" disabled />
                <span v-if="element.append"
                    class="inline-flex items-center px-2 text-sm text-gray-900 bg-gray-200 border  border-gray-300 border-e-0 py-1 mt-1 ">
                    {{ element.append }}
                </span>
            </div>
        </div>
        <div v-else>
            <label v-if="!element.required" :for="element.name" class="block text-sm font-medium">{{ element.label
                }}</label>
            <label v-else :for="element.name" class="block text-sm font-medium text-red-500">*{{
                element.label }}</label>
            <div class="flex">
                <span v-if="element.prepend"
                    class="inline-flex items-center px-2 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 py-1 mt-1 ">
                    {{ element.prepend }}
                </span>
                <input class="border px-2 py-1 mt-1 w-full" :required="element.required" :type="element.inputType"
                    :name="element.name" :placeholder="element.placeholder" disabled />
                <span v-if="element.append"
                    class="inline-flex items-center px-2 text-sm text-gray-900 bg-gray-200 border  border-gray-300 border-e-0 py-1 mt-1 ">
                    {{ element.append }}
                </span>
            </div>
        </div>
        <div class="flex justify-between">
            <small class="text-blue-500">name:[ {{ element.name }} ]</small>
            <small class="text-stone-900">{{ element.type }}</small>
            <small class="text-gray-700">classes:{ {{ element.class }} }</small>
            <small :class="element.visibility ? 'text-green-500' : 'text-red-500'">{{ element.visibility ? 'has conditional visibility' : 'has no conditional visibility' }}</small>
        </div>
    </div>

</template>

<script setup>
import { useBuilderStore } from '@/stores/builder'
import { computed } from 'vue'

const store = useBuilderStore()
const props = defineProps({
    element: {
        type: Object,
        required: true
    }
})

function selected(elementId) {
    store.selectElement(elementId)
}

function getFieldValueByName(name) {
    // try store helper first, else fallback to store.formData (adjust to your store)
    if (typeof store.getValueByName === 'function') return store.getValueByName(name)
    return (store.formData && store.formData[name]) ?? undefined
}

function evaluateCondition(cond) {
    const val = getFieldValueByName(cond.field)
    if (cond.op === '==') return String(val) === String(cond.value)
    if (cond.op === '!=') return String(val) !== String(cond.value)
    if (cond.op === '>') return Number(val) > Number(cond.value)
    if (cond.op === '<') return Number(val) < Number(cond.value)
    if (cond.op === '>=') return Number(val) >= Number(cond.value)
    if (cond.op === '<=') return Number(val) <= Number(cond.value)
    return false
}

const visible = computed(() => {
    const vis = props.element.visibility
    if (!vis) return true
    const showIf = vis.showIf
    if (!showIf) return true
    if (showIf.all && Array.isArray(showIf.all)) {
        return showIf.all.every(evaluateCondition)
    }
    // fallback: show
    return true
})
</script>

<style scoped>
input[disabled] {
    background-color: white;
    color: black;
}
</style>
