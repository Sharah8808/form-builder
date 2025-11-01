<template>
    <div v-if="element.type === 'custom'" class="p-2 bg-white "
        :class="{ 'shadow-lg ring-blue-400': element.id === store.selectedElementId }" @click="selected(element.id)">
        <div :class="element.horizontal ? 'flex items-center justify-between' : ''">
            <label v-if="!element.required" :for="element.name" :class="element.horizontal ? 'mr-2' : ''"
                class="block text-sm font-medium">{{ element.label
                }}</label>
            <label v-if="element.required" :for="element.name" :class="element.horizontal ? 'mr-2' : ''"
                class="block text-sm font-medium text-red-500">*{{
                element.label }}</label>
            <div class="rounded-lg w-60 text-center bg-orange-50">
                <div>{{ element.name
                    }}</div>
                <div class="text-xs italic">elementId:{ {{ element.elementId }} }</div>
                <div class="text-xs italic">elementClass:{ {{ element.elementClass }} }</div>
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
