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
  width: calc(1.5 * var(--icon-width));
}
</style>
<template>
 
  <img :alt="'an image -' + icon" :src="icon" class="input-wrapper-menu-button" />
 
 
</template>
