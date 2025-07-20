<template>
  <PublicationPanelComponent :icon="blogIcon" :icon-hover="blogIcon" plugin="blogPost">
    <template v-slot:panel></template>
  </PublicationPanelComponent>
</template>
<script lang="ts" setup>
import blogIcon from '@/assets/images/publications/podcasts/publish-as-mogul-blog.png'
import PublicationPanelComponent from '@/publications/PublicationPanelComponent.vue'
</script>
