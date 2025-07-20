<template>
  <PublicationPanelComponent plugin="transcript">
    <template v-slot:panel>download transcript</template>
    <template v-slot:icon> [transcript]</template>
  </PublicationPanelComponent>
</template>
<script lang="ts" setup>
import PublicationPanelComponent from '@/publications/PublicationPanelComponent.vue'
</script>
