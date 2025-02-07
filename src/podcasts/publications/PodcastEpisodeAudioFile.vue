<template>
  <PublicationPanel plugin="audioFile">
    <template v-slot:panel>download .mp3 </template>
    <template v-slot:icon>
      [mp3 download]
    </template>
  </PublicationPanel></template>
<script setup lang="ts">
import PublicationPanel from '@/publications/PublicationPanel.vue'
</script>