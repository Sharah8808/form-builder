<template>
    <div class="p-2 bg-white rounded" :class="{ 'shadow-lg ring-blue-400': element.id === store.selectedElementId }"
        @click="store.selectElement(element.id)">
        <div :class="element.horizontal ? 'flex items-center' : ''">
            <div>
                <label v-if="!element.required" :for="element.name" :class="element.horizontal ? 'mr-2' : ''"
                    class="block text-sm font-medium">{{ element.label
                    }}</label>
                <label v-if="element.required" :for="element.name" :class="element.horizontal ? 'mr-2' : ''"
                    class="block text-sm font-medium text-red-500">*{{
                        element.label }}</label>
            </div>
            <div :style="gridStyle">
                <div v-for="(option, idx) in element.options" :key="idx" class="flex items-center gap-2">
                    <input :required="element.required" type="radio" :name="element.name" :value="option.value"
                        disabled />
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
</script>
