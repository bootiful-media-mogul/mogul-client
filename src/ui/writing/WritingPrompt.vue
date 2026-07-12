<style scoped>
.writing-prompt-panel {
  --writing-tools-panel-padding: calc(var(--gutter-space) / 3);
  --writing-tools-panel-icon-size: 20px;
  display: grid;
  grid-row-gap: calc(1 * var(--writing-tools-panel-padding));
  min-width: 18rem;
}

.writing-prompt-panel textarea {
  width: 100%;
  resize: vertical;
}

.writing-prompt-panel .actions {
  display: grid;
  grid-template-areas: ' generate . ';
  grid-template-columns: auto 1fr;
}

.generate-button {
  grid-area: generate;
}

.generate-button.disabled {
  opacity: 0.5;
  cursor: default;
}

.proposal-approval a {
  font-size: small;
}
</style>
<template>
  <InputWrapperChild>
    <template v-slot:panel>
      <div class="writing-prompt-panel">
        <div v-if="!proposalApprovalRequired">
          <textarea v-model="prompt" :disabled="generating" :placeholder="placeholder" rows="3" />
          <div class="actions">
            <WritingAssistantButton
              :class="generateClasses"
              :label="generating ? 'Generating…' : 'Generate'"
              class="generate-button"
              @click="generate"
            >
<!--              <img alt="generate" src="../../assets/images/ai-icon.png" />-->

              <img alt="professional" src="../../assets/images/writing-tools/professional.png" />
            </WritingAssistantButton>
          </div>
        </div>
        <div v-if="proposalApprovalRequired" class="proposal-approval">
          <a class="accept-link" href="#" @click.prevent="accept">{{ t('buttons.accept') }}</a> |
          <a class="revert-link" href="#" @click.prevent="revert">{{ t('buttons.revert') }}</a>
        </div>
      </div>
    </template>
    <template v-slot:icon>
      <Icon :icon="assetHighlight" :icon-hover="asset" />
    </template>
  </InputWrapperChild>
</template>
<script lang="ts" setup>
import asset from '@/assets/images/ai-icon.png'
import assetHighlight from '@/assets/images/ai-icon-highlight.png'
import { ai } from '@/services'
import InputWrapperChild from '@/ui/input/InputWrapperChild.vue'
import WritingAssistantButton from '@/ui/writing/WritingAssistantButton.vue'
import { computed, inject, ref } from 'vue'
import type { ReadValueFunction, UpdateValueFunction } from '@/ui/input/input'
import Icon from '@/ui/Icon.vue'
import { useI18n } from 'vue-i18n'

const updateValue = inject<UpdateValueFunction>('updateInputValue')!
const readValue = inject<ReadValueFunction>('readInputValue')!

const prompt = ref<string>('')
const generating = ref<boolean>(false)
const previousModelValue = ref<string>('')
const proposalApprovalRequired = ref<boolean>(false)

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
const { t } = useI18n()

const placeholder = 'Ask the AI to write or rewrite this text…'

const generateClasses = computed<string>(() => (generating.value ? 'disabled' : ''))

function reset() {
  proposalApprovalRequired.value = false
}

function revert() {
  proposeUpdatedText(previousModelValue.value)
  reset()
}

function accept() {
  reset()
  prompt.value = ''
}

function proposeUpdatedText(updatedText: string) {
  previousModelValue.value = readValue()
  emit('update:modelValue', updatedText)
  proposalApprovalRequired.value = true
  updateValue(updatedText)
}

/**
 * Build a single prompt for the Ai service. When the text box already has
 * content we ask the model to transform it using the user's instruction;
 * when it's empty we ask the model to write something from scratch.
 */
function buildPrompt(instruction: string, existing: string): string {
  if (existing === '') {
    return `${instruction}

Return only the requested text, and nothing else.`
  }
  return `Follow the instruction below to rewrite or transform the text that appears after the line made of "="'s. Return only the resulting text, and nothing else.

Instruction: ${instruction}
==========================================
${existing}`
}

async function generate() {
  const instruction = prompt.value.trim()
  if (instruction === '' || generating.value) return

  generating.value = true
  try {
    const result = await ai.chat(buildPrompt(instruction, readValue().trim()))
    proposeUpdatedText(result)
  } finally {
    //
    generating.value = false
  }
}
</script>
