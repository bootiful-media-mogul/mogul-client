<template>
  <h1>Home</h1>
  <p>Here is your activity feed...</p> 
  
  <Publications :plugins=" [ 'podbean', 'mock', 'podcast-episode-blog-post', 'podcast-episode-audio-file' ] " />
  
</template>
<script setup lang="ts">
import Publications from '@/podcasts/publications/Publications.vue'
</script>