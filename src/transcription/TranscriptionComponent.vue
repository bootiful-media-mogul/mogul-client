<script lang="ts" setup>
import { ref, watch } from 'vue'
import { events, type TranscriptEditEvent } from '@/services'
import InputTools from '@/ui/InputTools.vue'
import InputWrapper from '@/ui/input/InputWrapper.vue'

const transcript = ref<string>('')
const el = ref<HTMLElement>()
const dirty = ref<boolean>()
const key = ref<string>('')
const id = ref<number>(0)
const fresh = ref<boolean>(true)

events.on('edit-transcript-event', async (event) => {
  const editEvent: TranscriptEditEvent = event as TranscriptEditEvent

  transcript.value = '' + editEvent.transcript
  key.value = editEvent.key
  id.value = editEvent.id

  dirty.value = false

  events.emit('sidebar-panel-opened', el.value)
})

function isDirty() {
  return !fresh.value && dirty.value
}

const cancel = () => {
  key.value = ''
  id.value = 0
  transcript.value = ''
  fresh.value = true
  dirty.value = false
}

watch(
  () => transcript.value,
  (o: string, n: string) => {
    if (fresh.value) {
      fresh.value = false
    } else {
      console.log('you changed something')
      dirty.value = true
    }
  }
)

const saveTranscript = () => {
  events.emit('transcript-edited-event', {
    key: key.value,
    transcript: transcript.value,
    id: id.value
  })
  dirty.value = false
}
</script>
<template>
  <form ref="el" class="pure-form pure-form-stacked">
    <fieldset>
      <div class="pure-control-group">
        <label v-if="key" for="transcript">
          {{
            $t('transcripts.text', {
              key: $t(key),
              id: id
            })
          }}
        </label>

        <InputWrapper v-model="transcript">
          <textarea id="transcript" v-model="transcript" required rows="10" />
          <InputTools v-model="transcript" />
        </InputWrapper>
      </div>
      <div>
        <span class="save">
          <button
            :class="'pure-button pure-button-primary ' + (isDirty() ? '' : 'disabled')"
            type="submit"
            @click.prevent="saveTranscript"
          >
            {{ $t('transcripts.buttons.save') }}
          </button>
        </span>

        <span class="cancel">
          <button
            :class="'pure-button ' + (isDirty() ? '' : 'disabled')"
            type="submit"
            @click.prevent="cancel"
          >
            {{ $t('transcripts.buttons.cancel') }}
          </button>
        </span>
      </div>
    </fieldset>
  </form>
</template>
