<template>
    <div
        v-if="visible"
        class="p-2 bg-white rounded"
        :class="{ 'shadow-lg ring-blue-400': element.id === store.selectedElementId }"
        @click="store.selectElement(element.id)"
    >
        <label class="block text-sm font-medium mb-2">{{ element.label }}</label>
        <table class="w-full table-auto border border-gray-300">
            <thead>
                <tr>
                    <th
                        v-for="(col, idx) in element.columns"
                        :key="idx"
                        class="border px-2 py-1 text-left"
                    >
                        {{ col }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <!-- Kalau sudah ada rows terdefinisi -->
                <template v-if="element.rows && element.rows.length">
                    <tr v-for="(row, rIdx) in element.rows" :key="rIdx">
                        <td
                            v-for="(cell, cIdx) in row"
                            :key="cIdx"
                            class="border px-2 py-1 text-xs"
                        >
                            <span v-if="!cell || cell.type === 'text'">
                                {{ cell?.text || cell?.label || '' }}
                            </span>
                            <span
                                v-else-if="cell.type === 'input'"
                                class="text-gray-400 italic"
                            >
                                [input] {{ cell?.text || cell?.label || '' }}
                            </span>
                            <span
                                v-else-if="cell.type === 'checkbox'"
                                class="text-gray-400 italic"
                            >
                                [checkbox] {{ cell?.text || cell?.label || '' }}
                            </span>
                            <span
                                v-else-if="cell.type === 'radio'"
                                cla ss="text-gray-400 italic"
                            >
                                [radio] {{ cell?.text || cell?.label || '' }}
                            </span>
                            <span v-else>&nbsp;</span>
                        </td>
                    </tr>
                </template>

                <!-- Backward compatible: tabel lama tanpa rows -->
                <template v-else>
                    <tr>
                        <td
                            v-for="(col, idx) in element.columns"
                            :key="idx"
                            class="border px-2 py-1 text-gray-400 italic"
                        >
                            (input)
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        <hr />
        <div class="flex justify-between">
            <small class="text-blue-500">name:[ {{ element.name }} ]</small>
            <small class="text-stone-900">{{ element.type }}</small>
            <small class="text-gray-700">classes:{ {{ element.class }} }</small>
            <small v-if="element.visibility" class="text-green-500">
                show/hidden : true
            </small>
        </div>
    </div>
</template>

<script setup>
import { useBuilderStore } from '@/stores/builder'
import { computed } from 'vue'

const props = defineProps({ element: Object })
const store = useBuilderStore()

function getFieldValueByName(name) {
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
    return true
})
</script>
