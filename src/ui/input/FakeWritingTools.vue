<template>
  <InputWrapperChild>
    <template v-slot:panel> the default b {{ userInput }}</template>
    <template v-slot:icon>
      <InputWrapperMenuButton :icon="privacyAsset" :icon-hover="privacyAssetHighlight" />
    </template>
  </InputWrapperChild>
</template>
<script lang="ts">
import privacyAsset from '@/assets/images/preview.png'
import privacyAssetHighlight from '@/assets/images/preview-highlight.png'
import InputWrapperChild from '@/ui/input/InputWrapperChild.vue'
import InputWrapperMenuButton from '@/ui/input/InputWrapperMenuButton.vue'

export default {
  name: 'FakeWritingTools',
  components: { InputWrapperMenuButton, InputWrapperChild },
  data() {
    return {
      privacyAssetHighlight,
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
