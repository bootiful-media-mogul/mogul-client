<template>
  <PublicationPanel plugin="audioFile" :icon-hover="downloadAudioIcon" :icon="downloadAudioIcon">
    <template v-slot:panel>
      <div>
        <button
          :disabled="!isReady()"
          @click.prevent="downloadAudio()"
          type="button"
          class="pure-button pure-button-primary publish-button"
        >
          {{ $t('publications.plugins.audiofile.download') }}
        </button>
      </div>
    </template>
  </PublicationPanel>
</template>
<script setup lang="ts">
import downloadAudioIcon from '@/assets/images/publications/podcasts/publish-download-produced-audio.png'

import PublicationPanel from '@/publications/PublicationPanel.vue'

import { inject, onMounted, ref } from 'vue'

import type {
  GetPublicationContextFunction,
  IsPluginReadyFunction,
  PublishFunction
} from '@/publications/input'
import { managedFiles, podcasts } from '@/services'

const ready = ref<boolean>(false)
const isPluginReadyFunction = inject<IsPluginReadyFunction>('isPluginReady')!
const getPublicationContextFunction =
  inject<GetPublicationContextFunction>('getPublicationContext')!

const publishFunction = inject<PublishFunction>('publish')!

const plugin = 'audioFile'

async function isReady(): Promise<boolean> {
  const clientContext = {}
  const publicationContext = getPublicationContextFunction()
  ready.value = await isPluginReadyFunction(
    publicationContext.type,
    publicationContext.publishableId,
    clientContext,
    plugin
  )
  return ready.value
}

onMounted(async () => {
  await isReady()
})

async function downloadAudio() {
  const publicationContext = getPublicationContextFunction()
  const clientContext = {}
  await publishFunction(
    publicationContext.type,
    publicationContext.publishableId,
    clientContext,
    plugin
  )
  const episode = await podcasts.podcastEpisodeById(publicationContext.publishableId)
  const mf = await managedFiles.managedFileById(episode.producedAudio.id)
  const url = mf.downloadableUrl
  window.open(url, '_blank')
}
</script>
