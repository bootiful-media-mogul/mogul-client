<template>
  <PublicationPanelComponent plugin="blogPost" :icon-hover="blogIcon" :icon="blogIcon">
    <template v-slot:panel> </template>
  </PublicationPanelComponent>
</template>
<script setup lang="ts">
import blogIcon from '@/assets/images/publications/podcasts/publish-as-mogul-blog.png'
import PublicationPanelComponent from '@/publications/PublicationPanelComponent.vue'
</script>
