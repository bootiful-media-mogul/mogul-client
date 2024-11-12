<script lang="ts" setup>
import { inject, onMounted, useSlots } from 'vue'
import type { RegisterChildFunction } from '@/ui/input/input'

const slots = useSlots()
const registerChild = inject<RegisterChildFunction>('registerChild')

onMounted(() => {
  if (slots.panel && slots.icon && registerChild) {
    registerChild({
      iconVisible: false,
      panelVisible: false,
      panel: slots.panel,
      icon: slots.icon ,
      toolbar: slots.toolbar
    })
  }
})
</script>
<template>
  <div></div>
</template>
