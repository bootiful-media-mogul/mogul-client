<script lang="ts" setup>
import PublicationPanelComponent from '@/publications/PublicationPanelComponent.vue'
import mockIcon from '@/assets/images/publications/podcasts/mock.png'
import { inject } from 'vue'
import { type GetPublicationContextFunction, PublicationContext, type PublishFunction } from '@/publications/input'

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
  <PublicationPanelComponent :icon="mockIcon" :icon-hover="mockIcon" plugin="mock">
    <template v-slot:panel>
      <button
        class="pure-button pure-button-primary publish-button"
        type="button"
        @click.prevent="publish()"
      >
        {{ $t('publications.plugins.publish') }}
      </button>
    </template>
  </PublicationPanelComponent>
</template>
