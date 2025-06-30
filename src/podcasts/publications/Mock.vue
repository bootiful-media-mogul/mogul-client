<script setup lang="ts">
import PublicationPanelComponent from '@/publications/PublicationPanelComponent.vue'
</script>

<template>
  <PublicationPanelComponent plugin="mock">
    <template v-slot:panel>Mock</template>
    <template v-slot:icon> [mock]</template>
  </PublicationPanelComponent>
</template>
