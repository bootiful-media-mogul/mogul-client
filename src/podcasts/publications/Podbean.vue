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
import type { GetPublicationContextFunction, IsPluginReadyFunction } from '@/publications/input'

const ready = ref<boolean>(false)

const isPluginReady = inject<IsPluginReadyFunction>('isPluginReady')!

const getPublicationContext = inject<GetPublicationContextFunction>('getPublicationContext')!

async function isReady(): Promise<boolean> {
  const clientContext = {}
  const publicationContext = getPublicationContext()
  ready.value = await isPluginReady(
    publicationContext.type,
    publicationContext.publishableId,
    clientContext,
    'podbean'
  )
  return ready.value
}

onMounted(async () => {
  await isReady()
})
</script>
