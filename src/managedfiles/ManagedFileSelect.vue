<template>

  <ManagedFileComponent accept="tgz,zip"
                        :managed-file-id="props.modelValue!!"
  />


</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ManagedFileComponent from '@/managedfiles/ManagedFileComponent.vue'
const { t } = useI18n()
const props = defineProps<{ modelValue: number | null }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: number | null): void }>()

// Proxy so <Select v-model> is directly your component v-model
const model = computed<number | null>({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})


onMounted(async () => {
 console.log('mount the managedFileComponent ')
})
</script>
