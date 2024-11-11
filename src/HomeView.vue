<script lang="ts" setup>
// import InputWrapper from '@/ui/input/InputWrapper.vue'
// import InputTools from '@/ui/InputTools.vue'
import { ref } from 'vue'
//
// const userInput = ref<string>('')
import InputWrapper from '@/ui/input/InputWrapper.vue'
import Markdown from '@/ui/markdown/Markdown.vue'

const blog = ref<string>('')
</script>

<template>
  <h1>Home</h1>

  <!--  <WYSIWYG />-->
  <fieldset>
    <legend>a nice form</legend>
    <div class="pure-control-group">
      <label for="title">input </label>
      <InputWrapper v-model="blog">
        <textarea type="text" id="title" rows="10" name="title" :value="blog"></textarea>
        <Markdown v-model="blog" />
      </InputWrapper>
    </div>
  </fieldset>

  <!--  <form class="pure-form pure-form-stacked">
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
  <div>what did the user type? {{ userInput }}</div>-->
</template>
