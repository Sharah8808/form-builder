<!-- components/elements/SelectInput.vue -->
<template>
    <div class="p-2 mb-1 bg-white" :class="{ 'shadow-lg ring-blue-400': element.id === store.selectedElementId }"
        @click="store.selectElement(element.id)">
        <div :class="element.horizontal ? 'flex items-center' : ''">
            <label v-if="!element.required" :for="element.name" :class="element.horizontal ? 'mr-2' : ''" class="block text-sm font-medium">{{ element.label
            }}</label>
            <label v-if="element.required" :for="element.name" :class="element.horizontal ? 'mr-2' : ''" class="block text-sm font-medium text-red-500">*{{
                element.label }}</label>
            <select :required="element.required" :name="element.name" class="w-full border p-1 mt-1" disabled>
                <option v-for="(opt, idx) in element.options" :key="idx" :value="opt.value">
                    {{ opt.label }}
                </option>
            </select>
        </div>
        <div class="flex justify-between">
            <small class="text-blue-500">name:[ {{ element.name }} ]</small>
            <small class="text-stone-900">{{ element.type }} {{ element.multiple ? 'multiple' : '' }}</small>
            <small class="text-gray-700">classes:{ {{ element.class }} }</small>
            <small v-if="element.visibility" class="text-green-500">show/hidden : true</small>
        </div>
    </div>
</template>

<script setup>
import { useBuilderStore } from '@/stores/builder'
import { computed } from 'vue'

const store = useBuilderStore()
const props = defineProps({
    element: Object
})

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
