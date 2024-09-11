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

<script lang="ts">
export default {
  created() {},
  mounted() {
    const square = this.$refs.square
    const btn = this.$refs.button
    const defaultStyle = 'panel-window-button-color-square-default'
    const hoverStyle = 'panel-window-button-color-square-hover'

    btn.addEventListener('mouseover', (event: MouseEvent) => {
      square.classList.remove(defaultStyle)
      square.classList.add(hoverStyle)
    })

    btn.addEventListener('mouseout', (event: MouseEvent) => {
      square.classList.add(defaultStyle)
      square.classList.remove(hoverStyle)
    })
  },

  data() {
    return {
      // enabled: true
    }
  },

  // props: ['enabled'],
  methods: {},
  computed: {}
}
</script>
