<script lang="ts" setup>
import { onMounted, ref } from 'vue'

interface Props {
  readonly iconHover: string
  readonly icon: string
  readonly disabled?: boolean | string
  readonly sticky?: boolean | string
}

const props = defineProps<Props>()
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
onMounted(() => {
  src.value = props.icon
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
    :alt="'an image - ' + src"
    :src="src"
    class="icon icon-disabled unselectable"
  />
  <img
    v-else
    :alt="'an image - ' + src"
    :src="src"
    class="icon"
    @mouseout="mouseSwap"
    @click="clickDelegate"
    @mouseover="mouseSwap"
  />
</template>
