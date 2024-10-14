<!-- Child.vue -->
<template>
  <div>
    <h2>Child Component</h2>
    <slot name="default"></slot>
  </div>
</template>

<script>
import { inject, onMounted } from 'vue'

export default {
  name: 'MetaWrapperChild',
  setup(props, { slots }) {
    const registerChild = inject('registerChild')
    onMounted(() => {
      if (slots.default && slots.icon) {
        registerChild({ default: slots.default, icon: slots.icon })
        console.log('registering ...')
      }
    })
  }
}
</script>