<script setup lang="ts">
import { ref } from 'vue'

const transcript = ref<string>()

</script>
<template>
  <form ref="el" class="pure-form pure-form-stacked">
    <fieldset>
      <div class="pure-control-group">
        <label for="transcript">
          {{ $t('transcripts.text') }}
        </label>
        <textarea id="transcript" required v-model="transcript" rows="10" />
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