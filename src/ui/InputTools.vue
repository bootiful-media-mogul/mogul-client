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

    [[ {{ modelValue }} ]]
  </div>
</template>

<script>
import MarkdownPreview from '@/ui/markdown/MarkdownPreview.vue'
import WritingAssistant from '@/ui/writing/WritingAssistant.vue'

export default {
  name: 'InputTools',
  components: {
    MarkdownPreview, WritingAssistant
  },
  props: ['modelValue'],
  watch: {
    modelValue(o, n) {
      console.log(o)
    }
  },
  emits: ['update:modelValue'],
  methods: {
    updateValue() {
      this.$emit('update:modelValue', this.modelValue)
    }
  }

}
</script>