<script lang="ts">
import pencilIcon from '@/assets/images/edit.png'
import pencilIconHighlight from '@/assets/images/edit-highlight.png'
import InputWrapper from '@/ui/input/InputWrapper.vue'
import InputTools from '@/ui/InputTools.vue'

export default {
  name: 'HomeView',
  components: {
    InputTools,
    InputWrapper
  },
  methods: {},
  data() {
    return {
      userInput: '',
      aiIcon: pencilIcon,
      aiIconHighlight: pencilIconHighlight
    }
  }
}
</script>

<template>
  <h1>Home</h1>
  
  
  <form class="pure-form pure-form-stacked">
    <fieldset>
      <legend>a nice form</legend>

      <div class="pure-control-group">
        <label for="title">input </label>

        <InputWrapper v-model="userInput">

          <textarea type="text" id="title" rows="10" name="title" :value="userInput"></textarea>

          <InputTools v-model="userInput" />

        </InputWrapper>
      </div>

      <div class="pure-controls">
        <button class="pure-button pure-button-primary" type="submit" value="create">
          do the thing
        </button>
      </div>
    </fieldset>
  </form>

  <div>what did the user type? {{ userInput }}</div>
  
</template>
