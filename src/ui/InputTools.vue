<template>
  <div>
    <WritingAssistant :model-value="modelValue" @update:modelValue="updateValue" />
    <MarkdownPreview :model-value="modelValue" @update:modelValue="updateValue" />
    <WritingPrompt :model-value="modelValue" @update:modelValue="updateValue" />
    <slot> </slot>
  </div>
</template>
<script lang="ts" setup>
import MarkdownPreview from '@/ui/markdown/Markdown.vue'
import WritingAssistant from '@/ui/writing/WritingAssistant.vue'
import WritingPrompt from '@/ui/writing/WritingPrompt.vue'

interface Props {
  readonly modelValue: string
}

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
const props = defineProps<Props>()
const updateValue = (value: string): void => {
  emit('update:modelValue', props.modelValue)
}
</script>
