<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import deleteHighlightAsset from '@/assets/images/delete-highlight.png'
import deleteAsset from '@/assets/images/delete.png'
import Icon from '@/ui/Icon.vue'
import editHighlightAsset from '@/assets/images/edit-highlight.png'
import editAsset from '@/assets/images/edit.png'
import { dateTimeToString } from '@/dates'
import { notes } from '@/services'

const { t } = useI18n()

const emit = defineEmits<{
  deleted: [id: number, type: string]
  update: [id: number, type: string]
}>()

async function deleteNote() {
  await notes.deleteNote(props.id)
  emit('deleted', props.id, props.type)
}

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
      <Icon
        :icon="editHighlightAsset"
        :icon-hover="editAsset"
        @click.prevent="$emit('update', id, type)"
      />
      <Icon
        @click.prevent="deleteNote"
        :icon="deleteHighlightAsset"
        :icon-hover="deleteAsset"
        class="delete-icon"
      />
    </div>
  </div>
</template>

<style scoped>
.note {
  padding-bottom: var(--gutter-space-half);
  display: grid;
  grid-template-areas:
    ' created '
    ' note '
    ' buttons ';

  .created {
    border-top: 1px solid black;
    padding-top: var(--gutter-space-half);
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
