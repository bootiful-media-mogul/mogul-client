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
          v-if="searchResults"
          v-html="
            t('search.results.prompt', {
              count: searchResults.length,
              term: searchTerm
            })
          "
        />
        <span v-else>
          {{ t('search.no-results.prompt') }}
        </span>
      </legend>
      <div class="toolbar"></div>
      <div v-for="result in searchResults" v-bind:key="result.searchableId">
        <Result
          :context="result.contextMap"
          :type="result.type as ResultType"
          :aggregate-id="result?.aggregateId"
          :created="result.created"
          :title="result.title"
          :allow-deletion="false"
          :id="result.aggregateId"
          @delete="refresh"
        />
      </div>
    </fieldset>
  </form>
</template>

<script setup lang="ts">
import { results, ResultType, search, SearchableResult } from '@/services'

import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import Result from '@/search/Result.vue'

const { t } = useI18n()

const route = useRoute()

const query = route.query.query as string

async function refresh() {
  await doSearch(query)
}
onMounted(async () => {
  await refresh()
})

const searchTerm = ref<string>('')
const searchResults = ref([] as Array<SearchableResult>)

async function doSearch(q: string) {
  searchTerm.value = q
  searchResults.value = await search.search(q)
}
</script>
