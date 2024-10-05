<script lang="ts">
import WritingTools from '@/composition/WritingTools.vue'

export default {
  components: {
    WritingTools
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
        <WritingTools v-model="userInput">
          <textarea :value="userInput" />
          <!--          <input type="text" :value="userInput" />-->
        </WritingTools>
      </div>

      <div class="pure-controls">
        <button class="pure-button pure-button-primary" type="submit" value="create">
          do the thing
        </button>
      </div>
    </fieldset>
  </form>

  <div>
    {{ userInput }}
  </div>
</template>
