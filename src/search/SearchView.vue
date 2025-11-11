<template>
  <div>
    <div>search for {{ searchTerm }}</div>
    <div>
      <div v-for="result in results" v-bind:key="result.searchableId">
        {{ result.searchableId }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { events, search } from '@/services'
import { onMounted, ref } from 'vue'

const searchTerm = ref<string>('')
const results = ref([] as Array<Map<string, any>>)

async function doSearch(q: string) {
  searchTerm.value = q
  const r: Array<any> = []
  const apiResults = await search.search(q)
  apiResults.forEach((v) => {
    r.push(v)
  })
  results.value = r
}

onMounted(async () => {
  events.on('search-term-entered', async (event) => {
    await doSearch(event as string)
  })
})
</script>
