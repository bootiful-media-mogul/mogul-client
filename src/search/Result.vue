<script lang="ts" setup>
import Icon from '@/ui/Icon.vue'

import noteIconAsset from '@/assets/images/search/note-icon.png'
import segmentIconAsset from '@/assets/images/search/segment-icon.png'

import editHighlightAsset from '@/assets/images/edit-highlight.png'
import { useRouter } from 'vue-router'
import { results, type ResultType, utils } from '@/services'
import { useI18n } from 'vue-i18n'

import { dateTimeToString } from '@/dates'

const { t } = useI18n()

const emit = defineEmits<{
  delete: [context: Map<string, number>]
  navigate: [context: Map<string, number>]
}>()

const props = defineProps<{
  id: number
  context: Map<string, number>
  type: ResultType
  created: number | string | null
  title: string
  aggregateId: number | undefined
}>()

async function deleteEntity() {
  const msg = t('confirm.deletion', { title: props?.title ?? '' })

  if (!utils.confirmDeletion(msg)) return

  const context = props.context
  const func = results.deletion(props.type as ResultType)!!
  func(context)
  emit('delete', context)
}
const router = useRouter()

async function navigateToEntity() {
  const context = props.context
  await router.push({
    name: 'entity',
    params: { id: context.get('id'), type: context.get('type') }
  })
  emit('navigate', context)
}

function sourceFor(type: string): string {
  const map = new Map<string, string>()
  map.set('segment', segmentIconAsset)
  map.set('note', noteIconAsset)
  return map.get(type)!!
}
</script>
<template>
  <div class="badged-row">
    <div class="type-badge">
      <Icon
        @click.prevent="navigateToEntity()"
        :icon-hover="editHighlightAsset"
        :icon="sourceFor(type)"
      />
    </div>
    <div class="results-result-row result-row">
      <div class="result-id-column">
        #<b>{{ id }}</b>
      </div>
      <div class="result-title-column">{{ props.title }}</div>
      <div class="result-created-column">
        {{ dateTimeToString(props.created) }}
      </div>
      <!--      <div class="edit">
        <Icon
          :icon="editHighlightAsset"
          :icon-hover="editAsset"
          @click.prevent="navigateToEntity()"
        />
      </div>-->
      <!--      <div class="delete">
        <Icon
          :icon="deleteHighlightAsset"
          :icon-hover="deleteAsset"
          @click.prevent="deleteEntity()"
        />
      </div>-->
    </div>
  </div>
</template>

<style scoped>
.badged-row {
  --badge-width: calc(1.5 * var(--gutter-space));
  border-top: 1px solid black;
  padding-bottom: var(--gutter-space-half);
  padding-top: var(--gutter-space);
  grid-template-areas: ' badge result  ';
  display: grid;
  grid-template-columns: calc(var(--gutter-space) + var(--badge-width)) auto;

  .type-badge {
    grid-area: badge;
    img {
      width: var(--badge-width);
    }
  }

  .results-result-row {
    .result-title-column {
      grid-area: title;
    }
    .result-created-column {
      grid-area: created;
    }
    .result-id-column {
      grid-area: id;
      text-align: right;
    }

    .type-badge {
      img {
        width: var(--icon-column);
      }
    }
    grid-area: result;
    grid-template-areas:
      '  created id     '
      '  title title ';
    grid-template-rows: auto minmax(var(--row-height), auto);
    grid-template-columns: auto var(--id-column);
    row-gap: var(--gutter-space);
    /*column-gap: var(--gutter-space);*/
    padding-bottom: var(--gutter-space);

    display: grid;
  }
}
</style>
