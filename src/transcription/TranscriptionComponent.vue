<script setup lang="ts">
import { ref } from 'vue'
import { events } from '@/services'
import InputTools from '@/ui/InputTools.vue'
import InputWrapper from '@/ui/input/InputWrapper.vue'

const transcript = ref<string>('')
const el = ref<HTMLElement>()

events.on('edit-transcript-event', async (event) => {
  console.log('received an event for a transcript ' + event)
  transcript.value = '' + event
  events.emit('sidebar-panel-opened', el.value)
})
</script>
<template>
  <form ref="el" class="pure-form pure-form-stacked">
    <fieldset>
      <div class="pure-control-group">
        <label for="transcript">
          {{ $t('transcripts.text') }}
        </label>
        <InputWrapper v-model="transcript">
          <textarea id="transcript" required v-model="transcript" rows="10" />
          <InputTools v-model="transcript" />
        </InputWrapper>
      </div>
      <div>
        <span class="save">
            <button
              type="submit"
              class="pure-button pure-button-primary"
            >
              {{ $t('transcripts.buttons.save') }}
            </button>
        </span>

        <span class="cancel">
            <button
              type="submit"
              class="pure-button pure-button-primary"
            >
              {{ $t('transcripts.buttons.cancel') }}
            </button>
          </span>

      </div>


    </fieldset>
  </form>
</template>