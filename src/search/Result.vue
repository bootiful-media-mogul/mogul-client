<script lang="ts" setup>
import Icon from '@/ui/Icon.vue'

import noteIconAsset from '@/assets/images/entity-badges/note-icon.png'
import segmentIconAsset from '@/assets/images/entity-badges/segment-icon.png'

import editAsset from '@/assets/images/edit-highlight.png'
import editHighlightAsset from '@/assets/images/edit.png'
import deleteHighlightAsset from '@/assets/images/delete.png'
import deleteAsset from '@/assets/images/delete-highlight.png'

import { useRouter } from 'vue-router'
import { results, type ResultType, utils } from '@/services'
import { useI18n } from 'vue-i18n'

import { dateTimeToString } from '@/dates'
import WatermarkedImage from '@/ui/WatermarkedImage.vue'

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
  allowDeletion: boolean | undefined
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
  <div class="result">
    <div class="edit-button">
      <Icon
        @click.prevent="navigateToEntity()"
        :icon="editHighlightAsset"
        :icon-hover="editAsset"
      />
    </div>
    <div class="id-column">#{{ id }}</div>
    <div class="delete-button">
      <Icon
        v-if="props.allowDeletion"
        :icon="deleteHighlightAsset"
        :icon-hover="deleteAsset"
        @click.prevent="deleteEntity()"
      />
    </div>
    <div class="created-column">
      {{ dateTimeToString(props.created) }}
    </div>
    <div class="content">
      <div class="title">{{ props.title }}</div>
      <div class="watermark">
        <WatermarkedImage class="watermark-image" :watermark-image="sourceFor(type)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.result {
  --badge-width: calc(5 * var(--gutter-space));
  position: relative;
  border-top: 1px solid black;
  grid-template-areas:
    ' content content content content content content         '
    ' edit-button . created-column id-column . delete-button ';
  grid-template-columns: var(--icon-width) var(--gutter-space) 1fr 1fr var(--gutter-space) var(
      --icon-width
    );
  grid-template-rows: auto min-content;
  grid-row-gap: var(--gutter-space);
  display: grid;
  padding-bottom: var(--gutter-space-half);
  padding-top: var(--gutter-space-half);

  .edit-button {
    grid-area: edit-button;
    width: var(--icon-width);
  }

  .content {
    grid-area: content;
    grid-template-areas: 'watermark title ';
    display: grid;
    grid-template-columns: max-content auto;
    grid-column-gap: 0;
    align-items: start;
    .watermark {
      grid-area: watermark;
    }
    .title {
      padding-left: var(--gutter-space );
      grid-area: title;
      text-align: left;
    }
  }

  .id-column {
    grid-area: id-column;
    padding-left: calc(0.5 * var(--gutter-space));
    border-left: 0.5px solid black;
  }
  .created-column {
    grid-area: created-column;
    text-align: right;
    border-right: 0.5px solid black;
    padding-right: calc(0.5 * var(--gutter-space));
  }
  .delete-button {
    grid-area: delete-button;
    width: var(--icon-width);
  }
  .watermark {
    --image-dimension: calc(3 * var(--gutter-space));
    display: flex;
    align-items: center;
    .watermark-image {
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      width: var(--image-dimension);
      height: var(--image-dimension);
    }
  }
}
</style>
