<script lang="ts" setup>
import { onMounted, ref } from 'vue'

interface Props {
  readonly iconHover: string
  readonly icon: string
  readonly disabled?: boolean | string
}

const props = defineProps<Props>()
const src = ref<string>()

const swap = function () {
  if (props.iconHover) src.value = props.icon == src.value ? props.iconHover : props.icon
}

const emit = defineEmits<{
  (e: 'click'): void
}>()
const clickDelegate = (e: MouseEvent): void => {
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
  width: var(--icon-width);
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
    @mouseout="swap"
    @click="clickDelegate"
    @mouseover="swap"
  />
</template>
