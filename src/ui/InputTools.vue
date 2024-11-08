<template>
  <div>
    <WritingAssistant :model-value="modelValue" @update:modelValue="updateValue" />
    <MarkdownPreview :model-value="modelValue" @update:modelValue="updateValue" />
  </div>
</template>
<script lang="ts" setup>
import MarkdownPreview from '@/ui/markdown/MarkdownPreview.vue'
import WritingAssistant from '@/ui/writing/WritingAssistant.vue'

interface Props {
  readonly modelValue: string
}

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
const props = defineProps<Props>()
const updateValue = (value: string): void => {
  emit('update:modelValue', props.modelValue)
}
</script>
