<style scoped>
.writing-tools-panel {
  --writing-tools-panel-padding: calc(var(--gutter-space) / 3);
  --writing-tools-panel-icon-size: 20px;
}

.tools.active .writing-tools-button:last-of-type {
  background-color: white;
  opacity: 100%;
}

.styles.active .writing-tools-button {
  background-color: white;
  opacity: 100%;
}

.tools.active .rewrite-button {
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
  grid-column-gap: calc(1 * var(--writing-tools-panel-padding));
}

.rewrite-button {
  grid-area: rewrite-button;
}

.active .proofread-button {
  margin-bottom: calc(1 * var(--writing-tools-panel-padding));
}

.active .rewrite-button {
  margin-bottom: 0;
  padding-bottom: calc(2 * var(--writing-tools-panel-padding));
}

.proofread-button {
  grid-area: proofread-button;
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
  <InputWrapperChild>
    <template v-slot:panel>
      <div class="writing-tools-panel">
        <div v-if="!proposalApprovalRequired">
          <div :class="toolsClasses">
            <WritingAssistantButton label="Proofread" class="proofread-button" @click="proofread">
              <img alt="proofread" src="../../assets/images/writing-tools/proofread.png" />
            </WritingAssistantButton>

            <WritingAssistantButton
              label="Rewrite"
              :class="rewriteToolsClasses"
              @click="toggleRewriteTools"
            >
              <img alt="rewrite" src="../../assets/images/writing-tools/rewrite.png" />
            </WritingAssistantButton>
          </div>
          <div :class="rewriteStylesClasses" v-if="rewriteStylesVisible">
            <WritingAssistantButton
              label="Friendly"
              class="friendly-button"
              @click="rewriteFriendly"
            >
              <img alt="friendly" src="../../assets/images/writing-tools/friendly.png" />
            </WritingAssistantButton>

            <WritingAssistantButton label="Concise" class="concise-button" @click="rewriteConcise">
              <img alt="concise" src="../../assets/images/writing-tools/concise.png" />
            </WritingAssistantButton>

            <WritingAssistantButton
              label="Professional"
              class="professional-button"
              @click="rewriteProfessional"
            >
              <img alt="professional" src="../../assets/images/writing-tools/professional.png" />
            </WritingAssistantButton>
          </div>
        </div>
        <div class="proposal-approval" v-if="proposalApprovalRequired">
          <a class="accept-link" href="#" @click.prevent="accept">accept</a> |
          <a class="revert-link" href="#" @click.prevent="revert">revert</a>
        </div>
      </div>
    </template>
    <template v-slot:icon>
      <InputWrapperMenuButton :icon="assetHighlight" :icon-hover="asset" />
    </template>
  </InputWrapperChild>
</template>
<script lang="ts">
import asset from '@/assets/images/writing-tools/rewrite.png'
import assetHighlight from '@/assets/images/writing-tools/rewrite-highlight.png'

import InputWrapperChild from '@/ui/input/InputWrapperChild.vue'
import InputWrapperMenuButton from '@/ui/input/InputWrapperMenuButton.vue'
import { ai } from '@/services'
import WritingAssistantButton from '@/ui/writing/WritingAssistantButton.vue'
import { inject } from 'vue'
import type { ReadValueFunction, UpdateValueFunction } from '@/ui/input/input'

export default {
  name: 'WritingAssistant',
  components: { WritingAssistantButton, InputWrapperMenuButton, InputWrapperChild },

  setup(_) {
    const update = inject<UpdateValueFunction>('updateInputValue')!
    const read = inject<ReadValueFunction>('readInputValue')!
    return {
      updateValue: update,
      readValue: read
    }
  },
  watch: {
    async modelValue(o: string, n: string) {
      //console.log(o + ':' + n)
    }
  },
  methods: {
    reset() {
      this.proposalApprovalRequired = false
      this.rewriteStylesVisible = false
      this.rewriteStylesClasses = 'styles'
      this.toolsClasses = 'tools'
      this.toggleButtonClasses = 'toggle-icon edit-icon'
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
      this.previousModelValue = this.readValue()
      this.$emit('update:modelValue', updatedText)
      this.proposalApprovalRequired = true
      console.log('proposed ' + updatedText)
      this.updateValue(updatedText)
    },


    async proofread() {
      if (this.readValue().trim() === '') return

      if (this.rewriteStylesVisible) this.toggleRewriteTools()

      const proofread = await ai.chat(
        `Please proof read the text following the line made of "="'s. Return only the proofread text, and nothing else.
        ==========================================
        ${this.readValue()}
      `
      )
      this.proposeUpdatedText(proofread)
    },

    async rewriteProfessional() {
      if (this.readValue().trim() === '') return
      const updated = await ai.chat(
        `Please rewrite the text following the line made of "="'s to sound more professional. Return only the new text, and nothing else.
        ==========================================
        ${this.readValue()}
      `
      )
      this.proposeUpdatedText(updated)
    },

    async rewriteConcise() {
      if (this.readValue().trim() === '') return
      const updated = await ai.chat(
        `Please rewrite the text following the line made of "="'s to be more concise. Return only the new text, and nothing else.
        ==========================================
        ${this.readValue()}
      `
      )
      this.proposeUpdatedText(updated)
    },
    async rewriteFriendly() {
      if (this.readValue().trim() === '') return
      const updated = await ai.chat(
        `Please rewrite the text following the line made of "="'s to be more friendly in tone. Return only the new text, and nothing else.
        ==========================================
        ${this.readValue()}
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
    }
  },

  data() {
    return {
      previousModelValue: '',
      proposalApprovalRequired: false,
      asset: asset,
      assetHighlight: assetHighlight,
      toolsClasses: 'tools',
      rewriteStylesVisible: false,
      rewriteStylesClasses: 'styles',
      rewriteToolsClasses: 'rewrite-button',
      toggleButtonClasses: 'toggle-icon edit-icon'
    }
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  }
}
</script>
