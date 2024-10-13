
<!-- Child.vue -->
<template>
  <div>
    <h2>Child Component</h2>
    <slot name="default"></slot>
  </div>
</template>

<script>
import { inject, onMounted } from 'vue';

export default {
  name: 'MetaWrapperChild',
  setup(props, { slots }) {
    const registerFooSlot = inject('registerFooSlot');

    onMounted(() => {
      if (slots.foo) {
        registerFooSlot(slots.foo);
      }
    });
  }
};
</script>