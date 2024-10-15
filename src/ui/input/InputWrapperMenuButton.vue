<script lang="ts">
export default {
  props: {
    icon: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped>
.input-wrapper-menu-button {
  border: 1px solid #129fea;
  width: calc(1.5 * var(--icon-width));
  /*height: calc(1.5 * var(--icon-width));*/
}
</style>
<template>
 
  <img :alt="'an image -' + icon" :src="icon" class="input-wrapper-menu-button" />
 
 
</template>
