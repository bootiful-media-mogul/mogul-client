<template>
  <h1>Home</h1>
  <p>Here is your activity feed...</p>

  <a href="/oauth2/authorization/wordpress">click here to connect to wordpress </a>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { wordpress } from '@/services'

onMounted(async () => {
  const status = await wordpress.wordPressStatus()
  console.log(status)
})
</script>
