<script setup lang="ts">
defineProps<{
  text: string
  title?: string
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<template>
  <div
    type="button"
    class="text-icon"
    :title="title"
    @click.prevent="handleClick"
  >
    {{ text }}
  </div>
</template>

<style scoped>
.text-icon {
  --button-size: calc(3 * var(--gutter-space-half));
  font-size: calc(0.8 * var(--button-size));
  font-weight: bolder;
  background-color: black;
  color: white;
  border: 1px solid black;
  border-radius: 50%;
  width: var(--button-size);
  height: var(--button-size);
  cursor: pointer;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-icon:hover {
  background-color: #333;
}
</style>
