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
    <div class="buttons">
      <Icon
        class="edit-button"
        @click.prevent="navigateToEntity()"
        :icon="editHighlightAsset"
        :icon-hover="editAsset"
      />

      <Icon
        v-if="props.allowDeletion"
        :icon="deleteHighlightAsset"
        :icon-hover="deleteAsset"
        class="delete-button"
        @click.prevent="deleteEntity()"
      />
    </div>

    <div class="details">
      <div class="id">
        #<b>{{ id }}</b>
      </div>
      <div class="title">{{ props.title }}</div>
      <div class="created">
        {{ dateTimeToString(props.created) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.result {
  --badge-width: calc(1.5 * var(--gutter-space));
  border-top: 1px solid black;
  grid-template-rows: minmax(calc(2 * var(--row-height)), auto);
  grid-template-areas: ' buttons . details';
  display: grid;
  grid-template-columns: var(--badge-width) var(--gutter-space) auto;
  padding-bottom: var(--gutter-space);
  padding-top: var(--gutter-space);

  .buttons {
    grid-area: buttons;
    display: grid;
    grid-template-rows: min-content auto min-content;
    grid-template-areas:
      'edit '
      ' . '
      'delete';
    .edit-button {
      grid-area: edit;
      width: var(--badge-width);
    }
    .delete-button {
      grid-area: delete;
      width: var(--badge-width);
    }
  }

  .details {
    grid-area: details;
    display: grid;
    grid-template-areas:
      ' created id '
      ' title title ';
    grid-template-columns: auto 100px;
    grid-template-rows: min-content auto;
    grid-row-gap: var(--gutter-space);
    .id {
      grid-area: id;
      text-align: right;
    }
    .title {
      grid-area: title;
    }
    .created {
      grid-area: created;
    }
  }
}
</style>
