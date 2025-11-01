<template>
    <div class="p-2 bg-white" :class="{ 'shadow-lg  ring-blue-400': element.id === store.selectedElementId }"
        @click="store.selectElement(element.id)">
        <div :class="element.horizontal ? 'flex items-center' : ''">
            <label v-if="!element.required" :for="element.name" :class="element.horizontal ? 'mr-2' : ''" class="block text-sm font-medium">{{ element.label
                }}</label>
            <label v-if="element.required" :for="element.name" :class="element.horizontal ? 'mr-2' : ''" class="block text-sm font-medium text-red-500">*{{
                element.label }}</label>

            <div :style="gridStyle">
                <div v-for="(option, idx) in element.options" :key="idx" class="flex items-center gap-2">
                    <input type="checkbox" :name="option.name" :value="option.value"  disabled />
                    <span class="text-sm">{{ option.label }}</span>
                </div>
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
import { computed } from 'vue'
import { useBuilderStore } from '@/stores/builder'
const store = useBuilderStore()
const props = defineProps({ element: Object })

const gridStyle = computed(() => {
    const count = props.element.columns || 1
    return {
        display: 'grid',
        gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
        gap: '0.0rem'
    }
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
