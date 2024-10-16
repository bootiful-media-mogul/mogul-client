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
  /* 
   todo i dont like the vertical positioning. this is going to be ugly in a single line input.
   todo also, i need to setup the toggle so that when u click the icon, it shows the panel and the icon turns into an `X`, like it does currently.
   todo   click the 'X', and the panel is hidden. EZ.     
   */
  display: grid;

  padding-left: calc(var(--gutter-space) / 3);
  grid-template-areas:
    ' up    '
    ' icons '
    ' down  ';

  grid-template-columns:  auto;
  grid-template-rows: 20px var(--icon-width)  20px;
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