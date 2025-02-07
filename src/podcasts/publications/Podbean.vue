<template>
  <PublicationPanel plugin="podbean" :icon-hover="podbeanIcon" :icon="podbeanIcon">
    <template v-slot:panel>Podbean</template>
  </PublicationPanel>
</template>
<script setup lang="ts">
import podbeanIcon from '@/assets/images/publications/podcasts/publish-to-podbean.png'
import PublicationPanel from '@/publications/PublicationPanel.vue'
</script>
