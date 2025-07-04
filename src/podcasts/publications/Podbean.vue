<template>
  <PublicationPanelComponent plugin="podbean" :icon-hover="podbeanIcon" :icon="podbeanIcon">
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
import podbeanIcon from '@/assets/images/publications/podcasts/publish-to-podbean.png'
import PublicationPanelComponent from '@/publications/PublicationPanelComponent.vue'
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
  console.debug('podbean: podcast-episode-completed-event', evt)
  disabled.value = await isPluginDisabled()
})

onMounted(async () => {
  console.log('podbean: calling isPluginDisabled()')
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
