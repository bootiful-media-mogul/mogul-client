<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NoteEditor from '@/notes/NoteEditor.vue'
import { events, notes } from '@/services'
import InputWrapper from '@/ui/input/InputWrapper.vue'
import InputTools from '@/ui/InputTools.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const transcript = ref<string>('')
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

const noteText = ref<string>('')
</script>

<template>
  <form ref="el" class="pure-form pure-form-stacked">
    <fieldset>
      <div class="note-composition">
        <div class="pure-control-group">
          <label for="note">
            <!--
               todo we'll have an event that loads this note composition form and specifies an Notable entity. by default, if not specified. the note will be for the Mogul (system-wide)
                otherwise, it'll be for the selected item. (unless they user clicks cancel in which case it'll revert back to the Mogul). So, we'll parameterize this prompt to indicate to what
                entity we're attaching this note.
               -->
            {{ t('notes.new.prompt') }}
          </label>

          <InputWrapper v-model="noteText">
            <textarea id="transcript" v-model="noteText" required rows="10" />
            <InputTools v-model="noteText" />
          </InputWrapper>
        </div>
        <div>
          <span class="save">
            <button :class="'pure-button pure-button-primary '" type="submit">
              {{ t('transcripts.buttons.save') }}
            </button>
          </span>

          <span class="cancel">
            <button :class="'pure-button '" type="submit">
              {{ t('transcripts.buttons.cancel') }}
            </button>
          </span>
        </div>
      </div>
      <div class="existing-notes">
        <div v-for="note in mogulNotes" :key="note.id">
          <NoteEditor :id="note.id" :note="note.note" :type="note.type" />
        </div>
      </div>
    </fieldset>
  </form>

  <!--    -->

  <!--
 todo:
  - by default we should load all system-wide Mogul notes
  - then we should load the notes for whatever is in view. how do we determine that? each page (episodes, posts, etc.)
    will publish an event indicating the notable id and the type.
  - there should be some reusable component to let us view or edit a note. so, we can iterate over a list of Note-s
--></template>

<style scoped>

.note-composition {
  padding-bottom: var(--gutter-space);
}

</style>
