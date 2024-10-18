<script lang="ts">
import WritingAssistant from '@/ui/writing/WritingAssistant.vue'
import MarkdownPreview from '@/ui/markdown/MarkdownPreview.vue'

export default {

  name: 'InputTools',

  components: {
    MarkdownPreview, WritingAssistant
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  }
}
</script>
<template>
  <MarkdownPreview v-bind="modelValue" />
  <WritingAssistant v-bind="modelValue" />
</template>