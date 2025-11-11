<template>
  search for <em>{{ searchTerm }}</em
  >.
</template>

<script setup lang="ts">
import { events, search } from '@/services'
import { onMounted, ref } from 'vue'

const searchTerm = ref<string>('')

async function doSearch(q: string) {
  const results = await search.search(q)
  console.log(results)
}

onMounted(async () => {
  events.on('search-term-entered', async (event) => {
    console.log(event)
    searchTerm.value = event as string
    await doSearch(searchTerm.value)
  })
})
</script>
