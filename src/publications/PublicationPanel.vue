<script setup lang="ts">


import { inject, onMounted, useSlots } from 'vue'
import type { RegisterChildFunction } from '@/publications/input'

const slots = useSlots()

const props = defineProps<{ plugin: string; icon?: string; iconHover?: string }>()

const registerChild = inject<RegisterChildFunction>('registerPublicationPanel')!

onMounted(() => {
  if (slots.panel) {
    registerChild({
      icon: { icon: props.icon!, iconHover: props.iconHover! },
      panel: slots.panel,
      selected: false,
      plugin: props.plugin
    })
  }
})
</script>
<template>
  <div></div>
</template>
