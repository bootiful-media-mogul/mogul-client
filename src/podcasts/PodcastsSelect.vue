<template>
  <Select v-model="model" :options="podcastSelections" :placeholder="t('selections.podcasts')" />
</template>

<script setup lang="ts">
import { podcasts } from '@/services'
import Select, { type SelectOption } from '@/ui/Select.vue'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = defineProps<{ modelValue: SelectOption | null }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: SelectOption | null): void }>()

// Proxy so <Select v-model> is directly your component v-model
const model = computed<SelectOption | null>({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const podcastSelections = ref<SelectOption[]>([])

onMounted(async () => {
  podcastSelections.value = (await podcasts.podcasts()).map((p) => ({
    value: p.id,
    label: p.title
  }))
})
</script>
