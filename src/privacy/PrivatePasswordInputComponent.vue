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
// import { AiWorkshopReplyEvent, workshopInAi } from '@/services'

import { formInputForLabel, positionIconRelativeToFormInputForParentLabel } from '@/components'

export default {
  // emits: ['ai-workshop-completed'],
  // props: ['text', 'prompt'],
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
    //   callbackFunction: (updated: AiWorkshopReplyEvent) =>
    //     ctx.emit('ai-workshop-completed', updated)
    // }
  },

  methods: {
    togglePreview(e: Event) {
      e.preventDefault()
      const icon = this.$refs.icon as HTMLElement
      const input = formInputForLabel(icon.parentElement as HTMLElement) as HTMLInputElement
      // console.log('the input is ' , input.type )
      const isPrivate = input.type.toLowerCase() === 'password'
      input.type = isPrivate ? 'text' : 'password'

      if (isPrivate)
        icon.classList.add('clicked')
      else
        icon.classList.remove('clicked')
    }
  }
}
</script>
