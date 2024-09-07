<template>
  <div class="panel-window-button">
    <div class="panel-window-button-icon">
      <slot />
    </div>
    <div class="panel-window-button-color-square"></div>
  </div>
</template>

<style>
/* 
variable references don't in vue if you use scoped css styles. 
so, to keep things on the level, i'm using really long fully 
qualified css rules that probably won't clash in a global namespace.

*/
:root {
  --panel-window-button-diameter: 20px;
  --panel-window-button-inner-diameter: calc(var(--panel-window-button-diameter) * 0.7071);
  --panel-window-button-inner-ofset: calc(calc(var(--panel-window-button-diameter) - var(--panel-window-button-inner-diameter)) / 2);
}

.panel-window-button {
  position: relative;
}

.panel-window-button-icon {
  z-index: 10;

  position: absolute;

}

.panel-window-button-icon img {
  filter: invert(100%);

  width: var(--panel-window-button-diameter);
  height: var(--panel-window-button-diameter);
}

.panel-window-button-color-square {
  background-color: red;
  position: absolute;
  left: var(--panel-window-button-inner-ofset);
  top  : var(--panel-window-button-inner-ofset);
  /*top: 100px;*/
  z-index: 7;
  width: var(--panel-window-button-inner-diameter);
  height: var(--panel-window-button-inner-diameter);
}
</style>

<script lang="ts">
export default {
  created() {
  },

  data() {
    return {
      enabled: true
    }
  },

  props: ['enabbled'],
  methods: {},
  computed: {}
}
</script>
