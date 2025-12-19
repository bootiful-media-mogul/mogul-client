<style>
.result {
  border-top: 1px solid black;
  padding-bottom: var(--gutter-space);
  padding-top: var(--gutter-space);
  grid-template-areas:
    'title  '
    'link  ';
  grid-template-columns: auto min(100%, 1fr);
  display: grid;
  .title {
    grid-area: title;
  }
  .navigation-link {
    /*text-align: right;*/
    grid-area: link;
  }
}
.results-prompt {
  padding-bottom: var(--gutter-space);
}
.term {
  font-weight: bold;
}
</style>
<template>
  <div>
    <div class="results-prompt">
      <div v-html="$t('search.results.prompt', { term: searchTerm })" />
    </div>
    <div>
      <div v-for="result in results" v-bind:key="result.searchableId">
        <div class="result">
          <div class="title">{{ result.title }}</div>
          <div class="navigation-link">
            <a href="#" @click="navigate(result)">{{ $t('search.results.result.view') }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { events, podcasts, RankedSearchResult, search } from '@/services'
import { onMounted, ref } from 'vue'
import router from '@/index'

const renderers: Record<string, any> = {
  segment: navigateToPodcastEpisode
}

async function navigate(result: RankedSearchResult): Promise<void> {
  const navigationFunction = renderers[result.type]
  console.log(
    'navigationFunction for type ' + result.type,
    navigationFunction == null ? 'null' : 'not null'
  )
  await navigationFunction(result)
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
  results.value.forEach((result) => {
    console.debug(result)
  })
}

onMounted(async () => {
  events.on('search-term-entered', async (event) => {
    await doSearch(event as string)
  })

  await doSearch('rot')
})
</script>
