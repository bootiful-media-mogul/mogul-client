<template>
  <a ref="link" class="ai-workshop-it-link" href="#" @click="workshop"></a>
</template>

<style>
.ai-workshop-it-link {
  background: url('../assets/images/ai-icon-highlight.png');
  height: var(--icon-size);
  width: var(--icon-size);
  background-size: var(--icon-size) var(--icon-size);
  background-repeat: no-repeat;
  background-position: left;
}

.ai-workshop-it-link:hover {
  background: url('../assets/images/ai-icon.png');
  background-size: var(--icon-size) var(--icon-size);
  background-repeat: no-repeat;
  background-position: left;
}

label .ai-workshop-it-link {
  position: absolute;
  padding-top: calc(var(--icon-size) - calc(var(--icon-size) / 2));
}
</style>

<script lang="ts">
import { AiWorkshopReplyEvent, workshopInAi } from '@/services'
import { positionIconRelativeToFormInputForParentLabel } from '@/components'

export default {
  emits: ['ai-workshop-completed'],
  props: ['text', 'prompt'],
  data() {
    return {
      description: ''
    }
  },
  mounted() {
    const aiIcon = this.$refs.link as HTMLElement
    positionIconRelativeToFormInputForParentLabel(aiIcon, (value) => value)
  },

  setup(props, ctx) {
    return {
      callbackFunction: (updated: AiWorkshopReplyEvent) => ctx.emit('ai-workshop-completed', updated)
    }
  },

  methods: {
    workshop(e: Event) {
      e.preventDefault()
      const prompt =
        this.prompt == null || this.prompt.trim() == ''
          ? this.text
          : this.prompt + '\n\n' + this.text
      workshopInAi(this.callbackFunction, prompt)
    }
  }
}
</script>
