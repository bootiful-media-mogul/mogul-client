<style>
.result {
  border-top: 1px solid black;
  padding-bottom: var(--gutter-space);
  padding-top: var(--gutter-space);
}
.results-prompt {
  padding-bottom : var(--gutter-space);
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
          {{ result.searchableId }}
          | {{ result.type }} | {{ result.title }} | {{ result.rank }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { events, RankedSearchResult, search } from '@/services'
import { onMounted, ref } from 'vue'

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
