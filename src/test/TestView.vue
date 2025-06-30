<template>
  <div>
    <a href="#" @click="modal">visible and modal notification</a> <br />
    <a href="#" @click="quiet">visible, but not-modal notification</a>
  </div>
</template>
<style>
</style>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  graphqlClient,
  mogul as mogulService, notifications,
  Setting,
  settings as settingsService,
  SettingsPage
} from '@/services'


// lets drive some notifications to test out the panel on the right

const quiet = async () => {
  console.log('visible, but not-modal notification')
  await notifications.notify(true, false)
}

const modal = async () => {
  console.log('modal and visible notification')
  await notifications.notify(true, true)
}

onMounted(() => {
  console.log('test loaded.')
})


</script>

