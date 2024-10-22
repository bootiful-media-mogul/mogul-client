<template>
  <div class="writing-tools-container">
    <div ref="root" class="input-wrapper">
      <slot></slot>
    </div>
    <div class="icon-column">
      <InputWrapperMenu
        :disabled="panelVisible || childSlots.length <= 1"
        class="icon-column-menu"
        @down="down"
        @up="up"
        :enableUpArrow="enableUpArrow()"
        :enableDownArrow="enableDownArrow()"
      >
        <div
          @click="togglePanel(slot)"
          class="icon unselectable"
          v-for="(slot, index) in childSlots"
          :key="index"
        >
          <div v-if="panelVisible && slot.iconVisible">
            <div class="close-icon"></div>
          </div>
          <div v-else>
            <component v-if="slot.iconVisible" :is="slot.icon"></component>
          </div>
        </div>
      </InputWrapperMenu>
    </div>
    <div class="panel" v-if="panelVisible">
      <div v-for="(slot, index) in childSlots" :key="index">
        <div v-if="slot.panelVisible">
          <component :is="slot.panel"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onBeforeUnmount, onMounted, provide, ref } from 'vue'
import InputWrapperMenu from '@/ui/input/InputWrapperMenu.vue'
import InputWrapperMenuButton from '@/ui/input/InputWrapperMenuButton.vue'
import type { PanelSlot } from './input'

export default {
  name: 'InputWrapper',
  components: { InputWrapperMenuButton, InputWrapperMenu },

  setup(props, { emit }) {
    const text = ref<String>('')
    const root = ref<HTMLElement>()
    const inputElement = ref<HTMLInputElement>()

    const updateInputValue = (txt: string) => {
      emit('update:modelValue', txt)
      text.value = txt
    }

    const updateValue = (event: Event) => {
      const elementTarget = event?.target as HTMLInputElement
      const txt = elementTarget.value
      updateInputValue(txt)
    }

    const events = 'input,change'.split(',')

    onMounted(() => {
      inputElement.value = root.value?.querySelector('input, textarea')!!
      if (inputElement.value) {
        events.forEach((evt) => inputElement.value!!.addEventListener(evt, updateValue))
      }
    })

    onBeforeUnmount(() => {
      if (inputElement.value) {
        events.forEach((evt) => inputElement.value!!.removeEventListener(evt, updateValue))
      }
    })
    const childSlots = ref<Array<PanelSlot>>([])
    const registerChild = (slotPair: PanelSlot) => {
      childSlots.value.push(slotPair)
    }

    const readInputValue = () => {
      return text.value || ''
    }
    provide('updateInputValue', updateInputValue)
    provide('registerChild', registerChild)
    provide('readInputValue', readInputValue)

    return {
      childSlots,
      root,
      text,
      inputElement
    }
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.childSlots[0].iconVisible = true
  },
  methods: {
    current(): PanelSlot | null {
      const visible = this.childSlots.filter((slot) => slot.panelVisible)
      if (visible && visible.length > 0) {
        return visible[0]
      }
      return null
    },
    enableDownArrow() {
      const c = this.current()
      if (c == null) return true
      return c !== this.childSlots[this.childSlots.length - 1]
    },

    enableUpArrow() {
      const c = this.current()
      if (c == null) return false
      return c !== this.childSlots[0]
    },

    move(direction: number) {
      const currentlyVisiblePanel = this.childSlots.filter((slot) => slot.panelVisible)
      const selected =
        currentlyVisiblePanel && currentlyVisiblePanel.length > 0
          ? currentlyVisiblePanel[0]
          : this.childSlots[0]
      let index = this.childSlots.indexOf(selected)
      if (index + direction >= 0 && index + direction < this.childSlots.length)
        index = index + direction
      this.childSlots.forEach((slot) => {
        slot.iconVisible = false
        slot.panelVisible = false
      })
      this.childSlots[index].iconVisible = true
      this.childSlots[index].panelVisible = true
    },
    down() {
      this.move(+1)
    },
    up() {
      this.move(-1)
    },
    togglePanel(slot: PanelSlot) {
      this.childSlots.forEach((slot) => {
        slot.panelVisible = false
      })
      this.childSlots[this.childSlots.indexOf(slot)].panelVisible = true
      this.panelVisible = !this.panelVisible
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      panelVisible: false,
      previousModelValue: '',
      activeIndex: -1
    }
  }
}
</script>

<style scoped>
.writing-tools-container {
  display: grid;
  grid-template-areas:
    ' input icons '
    ' panel . ';

  grid-template-columns: auto var(--icon-column-width);
  margin-right: calc(var(--icon-column-width) * -1);
}

.input-wrapper {
  grid-area: input;
}

.icon-column {
  display: grid;
  grid-area: icons;
}

.panel {
  --writing-tools-panel-padding: calc(var(--gutter-space) / 3);
  grid-area: panel;
  margin-top: calc(-2 * var(--writing-tools-panel-padding));
  padding-bottom: var(--writing-tools-panel-padding);
  padding-left: var(--writing-tools-panel-padding);
  padding-right: var(--writing-tools-panel-padding);
  padding-top: calc(3 * var(--writing-tools-panel-padding));
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.icon {
  height: var(--icon-width);
  display: inline-block;
  background-size: var(--icon-width) var(--icon-width);
  cursor: pointer;
}
</style>
