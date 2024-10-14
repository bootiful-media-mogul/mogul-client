<script lang="ts">

import InputWrapper from '@/ui/input/InputWrapper.vue'
import InputWrapperChild from '@/ui/input/InputWrapperChild.vue'

export default {
  name: 'HomeView',
  components: {
    InputWrapper,
    InputWrapperChild
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
      <legend>a nice form
      </legend>
      <div class="pure-control-group">
        <label for="title">input </label>
        <InputWrapper v-model="userInput">
          <input type="text"
                 id="title" name="title" :value="userInput" />
          <InputWrapperChild>
            <template v-slot:icon>[a]</template>
            <template v-slot:panel> the default a</template>
          </InputWrapperChild>
          <InputWrapperChild>
            <template v-slot:panel> the default b</template>
            <template v-slot:icon>[b]</template>
          </InputWrapperChild>
        </InputWrapper>


      </div>

      <div class="pure-controls">
        <button class="pure-button pure-button-primary" type="submit" value="create">
          do the thing
        </button>
      </div>
    </fieldset>
  </form>
  <div> what did the user type? {{ userInput }}</div>


  <!--

  -->

</template>
