<script lang="ts">
import { defineComponent, inject, onMounted } from 'vue'

import type { Slot } from 'vue'
import type { RegisterChildFunction } from '@/ui/input/input'

export default defineComponent({
  name: 'InputWrapperChild',
  setup(_, { slots }) {
    const registerChild = inject<RegisterChildFunction>('registerChild')

    onMounted(() => {
      if (slots.panel && slots.icon && registerChild) {
        registerChild({
          iconVisible: false,
          panelVisible: false,
          panel: slots.panel,
          icon: slots.icon
        })
        console.log('registering ...')
      }
    })

    return {}
  }
})
</script>

<template>
  <div></div>
</template>
