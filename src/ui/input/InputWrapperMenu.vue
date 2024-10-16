<template>
  <div class="menu">
    <div class="unselectable arrow up" @click="$emit('up')">⬆</div>
    <div class="icons">
      <slot> the buttons should go here otherwise this will look like crap!</slot>
    </div>
    <div class="unselectable  arrow down" @click="$emit('down')">⬇</div>
  </div>
</template>
<style scoped>
.menu {
  display: grid;
  grid-template-areas:
    'icons up'
    'icons down';

  grid-template-columns:  auto    auto;
  grid-template-rows:  var(--icon-width) var(--icon-width);
  align-items: center;
  justify-content: center;
}

.down {
  grid-area: down;
  
}

.icons {
  grid-area: icons;
}

.up {
  grid-area: up;
}

.arrow {
  text-align: center;
  font-size: 0.7em;
  cursor: pointer;
}

.arrow:first-of-type {
  padding-bottom: calc(var(--icon-width) / 3);
}

.arrow:last-of-type {
  padding-top: calc(var(--icon-width) / 3);
}
</style>
<script lang="ts">

export default {
  emits: ['up', 'down']
}
</script>