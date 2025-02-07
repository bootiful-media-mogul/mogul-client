<template>
  <!--
    were going to draw a toolbar, with icons in them, 
    using the slots in the nested components. 
  -->
  <slot />
  <div>
    <div class="toolbar">
      <div v-for="(slot, index) in childSlots" :key="index">
        <div class="toolbar-icon">
          <Icon
            :alt="slot.plugin"
            :width="50"
            :icon="slot.icon.icon"
            :icon-hover="slot.icon.iconHover"
            @click.prevent="showPanelForSlot(slot)"
          />
        </div>
      </div>
    </div>
    <div>
      <div v-for="(slot, index) in childSlots" :key="index">
        <component :is="slot.panel" v-if="slot.selected" />
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
  border-radius: var(--radius);
  background-color: black;
}

.toolbar-icon:hover {
  background-color: white;
}
</style>

<script lang="ts" setup>
import Icon from '@/ui/Icon.vue'
import { provide, ref } from 'vue'
import type { PanelSlot } from '@/publications/input'

const childSlots = ref<Array<PanelSlot>>([])

function showPanelForSlot(slot: PanelSlot) {
  childSlots.value.forEach((s) => {
    s.selected = slot.plugin === s.plugin
  })
}

const registerChild = (slotPair: PanelSlot) => {
  if (childSlots.value.filter((slot) => slot.plugin == slotPair.plugin).length == 0)
    childSlots.value.push(slotPair)
}

provide('registerPublicationPanel', registerChild)
</script>
