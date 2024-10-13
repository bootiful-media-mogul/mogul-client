
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
    const registerIconSlot = inject('registerIconSlot');

    onMounted(() => {
      if (slots.icon) {
        registerIconSlot(slots.icon);
      }
    });
  }
};
</script>