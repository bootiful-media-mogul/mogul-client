<template>
  <div class="menu">
    <div :class="'unselectable arrow up ' + upArrowCss()" ref="up" @click="emit('up')">◀</div>
    <div class="unselectable icons">
      <slot> the buttons should go here otherwise this will look like crap!</slot>
    </div>
    <div :class="'unselectable arrow down ' + downArrowCss()" ref="down" @click="emit('down')">▶</div>
  </div>
</template>
<style scoped>
.menu {
  display: grid;
  grid-template-areas: ' . up icons down  . ';
  /*
    sort of ugly: the sum of these 3 values has to be duplicated exactly and made 
    into a negative in the `base.css` definition for .writing-tools-container 
  */
  grid-template-columns: auto var(--gutter-space) var(--icon-width) var(--gutter-space) auto;
  justify-content: center;
  align-items: center;
  width: var(--icon-column-width);
}

.arrow {
  text-align: center;
  cursor: pointer;
}

.arrow.down {
  grid-area: down;
}

.icons {
  grid-area: icons;
}

.arrow.up {
  grid-area: up;
  text-align: right;
}

.arrow.disabled {
  opacity: 0.3;
  pointer-events: none;
}
</style>
<script setup lang="ts">
import { ref, watch } from 'vue'
interface Props {
  readonly disabled: boolean
  readonly enableUpArrow: boolean
  readonly enableDownArrow: boolean
}
const emit = defineEmits<{
  (e: 'down'): void
  (e: 'up'): void
}
>()
const props = defineProps<Props>()
const downArrowCss = function() {
  if (props.disabled) return 'disabled'
  if (!props.enableDownArrow) return 'disabled'
  return ''
}
const upArrowCss = () => {
  if (props.disabled) return 'disabled'
  if (!props.enableUpArrow) return 'disabled'
  return ''
}
const disable = function(r: HTMLElement) {
  r.classList.add('disabled')
}
const up = ref<HTMLElement>()
const down = ref<HTMLElement>()

watch(() => props.disabled, (_, newValue) => {
  if (!newValue) {
    [up, down].forEach((el) => disable(el.value!!))
  }
})
</script>
