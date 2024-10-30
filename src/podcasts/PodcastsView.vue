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
          <input type="text" required id="title" v-model="title" />
          <InputTools v-model="title" />
        </InputWrapper>
      </div>
      <div class="pure-controls">
        <button
          class="pure-button pure-button-primary"
          type="submit"
          :disabled="title == null || title.trim().length == 0"
          @click="createPodcast"
          value="create"
        >
          {{ $t('podcasts.new-podcast.submit') }}
        </button>
      </div>
    </fieldset>
  </form>
  <form class="pure-form">
    <fieldset>
      <legend>Podcasts</legend>

      <div class="pure-g form-row podcast-rows" v-for="podcast in all" v-bind:key="podcast.id">
        <div class="id">
          #<b>{{ podcast.id }}</b>
        </div>
        <div class="created">
          {{ dts(podcast.created) }}
        </div>

        <div class="links">
          <a href="#" @click="navigateToEpisodesPageForPodcast(podcast.id, $event)">
            {{ $t('podcasts.podcasts.episodes') }}
          </a>
          |
          <a :href="podcastRssFeedUrl(podcast)">RSS</a>

        </div>
        <div class="delete">
          <a
            v-if="all.length > 1"
            @click.prevent="deletePodcast(podcast.id)"
            href="#"
            class="delete-icon"
          ></a>
          <span v-if="all.length == 1" href="#" class="delete-icon disabled"></span>
        </div>
        <div class="title">
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

.links {
  grid-area: links;
}

.created {
  grid-area: created;
}

.id b {
  font-weight: bold;
  font-size: medium;
}

.delete {
  grid-area: delete;
}

.title {
  grid-area: title;
}

.podcast-rows {
  display: grid;
  grid-template-areas: 'id delete links created title';
  grid-template-columns: var(--id-column) 30px 150px var(--date-column) auto;
}
</style>
<script setup lang="ts">
import { mogul, Podcast, podcasts } from '@/services'
import { dateTimeToString } from '@/dates'
import InputWrapper from '@/ui/input/InputWrapper.vue'
import InputTools from '@/ui/InputTools.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const title = ref<string>('')
const all = ref<Array<Podcast>>([])
const mogulId = ref<number>(0)

const refresh = async function() {
  return await podcasts.podcasts()
}
const dts = function(date: number) {
  return dateTimeToString(date)
}
const deletePodcast = async (id: number) => {
  const deleted = await podcasts.deletePodcast(id)
  all.value = all.value.filter((p) => p.id != deleted)
}
const navigateToEpisodesPageForPodcast = async function(podcastId: number, e: Event) {
  e.preventDefault()
  await router.push({
    name: 'podcast-episodes',
    params: { id: podcastId }
  })
}


const podcastRssFeedUrl = (podcast: Podcast): string => {
  //http://127.0.0.1:1010/api/feeds/moguls/16386/podcasts/1/episodes.atom
  return '/api/feeds/moguls/' + mogulId.value + '/podcasts/' + podcast.id + '/episodes.atom'
}


const createPodcast = async function(e: Event) {
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
