<script setup lang="ts">
defineProps<{
  watermarkImage: string
}>()
</script>

<template>
  <div class="watermarked-view">
    <div class="watermark-badge" :style="{ backgroundImage: `url(${watermarkImage})` }" />
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.watermarked-view {
  width: 100%;
  height: 100%;
}

.watermark-badge {
  position: fixed;
  top: var(--gutter-space);
  left: var(--gutter-space);

  width: 400px;
  height: 400px;

  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  filter: invert(1);
  opacity: 0.1;
  z-index: -1000;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 1;
}
</style>
