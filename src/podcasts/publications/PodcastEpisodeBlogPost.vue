<template>
  <PublicationPanel plugin="blogPost" :icon-hover="blogIcon" :icon="blogIcon">
    <template v-slot:panel> 
    
    </template>
  </PublicationPanel>
</template>
<script setup lang="ts">
import blogIcon from '@/assets/images/publications/podcasts/publish-as-mogul-blog.png'
import PublicationPanel from '@/publications/PublicationPanel.vue'
</script>
