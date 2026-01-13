<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NoteEditor from '@/notes/NoteEditor.vue'
import { events, mogul, Note, notes } from '@/services'
import InputWrapper from '@/ui/input/InputWrapper.vue'
import InputTools from '@/ui/InputTools.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const el = ref<HTMLElement>()

/* internal representation */
class UiNote {
  readonly id: number

  readonly note: string

  readonly type: string

  readonly created: number

  constructor(id: number, note: string, type: string, created: number) {
    this.id = id
    this.note = note
    this.type = type
    this.created = created
  }
}

const defaultId = -1
const noteText = ref<string>('')
const mogulNotes = ref<UiNote[]>([])
const id = ref<number>(defaultId)
const mogulId = ref<number>(-1)

async function resultsToUiNotes(items: Array<Note>) {
  const arr: Array<UiNote> = []
  for (const item of items) {
    arr.push(new UiNote(item.id, item.note, item.type, item.created))
  }
  return arr
}

async function getMogulNotes(): Promise<Array<UiNote>> {
  const items = await notes.notesForNotable(mogulId.value, 'mogul')
  return resultsToUiNotes(items)
}

async function saveNote() {
  if (id.value > 0) {
    await notes.updateNote(id.value, noteText.value)
  } //
  else {
    await notes.createNote(noteText.value)
  }
  await reload()
  await clear()
}

async function expandIfNotesAvailable(): Promise<void> {
  if (mogulNotes.value.length > 0) {
    events.emit('sidebar-panel-opened', el.value)
  }
}

async function clear() {
  noteText.value = ''
  id.value = defaultId
}

async function reload() {
  mogulNotes.value = await getMogulNotes()
  await expandIfNotesAvailable()
}

onMounted(async () => {
  mogulId.value = (await mogul.user()).id
  await reload()
})

async function loadIntoEditor(note: UiNote) {
  noteText.value = note.note
  id.value = note.id
}
</script>
<!--
todo we'll have an event that loads this note composition form and specifies an Notable entity.
    by default, if not specified. the note will be for the Mogul (system-wide)
    otherwise, it'll be for the selected item. (unless they user clicks cancel in which case it'll
    revert back to the Mogul). So, we'll parameterize this prompt to indicate to what
    entity we're attaching this note.

todo:
- by default we should load all system-wide Mogul notes
- then we should load the notes for whatever is in view ('contextual notes').
  how do we determine that? each page (episodes, posts, etc.)
  will publish an event indicating the notable id and the type.
- there should be some reusable component to let us view or edit a note. so, we can iterate over a list of Note-s
-->
<template>
  <form ref="el" class="pure-form pure-form-stacked">
    <fieldset>
      <div class="note-composition">
        <div class="pure-control-group">
          <label for="note">
            {{ t('notes.new.prompt') }}
          </label>

          <InputWrapper v-model="noteText">
            <textarea id="transcript" v-model="noteText" required rows="10" />
            <InputTools v-model="noteText" />
          </InputWrapper>
        </div>
        <div>
          <span class="save">
            <button
              :class="'pure-button pure-button-primary '"
              type="submit"
              @click.prevent="saveNote"
              :disabled="noteText.length === 0"
            >
              {{ t('transcripts.buttons.save') }}
            </button>
          </span>
          <span class="cancel">
            <button
              :class="'pure-button '"
              :disabled="noteText.length === 0"
              type="submit"
              @click.prevent="clear"
            >
              {{ t('transcripts.buttons.cancel') }}
            </button>
          </span>
        </div>
      </div>
      <div class="existing-notes">
        <div class="panel-menu-subtitle notes-section">
          {{ t('notes.system-wide.title') }}
        </div>
        <div v-for="note in mogulNotes" :key="note.id">
          <NoteEditor
            :created="note.created"
            :id="note.id"
            :note="note.note"
            :type="note.type"
            @deleted="reload"
            @update="loadIntoEditor(note)"
          />
        </div>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
.notes-section {
  padding-bottom: var(--gutter-space-half);
  padding-top: var(--gutter-space-half);
}

.note-composition {
  padding-bottom: var(--gutter-space);
}
</style>
