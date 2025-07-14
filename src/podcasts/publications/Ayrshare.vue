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
        <div v-for="p in posts" v-bind:key="p.platforms.map((x) => x.name).join(',')">
          <div class="platform-panel" v-for="platform in p.platforms" v-bind:key="platform.name">
            <div class="platform-enabled">
              <input v-model="platform.enabled" type="checkbox" @change="reset(p)" />
            </div>
            <div class="platform-name">
              {{ $t('publications.plugins.ayrshare.platforms.' + platform.name) }}
            </div>
            <div class="platform-post">
              <div v-if="platform.enabled">
                <InputWrapper v-model="p.post">
                  <textarea v-model="p.post" required rows="5" />
                  <InputTools v-model="p.post" />
                </InputWrapper>
              </div>
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
import { ayrshare, notifications } from '@/services'
import InputTools from '@/ui/InputTools.vue'
import InputWrapper from '@/ui/input/InputWrapper.vue'

class Platform {
  public readonly name: string
  public readonly enabled: boolean = false

  constructor(name: string, enabled: boolean) {
    this.name = name
    this.enabled = enabled
  }
}

/* represents a post intended for one or more platforms */
class Post {
  public readonly platforms: Array<Platform>
  public post: string

  constructor(platforms: Array<Platform>, post: string) {
    this.platforms = platforms
    this.post = post
  }
}

const pluginName = 'ayrshare'
const posts = ref<Array<Post>>([])
const platforms = ref<string[]>([])
const disabled = ref<boolean>(false)
const isPluginReadyFunction = inject<IsPluginReadyFunction>('isPluginReady')!
const publishFunction = inject<PublishFunction>('publish')!
const getPublicationContextFunction =
  inject<GetPublicationContextFunction>('getPublicationContext')!

async function publish(): Promise<boolean> {
  const publicationContext: PublicationContext = getPublicationContextFunction()
  // todo calculate the client context to send when publishing, based on the state of the forms

  const clientContext: any = {}
  posts.value.forEach((post) => {
    post.platforms.forEach((platform) => {
      if (platform.enabled) {
        clientContext[platform.name] = post.post
      }
    })
  })

  return await publishFunction(
    publicationContext.type,
    publicationContext.publishableId,
    clientContext,
    pluginName
  )
}

function reset(post: Post) {
  post.post = ''
}

notifications.listenForCategory('podcast-episode-completed-event', async (evt) => {
  disabled.value = await isPluginDisabled()
})

onMounted(async () => {
  disabled.value = await isPluginDisabled()
  platforms.value = (await ayrshare.platforms()).sort((a, b) => a.localeCompare(b))
  layout()
})

function layout() {
  posts.value = []
  for (const platform of platforms.value) {
    posts.value.push(new Post([new Platform(platform, false)], ''))
  }
}

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
