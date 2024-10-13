<!-- Parent.vue -->
<template>
  <div>
    <h1>Parent Component</h1>

    <!-- Render the discovered foo slots here -->
    <div v-for="(slot, index) in fooSlots.reverse()" :key="index">
      <component :is="slot" />
    </div>

    <!-- Slot for child components -->
    <slot></slot>
  </div>
</template>

<script>
import { ref, provide, onMounted } from 'vue';

export default {
  name: 'MetaWrapper',
  setup() {
    const fooSlots = ref([]);

    const registerFooSlot = (slot) => {
      fooSlots.value.push(slot);
    };

    provide('registerFooSlot', registerFooSlot);

    return {
      fooSlots
    };
  }
};
</script>