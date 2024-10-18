<style scoped>

.rendered-preview {
  font-size: small;
  padding: calc(var(--gutter-space) / 3);

}

.rendered-preview a {
  text-transform: revert;
}

.rendered-preview h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  margin-bottom: 0;
  line-height: 1;

}

</style>
<template>
  <InputWrapperChild>
    <template v-slot:panel>
      <div class="rendered-preview" v-if="modelValue.trim()!==''" v-html="rendered"></div>
      <div v-if="modelValue.trim()===''">(nothing to preview)</div>
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

    async debouncingRender() {
      if (this.timer && this.timer > -1) {
        clearTimeout(this.timer)
      }
      const mv = this.modelValue
      this.timer = window.setTimeout(async () => {
        await this.render(mv)
      }, 1000)
    },
    async render(md: string) {
      if ( !md || md.trim() === '') return
      this.rendered = await markdown.render(md)
    }
  },
  watch: {
    modelValue: async function(o: string, n: string) {
      // we're interested in the event, but we'll only 
      // want to render the actual value when the time comes.
      await this.debouncingRender()
    }
  },

  data() {
    return {
      timer: -1,
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
