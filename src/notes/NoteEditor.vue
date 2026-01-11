<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import deleteHighlightAsset from '@/assets/images/delete-highlight.png'
import deleteAsset from '@/assets/images/delete.png'
import Icon from '@/ui/Icon.vue'
import editHighlightAsset from '@/assets/images/edit-highlight.png'
import editAsset from '@/assets/images/edit.png'
import { dateTimeToString } from '@/dates'

const { t } = useI18n()

const emit = defineEmits<{
  deleted: [id: number, type: string]
  updated: [id: number, type: string]
}>()

const props = defineProps<{
  id: number
  note: string
  created: string | number
  type: string
}>()
</script>

<template>
  <div class="note">
    <div class="created">{{ dateTimeToString(created) }}</div>
    <div class="note">
      {{ note }}
    </div>
    <div class="note-controls">
      <Icon :icon="editHighlightAsset" :icon-hover="editAsset" />
      <Icon :icon="deleteHighlightAsset" :icon-hover="deleteAsset" class="delete-icon" />
    </div>
  </div>
</template>

<style scoped>
/*
div.segment-controls {
  display: grid;
  grid-template-areas: 'up down delete transcript ';
  grid-column-gap: var(--gutter-space-half);
  grid-template-columns: var(--icon-column) var(--icon-column) var(--icon-column) var(--icon-column);
}*/

.note {
  padding-bottom: var(--gutter-space);
  display: grid;
  grid-template-areas:
    ' created '
    ' note '
    ' buttons ';

  .created {
    border-top: 1px solid black;
    padding-top: calc(var(--gutter-space) / 2);
    padding-bottom: calc(var(--gutter-space) / 2);
    font-size: smaller;
    text-align: right;
  }
  .note {
    grid-area: note;
  }
  .note-controls {
    grid-area: buttons;
    display: grid;
    grid-template-areas: 'edit delete';
    grid-column-gap: var(--gutter-space-half);
    grid-template-columns: var(--icon-column) var(--icon-column);
  }
}
</style>
