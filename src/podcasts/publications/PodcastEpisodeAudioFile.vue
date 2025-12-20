<template>
  <PublicationPanelComponent
    :icon="downloadAudioIcon"
    :icon-hover="downloadAudioIcon"
    plugin="audioFile"
  >
    <template v-slot:panel>
      <div>
        <button
          :disabled="disabled"
          class="pure-button pure-button-primary publish-button"
          type="button"
          @click.prevent="downloadAudio()"
        >
          {{ t('publications.plugins.audioFile.download') }}
        </button>
      </div>
    </template>
  </PublicationPanelComponent>
</template>
<script lang="ts" setup>
import downloadAudioIcon from '@/assets/images/publications/podcasts/publish-download-produced-audio.png'
import PublicationPanelComponent from '@/publications/PublicationPanelComponent.vue'
import { managedFiles, notifications, podcasts } from '@/services'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

import { inject, onMounted, ref } from 'vue'
import type {
  GetPublicationContextFunction,
  IsPluginReadyFunction,
  PublishFunction
} from '@/publications/input'

const pluginName = 'audioFile'

const isPluginReadyFunction = inject<IsPluginReadyFunction>('isPluginReady')!
const publishFunction = inject<PublishFunction>('publish')!
const getPublicationContextFunction =
  inject<GetPublicationContextFunction>('getPublicationContext')!

const disabled = ref<boolean>(false)

notifications.listenForCategory('podcast-episode-completed-event', async (evt) => {
  disabled.value = await isPluginDisabled()
})

async function isPluginDisabled() {
  const clientContext = {}
  const publicationContext = getPublicationContextFunction()
  const ready = await isPluginReadyFunction(
    publicationContext.type,
    publicationContext.publishableId,
    clientContext,
    pluginName
  )
  return !ready!
}

async function downloadAudio() {
  const publicationContext = getPublicationContextFunction()
  const clientContext = {}
  await publishFunction(
    publicationContext.type,
    publicationContext.publishableId,
    clientContext,
    pluginName
  )
  const episode = await podcasts.podcastEpisodeById(publicationContext.publishableId)
  const mf = await managedFiles.managedFileById(episode.producedAudio.id)
  const url = mf.downloadableUrl
  window.open(url, '_blank')
}

onMounted(async () => {
  disabled.value = await isPluginDisabled()
})
</script>
