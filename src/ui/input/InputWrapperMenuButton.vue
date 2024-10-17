<script lang="ts">
export default {
  props: {
    iconHover: { type: String, default: '' },
    icon: { type: String, default: '' }
  },
  data() {
    return {
      src: this.iconHover
    }
  },
  mounted() {
    this.src = this.icon
  },
  methods: {
    swap() {
      if (this.iconHover)
        this.src = this.icon == this.src ? this.iconHover : this.icon
      
    }
  }
}
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
