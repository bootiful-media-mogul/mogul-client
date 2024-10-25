<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Props {
  readonly iconHover: string
  readonly icon: string
}

const props = defineProps<Props>()
const src = ref<string>()

const swap = function() {
  if (props.iconHover)
    src.value = props.icon == src.value ? props.iconHover : props.icon
}

onMounted(() => {
  src.value = props.icon
})

</script>
<style scoped>
.input-wrapper-menu-button {
  max-width: var(--icon-width);
}
</style>
<template>
  <img
    :alt="'an image -' + src"
    :src="src"
    @mouseover="swap"
    @mouseout="swap"
    class="input-wrapper-menu-button"
  />
</template>
