<template>
  <PublicationPanel plugin="podbean" :icon-hover="podbeanIcon" :icon="podbeanIcon">
    <template v-slot:panel>
      Podbean is ready? {{ ready }} <br />

      <button @click="isReady()" type="button" class="btn btn-primary">check</button>
    </template>
  </PublicationPanel>
</template>
<script setup lang="ts">
import podbeanIcon from '@/assets/images/publications/podcasts/publish-to-podbean.png'
import PublicationPanel from '@/publications/PublicationPanel.vue'
import { inject, onMounted, ref } from 'vue'
import type { IsPluginReadyFunction } from '@/services'

const ready = ref<boolean>(false)

const isPluginReady = inject<IsPluginReadyFunction>('isPluginReady')!

async function isReady(): Promise<boolean> {
  const context = {}
  ready.value = await isPluginReady('episode', 1, context, 'podbean')
  return ready.value
}

onMounted(async () => {
  ready.value = await isReady()
})
</script>
