<template>
  <PublicationPanelComponent plugin="ayrshare" :icon-hover="ayrshareIcon" :icon="ayrshareIcon">
    <template v-slot:panel>
      <div>
        <button
          :disabled="disabled"
          @click.prevent="publish()"
          type="button"
          class="pure-button pure-button-primary publish-button"
        >
          {{ $t('publications.plugins.publish') }}
        </button>
      </div>
    </template>
  </PublicationPanelComponent>
</template>
<script setup lang="ts">
import ayrshareIcon from '@/assets/images/publications/podcasts/publish-to-ayrshare.png'
import PublicationPanelComponent from '@/publications/PublicationPanelComponent.vue'
import { inject, onMounted, ref } from 'vue'
import {
  type GetPublicationContextFunction,
  type IsPluginReadyFunction, PublicationContext,
  type PublishFunction
} from '@/publications/input'
import { ayrshare, notifications } from '@/services'

const pluginName = 'ayrshare'

const isPluginReadyFunction = inject<IsPluginReadyFunction>('isPluginReady')!
const publishFunction = inject<PublishFunction>('publish')!
const getPublicationContextFunction =
  inject<GetPublicationContextFunction>('getPublicationContext')!

async function publish(): Promise<boolean> {
  const clientContext = {}
  const publicationContext: PublicationContext = getPublicationContextFunction()
  return await publishFunction(
    publicationContext.type,
    publicationContext.publishableId,
    clientContext,
    pluginName
  )
}

const disabled = ref<boolean>(false)

notifications.listenForCategory('podcast-episode-completed-event', async (evt) => {
  disabled.value = await isPluginDisabled()
})

onMounted(async () => {
  disabled.value = await isPluginDisabled()

  const platforms = await ayrshare.platforms()
  console.log('platforms', platforms)

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
