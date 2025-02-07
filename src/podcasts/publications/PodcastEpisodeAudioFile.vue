<template>
  <PublicationPanel plugin="audioFile" :icon-hover="downloadAudio" :icon="downloadAudio">
    <template v-slot:panel>download .mp3</template>
  </PublicationPanel>
</template>
<script setup lang="ts">
import downloadAudio from '@/assets/images/publications/podcasts/publish-download-produced-audio.png'
import PublicationPanel from '@/publications/PublicationPanel.vue'
</script>
