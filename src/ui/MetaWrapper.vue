<!-- Parent.vue -->
<template>
  <div>
    <h1>Parent Component</h1>

    <!-- Render the discovered foo slots here -->
    <div v-for="(slot, index) in iconSlots " :key="index">
      <component :is="slot" />
    </div>

    <!-- Slot for child components -->
    <slot></slot>
  </div>
</template>

<script>
import { ref, provide } from 'vue'

export default {
  name: 'MetaWrapper',
  setup() {
    const iconSlots = ref([])

    const registerIconSlot = (slot) => {
      iconSlots.value.push(slot)
    }

    provide('registerIconSlot', registerIconSlot)

    return {
      iconSlots: iconSlots
    }
  }
}
</script>