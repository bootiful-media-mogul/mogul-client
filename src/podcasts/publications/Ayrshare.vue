<style scoped>
.platform-panel {
  display: grid;
  grid-template-areas:
    ' platform-enabled . platform-name   '
    ' . . platform-post ';
  grid-template-columns: min-content calc(var(--gutter-space) / 2) auto;
}

.platform-panel .platform-enabled {
  grid-area: platform-enabled;
}

.platform-panel .platform-post {
  grid-area: platform-post;
  width: 100%;
}

.platform-panel .platform-post textarea {
  width: 100%;
}

.platform-panel .platform-name {
  grid-area: platform-name;
}

.platform-panels {
  padding-bottom: var(--gutter-space);
  padding-top: var(--gutter-space);
}
</style>
<template>
  <PublicationPanelComponent plugin="ayrshare" :icon-hover="ayrshareIcon" :icon="ayrshareIcon">
    <template v-slot:panel>
      <div class="platform-panels">
        <div v-for="p in posts" v-bind:key="p.ayrsharePublicationComposition.platform" class="platform-panel">
          <div class="platform-enabled">
            <input v-model="p.enabled" :disabled="publishing" type="checkbox" @change="reset(p)" />
          </div>
          <div class="platform-name">
            {{ $t('publications.plugins.ayrshare.platforms.' + p.ayrsharePublicationComposition.platform) }}
          </div>
          <div class="platform-post">
            <div v-if="p.enabled">
              <InputWrapper v-model="p.post">
                <textarea :disabled="publishing" v-model="p.post" required rows="5" />
                <CompositionComponent
                  :composition-id="p.ayrsharePublicationComposition.composition.id"
                />
                <InputTools v-model="p.post" />
              </InputWrapper>
            </div>
          </div>
        </div>

      </div>
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
  type IsPluginReadyFunction,
  PublicationContext,
  type PublishFunction
} from '@/publications/input'

import { ayrshare, AyrsharePublicationComposition, notifications } from '@/services'
import CompositionComponent from '@/compositions/CompositionComponent.vue'
import InputTools from '@/ui/InputTools.vue'
import InputWrapper from '@/ui/input/InputWrapper.vue'

class EnableAyrsharePublicationComposition {

  public enabled: boolean = false
  public ayrsharePublicationComposition: AyrsharePublicationComposition
  public post: string = ''

  constructor(ayrsharePublicationComposition: AyrsharePublicationComposition) {
    this.ayrsharePublicationComposition = ayrsharePublicationComposition
  }
}

const pluginName = 'ayrshare'

const publishing = ref<boolean>(false)

const posts = ref<Array<EnableAyrsharePublicationComposition>>([])
const disabled = ref<boolean>(false)
const isPluginReadyFunction = inject<IsPluginReadyFunction>('isPluginReady')!
const publishFunction = inject<PublishFunction>('publish')!
const getPublicationContextFunction =
  inject<GetPublicationContextFunction>('getPublicationContext')!

async function publish(): Promise<boolean> {
  publishing.value = true
  const publicationContext: PublicationContext = getPublicationContextFunction()

  const clientContext: any = {}

  posts.value.forEach((p) => {
    if (p.enabled) {
      clientContext[p.ayrsharePublicationComposition.platform] = p.post
      clientContext[p.ayrsharePublicationComposition.platform + 'CompositionId'] = p.ayrsharePublicationComposition.composition.id
    }
  })


  return await publishFunction(
    publicationContext.type,
    publicationContext.publishableId,
    clientContext,
    pluginName
  )
}

async function reset(post: EnableAyrsharePublicationComposition) {
  if (!post.enabled) {
    post.post = ''
  }
  disabled.value = await isPluginDisabled()
}

notifications.listenForCategory('podcast-episode-completed-event', async (evt) => {
  disabled.value = await isPluginDisabled()
})

notifications.listenForCategory('ayrshare-publication-completion-event', async (evt) => {
  console.log('event', evt)
  publishing.value = false
  await refresh()
})

async function refresh() {
  posts.value = (await ayrshare.publicationCompositions())
    .map((x) => new EnableAyrsharePublicationComposition(x))
}

onMounted(async () => {
  await refresh()
  console.log('posts: ', posts.value)
  disabled.value = await isPluginDisabled()
})

async function isPluginDisabled() {

  const selected = posts.value.filter((p) => p.enabled).length > 0
  if (!selected) {
    return true
  }

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
