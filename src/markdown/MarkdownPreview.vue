<style scoped></style>
<template>
  <InputWrapperChild>
    <template v-slot:panel>
      <a href="#" @click.prevent="render">render</a>
      <div v-html="rendered"></div>
    </template>
    <template v-slot:icon>
      <InputWrapperMenuButton :icon="asset" :icon-hover="assetHighlight" />
    </template>
  </InputWrapperChild>
</template>
<script lang="ts">
import asset from '@/assets/images/markdown/markdown-preview.png'
import assetHighlight from '@/assets/images/markdown/markdown-preview-highlight.png'

import InputWrapperChild from '@/ui/input/InputWrapperChild.vue'
import InputWrapperMenuButton from '@/ui/input/InputWrapperMenuButton.vue'
import { markdown } from '@/services'

export default {
  name: 'MarkdownPreview',
  components: { InputWrapperMenuButton, InputWrapperChild },

  methods: {
    async render() {

      if (this.modelValue.trim() === '') return

      this.rendered = await markdown.render(this.modelValue)
    }
  },
  watch: {
    modelValue: function(o: string, n: string) {
      console.log(o + '/' + n)
    }
  },

  data() {
    return {
      assetHighlight: assetHighlight,
      asset: asset,
      rendered: ''
    }
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  }
}
</script>
