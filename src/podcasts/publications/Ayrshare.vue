<template>
  <AyrshareComponent
    :icon="ayrshareIcon"
    plugin-name="podcastEpisodeAyrshare"
    ready-event-category="podcast-episode-completed-event"
  />
</template>
<script lang="ts" setup>
import ayrshareIcon from '@/assets/images/publications/podcasts/publish-to-ayrshare.png'
import AyrshareComponent from '@/publications/AyrshareComponent.vue'
</script>
