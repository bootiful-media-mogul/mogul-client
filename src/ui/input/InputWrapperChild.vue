<script>
import { inject, onMounted } from 'vue'

export default {
  name: 'InputWrapperChild',
  setup(props, { slots }) {
    const registerChild = inject('registerChild')
    onMounted(() => {
      if (slots.panel && slots.icon) {
        registerChild({
          iconVisible: false,
          panelVisible: false,
          panel: slots.panel,
          icon: slots.icon
        })
        console.log('registering ...')
      }
    })
  }
}
</script>

<template>
  <div></div>
</template>
