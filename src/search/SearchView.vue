<style>
.term {
  font-weight: bold;
}
</style>
<template>
  <h1>
    {{ t('search.results.title') }}
  </h1>
  <form class="pure-form">
    <fieldset>
      <legend>
        <span
          v-if="results"
          v-html="
            t('search.results.prompt', {
              count: results.length,
              term: searchTerm
            })
          "
        />
        <span v-else>
          {{ t('search.no-results.prompt') }}
        </span>
      </legend>

      <div v-for="result in results" v-bind:key="result.searchableId">
        <Result
          :aggregate-id="result?.aggregateId"
          :created="result.created"
          :title="result.title"
          :id="result.searchableId"
        />
      </div>
    </fieldset>
  </form>
</template>

<script setup lang="ts">
import router from '@/index'
import { podcasts, RankedSearchResult, search } from '@/services'

import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import Result from '@/search/Result.vue'

const { t } = useI18n()

const route = useRoute()

const query = route.query.query as string

onMounted(async () => {
  await doSearch(query)
})

const renderers: Record<string, any> = {
  segment: navigateToPodcastEpisode
}

async function navigate(result: RankedSearchResult): Promise<void> {
  await renderers[result.type](result)
}

const searchTerm = ref<string>('')
const results = ref([] as Array<RankedSearchResult>)

async function navigateToPodcastEpisode(result: RankedSearchResult): Promise<void> {
  const episode = await podcasts.podcastEpisodeById(result.aggregateId)
  await router.push({
    name: 'podcasts/episodes/episode',
    params: {
      podcastId: episode.podcastId,
      episodeId: episode.id
    }
  })
}

async function doSearch(q: string) {
  searchTerm.value = q
  results.value = await search.search(q)
}
</script>
