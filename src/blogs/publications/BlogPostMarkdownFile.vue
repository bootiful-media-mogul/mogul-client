<template>
  <PublicationPanelComponent
    :icon="downloadAudioIcon"
    :icon-hover="downloadAudioIcon"
    :plugin="pluginName"
  >
    <template v-slot:panel>
      <div>
        <button
          :disabled="disabled"
          class="pure-button pure-button-primary publish-button"
          type="button"
          @click.prevent="downloadMarkdown()"
        >
          {{ t('publications.plugins.audioFile.download') }}
        </button>
      </div>
    </template>
  </PublicationPanelComponent>
</template>
<script lang="ts" setup>
import downloadAudioIcon from '@/assets/images/publications/blogs/download-blog-post-as-markdown.png'

import PublicationPanelComponent from '@/publications/PublicationPanelComponent.vue'
import { useI18n } from 'vue-i18n'
import { inject, onMounted, ref } from 'vue'
import type {
  GetPublicationContextFunction,
  IsPluginReadyFunction,
  PublishFunction
} from '@/publications/input'

const { t } = useI18n()

const pluginName = 'blogPostMarkdownFile'

const isPluginReadyFunction = inject<IsPluginReadyFunction>('isPluginReady')!
const publishFunction = inject<PublishFunction>('publish')!
const getPublicationContextFunction =
  inject<GetPublicationContextFunction>('getPublicationContext')!

const disabled = ref<boolean>(false)

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

async function downloadMarkdown() {
  const publicationContext = getPublicationContextFunction()
  const clientContext = {}
  console.log('going to download audio file, before publishFunction')
  await publishFunction(
    publicationContext.type,
    publicationContext.publishableId,
    clientContext,
    pluginName
  )
  console.log(clientContext)
  // console.log('going to download audio file, after publishFunction')
  // const episode = await podcasts.podcastEpisodeById(publicationContext.publishableId)
  // const mf = await managedFiles.managedFileById(episode.producedAudio.id)
  // const url = mf.downloadableUrl
  // console.log('there should now be a publication outcome for the following url ' + url)
  // window.open(url, '_blank')
}

onMounted(async () => {
  disabled.value = await isPluginDisabled()
})
</script>
