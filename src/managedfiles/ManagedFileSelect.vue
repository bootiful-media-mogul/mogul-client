<template>
  <ManagedFileComponent accept="tgz,zip" :managed-file-id="model" @has-data="onManagedFileChange" />
</template>

<script setup lang="ts">
function onManagedFileChange(id: number) {
  emit('update:modelValue', id)
  emit('validated', true)
}

import { computed, onMounted } from 'vue'
import ManagedFileComponent from '@/managedfiles/ManagedFileComponent.vue'
const props = defineProps<{ modelValue: number | null }>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: number | null): void
  (e: 'validated', valid: boolean): void
}>()

const model = computed<number>({
  get: () => props.modelValue!!,
  set: (v) => emit('update:modelValue', v)
})

onMounted(async () => {
  console.log('mount the managedFileComponent ')
})
</script>
