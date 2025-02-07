<template>
  <h1>Home</h1>
  <p>Here is your activity feed...</p>

  <Publications>
    <!--    <Mock />-->
    <!--    <PodcastEpisodeTranscript />-->
    <PodcastEpisodeBlogPost />
    <Podbean />
    <PodcastEpisodeAudioFile />
  </Publications>
</template>
<script setup lang="ts">
import Publications from '@/publications/Publications.vue'
import Podbean from '@/podcasts/publications/Podbean.vue'
import PodcastEpisodeAudioFile from '@/podcasts/publications/PodcastEpisodeAudioFile.vue'
import PodcastEpisodeBlogPost from '@/podcasts/publications/PodcastEpisodeBlogPost.vue'
</script>
