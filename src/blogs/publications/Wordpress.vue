<template>
  <PublicationPanelComponent :icon="wordpressIcon" :icon-hover="wordpressIcon" :plugin="pluginName">
    <template v-slot:panel>
      <div>
        <div v-if="status?.connected">
          <Icon :icon="connected" :icon-hover="connected" :disabled="true" />
        </div>
        <div v-else>
          <Icon :icon="disconnected" :icon-hover="disconnected" @click.prevent="connect()" />
        </div>

        <button
          :disabled="disabled"
          class="pure-button pure-button-primary publish-button"
          type="button"
          @click.prevent="publishToWordpress()"
        >
          {{ t('publications.plugins.audioFile.download') }}
        </button>
      </div>
    </template>
  </PublicationPanelComponent>
</template>
<script lang="ts" setup>
import wordpressIcon from '@/assets/images/publications/blogs/wordpress-og.png'
import connected from '@/assets/images/publications/blogs/linked-icon.png'
import disconnected from '@/assets/images/publications/blogs/unlinked-icon.png'

import PublicationPanelComponent from '@/publications/PublicationPanelComponent.vue'
import { useI18n } from 'vue-i18n'
import { inject, onMounted, ref } from 'vue'
import type {
  GetPublicationContextFunction,
  IsPluginReadyFunction,
  PublishFunction
} from '@/publications/input'
import { entityNavigationContexts, wordpress, WordPressStatus } from '@/services'
import Icon from '@/ui/Icon.vue'

const { t } = useI18n()

const status = ref<WordPressStatus>()

const pluginName = 'wordpress'

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

async function connect() {
  console.log(
    'going to connect to wordpress. i should store ' +
      'some state somewhere to reconstruct this view'
  )
  await attemptConnection()
}

async function attemptConnection() {
  const publicationContext = getPublicationContextFunction()
  const context = await entityNavigationContexts.buildEntityContextFor(
    publicationContext.type,
    publicationContext.publishableId
  )
  const json = JSON.stringify(context)
  sessionStorage.setItem('pending_action', json)
  window.location.href = '/oauth2/authorization/wordpress'
}

async function publishToWordpress() {
  const publicationContext = getPublicationContextFunction()
  const clientContext = {}
  console.log('going to download audio file, before publishFunction')
  await publishFunction(
    publicationContext.type,
    publicationContext.publishableId,
    clientContext,
    pluginName
  )
}

onMounted(async () => {
  disabled.value = await isPluginDisabled()
  status.value = await wordpress.wordPressStatus()

  console.log('onMounted ' + status?.value?.connected)
})
</script>
