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

.private-password-preview-link:hover, .private-password-preview-link.clicked {
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

import {formInputForLabel, positionIconRelativeToFormInputForParentLabel} from '@/components'

export default {
  data() {
    return {
      description: ''
    }
  },
  mounted() {
    const icon = this.$refs.icon as HTMLElement
    positionIconRelativeToFormInputForParentLabel(icon)

  },

  setup(props, ctx) {
    return {}
  },

  methods: {
    togglePreview: function(e: Event) {

      e.preventDefault()

      const icon = this.$refs.icon as HTMLElement

      const input = formInputForLabel(icon.parentElement as HTMLElement) as HTMLInputElement

      const opsToState = new Map<string, string>()
      opsToState.set('text', 'add')
      opsToState.set('password', 'remove')

      input.type = input.type.toLowerCase() === 'password' ? 'text' : 'password'
      const op: string = opsToState.get(input.type) as string

      if (op == 'add') {
        icon.classList.add('clicked')
      } //
      else {
        icon.classList.remove('clicked')
      }
    }
  }
}
</script>
