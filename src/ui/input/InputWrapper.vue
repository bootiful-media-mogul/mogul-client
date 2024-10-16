<!-- Parent.vue -->
<template>
  <div class="writing-tools-container">
    <div ref="root" class="input-wrapper">
      <slot></slot>
    </div>
    <div class="icon-column">


      <InputWrapperMenu class="icon-column-menu" @down="down" @up="up">
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
        <component v-if="slot.panelVisible" :is="slot.panel"></component>
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
  mounted() {

    this.childSlots [0].iconVisible = true

  },
  methods: {
    move(direction) {
      const currentlyVisiblePanel = this.childSlots.filter(slot => slot.panelVisible)
      const selected = currentlyVisiblePanel && currentlyVisiblePanel.length > 0 ? currentlyVisiblePanel[0] : this.childSlots[0]
      let index = this.childSlots.indexOf(selected)
      if ((index + direction) >= 0 && (index + direction) < (this.childSlots.length)) index = index + direction
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
    togglePanel(slot) {
      this.childSlots.forEach((slot) => {
        slot.panelVisible = false
      })
      this.childSlots [this.childSlots.indexOf(slot)].panelVisible = true
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
  grid-column-gap: calc(var(--gutter-space) / 3);
  grid-template-columns: auto min-content;
}

.icon-column-menu {
  grid-area: icons-column-menu;
}

.input-wrapper {
  grid-area: input;
}

.panel {
  grid-area: panel;
}

.icon-column {
  display: grid;
  grid-area: icons;
}

.panel {
  grid-area: panel;
  --writing-tools-panel-padding: calc(var(--gutter-space) / 3);
  /*--writing-tools-panel-icon-size: 20px;*/
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
