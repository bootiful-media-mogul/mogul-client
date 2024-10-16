<template>
  <div class="menu">
    <div class="unselectable arrow up" @click="$emit('up')">◀</div>
    <div class="unselectable icons">
      <slot> the buttons should go here otherwise this will look like crap!</slot>
    </div>
    <div class="unselectable arrow down" @click="$emit('down')">▶</div>
  </div>
</template>
<style scoped>
.menu {

  display: grid;

  grid-template-areas: ' up icons down ';
  grid-template-columns:  20px var(--icon-width) 20px;
  justify-content: center;
  align-items: center;
 
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

/*.arrow:first-of-type {
  padding-bottom: calc(var(--icon-width) / 3);
}

.arrow:last-of-type {
  padding-top: calc(var(--icon-width) / 3);
}*/
</style>
<script lang="ts">

export default {
  emits: ['up', 'down']
}
</script>