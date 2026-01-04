<script lang="ts" setup>
import { dateTimeToString } from '@/dates'
import Icon from '@/ui/Icon.vue'

import editHighlightAsset from '@/assets/images/edit-highlight.png'
import deleteHighlightAsset from '@/assets/images/delete-highlight.png'
import editAsset from '@/assets/images/edit.png'

import deleteAsset from '@/assets/images/delete.png'

const deleteEntity = async () => {
  /*
  const podcastEpisodeDescription = t('podcasts.episodes.episode.reference', {
    title: props.title
  })
  const msg = t('confirm.deletion', { title: podcastEpisodeDescription })

  if (!utils.confirmDeletion(msg)) return

  await podcasts.deletePodcastEpisode(props.id)
  */
}

const props = defineProps<{
  id: number
  created: number | string | null
  title: string
  aggregateId: number | undefined
}>()

async function navigateToEntityEditor(aggregateId: number, id: number) {
/*  await router.push({
    name: 'podcasts/episodes/episode',
    params: { podcastId: aggregateId, episodeId: id }
  })
*/
}

const loadEntity = async () => {
  await navigateToEntityEditor(props?.aggregateId ?? 0, props.id)
}
</script>
<template>
  <div class="row result-row">
    <div class="id-column">
      #<b>{{ id }}</b>
    </div>
    <div class="created-column">
      {{ dateTimeToString(props.created) }}
    </div>
    <div class="edit">
      <Icon :icon="editHighlightAsset" :icon-hover="editAsset" @click.prevent="loadEntity()" />
    </div>
    <div class="delete">
      <Icon
        :icon="deleteHighlightAsset"
        :icon-hover="deleteAsset"
        @click.prevent="deleteEntity()"
      />
    </div>
    <div class="title">{{ props.title }}</div>
  </div>
</template>

<style scoped>
.title {
  grid-area: title;
}

.result-row {
  padding-top: calc(var(--gutter-space) / 2);
  border-top: 1px solid black;
  grid-template-areas:
    ' title    title   title title title '
    ' id  edit  delete created created   ';
  grid-template-columns:
    var(--id-column)
    var(--icon-column)
    var(--icon-column)
    var(--date-column)
    auto;
  grid-template-rows: minmax(var(--row-height), auto) auto;
  padding-bottom: var(--gutter-space);
  display: grid;
}
</style>
