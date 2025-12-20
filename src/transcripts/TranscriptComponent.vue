<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import {
  events,
  Notification,
  notifications,
  type TranscriptEditEvent,
  transcripts
} from '@/services'
import InputTools from '@/ui/InputTools.vue'
import InputWrapper from '@/ui/input/InputWrapper.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const transcript = ref<string>('')
const el = ref<HTMLElement>()
const dirty = ref<boolean>()
const key = ref<string>('')
const transcriptId = ref<number>(0)
const fresh = ref<boolean>(true)
const busy = ref<boolean>(false)

onMounted(async () => {
  // Event Listeners
  notifications.listenForCategory(
    'transcript-processed-event',
    async (notification: Notification) => {
      const idOfThingWithTranscript = parseInt(notification.key)
      const incoming = parseInt(idOfThingWithTranscript + '')
      const existing = parseInt(transcriptId.value + '')
      if (incoming === existing) {
        transcript.value = '' + notification.context
      }
      busy.value = false
      dirty.value = false
      fresh.value = true
    }
  )
})

events.on('transcript-edit-event', async (event) => {
  const editEvent: TranscriptEditEvent = event as TranscriptEditEvent
  transcript.value = '' + (editEvent.transcript == null ? '' : editEvent.transcript)
  key.value = editEvent.key
  transcriptId.value = editEvent.id
  dirty.value = false
  events.emit('sidebar-panel-opened', el.value)
})

function isDirty() {
  return !fresh.value && dirty.value
}

const cancel = () => {
  key.value = ''
  transcriptId.value = 0
  transcript.value = ''
  fresh.value = true
  dirty.value = false
}

const refresh = async () => {
  await transcripts.refreshTranscript(transcriptId.value)
  busy.value = true
  dirty.value = false
}

watch(
  () => transcript.value,
  (o: string, n: string) => {
    if (fresh.value) {
      fresh.value = false
    } //
    else {
      dirty.value = true
    }
  }
)

notifications.listenForCategory(
  'transcript-completed-event',
  async (notification: Notification) => {
    const context = JSON.parse(notification.context)
    const ctxTranscriptId = context['transcriptId']
    if (ctxTranscriptId != transcriptId.value) {
      return
    }
    transcript.value = context.transcript
    busy.value = false
  }
)

const saveTranscript = async () => {
  await transcripts.writeTranscript(transcriptId.value, transcript.value)
  dirty.value = false
}
</script>
<template>
  <form ref="el" class="pure-form pure-form-stacked">
    <fieldset>
      <div class="pure-control-group">
        <label v-if="key" for="transcript">
          {{
            t('transcripts.text', {
              key: t(key),
              id: transcriptId
            })
          }}
        </label>

        <InputWrapper v-model="transcript">
          <textarea id="transcript" v-model="transcript" :disabled="busy" required rows="10" />
          <InputTools v-model="transcript" />
        </InputWrapper>
      </div>
      <div>
        <span class="refresh">
          <button class="pure-button" type="submit" @click.prevent="refresh">
            {{ t('transcripts.buttons.refresh') }}
          </button>
        </span>
        <span class="save">
          <button
            :class="'pure-button pure-button-primary ' + (isDirty() ? '' : 'disabled')"
            type="submit"
            @click.prevent="saveTranscript"
          >
            {{ t('transcripts.buttons.save') }}
          </button>
        </span>

        <span class="cancel">
          <button
            :class="'pure-button ' + (isDirty() ? '' : 'disabled')"
            type="submit"
            @click.prevent="cancel"
          >
            {{ t('transcripts.buttons.cancel') }}
          </button>
        </span>
      </div>
    </fieldset>
  </form>
</template>
