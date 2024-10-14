<style scoped>
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

<template>
  
 
  <div class="writing-tools-container">
    <div ref="writingToolsRoot" class="input-wrapper">
      <slot></slot>
      <div :class="toggleButtonClasses"
           @click="togglePanel"
      >️</div>
    </div>

    <div v-if="panelVisible" class="unselectable writing-tools-panel">
      <slot name="panel"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'WritingTools',
  components: {   },
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
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const text = ref('')
    const writingToolsRoot = ref(null as HTMLElement | null)
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
      inputElement.value = (writingToolsRoot.value as HTMLElement | null)?.querySelector(
        'input, textarea'
      )
      if (inputElement.value) {
        inputElement.value.addEventListener('input', updateValue)
      }
    })

    onBeforeUnmount(() => {
      if (inputElement.value) {
        inputElement.value.removeEventListener('input', updateValue)
      }
    })

    return {
      writingToolsRoot,
      text,
      inputElement
    }
  },
  methods: {
    reset() {
      // this.proposalApprovalRequired = false
      this.panelVisible = false
      this.rewriteStylesVisible = false
      this.rewriteStylesClasses = 'styles'
      this.toolsClasses = 'tools'
      this.previousModelValue = ''
      this.toggleButtonClasses = 'toggle-icon unselectable edit-icon'
      this.rewriteToolsClasses = 'rewrite-button'
    },
    accept() {
      // this.proposalApprovalRequired = false
      this.reset()
    },

    proposeUpdatedText(updatedText: string) {
      console.log('updated text: ' + updatedText)
      this.previousModelValue = this.modelValue
      this.$emit('update:modelValue', updatedText)
      // this.proposalApprovalRequired = true
    },

       
    togglePanel() {
      this.panelVisible = !this.panelVisible
      if (this.panelVisible) this.toggleButtonClasses = 'toggle-icon unselectable close-icon'
      else this.toggleButtonClasses = 'toggle-icon unselectable edit-icon'
    }
  }
}
</script>
