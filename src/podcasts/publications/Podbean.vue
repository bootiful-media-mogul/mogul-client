<template>
  <PublicationPanel plugin="podbean" :icon-hover="podbeanIcon" :icon="podbeanIcon">
    <template v-slot:panel>
      <div>
        {{ $t('publications.plugins.podbean.description') }}
      </div>
      <div>
        <button :disabled="!isReady()" @click="publish()" type="button" class="btn btn-primary">
          {{ $t('publications.plugins.publish') }}
        </button>
      </div>
    </template>
  </PublicationPanel>
</template>
<script setup lang="ts">
import podbeanIcon from '@/assets/images/publications/podcasts/publish-to-podbean.png'
import PublicationPanel from '@/publications/PublicationPanel.vue'
import { inject, onMounted, ref } from 'vue'
import type { GetPublicationContextFunction, IsPluginReadyFunction, PublishFunction } from '@/publications/input'

const ready = ref<boolean>(false)

const isPluginReadyFunction = inject<IsPluginReadyFunction>('isPluginReady')!
const publishFunction = inject<PublishFunction>('publish')!
const getPublicationContextFunction = inject<GetPublicationContextFunction>('getPublicationContext')!

async function publish(): Promise<boolean> {
  const clientContext = {}
  const publicationContext = getPublicationContextFunction()
  return await publishFunction(
    publicationContext.type,
    publicationContext.publishableId,
    clientContext,
    'podbean'
  )
}

async function isReady(): Promise<boolean> {
  const clientContext = {}
  const publicationContext = getPublicationContextFunction()
  ready.value = await isPluginReadyFunction(
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
