<script lang="ts" setup>
//
// this is an unusual component. it lets us attach attachments (which has managedFiles)
// to a composition, nominally so we can then include references to them in
// text blocks via drag and drop.
//
import { inject, onMounted, ref } from 'vue'
import { Attachment, compositions } from '@/services'
import ManagedFileComponent from '@/managedfiles/ManagedFileComponent.vue'
import type {
  GetInputElementFunction,
  ReadValueFunction,
  UpdateValueFunction
} from '@/ui/input/input'
import InputWrapperChild from '@/ui/input/InputWrapperChild.vue'
import asset from '@/assets/images/compositions/attachments.png'
import assetHighlight from '@/assets/images/compositions/attachments.png'
import Icon from '@/ui/Icon.vue'

// some very important functions!
const updateValue = inject<UpdateValueFunction>('updateInputValue')!
const getInputElement = inject<GetInputElementFunction>('getInputElement')!
const readValue = inject<ReadValueFunction>('readInputValue')!



onMounted(async () => {
  await reload()

  const ti = getInputElement()
  textareaRef.value = ti

  // console.log('textarea ref: ' + textareaRef.value)

  ti.addEventListener('change', handleTextChange)
  ti.addEventListener('focus', handleTextareaFocus)
  ti.addEventListener('click', handleTextareaFocus)
  ti.addEventListener('drop', handleDrop)
  ti.addEventListener('dragover', handleDragOver)
})

const attachments = ref<Array<Attachment>>()

const props = defineProps<{
  compositionId: number
}>()

const text = ref<string>()
const textareaRef = ref<HTMLInputElement>()
const lastCursorPos = ref<number>(0)

const setText = (txt: string) => {
  console.log('setting the text to be ' + txt)
  text.value = txt

  updateValue(txt)
}

const handleTextareaFocus = () => {
  lastCursorPos.value = textareaRef.value!!.selectionStart!!
}

// Update text state and maintain cursor position
const handleTextChange = (e: Event) => {
  const t = (e.target as HTMLInputElement)!!
  setText(t.value)
  lastCursorPos.value = t.selectionStart || 0
}

// Handle the drop event
const handleDrop = (e: DragEvent) => {
  e.preventDefault()

  const droppedText = e.dataTransfer!!.getData('text')

  // Get the cursor position where the drop occurred
  const dropPosition = textareaRef.value!!.selectionStart!!

  // Insert the dropped text at the cursor position
  const newText =
    readValue()!!.slice(0, dropPosition) + droppedText + readValue()!!.slice(dropPosition)

  setText(newText)

  // After setState, focus and set cursor position after inserted text
  setTimeout(() => {
    const tav = textareaRef.value!!
    tav.focus()
    const newPosition = dropPosition + droppedText.length
    tav.setSelectionRange(newPosition, newPosition)
  }, 0)
}

// Prevent default drag over behavior
const handleDragOver = (e: Event) => {
  e.preventDefault()
}

// Make the draggable div
const handleDragStart = (event: DragEvent, attachment: Attachment) => {
  console.log('drag start: ' + attachment.embedding)
  event.dataTransfer!!.setData('text', attachment.embedding)
}

async function reload() {
  const composition = await compositions.getCompositionById(props.compositionId)
  attachments.value = composition.attachments
}

async function addCompositionAttachment(compositionId: number) {
  await compositions.createCompositionAttachment(compositionId)
  await reload()
}
</script>
<template>
  <InputWrapperChild>
    <template v-slot:icon>
      <Icon :icon="asset" :icon-hover="assetHighlight" />
    </template>
    <template v-slot:panel>
      <div>
        <div v-for="attachment in attachments" :key="attachment.id">
          <div draggable="true" class="draggable" @dragstart="handleDragStart($event, attachment)">
            <ManagedFileComponent accept=".jpg,.png" :managed-file-id="attachment.managedFile.id" />
          </div>
        </div>
        <div>
          <span class="save">
            <button
              class="pure-button pure-button-primary"
              type="submit"
              @click.prevent="addCompositionAttachment(compositionId)"
            >
              {{ $t('compositions.buttons.add-attachment') }}
            </button>
          </span>
        </div>
      </div>
    </template>
  </InputWrapperChild>
</template>
<style>
.draggable {
  cursor: grab;
  position: relative;

  border: 1px solid orange;
}
</style>
