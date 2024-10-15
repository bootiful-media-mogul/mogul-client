<!-- Parent.vue -->
<template>
  <div class="writing-tools-container">
    <div ref="root" class="input-wrapper">
      <slot></slot>
    </div>
    <div class="icon-column">
 

      <InputWrapperMenu class="icon-column-menu">
        <div
          @click="togglePanel(slot)"
          class="icon unselectable"
          v-for="(slot, index) in childSlots"
          :key="index"
        >
          <component :is="slot.icon"></component>

        </div>
      </InputWrapperMenu>
    </div>
    <div v-if="!allHidden" class="panel">
      <div v-for="(slot, index) in childSlots" :key="index">
        <component v-if="slot.visible" :is="slot.panel"></component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, provide, onMounted, onBeforeUnmount } from 'vue'
import InputWrapperMenu from '@/ui/input/InputWrapperMenu.vue'
import InputWrapperMenuButton from '@/ui/input/InputWrapperMenuButton.vue'

export default {
  name: 'InputWrapper',
  components: { InputWrapperMenuButton, InputWrapperMenu },

  setup(props, { emit }) {
    const text = ref('')
    const root = ref(null as HTMLElement | null)
    const inputElement = ref(null as HTMLInputElement | null | undefined)

    const updateValue = (event: Event) => {
      const elementTarget = event?.target as HTMLInputElement
      const txt = elementTarget.value
      emit('update:modelValue', txt)
      text.value = txt
    }

    const events = 'input,change'.split(',')

    onMounted(() => {
      inputElement.value = (root.value as HTMLElement | null)?.querySelector('input, textarea')
      if (inputElement.value) {
        events.forEach((evt) => inputElement.value.addEventListener(evt, updateValue))
      }
    })

    onBeforeUnmount(() => {
      if (inputElement.value) {
        events.forEach((evt) => inputElement.value.removeEventListener(evt, updateValue))
      }
    })

    const childSlots = ref([])

    const registerChild = (slotPair) => {
      childSlots.value.push(slotPair)
    }

    provide('registerChild', registerChild)

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
  methods: {
    togglePanel: function(slot) {
      const newVisibility = !slot.visible
      this.childSlots.forEach((slot) => {
        slot.visible = false
      })
      slot.visible = newVisibility
      this.allHidden = this.childSlots.filter((item) => item.visible).length == 0
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      allHidden: true,
      previousModelValue: ''
    }
  }
}
</script>

<style scoped>
.writing-tools-container {

  
  

  display: grid;
  grid-template-areas:
    ' input  icons '
    ' panel  . ';
  grid-template-columns: auto min-content;
}

.icon-column-menu {
  grid-area: icons-column-menu;
}
.icon-column {
  
  display: grid;
  
  
  border: 1px solid white;
  grid-area: icons;
  
}

.panel {
  grid-area: panel;
  --writing-tools-panel-padding: calc(var(--gutter-space) / 3);
  --writing-tools-panel-icon-size: 20px;
  margin-top: calc(-2 * var(--writing-tools-panel-padding));
  padding-bottom: var(--writing-tools-panel-padding);
  padding-left: var(--writing-tools-panel-padding);
  padding-right: var(--writing-tools-panel-padding);
  padding-top: calc(3 * var(--writing-tools-panel-padding));
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  z-index: -1;
}

.icon {
  height: var(--icon-width);
  display: inline-block;
  background-size: var(--icon-width) var(--icon-width);
  cursor: pointer;
}
</style>
