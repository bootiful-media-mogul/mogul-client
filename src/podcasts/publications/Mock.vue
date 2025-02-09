<script setup lang="ts">
import PublicationPanel from '@/publications/PublicationPanel.vue'
</script>

<template>
  <PublicationPanel plugin="mock">
    <template v-slot:panel>Mock</template>
    <template v-slot:icon> [mock]</template>
  </PublicationPanel>
</template>
