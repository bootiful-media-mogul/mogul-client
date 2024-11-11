<template>
  <div class="writing-tools-container">
    <div ref="root" class="input-wrapper">
      <slot></slot>
    </div>
    <div class="icon-column">
      <InputWrapperMenu
        :disabled="panelVisible || childSlots.length <= 1"
        :enableDownArrow="enableDownArrow()"
        :enableUpArrow="enableUpArrow()"
        class="icon-column-menu"
        @down="down"
        @up="up"
      >
        <div
          v-for="(slot, index) in childSlots"
          :key="index"
          class="icon unselectable"
          @click="togglePanel(slot)"
        >
          <div v-if="panelVisible && slot.iconVisible">
            <div class="close-icon"></div>
          </div>
          <div v-else>
            <component :is="slot.icon" v-if="slot.iconVisible"></component>
          </div>
        </div>
      </InputWrapperMenu>
    </div>
    <div v-if="panelVisible" class="panel">
      <div v-for="(slot, index) in childSlots" :key="index">
        <div v-if="slot.panelVisible">
          <component :is="slot.panel"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, provide, ref } from 'vue'
import InputWrapperMenu from '@/ui/input/InputWrapperMenu.vue'
import type { PanelSlot } from './input'

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
// const text = ref<String>('')
const root = ref<HTMLElement>()
const inputElement = ref<HTMLInputElement>()
const childSlots = ref<Array<PanelSlot>>([])
const events = 'input,change'.split(',')
const panelVisible = ref<boolean>(false)

const updateInputValue = (txt: string) => {
  emit('update:modelValue', txt)
  //text.value = txt
}

const updateValue = (event: Event) => {
  const elementTarget = event?.target as HTMLInputElement
  const txt = elementTarget.value
  updateInputValue(txt)
}

const registerChild = (slotPair: PanelSlot) => {
  childSlots.value.push(slotPair)
}

const readInputValue = () => {
  // console.log('readInputValue ' + inputElement.value!!.value + ' text.value=' + text.value)
  // return text.value || ''
  return inputElement.value!!.value
}

const current = (): PanelSlot | null => {
  const visible = childSlots.value.filter((slot) => slot.panelVisible)
  if (visible && visible.length > 0) {
    return visible[0]
  }
  return null
}

const enableUpArrow = (): boolean => {
  const c = current()
  if (c == null) return false
  return c !== childSlots.value[0]
}

const enableDownArrow = (): boolean => {
  const c = current()
  if (c == null) return true
  return c !== childSlots.value[childSlots.value.length - 1]
}

const move = (direction: number): void => {
  const currentlyVisiblePanel = childSlots.value.filter((slot) => slot.panelVisible)
  const selected =
    currentlyVisiblePanel && currentlyVisiblePanel.length > 0
      ? currentlyVisiblePanel[0]
      : childSlots.value[0]
  let index = childSlots.value.indexOf(selected)
  if (index + direction >= 0 && index + direction < childSlots.value.length) {
    index = index + direction
  }
  childSlots.value.forEach((slot) => {
    slot.iconVisible = false
    slot.panelVisible = false
  })
  childSlots.value[index].iconVisible = true
  childSlots.value[index].panelVisible = true
}

const down = () => {
  move(+1)
}

const up = () => {
  move(-1)
}

const togglePanel = (slot: PanelSlot) => {
  childSlots.value.forEach((slot) => {
    slot.panelVisible = false
  })
  childSlots.value[childSlots.value.indexOf(slot)].panelVisible = true
  panelVisible.value = !panelVisible.value
}

onMounted(() => {
  inputElement.value = root.value?.querySelector('input, textarea')!!
  if (inputElement.value) {
    events.forEach((evt) => inputElement.value!!.addEventListener(evt, updateValue))
  }
  childSlots.value[0].iconVisible = true
})

onBeforeUnmount(() => {
  if (inputElement.value) {
    events.forEach((evt) => inputElement.value!!.removeEventListener(evt, updateValue))
  }
})


const getInputElement = () => {
  return inputElement.value!!
}

provide('updateInputValue', updateInputValue)
provide('registerChild', registerChild)
provide('readInputValue', readInputValue)
provide('getInputElement', getInputElement)
</script>

<style scoped>
.writing-tools-container {
  display: grid;
  grid-template-areas:
    ' input input  input '
    ' . icons .  '
    ' panel panel panel  ';
  grid-template-columns: auto min-content auto;
  grid-template-rows: auto calc(var(--icon-width) * 1.2) auto;
  margin-bottom: var(--gutter-space);
}

.input-wrapper {
  grid-area: input;
}

.icon-column {
  display: grid;
  grid-area: icons;
}

.panel {
  z-index: 8;
  --writing-tools-panel-padding: calc(var(--gutter-space) / 3);
  grid-area: panel;
  margin-top: calc(-2 * var(--icon-width));
  padding-bottom: var(--writing-tools-panel-padding);
  padding-left: var(--writing-tools-panel-padding);
  padding-right: var(--writing-tools-panel-padding);
  padding-top: calc(2.5 * var(--icon-width));
  background-color: rgba(255, 255, 255, 0.5);

  border-radius: 4px;
}

.icon-column-menu {
  z-index: 10;
  height: calc(1.5 * var(--icon-width));
}

.icon {
  height: var(--icon-width);
  display: inline-block;
  background-size: var(--icon-width) var(--icon-width);
  cursor: pointer;
}
</style>
