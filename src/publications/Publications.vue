<template>
  <!--
    were going to draw a toolbar, with icons in them, 
    using the slots in the nested components. 
  -->
  <slot />

  <div class="toolbar">
    <div v-for="(slot, index) in childSlots" :key="index">
      <Icon :width="200" :icon="slot.icon.icon" :icon-hover="slot.icon.iconHover" />
      {{ slot.icon.iconHover }}
      <component :is="slot.panel" />
    </div>
  </div>
</template>
<style scoped>
</style>
<script lang="ts" setup>
import Icon from '@/ui/Icon.vue'

const childSlots = ref<Array<PanelSlot>>([])

import { onMounted, provide, ref } from 'vue'
import type { PanelSlot } from '@/publications/input'

const registerChild = (slotPair: PanelSlot) => {
  if (childSlots.value.filter((slot) => slot.plugin == slotPair.plugin).length == 0)
    childSlots.value.push(slotPair)
}

// provide for nested components
provide('registerPublicationPanel', registerChild)

onMounted(() => {
  
  
})
</script>
