<template>
  <PublicationPanel plugin="blogPost">
    <template v-slot:panel>blog</template>
    <template v-slot:icon>
        [blog] 

    </template>
  </PublicationPanel></template>
<script setup lang="ts">
import PublicationPanel from '@/publications/PublicationPanel.vue'
</script>