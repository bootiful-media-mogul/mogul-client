<style>
.result {
  border-top: 1px solid black;
  padding-bottom: var(--gutter-space);
  padding-top: var(--gutter-space);
  grid-template-areas: ' link . title ';
  grid-template-columns: var(--icon-column) var(--gutter-space) auto;
  display: grid;
  .title {
    grid-area: title;
  }
  .navigation-link {
    /*text-align: right;*/
    grid-area: link;
  }
}
.results-prompt {
  padding-bottom: var(--gutter-space);
}
.term {
  font-weight: bold;
}
</style>
<template>
  <div>
    <div class="results-prompt">
      <div
        v-if="results.length"
        v-html="
          t('search.results.prompt', {
            count: results.length,
            term: searchTerm
          })
        "
      />
      <div v-else>
        {{ t('search.no-results.prompt') }}
      </div>
    </div>
    <div>
      <div v-for="result in results" v-bind:key="result.searchableId">
        <div class="result">
          <div class="title">{{ result.title }}</div>
          <div class="navigation-link">
            <Icon
              :icon="editHighlightAsset"
              :icon-hover="editAsset"
              @click.prevent="navigate(result)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/ui/Icon.vue'

import editHighlightAsset from '@/assets/images/edit-highlight.png'
import editAsset from '@/assets/images/edit.png'

import router from '@/index'
import { podcasts, RankedSearchResult, search } from '@/services'

import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()

const route = useRoute()

const query = route.query.query as string

onMounted(async () => {
  await doSearch(query)
})

const renderers: Record<string, any> = {
  segment: navigateToPodcastEpisode
}

async function navigate(result: RankedSearchResult): Promise<void> {
  await renderers[result.type](result)
}

const searchTerm = ref<string>('')
const results = ref([] as Array<RankedSearchResult>)

async function navigateToPodcastEpisode(result: RankedSearchResult): Promise<void> {
  const episode = await podcasts.podcastEpisodeById(result.aggregateId)
  await router.push({
    name: 'podcasts/episodes/episode',
    params: {
      podcastId: episode.podcastId,
      episodeId: episode.id
    }
  })
}

async function doSearch(q: string) {
  searchTerm.value = q
  results.value = await search.search(q)
}
</script>
