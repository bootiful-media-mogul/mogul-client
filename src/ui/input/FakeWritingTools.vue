<template>
  <InputWrapperChild>
    <template v-slot:panel> the default b {{ userInput }}</template>
    <template v-slot:icon>
      <InputWrapperMenuButton :icon="privacyAsset" />
    </template>
  </InputWrapperChild>
</template>
<script lang="ts">
import privacyAsset from '@/assets/images/preview-highlight.png'
import InputWrapperChild from '@/ui/input/InputWrapperChild.vue'
import InputWrapperMenuButton from '@/ui/input/InputWrapperMenuButton.vue'

export default {
  name: 'FakeWritingTools',
  components: { InputWrapperMenuButton, InputWrapperChild },
  data() {
    return {
      privacyAsset
    }
  },
  props: {
    userInput: {
      type: String,
      default: ''
    }
  }
}
</script>
