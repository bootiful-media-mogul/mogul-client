<script lang="ts" setup>
import PublicationPanelComponent from '@/publications/PublicationPanelComponent.vue'
import mockIcon from '@/assets/images/publications/podcasts/mock.png'

import { inject, onMounted, ref } from 'vue'

import {
  type GetPublicationContextFunction,
  type IsPluginReadyFunction,
  PublicationContext,
  type PublishFunction
} from '@/publications/input'

import { notifications } from '@/services'

const isPluginReadyFunction = inject<IsPluginReadyFunction>('isPluginReady')!

const disabled = ref<boolean>(false)
const publishFunction = inject<PublishFunction>('publish')!

const pluginName = 'mock'

const getPublicationContextFunction =
  inject<GetPublicationContextFunction>('getPublicationContext')!

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
onMounted(async () => {
  disabled.value = await isPluginDisabled()
})

notifications.listenForCategory('podcast-episode-completed-event', async (evt) => {
  disabled.value = await isPluginDisabled()
})

async function publish(): Promise<boolean> {
  const publicationContext: PublicationContext = getPublicationContextFunction()
  const clientContext: any = {}
  return await publishFunction(
    publicationContext.type,
    publicationContext.publishableId,
    clientContext,
    pluginName
  )
}
</script>

<template>
  <PublicationPanelComponent :icon="mockIcon" :icon-hover="mockIcon" plugin="mock">
    <template v-slot:panel>
      <button
        :disabled="disabled"
        class="pure-button pure-button-primary publish-button"
        type="button"
        @click.prevent="publish()"
      >
        {{ $t('publications.plugins.publish') }}
      </button>
    </template>
  </PublicationPanelComponent>
</template>
