<script lang="ts">

import InputWrapper from '@/ui/input/InputWrapper.vue'
import InputWrapperChild from '@/ui/input/InputWrapperChild.vue'
import InputWrapperMenuButton from '@/ui/input/InputWrapperMenuButton.vue'
import pencilIcon from '@/assets/images/edit-highlight.png'
import FakeWritingTools from '@/ui/input/FakeWritingTools.vue'


export default {
  name: 'HomeView',
  components: {
    FakeWritingTools,
    InputWrapperMenuButton,
    InputWrapper,
    InputWrapperChild
  },
  methods: {
 

  },
  data() {
    return {
      userInput: '' ,
      aiIconHighlight : pencilIcon 
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
          <textarea type="text" id="title" name="title" :value="userInput" />

          <InputWrapperChild>
            <template v-slot:icon>
              <InputWrapperMenuButton :icon="aiIconHighlight" />
            </template>
            <template v-slot:panel> the default a {{ userInput }}</template>
          </InputWrapperChild>
          
          <FakeWritingTools/>
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
