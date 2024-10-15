<!-- Parent.vue -->
<template>
  <div>
    <h1>Parent Component</h1>

    <!-- Render the discovered foo slots here -->
    <div v-for="(slot, index) in childSlots" :key="index">
      <div>
        icon:
        <component :is="slot.icon" />
      </div>
      <div>
        default:
        <component :is="slot.default" />
      </div>
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
    const childSlots = ref([])

    const registerChild = (slotPair) => {
      childSlots.value.push(slotPair)
    }

    provide('registerChild', registerChild)

    return {
      childSlots: childSlots
    }
  }
}
</script>
