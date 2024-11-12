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
</style>
<template>
  <InputWrapperChild>
    <template v-slot:panel>
      <div class="writing-tools-panel">
        <div v-if="!proposalApprovalRequired">
          <div :class="toolsClasses">
            <WritingAssistantButton class="proofread-button" label="Proofread" @click="proofread">
              <img alt="proofread" src="../../assets/images/writing-tools/proofread.png" />
            </WritingAssistantButton>

            <WritingAssistantButton
              :class="rewriteToolsClasses"
              label="Rewrite"
              @click="toggleRewriteTools"
            >
              <img alt="rewrite" src="../../assets/images/writing-tools/rewrite.png" />
            </WritingAssistantButton>
          </div>
          <div v-if="rewriteStylesVisible" :class="rewriteStylesClasses">
            <WritingAssistantButton
              class="friendly-button"
              label="Friendly"
              @click="rewriteFriendly"
            >
              <img alt="friendly" src="../../assets/images/writing-tools/friendly.png" />
            </WritingAssistantButton>

            <WritingAssistantButton class="concise-button" label="Concise" @click="rewriteConcise">
              <img alt="concise" src="../../assets/images/writing-tools/concise.png" />
            </WritingAssistantButton>

            <WritingAssistantButton
              class="professional-button"
              label="Professional"
              @click="rewriteProfessional"
            >
              <img alt="professional" src="../../assets/images/writing-tools/professional.png" />
            </WritingAssistantButton>
          </div>
        </div>
        <div v-if="proposalApprovalRequired" class="proposal-approval">
          <a class="accept-link" href="#" @click.prevent="accept">{{ $t('buttons.accept') }}</a> |
          <a class="revert-link" href="#" @click.prevent="revert">{{ $t('buttons.revert') }}</a>
        </div>
      </div>
    </template>
    <template v-slot:icon>
      <Icon :icon="assetHighlight" :icon-hover="asset" />
    </template>
  </InputWrapperChild>
</template>
<script lang="ts" setup>
import asset from '@/assets/images/writing-tools/rewrite.png'
import assetHighlight from '@/assets/images/writing-tools/rewrite-highlight.png'

import InputWrapperChild from '@/ui/input/InputWrapperChild.vue'

import { ai } from '@/services'
import WritingAssistantButton from '@/ui/writing/WritingAssistantButton.vue'
import { inject, ref } from 'vue'
import type { ReadValueFunction, UpdateValueFunction } from '@/ui/input/input'
import Icon from '@/ui/Icon.vue'

const updateValue = inject<UpdateValueFunction>('updateInputValue')!
const readValue = inject<ReadValueFunction>('readInputValue')!
const previousModelValue = ref<string>('')
const proposalApprovalRequired = ref<boolean>(false)
const toolsClasses = ref<string>('tools')
const rewriteStylesVisible = ref<boolean>(false)
const rewriteStylesClasses = ref<string>('styles')
const rewriteToolsClasses = ref<string>('rewrite-button')
const toggleButtonClasses = ref<string>('toggle-icon edit-icon')
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

function reset() {
  proposalApprovalRequired.value = false
  rewriteStylesVisible.value = false
  rewriteStylesClasses.value = 'styles'
  toolsClasses.value = 'tools'
  toggleButtonClasses.value = 'toggle-icon edit-icon'
  rewriteToolsClasses.value = 'rewrite-button'
}

function revert() {
  proposeUpdatedText(previousModelValue.value)
  reset()
}

function accept() {
  proposalApprovalRequired.value = false
  reset()
}

function proposeUpdatedText(updatedText: string) {
  previousModelValue.value = readValue()
  emit('update:modelValue', updatedText)
  proposalApprovalRequired.value = true
  console.log('proposed ' + updatedText)
  updateValue(updatedText)
}

async function proofread() {
  const contents = readValue().trim()
  console.log('proofread [' + contents + ']')

  if (contents === '') return

  if (rewriteStylesVisible.value) await toggleRewriteTools()

  const proofread = await ai.chat(
    `Please proof read the text following the line made of "="'s. Return only the proofread text, and nothing else.
        ==========================================
        ${contents}
      `
  )
  proposeUpdatedText(proofread)
}

async function rewriteProfessional() {
  if (readValue().trim() === '') return
  const updated = await ai.chat(
    `Please rewrite the text following the line made of "="'s to sound more professional. Return only the new text, and nothing else.
        ==========================================
        ${readValue()}
      `
  )
  proposeUpdatedText(updated)
}

async function rewriteConcise() {
  console.log('you want to rewrite: ' + readValue().substring(0, 10) + '...')
  if (readValue().trim() === '') return
  const updated = await ai.chat(
    `Please rewrite the text following the line made of "="'s to be more concise. Return only the new text, and nothing else.
        ==========================================
        ${readValue()}
      `
  )
  proposeUpdatedText(updated)
}

async function toggleRewriteTools() {
  rewriteStylesVisible.value = !rewriteStylesVisible.value
  if (rewriteStylesVisible.value) {
    rewriteStylesClasses.value += ' active'
    toolsClasses.value += ' active'
    rewriteToolsClasses.value += ' active'
  } else {
    rewriteStylesClasses.value = 'styles'
    toolsClasses.value = 'tools'
    rewriteToolsClasses.value = 'rewrite-button'
  }
}

async function rewriteFriendly() {
  if (readValue().trim() === '') return
  const updated = await ai.chat(
    `Please rewrite the text following the line made of "="'s to be more friendly in tone. Return only the new text, and nothing else.
        ==========================================
        ${readValue()}
      `
  )
  proposeUpdatedText(updated)
}
</script>
