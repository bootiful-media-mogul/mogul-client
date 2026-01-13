<template>
  <h1>
    {{ t('podcasts.title') }}
  </h1>

  <div v-if="!editorVisible">
    <form class="pure-form">
      <fieldset>
        <div class="toolbar">
          <a @click.prevent="createPodcast">
            {{ t('podcasts.new-podcast') }}
          </a>
        </div>

        <legend>{{ t('podcasts.all', { user: mogulName }) }}</legend>

        <div v-for="podcast in all" v-bind:key="podcast.id" class="row podcasts-row">
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
              @click.prevent="navigateToEpisodesPageForPodcast(podcast.id, $event)"
            >
              {{ t('podcasts.episodes') }}
            </a>
          </div>
          <div class="edit">
            <Icon
              :icon="editHighlightAsset"
              :icon-hover="editAsset"
              @click.prevent="editPodcast(podcast)"
            />
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
  </div>
  <div v-else>
    <PodcastsEditor :podcast="draftPodcast!" :podcast-id="draftPodcast!.id" />
  </div>
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

.podcasts-row {
  padding-top: calc(var(--gutter-space) / 2);
  grid-template-rows: minmax(var(--row-height), auto);

  border-top: 1px solid black;
  display: grid;
  grid-template-areas: 'id  edit delete rss episodes   created  podcast-title';
  grid-template-columns:
    var(--id-column) var(--icon-column) var(--icon-column) var(--icon-column) fit-content(100%) fit-content(
      100%
    )
    auto;
}
</style>
<script lang="ts" setup>
import editHighlightAsset from '@/assets/images/edit-highlight.png'
import editAsset from '@/assets/images/edit.png'
import { useRouter } from 'vue-router'

import { loadNotesForNotable, mogul, Podcast, podcasts, utils } from '@/services'
import { dateTimeToString } from '@/dates'
import { onMounted, ref } from 'vue'
import Icon from '@/ui/Icon.vue'

import rssHighlightAsset from '@/assets/images/rss-highlight.png'
import rssAsset from '@/assets/images/rss.png'

import deleteHighlightAsset from '@/assets/images/delete-highlight.png'
import deleteAsset from '@/assets/images/delete.png'
import PodcastsEditor from '@/podcasts/PodcastsEditor.vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const title = ref<string>('')
const all = ref<Array<Podcast>>([])

const draftPodcast = ref<Podcast>()

const editorVisible = ref(false)

const mogulId = ref<number>(0)
const mogulName = ref<string>('')
const { t } = useI18n()
async function refresh() {
  all.value = await podcasts.podcasts()
}

function dts(date: number) {
  return dateTimeToString(date)
}

async function deletePodcast(podcast: Podcast) {
  const msg = t('confirm.deletion', { title: podcast.title })

  if (!utils.confirmDeletion(msg)) {
    return
  }

  await podcasts.deletePodcast(podcast.id)
  await refresh()
}

async function navigateToEpisodesPageForPodcast(podcastId: number, e: Event) {
  await router.push({
    name: 'podcasts/episodes',
    params: { podcastId: podcastId }
  })
}

function podcastRssFeedUrl(podcast: Podcast) {
  const api = import.meta.env.VITE_API_URL
  return (
    api + '/public/feeds/moguls/' + mogulId.value + '/podcasts/' + podcast.id + '/episodes.atom'
  )
}

function openRssFeed(podcastId: number, url: string) {
  window.open(url, 'rssWindowForPodcastNo' + podcastId)
}

async function createPodcast() {
  const p = await podcasts.create(title.value)
  await editPodcast(p)
}

async function editPodcast(podcast: Podcast) {
  draftPodcast.value = podcast
  title.value = podcast.title
  editorVisible.value = true
  await loadNotesForNotable('podcast', podcast.id, podcast.title)
}

onMounted(async () => {
  const user = await mogul.user()
  mogulName.value = user.givenName + ' ' + user.familyName
  mogulId.value = user.id
  editorVisible.value = false
  await refresh()
})
</script>
