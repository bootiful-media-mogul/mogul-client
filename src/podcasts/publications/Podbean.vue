<template>
  <PublicationPanel plugin="podbean" :icon-hover="podbeanIcon" :icon="podbeanIcon">
    <template v-slot:panel>
      <div>
        <button :disabled="disabled" @click="publish()" type="button"
                class="pure-button pure-button-primary publish-button"
        >
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
import type {
  GetPublicationContextFunction,
  IsPluginReadyFunction,
  PublishFunction
} from '@/publications/input'
import { notifications } from '@/services'

const pluginName = 'podbean'

const isPluginReadyFunction = inject<IsPluginReadyFunction>('isPluginReady')!
const publishFunction = inject<PublishFunction>('publish')!
const getPublicationContextFunction =
  inject<GetPublicationContextFunction>('getPublicationContext')!

async function publish(): Promise<boolean> {
  const clientContext = {}
  const publicationContext = getPublicationContextFunction()
  return await publishFunction(
    publicationContext.type,
    publicationContext.publishableId,
    clientContext,
    pluginName
  )
}

const disabled = ref<boolean>(false)

notifications.listenForCategory('podcast-episode-completed-event', async (evt) => {
  console.debug('podcast-episode-completed-event', evt)
  disabled.value = await isPluginDisabled()
})

onMounted(async () => {
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
</script>
