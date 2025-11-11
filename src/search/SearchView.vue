<template>so you want to search for [{{ searchTerm }}]</template>

<script setup lang="ts">
import { events } from '@/services'
import { onMounted, ref } from 'vue'

const searchTerm = ref<string>('')

onMounted(async () => {
  events.on('search-term-entered', async (event) => {
    console.log(event)
    searchTerm.value = event as string

    // todo drive a call to the search endpoint

  })
})
</script>
