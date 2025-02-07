<template>
  <!--
    were going to draw a toolbar, with icons in them, 
    using the slots in the nested components. 
  -->
  <slot />

  <div class="toolbar">
    <div v-for="(slot, index) in childSlots" :key="index">
      <div class="toolbar-icon">
        <Icon :width="50" :icon="slot.icon.icon" :icon-hover="slot.icon.iconHover" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.toolbar {
  display: grid;
  grid-template-columns: repeat(auto-fill, 50px);
  gap: calc(var(--gutter-space) / 3);
  align-items: center;
}

.toolbar-icon {
  border-radius: calc(var(--gutter-space) / 3);
  border: 1px solid black;
}
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

onMounted(() => {})
</script>
