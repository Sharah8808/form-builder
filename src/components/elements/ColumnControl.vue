<template>
    <div class="grid grid-cols-12 gap-2">
        <div v-for="(col, index) in element.columns" :key="index"
            :class="['border bg-slate-100 border-dashed border-gray-400 p-2 rounded', `col-span-6`]">
            <div class="text-xs font-semibold mb-2">Col {{ index + 1 }} ({{ getColSize(index) }}/12)</div>
            <CanvasElement :target-type="'column'" :parent-id="element.id" :column-index="index"
                class=" border border-gray-300 bg-white p-1 rounded" />
        </div>
    </div>
    <div class="flex justify-between">
        <small class="text-blue-500">name:[ {{ element.name }} ]</small>
        <small class="text-stone-900">{{ element.type }}</small>
        <small class="text-gray-700">classes:{ {{ element.class }} }</small>
        <small v-if="element.visibility" class="text-green-500">show/hidden : true</small>

    </div>
</template>

<script setup>
import CanvasElement from '@/components/elements/CanvasElement.vue'
import { computed } from 'vue'

const props = defineProps({
    element: {
        type: Object,
        required: true,
    },
})

// Ambil ukuran kolom dari props.element.columnSizes[index] atau fallback 12 / jumlah kolom
const getColSize = (index) => {
    const sizes = props.element.columnSizes || []
    const defaultSize = Math.floor(12 / props.element.columns.length)
    return sizes[index] || defaultSize
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
