<style scoped>


.tools.active .writing-tools-button:last-of-type {
  background-color: #999999;
}

.styles {
  padding-top: calc(var(--gutter-space) / 2);
}

.styles .writing-tools-button {
  border-radius: 0;
}

.styles.active .writing-tools-button {
  background-color: #999999;

}

.styles .writing-tools-button:first-of-type {
  border-top-left-radius: var(--button-radius);
  border-bottom-left-radius: var(--button-radius);
}

.styles .writing-tools-button:last-of-type {
  border-top-right-radius: var(--button-radius);
  border-bottom-right-radius: var(--button-radius);
}

.tools .writing-tools-button:last-of-type {
}

.writing-tools-panel {
  --writing-tools-panel-icon-size: 30px;
  margin-right: calc(calc(var(--gutter-space) / 3) + calc(var(--gutter-space) * 1.2));
  margin-top: calc(var(--gutter-space) / 3);
  padding: calc(var(--gutter-space) / 2);
  background-color: #f9f9f9;
  border-radius: 4px;
}

/* styles for the rewrite */
.writing-tools-panel .styles {
  display: grid;
  grid-template-areas:  ' friendly-button concise-button professional-button  ';
  grid-template-columns: auto auto auto;
}

.tools.active {
  //border: 1px solid orange;
}

.styles.active {
  //border: 1px solid red;
  //border-top-right-radius: 0;
}

.writing-tools-panel .styles {
  font-size: small;
  //padding-top: calc(var(--gutter-space) / 2);
}

.writing-tools-panel .styles .writing-tools-button-icon {
  background-size: calc(var(--writing-tools-panel-icon-size) * 0.7) calc(var(--writing-tools-panel-icon-size) * 0.7);
  height: calc(var(--writing-tools-panel-icon-size) * 0.7);
}

.concise-button {
  grid-area: concise-button;
}

.friendly-button {
  grid-area: friendly-button;
}

.professional-button {
  grid-area: professional-button;
}

/* writing tools */
.writing-tools-panel .tools {
  display: grid;
  grid-template-areas:  ' proofread-button rewrite-button ';
  grid-template-columns: auto   auto;
  grid-column-gap: calc(var(--gutter-space) / 2);
  grid-row-gap: calc(var(--gutter-space) / 2);
}

.rewrite-button {
  grid-area: rewrite-button;
}

.proofread-button {
  grid-area: proofread-button;
}

.toggle-icon {
  cursor: pointer;
  margin-left: calc(var(--gutter-space) / 3);
  width: calc(var(--gutter-space) * 1.2);
  height: calc(var(--gutter-space) * 1.2);
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
      <div class="toggle-icon" @click="togglePanel">✏️</div>
    </div>

    <div v-if="panelVisible" class="writing-tools-panel">

      <div :class="toolsClasses">

        <WritingToolsButton
          label="Proofread"
          class="writing-tools-button   proofread-button"
          icon-image="src/assets/images/writing-tools/proofread.png"
          @click="proofread"
        />

        <WritingToolsButton
          label="Rewrite"
          class="rewrite-button"
          icon-image="src/assets/images/writing-tools/rewrite.png"
          @click="toggleRewriteTools"
        />

      </div>
      <div :class="rewriteClasses" v-if="rewriteStylesVisible">
        <WritingToolsButton
          label="Friendly"
          class="friendly-button"
          icon-image="src/assets/images/writing-tools/friendly.png"
          @click="console.log('friendly')"
        />

        <WritingToolsButton
          label="Concise"
          class="concise-button"
          icon-image="src/assets/images/writing-tools/concise.png"
          @click="console.log('concise')"
        />

        <WritingToolsButton
          label="Professional"
          class="professional-button"
          icon-image="src/assets/images/writing-tools/professional.png"
          @click="console.log('professional')"
        />


      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import WritingToolsButton from '@/composition/WritingToolsButton.vue'

export default {
  name: 'WritingTools',
  components: { WritingToolsButton },
  data() {
    return {
      panelVisible: false,
      rewriteStylesVisible: false,
      rewriteClasses: 'styles',
      toolsClasses: 'tools'
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
    const inputElement = ref(null)

    const updateValue = (event) => {
      const value = event.target.value
      emit('update:modelValue', value)
      text.value = value
    }

    onMounted(() => {
      // todo
      // I can export the change to the nested component in this way:
      // setTimeout( () => emit('update:modelValue' , 'hello, world'), 5 * 1000)
      //
      inputElement.value = document.querySelector('input, textarea')
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
      text,
      inputElement
    }
  },
  methods: {
    proposeUpdatedText(updatedText: string) {
      console.log('updated text: ' + updatedText)
    },
    proofread() {
      console.log('proofread')
      if (this.rewriteStylesVisible)
        this.toggleRewriteTools()
    },
    toggleRewriteTools() {
      this.rewriteStylesVisible = !this.rewriteStylesVisible
      if (this.rewriteStylesVisible) {
        this.rewriteClasses += ' active'
        this.toolsClasses += ' active'
      } else {
        this.rewriteClasses = 'styles'
        this.toolsClasses = 'tools'
      }
    },
    togglePanel() {
      this.panelVisible = !this.panelVisible
    }
  }
}
</script>
