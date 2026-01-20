<script setup lang="ts">
defineProps<{
  watermarkImage: string
}>()
</script>

<template>
  <div class="watermark-badge" :style="{ backgroundImage: `url(${watermarkImage})` }" />
</template>

<style scoped>
.watermark-badge {
  --badge-width: calc(0.4 * var(--sidebar-width));
  filter: invert(1);
  opacity: 0.2;
  z-index: -1000;
  pointer-events: none;
}
</style>
