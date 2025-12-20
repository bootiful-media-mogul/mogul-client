<script lang="ts" setup>
import { onMounted, ref } from 'vue'


interface Props {
  readonly alt?: string
  readonly iconHover: string
  readonly icon: string
  readonly disabled?: boolean | string
  readonly sticky?: boolean | string
  readonly width?: number
}

const props = defineProps<Props>()
const element = ref<HTMLImageElement>()
const src = ref<string>()

const swap = function () {
  if (props.iconHover) src.value = props.icon == src.value ? props.iconHover : props.icon
}
const mouseSwap = function () {
  if (props.sticky === true) return
  swap()
}

const emit = defineEmits<{
  (e: 'click', me: MouseEvent): void
}>()

const clickDelegate = (e: MouseEvent): void => {
  if (props.sticky) swap()

  emit('click', e)
}

const altText = ref<string>()

onMounted(() => {
  src.value = props.icon
  element.value!!.style.width = props.width + 'px'

  if (props.alt) {
    altText.value = props.alt
  } else {
    altText.value = 'an image - ' + src.value
  }
})
</script>
<style scoped>
img.icon {
  cursor: pointer;
  width: var(--icon-width);
}

img.icon-disabled {
  cursor: unset;
  opacity: 0.2;
  max-width: var(--icon-width);
  height: var(--icon-width);
}
</style>
<template>
  <img
    v-if="disabled"
    ref="element"
    :alt="altText"
    :src="src"
    class="icon icon-disabled unselectable"
  />
  <img
    v-else
    ref="element"
    :alt="altText"
    :src="src"
    class="icon"
    @click="clickDelegate"
    @mouseout="mouseSwap"
    @mouseover="mouseSwap"
  />
</template>
