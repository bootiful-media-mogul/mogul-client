<template>

  <div>
    <a href="#" @click="modal">modal</a> |
    <a href="#" @click="visible">visible</a> |
    <a href="#" @click="background">system</a>
  </div>

</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { notifications } from '@/services'

const visible = async () => {
  await notifications.notify(true, false)
}

const modal = async () => {
  await notifications.notify(false, true)
}

const background = async () => {
  await notifications.notify(false, false)
}

onMounted(() => {
  console.log('test loaded.')
})

</script>