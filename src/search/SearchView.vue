<style>
.result {
  border-top: 1px solid black;
  padding-bottom: var(--gutter-space);
  padding-top: var(--gutter-space);

  display: grid;


}
.results-prompt {
  padding-bottom: var(--gutter-space);
}
.term {
  font-weight: bold;
}
</style>
<template>
  <!--
 we need some generic way to refer to other
 types of assets: podcasts, blogs, etc.
 i think for now rather than having completely
 different hierarchies of components, we need to
 have a component that takes some parameters and
 renders the right client-side navigation behavior
 -->
  <div>
    <div class="results-prompt">
      <div v-html="$t('search.results.prompt', { term: searchTerm })" />
    </div>
    <div>
      <div v-for="result in results" v-bind:key="result.searchableId">
        <div class="result">
          <component
            :id="result.searchableId"
            :aggregate="result.aggregateId"
            :is="renderers[result.type]"
          >
          </component>

          {{ result.searchableId }} || {{ result.aggregateId }} || {{ result.type }} |
          {{ result.title }} | {{ result.rank }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { events, RankedSearchResult, search } from '@/services'
import { onMounted, ref } from 'vue'
import PodcastEpisodeSearchResult from '@/search/results/PodcastEpisodeSearchResult.vue'

// a directory of components that can render a given type of preview
const renderers: Record<string, any> = {
  segment: PodcastEpisodeSearchResult
}

const searchTerm = ref<string>('')
const results = ref([] as Array<RankedSearchResult>)

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

  // todo remove the following single line! it's only useful for me to develop the css!
  await doSearch('rot')
})
</script>
