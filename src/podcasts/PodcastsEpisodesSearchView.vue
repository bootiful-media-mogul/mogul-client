<!-- 
 this is meant to be the overall search view of the podcast episodes 
-->
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Podcast, PodcastEpisode, podcasts, utils } from '@/services'

import { dateTimeToString } from '@/dates'
import Icon from '@/ui/Icon.vue'

import editHighlightAsset from '@/assets/images/edit-highlight.png'
import editAsset from '@/assets/images/edit.png'

import deleteHighlightAsset from '@/assets/images/delete-highlight.png'
import deleteAsset from '@/assets/images/delete.png'
import router from '@/index'
// Props
const props = defineProps<{ podcastId: number }>()
const episodes = ref<PodcastEpisode[]>([])
const currentPodcast = ref<Podcast>()
const editorVisible = ref(false)
const selectedPodcastId = ref(props.podcastId)
const episode = ref<PodcastEpisode | null>()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

function dts(date: number): string | null {
  return dateTimeToString(date)
}

const deletePodcastEpisode = async (episode: PodcastEpisode) => {
  const podcastEpisodeDescription = t('podcasts.episodes.episode.reference', {
    title: episode.title
  })
  const msg = t('confirm.deletion', { title: podcastEpisodeDescription })

  if (!utils.confirmDeletion(msg)) return

  await podcasts.deletePodcastEpisode(episode.id)

  await loadPodcast()
}

onMounted(async () => {
  await loadPodcast()
})

const title = ref<string>('')

const loadPodcast = async () => {
  const newPodcastId = selectedPodcastId.value
  currentPodcast.value = await podcasts.podcastById(newPodcastId)

  const podcastEpisodes = await podcasts.podcastEpisodesPreviews(newPodcastId)
  // if (podcastEpisodes) podcastEpisodes.sort((a, b) => b.created - a.created)
  episodes.value = podcastEpisodes

  title.value = t('podcasts.episodes.all', {
    id: currentPodcast.value.id,
    title: currentPodcast.value.title
  })
}

async function navigateToEpisodeEditor(podcastId: number, episodeId: number) {
  await router.push({
    name: 'podcasts/episodes/episode',
    params: { podcastId: podcastId, episodeId: episodeId }
  })
}

const loadEpisode = async (e: PodcastEpisode) => {
  await navigateToEpisodeEditor(props.podcastId, e.id)
  title.value = t('podcasts.episodes')
}

async function newEpisode() {
  // todo call create draft episode
  episode.value = await podcasts.createPodcastEpisodeDraft(selectedPodcastId.value, '', '')

  await loadEpisode(episode.value)
}
</script>
<template>
  <h1>
    {{ t('podcasts.episodes') }}
  </h1>

  <form class="pure-form">
    <fieldset class="episodes-table">
      <legend>
        {{ t('podcasts.episodes.title', { title: currentPodcast?.title }) }}
      </legend>

      <div class="toolbar">
        <a @click.prevent="newEpisode()"> {{ t('podcasts.episodes.new-episode') }}</a>
      </div>
      <div v-for="episode in episodes" v-bind:key="episode.id" class="row episodes-row">
        <div class="id-column">
          #<b>{{ episode.id }}</b>
        </div>
        <div class="created-column">{{ dts(episode.created) }}</div>
        <div class="edit">
          <Icon
            :icon="editHighlightAsset"
            :icon-hover="editAsset"
            @click.prevent="loadEpisode(episode)"
          />
        </div>
        <div class="delete">
          <Icon
            :icon="deleteHighlightAsset"
            :icon-hover="deleteAsset"
            @click.prevent="deletePodcastEpisode(episode)"
          />
        </div>
        <div class="title">{{ episode.title }}</div>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
.title {
  grid-area: title;
}

.episodes-row {
  padding-top: calc(var(--gutter-space) / 2);
  border-top: 1px solid black;
  grid-template-areas:
    'id  edit delete created created'
    'title   title   title title title';
  grid-template-columns:
    var(--id-column)
    var(--icon-column)
    var(--icon-column)
    var(--date-column)
    auto;
  grid-template-rows: auto minmax(var(--row-height), auto);

  display: grid;
}
</style>
