<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['update:modelValue', 'change'])

function onChange(e: any) {
  const v = e.target.value == '' || e.target.value.trimEnd() == '' ? null : e.target.value
  emit('update:modelValue', v)
  emit('change', v)
}
const props = defineProps({
  modelValue: { type: [String, null], default: '' },
  disabled: { type: Boolean, default: false }
})

const value = ref<string | null>(props.modelValue)
</script>

<template>
  <input type="text" @change="onChange" v-model="value" :placeholder="'enter a value'" />
</template>

<style scoped></style>
