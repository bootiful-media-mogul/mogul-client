<style scoped>
.tools.active .writing-tools-button:last-of-type {
  background-color: white;
  opacity: 100%;
}

.styles.active .writing-tools-button {
  background-color: white;
  opacity: 100%;
}

.styles {
  /* todo somehow refactor so that the rewrite button is its current height + 
   the following value 
   padding-top: calc(var(--gutter-space) / 2);
   */
}

.tools.active .rewrite-button  {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.styles .writing-tools-button {
  border-radius: 0;
}

.styles .writing-tools-button:first-of-type {
  border-top-left-radius: var(--button-radius);
  border-bottom-left-radius: var(--button-radius);
}

.styles .writing-tools-button:last-of-type {
  border-top-right-radius: var(--button-radius);
  border-bottom-right-radius: var(--button-radius);
}

.writing-tools-panel {
  --writing-tools-panel-padding: calc(var(--gutter-space) / 3);
  --writing-tools-panel-icon-size: 20px;
  margin-right: calc(calc(var(--gutter-space) / 3) + calc(var(--gutter-space) * 1.2));
  margin-top: calc(-1 * var(--writing-tools-panel-padding));
  padding-bottom: calc(var(--gutter-space) / 2);
  padding-left: calc(var(--gutter-space) / 2);
  padding-right: calc(var(--gutter-space) / 2);
  padding-top: calc(2 * var(--writing-tools-panel-padding));

  background-color: rgba(255, 255, 255, 0.3); /* A slightly whiter transparent overlay */
  border-radius: 4px;
  /* make sure the user doesn't accidentally select nonsense */
  user-select: none; /* For modern browsers */
  -webkit-user-select: none; /* For Safari */
  -moz-user-select: none; /* For older Firefox versions */
  -ms-user-select: none; /* For older IE/Edge versions */

}

.writing-tools-panel .styles {
  display: grid;
  grid-template-areas: ' friendly-button concise-button professional-button  ';
  grid-template-columns: auto auto auto;
}

.writing-tools-panel .styles.active .writing-tools-button {
  border-top-right-radius: 0;
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

.revert-link {
  grid-area: revert-link;
}

.accept-link {
  grid-area: accept-link;
}

.writing-tools-panel .tools {
  display: grid;
  grid-template-areas: ' proofread-button rewrite-button ';
  grid-template-columns: auto auto;
  grid-column-gap:  calc(1 * var(--writing-tools-panel-padding));
  
}

.rewrite-button {
  grid-area: rewrite-button;
}

.active .proofread-button {
  margin-bottom: calc(1 * var(--writing-tools-panel-padding));
  /* padding-bottom: calc(1 * var(--writing-tools-panel-padding)); */

}

.active .rewrite-button {
  margin-bottom: 0;
  padding-bottom: calc(2 * var(--writing-tools-panel-padding));
}

.proofread-button {
  grid-area: proofread-button;
  
  /*margin-bottom: var(--writing-tools-panel-padding);*/
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

.proposal-approval a {
  font-size: small;
}

.proposal-approval {
}

.proposal-approval .accept-link {
}
</style>

<template>
  <div class="writing-tools-container">
    <div ref="writingToolsRoot" class="input-wrapper">
      <slot></slot>
      <div class="toggle-icon" @click="togglePanel">✏️</div>
    </div>

    <div v-if="panelVisible" class="writing-tools-panel">
      <div v-if="!proposalApprovalRequired">
        <div :class="toolsClasses">
          <WritingToolsButton
            label="Proofread"
            class="proofread-button"
            @click="proofread"
          >
            <img alt="proofread" src="../assets/images/writing-tools/proofread.png" />
          </WritingToolsButton>

          <WritingToolsButton
            label="Rewrite"
            :class="rewriteToolsClasses"
            @click="toggleRewriteTools"
          >
            <img alt="rewrite" src="../assets/images/writing-tools/rewrite.png" />
          </WritingToolsButton>
        </div>
        <div :class="rewriteStylesClasses" v-if="rewriteStylesVisible">
          <WritingToolsButton label="Friendly" class="friendly-button" @click="rewriteFriendly">
            <img alt="friendly" src="../assets/images/writing-tools/friendly.png" />
          </WritingToolsButton>

          <WritingToolsButton label="Concise" class="concise-button" @click="rewriteConcise">
            <img alt="concise" src="../assets/images/writing-tools/concise.png" />
          </WritingToolsButton>

          <WritingToolsButton
            label="Professional"
            class="professional-button"
            @click="rewriteProfessional"
          >
            <img alt="professional" src="../assets/images/writing-tools/professional.png" />
          </WritingToolsButton>
        </div>
      </div>
      <div class="proposal-approval" v-if="proposalApprovalRequired">
        <a class="accept-link" href="#" @click.prevent="accept">accept</a> |
        <a class="revert-link" href="#" @click.prevent="revert">revert</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import WritingToolsButton from '@/composition/WritingToolsButton.vue'
import { ai } from '@/services'

export default {
  name: 'WritingTools',
  components: { WritingToolsButton },
  data() {
    return {
      proposalApprovalRequired: false,
      panelVisible: false,
      rewriteStylesVisible: false,
      rewriteStylesClasses: 'styles',
      rewriteToolsClasses: 'rewrite-button',
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
      this.proposalApprovalRequired = false
      this.panelVisible = false
      this.rewriteStylesVisible = false
      this.rewriteStylesClasses = 'styles'
      this.toolsClasses = 'tools'
      this.previousModelValue = ''
      this.rewriteToolsClasses = 'rewrite-button'
    },
    revert() {
      this.proposeUpdatedText(this.previousModelValue)
      this.reset()
    },
    accept() {
      this.proposalApprovalRequired = false
      this.reset()
    },

    proposeUpdatedText(updatedText: string) {
      console.log('updated text: ' + updatedText)
      this.previousModelValue = this.modelValue
      this.$emit('update:modelValue', updatedText)
      this.proposalApprovalRequired = true
    },

    async proofread() {
      if (this.modelValue.trim() === '') return

      if (this.rewriteStylesVisible) this.toggleRewriteTools()

      const proofread = await ai.chat(
        `Please proof read the text following the line made of "="'s. Return only the proofread text, and nothing else.
        ==========================================
        ${this.modelValue}
      `
      )
      this.proposeUpdatedText(proofread)
    },

    async rewriteProfessional() {
      if (this.modelValue.trim() === '') return
      const updated = await ai.chat(
        `Please rewrite the text following the line made of "="'s to sound more professional. Return only the new text, and nothing else.
        ==========================================
        ${this.modelValue}
      `
      )
      this.proposeUpdatedText(updated)
    },

    async rewriteConcise() {
      if (this.modelValue.trim() === '') return
      const updated = await ai.chat(
        `Please rewrite the text following the line made of "="'s to be more concise. Return only the new text, and nothing else.
        ==========================================
        ${this.modelValue}
      `
      )
      this.proposeUpdatedText(updated)
    },
    async rewriteFriendly() {
      if (this.modelValue.trim() === '') return
      const updated = await ai.chat(
        `Please rewrite the text following the line made of "="'s to be more friendly in tone. Return only the new text, and nothing else.
        ==========================================
        ${this.modelValue}
      `
      )
      this.proposeUpdatedText(updated)
    },
    toggleRewriteTools() {
      this.rewriteStylesVisible = !this.rewriteStylesVisible
      if (this.rewriteStylesVisible) {
        this.rewriteStylesClasses += ' active'
        this.toolsClasses += ' active'
        this.rewriteToolsClasses += ' active'
      } else {
        this.rewriteStylesClasses = 'styles'
        this.toolsClasses = 'tools'
        this.rewriteToolsClasses = 'rewrite-button'
      }
    },
    togglePanel() {
      this.panelVisible = !this.panelVisible
    }
  }
}
</script>
