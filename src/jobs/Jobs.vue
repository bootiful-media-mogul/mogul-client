<template>
  <div></div>
</template>
<style scoped></style>

<script lang="ts" setup>
import { Job, jobs } from '@/services'
import { onMounted, ref } from 'vue'

const allJobs = ref<Job[]>()

onMounted(async () => {
  allJobs.value = await jobs.jobs()
  console.log(allJobs.value)
})
</script>
