<template>
  <a ref="icon" class="private-password-preview-link" href="#" @click="togglePreview"></a>
</template>

<style>
.private-password-preview-link {
  --icon-size: 3em;

  background: url('../assets/images/privacy-preview.png');

  height: var(--icon-size);
  width: var(--icon-size);

  background-size: var(--icon-size) var(--icon-size);
  background-repeat: no-repeat;
  background-position: left;
}

.private-password-preview-link:hover,
.private-password-preview-link.clicked {
  background: url('../assets/images/privacy-preview-highlight.png');
  background-size: var(--icon-size) var(--icon-size);
  background-repeat: no-repeat;
  background-position: left;
}

label .private-password-preview-link {
  position: absolute;
  padding-top: var(--icon-size);
}
</style>

<script lang="ts">
import { formInputForLabel, positionIconRelativeToFormInputForParentLabel } from '@/components'

export default {
  data() {
    return {
      description: ''
    }
  },
  mounted() {
    positionIconRelativeToFormInputForParentLabel(this.$refs.icon as HTMLElement)
  },
  methods: {
    togglePreview: function (e: Event) {
      e.preventDefault()
      const icon = this.$refs.icon as HTMLElement
      const input = formInputForLabel(icon.parentElement as HTMLElement) as HTMLInputElement
      input.type = input.type.toLowerCase() === 'password' ? 'text' : 'password'
      if (input.type == 'text') {
        icon.classList.add('clicked')
      } //
      else {
        icon.classList.remove('clicked')
      }
    }
  }
}
</script>
