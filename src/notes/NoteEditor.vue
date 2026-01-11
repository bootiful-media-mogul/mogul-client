<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{
  deleted: [id: number, type: string]
  updated: [id: number, type: string]
}>()

const props = defineProps<{
  id: number
  note: string
  type: string
}>()
</script>

<template>
  <div class="note">
    <div class="note">
      {{ note }}
    </div>
    <div class="buttons">
      <button value="edit">save</button>
    </div>
  </div>
</template>

<style scoped>
.note {
  padding-bottom: var(--gutter-space);
  display: grid;
  grid-template-areas:
    ' note '
    ' buttons ';
  .note {
    border-top: 1px solid black;
    padding-top: var(--gutter-space);
    grid-area: note;
  }
  .buttons {
    grid-area: buttons;
  }
}
</style>
