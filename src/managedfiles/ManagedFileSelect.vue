<template>
  <ManagedFileComponent accept="tgz,zip" :managed-file-id="props.modelValue!!" @has-data="change" />
</template>

<script setup lang="ts">
function change(id: number) {
  console.log('changing', id)
  emit('update:modelValue', id)
}

import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ManagedFileComponent from '@/managedfiles/ManagedFileComponent.vue'
const { t } = useI18n()
const props = defineProps<{ modelValue: number | null }>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: number | null): void
  (e: 'change', v: number | null): void
}>()

const model = computed<number | null>({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

onMounted(async () => {
  console.log('mount the managedFileComponent ')

})
</script>
