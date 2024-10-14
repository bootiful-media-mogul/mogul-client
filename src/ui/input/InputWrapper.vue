<!-- Parent.vue -->
<template>
  <div class="writing-tools-container">
    <div ref="root" class="input-wrapper">

      <slot></slot>
      ️
      <div v-for="(slot, index) in childSlots" :key="index">
        <component :is="slot.icon"></component>
      </div>
    </div>

    <div class="writing-tools-panel">
      <div v-for="(slot, index) in childSlots" :key="index">
        <component :is="slot.panel"></component>
      </div>


    </div>
  </div>
</template>

<script lang="ts">
import { ref, provide, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'InputWrapper',
  
  setup(props, { emit }) {
    const text = ref('')
    const root = ref(null as HTMLElement | null)
    const inputElement = ref(null as HTMLInputElement | null | undefined)

    const updateValue = (event: Event) => {
      const elementTarget = event?.target as HTMLInputElement
      if (elementTarget.value) {
        const txt = elementTarget.value
        emit('update:modelValue', txt)
        text.value = txt
      }
    }

    onMounted(() => {
      inputElement.value = (root.value as HTMLElement | null)?.querySelector('input, textarea')
      if (inputElement.value) {
        inputElement.value.addEventListener('input', updateValue)
      }
    })

    onBeforeUnmount(() => {
      if (inputElement.value) {
        inputElement.value.removeEventListener('input', updateValue)
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

  emits: ['update:modelValue'],

  data() {

    return {
      proposalApprovalRequired: false,
      panelVisible: false,
      rewriteStylesVisible: false,
      // rewriteStylesClasses: 'styles',
      rewriteToolsClasses: 'rewrite-button',
      toggleButtonClasses: 'toggle-icon unselectable edit-icon',
      toolsClasses: 'tools',
      previousModelValue: ''
    }
  }


}
</script>

<style>
.tools.active > .writing-tools-button:last-of-type {
  background-color: white;
  opacity: 100%;
}


.unselectable {
  user-select: none; /* For modern browsers */
  -webkit-user-select: none; /* For Safari */
  -moz-user-select: none; /* For older Firefox versions */
  -ms-user-select: none; /* For older IE/Edge versions */
}

.writing-tools-panel {
  --writing-tools-panel-padding: calc(var(--gutter-space) / 3);
  --writing-tools-panel-icon-size: 20px;
  margin-right: calc(var(--icon-width) + var(--writing-tools-panel-padding));
  margin-top: calc(-1 * var(--writing-tools-panel-padding));
  padding-bottom: var(--writing-tools-panel-padding);
  padding-left: var(--writing-tools-panel-padding);
  padding-right: var(--writing-tools-panel-padding);
  padding-top: calc(2 * var(--writing-tools-panel-padding));
  background-color: rgba(255, 255, 255, 0.3); /* A slightly whiter transparent overlay */
  border-radius: 4px;
}

.writing-tools-panel > .tools {
  display: grid;
  grid-template-areas: ' proofread-button rewrite-button ';
  grid-template-columns: auto auto;
  grid-column-gap: calc(1 * var(--writing-tools-panel-padding));
}


.toggle-icon {
  cursor: pointer;
  margin-left: calc(var(--gutter-space) / 3);
}

.input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

</style>