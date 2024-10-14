<template>
  <InputWrapperChild>
    <template v-slot:panel> the default b {{ userInput }}</template>
    <template v-slot:icon>B</template>
  </InputWrapperChild>
</template>
<script lang="ts">

import InputWrapperChild from '@/ui/input/InputWrapperChild.vue'

export default {
  name: 'FakeWritingTools',
  components: { InputWrapperChild },


  props: {
    userInput: {
      type: String,
      default: ''
    }
  }
}
</script>