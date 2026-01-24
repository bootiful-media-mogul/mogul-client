<script lang="ts" setup>
import { inject, onMounted, useSlots, computed } from 'vue'
import type { RegisterTabFunction, GetActiveTabFunction } from '@/layout/tabbar'

interface Props {
  label: string
}

const props = defineProps<Props>()
const slots = useSlots()
const registerTab = inject<RegisterTabFunction>('registerTab')
const getActiveTab = inject<GetActiveTabFunction>('getActiveTab')

// Generate a unique ID based on the label
const tabId = computed(() => {
  return props.label.toLowerCase().replace(/\s+/g, '-')
})

const isActive = computed(() => {
  return getActiveTab?.() === tabId.value
})

onMounted(() => {
  if (slots.default && registerTab) {
    registerTab({
      id: tabId.value,
      label: props.label,
      slot: slots.default,
      visible: true
    })
  }
})
</script>

<template>
  <div class="tab-wrapper" :class="{ 'tab-hidden': !isActive }">
    <slot></slot>
  </div>
</template>

<style scoped>
/* Mobile: hide inactive tabs */
.tab-hidden {
  display: none !important;
}

/* Desktop: show all tabs, use contents to not interfere with grid */
@container app (min-width: 900px) {
  .tab-wrapper {
    display: contents;
  }

  .tab-hidden {
    display: contents !important;
  }
}
</style>
