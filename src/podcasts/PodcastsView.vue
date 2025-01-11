<template>
  <h1>{{ $t('podcasts.title') }}</h1>
  <form class="pure-form pure-form-stacked">
    <fieldset>
      <legend>{{ $t('podcasts.new-podcast') }}</legend>
      <div class="pure-control-group">
        <label for="title">
          {{ $t('podcasts.new-podcast.title') }}
        </label>

        <InputWrapper v-model="title">
          <input id="title" v-model="title" required type="text" />
          <InputTools v-model="title" />
        </InputWrapper>
      </div>
      <div class="pure-controls">
        <button
          :disabled="title == null || title.trim().length == 0"
          class="pure-button pure-button-primary"
          type="submit"
          value="create"
          @click="createPodcast"
        >
          {{ $t('podcasts.new-podcast.submit') }}
        </button>
      </div>
    </fieldset>
  </form>
  <form class="pure-form">
    <fieldset>
      <legend>Podcasts</legend>

      <div v-for="podcast in all" v-bind:key="podcast.id" class="pure-g form-row podcast-rows">
        <div class="id">
          #<b>{{ podcast.id }}</b>
        </div>
        <div class="created-column">
          {{ dts(podcast.created) }}
        </div>
        <div class="episodes">
          <a
            class="podcasts-icon"
            href="#"
            @click="navigateToEpisodesPageForPodcast(podcast.id, $event)"
          >
            {{ $t('podcasts.podcasts.episodes') }}
          </a>
        </div>
        <div class="rss">
          <Icon
            :icon="rssHighlightAsset"
            :icon-hover="rssAsset"
            @click.prevent="openRssFeed(podcast.id, podcastRssFeedUrl(podcast))"
          />
        </div>
        <div class="delete">
          <Icon
            :disabled="all.length == 1"
            :icon="deleteHighlightAsset"
            :icon-hover="deleteAsset"
            @click.prevent="deletePodcast(podcast)"
          />
        </div>
        <div class="podcast-title">
          {{ podcast.title }}
        </div>
      </div>
    </fieldset>
  </form>
</template>

<style>
.id {
  font-weight: normal;
}

.rss {
  grid-area: rss;
}

.episodes {
  grid-area: episodes;
  padding-left: var(--gutter-space);
}

.created-column {
  grid-area: created;
  padding-left: var(--gutter-space);
}

.id b {
  font-weight: bold;
  font-size: medium;
}

.delete {
  grid-area: delete;
}

.podcast-title {
  grid-area: podcast-title;
  padding-left: var(--gutter-space);
}

.podcast-rows {
  display: grid;
  grid-template-areas: 'id delete rss episodes   created  podcast-title';
  grid-template-columns:
    var(--id-column) var(--icon-column) var(--icon-column) fit-content(100%) fit-content(100%)
    auto;
}
</style>
<script lang="ts" setup>
import { mogul, Podcast, podcasts, utils } from '@/services'
import { dateTimeToString } from '@/dates'
import InputWrapper from '@/ui/input/InputWrapper.vue'
import InputTools from '@/ui/InputTools.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Icon from '@/ui/Icon.vue'

import rssHighlightAsset from '@/assets/images/rss-highlight.png'
import rssAsset from '@/assets/images/rss.png'

import deleteHighlightAsset from '@/assets/images/delete-highlight.png'
import deleteAsset from '@/assets/images/delete.png'

const { t } = useI18n()

const router = useRouter()
const title = ref<string>('')
const all = ref<Array<Podcast>>([])
const mogulId = ref<number>(0)

const refresh = async function () {
  return await podcasts.podcasts()
}

const dts = function (date: number) {
  return dateTimeToString(date)
}

const deletePodcast = async (podcast: Podcast) => {
  const msg = t('confirm.deletion', { title: podcast.title })
  if (!utils.confirmDeletion(msg)) return

  const deleted = await podcasts.deletePodcast(podcast.id)
  all.value = all.value.filter((p) => p.id != deleted)
}
const navigateToEpisodesPageForPodcast = async function (podcastId: number, e: Event) {
  e.preventDefault()
  await router.push({
    name: 'podcast-episodes',
    params: { id: podcastId }
  })
}

const podcastRssFeedUrl = (podcast: Podcast): string => {
  const api = import.meta.env.VITE_API_URL

  return (
    api + '/public/feeds/moguls/' + mogulId.value + '/podcasts/' + podcast.id + '/episodes.atom'
  )
}

const openRssFeed = async function (podcastId: number, url: string) {
  window.open(url, 'rssWindowForPodcastNo' + podcastId)
}

const createPodcast = async function (e: Event) {
  e.preventDefault()
  await podcasts.create(title.value)
  all.value = await refresh()
  title.value = ''
}
onMounted(async () => {
  mogulId.value = (await mogul.user()).id
  all.value = await refresh()
})
</script>
