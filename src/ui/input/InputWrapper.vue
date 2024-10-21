<!-- Parent.vue -->
<template>
  <div
    ref="rootDiv"
    :class="{ 'writing-tools-container': true, 'expanded': isFocused }"
    :style="{ height: containerHeight + 'px' }"
  >
    <div ref="inputDiv" class="input-wrapper">
      <slot></slot>
    </div>
    <div ref="toolboxDiv" class="toolbox">
      <InputWrapperMenu
        :disabled="panelVisible || childSlots.length <= 1"
        class="icon-column-menu"
        @down="down"
        @up="up"
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
    <div ref="panelDiv" class="panel" :style="{ display: panelVisible ? 'block' :'none' }">
      <div v-for="(slot, index) in childSlots" :key="index">
        <div v-if="slot.panelVisible">
          <component :is="slot.panel"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onBeforeUnmount, onMounted, onUnmounted, provide, ref } from 'vue'
import InputWrapperMenu from '@/ui/input/InputWrapperMenu.vue'
import InputWrapperMenuButton from '@/ui/input/InputWrapperMenuButton.vue'
import type { PanelSlot } from './input'

export default {
  name: 'InputWrapper',
  components: { InputWrapperMenuButton, InputWrapperMenu },

  setup(props, { emit }) {
    const rootDiv = ref<HTMLElement>()
    const text = ref<String>('')
    const inputDiv = ref<HTMLElement>()
    const toolboxDiv = ref<HTMLDivElement>()
    const panelDiv = ref<HTMLDivElement>()
    const inputElement = ref<HTMLInputElement>()

    /// new shrinking code after this
    const isFocused = ref(false)
    const containerHeight = ref(0)

    function calculateHeightFor(e: HTMLDivElement): number {
      const computedStyle = window.getComputedStyle(e)
      return parseFloat(computedStyle.height)
    }

    const updateHeight = () => {
      if (inputElement.value) {
        toolboxDiv.value.style.display = 'block'
        const panelHeight = (panelDiv.value && panelDiv.value?.style.display !== '' ? calculateHeightFor(panelDiv.value) : 0)
        const heightOfToolbar = calculateHeightFor(toolboxDiv.value) + panelHeight
        const elementHeight = inputElement.value.scrollHeight
        containerHeight.value = isFocused.value ? elementHeight + heightOfToolbar : elementHeight
      }
    }


    const checkMousePosition = (event: MouseEvent) => {
      if (rootDiv.value) {
        const rect = rootDiv.value.getBoundingClientRect()
        isFocused.value = (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        )
        if (!isFocused.value)
          console.log('in focus? ' + isFocused.value)
      }
    }

// Alternative method using mouseenter and mouseleave events


    const handleFocus = () => {
      isFocused.value = true
      updateHeight()
    }

    const handleBlur = () => {
      isFocused.value = false
      updateHeight()
    }

    const focusIfInContainer = (e: MouseEvent) => {
      if (checkMousePosition(e))
        handleFocus()
      // else 
      //   handleBlur()
    }


    onUnmounted(() => {
      window.removeEventListener('resize', updateHeight)
    })

    /// new shrinking code before this

    const updateInputValue = (txt: string) => {
      emit('update:modelValue', txt)
      text.value = txt
    }

    const updateValue = (event: Event) => {
      const elementTarget: HTMLInputElement = event?.target as HTMLInputElement
      const txt = elementTarget.value
      updateInputValue(txt)
    }

    const events = 'input,change'.split(',')

    onMounted(() => {
      inputElement.value = inputDiv.value?.querySelector('input, textarea')!!
      if (inputElement.value.length > 1) {
        inputElement.value = inputElement.value.slice(0, inputElement.value.length - 1)
      }
      if (inputElement.value) {
        events.forEach((evt) => inputElement.value!!.addEventListener(evt, updateValue))

        inputElement.value.addEventListener('focus', handleFocus)
        // inputElement.value.addEventListener('blur', handleBlur)
      }

      if (rootDiv.value) {
        // todo 
        //      figure out how to not show these things. maybe we move the toolbox 
        //      above the input element so that no matter how big or small the input is,
        //      we can see it? should we set a timeout and set visible = false if they're 
        //      still not in the element in 1s?
        // inputWrapper.value?.addEventListener('mouseleave', focusIfInContainer)
        rootDiv.value?.addEventListener('mouseenter', focusIfInContainer)
      }

      updateHeight() // on
      window.addEventListener('resize', updateHeight)
    })

    onBeforeUnmount(() => {
      if (inputElement.value) {
        rootDiv.value?.removeEventListener('mouseenter', focusIfInContainer)
        events.forEach((evt) => inputElement.value?.removeEventListener(evt, updateValue))
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
      isFocused,
      containerHeight,
      toolboxDiv,
      handleFocus,
      handleBlur,
      rootDiv,
      panelDiv,
      //
      childSlots,
      inputDiv,
      text,
      updateHeight,
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
      this.updateHeight()
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
  border: 1px solid black;

  display: grid;
  grid-template-areas:
    ' input '
    ' icons '
    ' panel ';


  transition: height 0.3s ease;
  overflow: hidden;
}


.writing-tools-container.expanded > .toolbox {
  display: block;
  border: 1px solid red;
}

.input-wrapper {
  grid-area: input;
}

.toolbox {
  display: grid;
  grid-area: icons;

}


.panel {
  display: none;
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
