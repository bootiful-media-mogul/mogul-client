<template>
  <PublicationPanel plugin="transcript">
    <template v-slot:panel>download transcript </template>
    <template v-slot:icon> [transcript] </template>
  </PublicationPanel>
</template>
<script setup lang="ts">
import PublicationPanel from '@/publications/PublicationPanel.vue'
</script>
