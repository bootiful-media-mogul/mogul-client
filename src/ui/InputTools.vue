<template>
  <div>
    <WritingAssistant
      :model-value="modelValue"
      @update:modelValue="updateValue"
    />
    <MarkdownPreview
      :model-value="modelValue"
      @update:modelValue="updateValue"
    />
  </div>
</template>

<script lang="ts">
import MarkdownPreview from '@/ui/markdown/MarkdownPreview.vue'
import WritingAssistant from '@/ui/writing/WritingAssistant.vue'

export default {
  name: 'InputTools',
  components: {
    MarkdownPreview, WritingAssistant
  },
  props: ['modelValue'],
  emits: ['update:modelValue'],
  methods: {
    updateValue() {
      this.$emit('update:modelValue', this.modelValue)
    }
  }

}
</script>