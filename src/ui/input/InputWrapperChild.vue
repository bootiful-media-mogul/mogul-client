<script setup lang="ts">
import { inject, onMounted } from 'vue'
import type { RegisterChildFunction } from '@/ui/input/input'

import { useSlots } from 'vue'

const slots = useSlots()
const registerChild = inject<RegisterChildFunction>('registerChild')

onMounted(() => {
  if (slots.panel && slots.icon && registerChild) {
    registerChild({
      iconVisible: false,
      panelVisible: false,
      panel: slots.panel,
      icon: slots.icon
    })
  }
})
</script>
<template>
  <div></div>
</template>
