<script lang="ts">
/*
import InputWrapper from '@/ui/input/InputWrapper.vue'
import InputWrapperChild from '@/ui/input/InputWrapperChild.vue'
import InputWrapperMenuButton from '@/ui/input/InputWrapperMenuButton.vue'
import WritingAssistant from '@/writing/WritingAssistant.vue'
*/

import pencilIcon from '@/assets/images/edit.png'
import pencilIconHighlight from '@/assets/images/edit-highlight.png'
import InputWrapper from '@/ui/input/InputWrapper.vue'
import WritingAssistant from '@/writing/WritingAssistant.vue'
import MarkdownPreview from '@/markdown/MarkdownPreview.vue'

export default {
  name: 'HomeView',
  components: {
    MarkdownPreview,
    WritingAssistant,
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

          <MarkdownPreview v-model="userInput" />
          <WritingAssistant v-model="userInput" />

          <!--          <InputWrapperChild>
            <template v-slot:icon>
              <InputWrapperMenuButton :icon="aiIcon" :icon-hover="aiIconHighlight" />
            </template>

            <template v-slot:panel>
              the default a {{ userInput }}

              <a href="#" @click="console.log('moo')">moo</a>
            </template>
          </InputWrapperChild>-->
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
