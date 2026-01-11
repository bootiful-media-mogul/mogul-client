<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NoteEditor from '@/notes/NoteEditor.vue'
import { events, notes } from '@/services'

const el = ref<HTMLElement>()

/* internal representation */
class UiNote {
  readonly id: number
  readonly note: string
  readonly type: string
  constructor(id: number, note: string, type: string) {
    this.id = id
    this.note = note
    this.type = type
  }
}

const mogulNotes = ref<UiNote[]>([])

async function mogul(): Promise<Array<UiNote>> {
  // call the notes service and load the mogul-wide notes.
  const items = await notes.notesForMogul()
  const arr: Array<UiNote> = []
  for (const item of items) {
    arr.push(new UiNote(item.id, item.note, item.type))
  }
  return arr
}

async function expandIfNotesAvailable(): Promise<void> {
  if (mogulNotes.value.length > 0) {
    // todo publish the event to open this component
    events.emit('sidebar-panel-opened', el.value)
  }
}

onMounted(async () => {
  mogulNotes.value = await mogul()
  await expandIfNotesAvailable()
})
</script>

<template>
  <div ref="el">

    <div>
      <textarea />
      <div>
        <button>global note</button>
        <button>note for episode</button>
      </div>
    </div>

    <div v-for="note in mogulNotes" :key="note.id">
      <NoteEditor :id="note.id" :note="note.note" :type="note.type" />
    </div>
  </div>
  <!--
 todo:
  - by default we should load all system-wide Mogul notes
  - then we should load the notes for whatever is in view. how do we determine that? each page (episodes, posts, etc.)
    will publish an event indicating the notable id and the type.
  - there should be some reusable component to let us view or edit a note. so, we can iterate over a list of Note-s
--></template>

<style scoped></style>
