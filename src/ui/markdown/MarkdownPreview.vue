<style>
.rendered-preview {
  font-size: small;
  padding: calc(var(--gutter-space) / 3);
}

.rendered-preview a {
  text-transform: unset;
}

.rendered-preview h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 0;
  margin-bottom: 0;
  line-height: 1;
}
</style>
<template>
  <InputWrapperChild>
    <template v-slot:panel>
      <div class="rendered-preview" v-if="props.modelValue.trim() !== ''" v-html="rendered"></div>
      <div v-if="props.modelValue.trim() === ''">(nothing to preview)</div>
    </template>
    <template v-slot:icon>
      <InputWrapperMenuButton :icon="asset" :icon-hover="assetHighlight" />
    </template>
  </InputWrapperChild>
</template>
<script setup lang="ts">
import asset from '@/assets/images/markdown/markdown-preview.png'
import assetHighlight from '@/assets/images/markdown/markdown-preview-highlight.png'
import InputWrapperChild from '@/ui/input/InputWrapperChild.vue'
import InputWrapperMenuButton from '@/ui/input/InputWrapperMenuButton.vue'
import { markdown } from '@/services'
import { onMounted, onUnmounted, ref, watch } from 'vue'

interface Props {
  readonly modelValue: string
}

const needed = ref<boolean>(false)
let timer = -1
const props = defineProps<Props>()
const rendered = ref<string>('')

const render = async (md: string) => {
  
  if (!md || md.trim() === '' || !needed.value) 
    return
  
  rendered.value = await markdown.render(md)
  
  console.log(rendered.value)
}

const debouncingRender = async () => {
  if (timer && timer > -1) {
    clearTimeout(timer)
  }
  timer = window.setTimeout(async () => {
    await render(props.modelValue)
  }, 1000)
}

onMounted(() => {
  // console.log('the markdown preview is needed!')
  needed.value = true
})

onUnmounted(() => {
  // console.log('the markdown preview is not mounted any more')
  needed.value = false
})

watch(
  () => props.modelValue,
  (o: string, n: string) => {
    debouncingRender()
  }
)
</script>
