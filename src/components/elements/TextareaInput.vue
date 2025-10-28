<template>
    <div class="p-2 bg-white rounded" :class="{ 'shadow-lg ring-blue-400': element.id === store.selectedElementId }"
        @click="store.selectElement(element.id)">
        <div :class="element.horizontal ? 'flex items-center' : ''">
            <label v-if="!element.required" :for="element.name" :class="element.horizontal ? 'mr-2' : ''" class="block text-sm font-medium">{{ element.label
            }}</label>
            <label v-if="element.required" :for="element.name" :class="element.horizontal ? 'mr-2' : ''" class="block text-sm font-medium text-red-500">*{{
                element.label }}</label>
            <textarea :required="element.required" class="border px-2 py-1 mt-1 w-full" :name="element.name" :placeholder="element.placeholder" disabled
                rows="4"></textarea>
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
const props = defineProps({ element: Object })

// small evaluator for the visibility object
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