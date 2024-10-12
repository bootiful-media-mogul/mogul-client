<script lang="ts">
// import WritingTools from '@/composition/WritingTools.vue'

import InputWrapper from '@/ui/InputWrapper.vue'

export default {
  components: {
    InputWrapper
    // WritingTools
  },
  data() {
    return {
      userInput: ''
    }
  }
}
</script>

<template>
  <h1>Home</h1>
   
  <form class="pure-form pure-form-stacked">
    <fieldset>
      <legend>Simple form to remove later</legend>
      <div class="pure-control-group">
        <label for="title"> some text we need input on </label>
        <InputWrapper v-model="userInput">
            <textarea :value="userInput" />
        </InputWrapper>
      </div>

      <div class="pure-controls">
        <button class="pure-button pure-button-primary" type="submit" value="create">
          do the thing
        </button>
      </div>
    </fieldset>
  </form>
  <div>{{ userInput }}</div>
 
</template>
