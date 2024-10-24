<style>
:root {
  --panel-window-button-diameter: 20px;
  --panel-window-button-inner-diameter: calc(var(--panel-window-button-diameter) * 0.7071);
  --panel-window-button-inner-ofset: calc(
    calc(var(--panel-window-button-diameter) - var(--panel-window-button-inner-diameter)) / 2
  );
}

.panel-window-button {
  position: relative;

  width: var(--panel-window-button-diameter);
  height: var(--panel-window-button-diameter);
}

.panel-window-button-icon {
  position: absolute;
}

.panel-window-button-icon img {
  filter: invert(100%);
  height: var(--panel-window-button-diameter);
  z-index: 100;
  position: absolute;
}

.panel-window-button-color-square-hover {
  background-color: var(--bg-color);
}

.panel-window-button-color-square-default {
  background-color: black;
}

.panel-window-button-color-square {
  position: absolute;

  left: var(--panel-window-button-inner-ofset);
  top: var(--panel-window-button-inner-ofset);
  z-index: 7;
  width: var(--panel-window-button-inner-diameter);
  height: var(--panel-window-button-inner-diameter);
}
</style>

<template>
  <div ref="button" class="panel-window-button">
    <div class="panel-window-button-icon">
      <slot />
    </div>
    <div
      ref="square"
      class="panel-window-button-color-square panel-window-button-color-square-default"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const square = ref<HTMLElement>()
const button = ref<HTMLButtonElement>()

onMounted(() => {
  const defaultStyle = 'panel-window-button-color-square-default'
  const hoverStyle = 'panel-window-button-color-square-hover'

  const btnValue = button.value
  const squareValue = square.value

  btnValue.addEventListener('mouseover', (_: MouseEvent) => {
    squareValue.classList.remove(defaultStyle)
    squareValue.classList.add(hoverStyle)
  })

  btnValue.addEventListener('mouseout', (_: MouseEvent) => {
    squareValue.classList.add(defaultStyle)
    squareValue.classList.remove(hoverStyle)
  })
})
</script>
