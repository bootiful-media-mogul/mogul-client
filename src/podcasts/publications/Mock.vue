<script setup lang="ts">
import PublicationPanelComponent from '@/publications/PublicationPanelComponent.vue'
import mockIcon from '@/assets/images/publications/podcasts/mock.png'
import { inject } from 'vue'
import {
  type GetPublicationContextFunction,
  PublicationContext,
  type PublishFunction
} from '@/publications/input'
const publishFunction = inject<PublishFunction>('publish')!
const getPublicationContextFunction =
  inject<GetPublicationContextFunction>('getPublicationContext')!
const pluginName = 'mock'

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
  <PublicationPanelComponent plugin="mock" :icon-hover="mockIcon" :icon="mockIcon">
    <template v-slot:panel>
      <button
        @click.prevent="publish()"
        type="button"
        class="pure-button pure-button-primary publish-button"
      >
        {{ $t('publications.plugins.publish') }}
      </button>
    </template>
  </PublicationPanelComponent>
</template>
