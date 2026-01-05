<script lang="ts" setup>
import { dateTimeToString } from '@/dates'
import Icon from '@/ui/Icon.vue'

import editHighlightAsset from '@/assets/images/edit-highlight.png'
import deleteHighlightAsset from '@/assets/images/delete-highlight.png'
import editAsset from '@/assets/images/edit.png'

import deleteAsset from '@/assets/images/delete.png'
import { results, type ResultType, utils } from '@/services'
import { useI18n } from 'vue-i18n'

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
  const context = props.context
  const msg = t('confirm.deletion', { title: props?.title ?? '' })

  if (!utils.confirmDeletion(msg)) return

  const func = results.deletion(props.type as ResultType)!!
  func(context)
  emit('delete', context)
}

async function navigateToEntity() {
  const context = props.context
  const func = results.navigation(props.type as ResultType)!!
  await func(context)
  emit('navigate', context)
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
      <Icon
        :icon="editHighlightAsset"
        :icon-hover="editAsset"
        @click.prevent="navigateToEntity()"
      />
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
