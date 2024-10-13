<script lang="ts">

// import InputWrapper from '@/ui/InputWrapper.vue'
import MetaWrapper from '@/ui/MetaWrapper.vue'
import MetaWrapperChild from '@/ui/MetaWrapperChild.vue'

export default {
  components: {
    MetaWrapperChild,
    MetaWrapper
    // InputWrapper
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


  <MetaWrapper>
    <MetaWrapperChild>
      <template v-slot:icon> a</template>
    </MetaWrapperChild>
    <MetaWrapperChild>
      <template v-slot:icon>b</template>
    </MetaWrapperChild>
  </MetaWrapper>


  <!--
  
    <form class="pure-form pure-form-stacked">
      <fieldset>
        <legend>Simple form to remove later</legend>
        <div class="pure-control-group">
          <label for="title">some text we need input on</label>
          <InputWrapper v-model="userInput">
            <InputWrapper>
              <textarea :value="userInput" /> 
              <template v-slot:panel>
                this is another panel
              </template>
            </InputWrapper>
            <template v-slot:panel>
              this is the panel
            </template>
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
  -->

</template>
