<template>
  <a href="#" @click="navigateToEpisode"> {{ $t('search.navigation.episode') }} </a>
</template>
<script setup lang="ts">
import router from '@/index'
import { podcasts } from '@/services'
import { ref } from 'vue'

const props = defineProps<{
  id: number
  aggregate: number
}>()

const episodeId = ref<number>(0)

async function navigateToEpisode() {
  const episode = await podcasts.podcastEpisodeById(props.aggregate)
  episodeId.value = episode.id
  await router.push({
    name: 'podcasts/episodes/episode',
    params: {
      podcastId: episode.podcastId,
      episodeId: episode.id
    }
  })
}
</script>
