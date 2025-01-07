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

const updateValue = inject<UpdateValueFunction>('updateInputValue')!
const getInputElement = inject<GetInputElementFunction>('getInputElement')!
const readValue = inject<ReadValueFunction>('readInputValue')!

onMounted(async () => {
  await reload()

  const ti = getInputElement()
  textareaRef.value = ti

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
  event.dataTransfer!!.setData('text', attachment.embedding)

  // Create a clean clone of just this element
  const dragEl = event.target as HTMLElement

  const clone = dragEl.cloneNode(true) as HTMLElement
  clone.style.width = `${dragEl.offsetWidth}px`
  clone.style.height = `${dragEl.offsetHeight}px`
  clone.style.position = 'fixed'
  clone.style.top = '-1000px' // Position off-screen
  clone.style.opacity = '0.8'

  // Add to DOM temporarily
  document.body.appendChild(clone)

  // Set as drag image
  event.dataTransfer!!.setDragImage(clone, 0, 0)

  // Clean up the clone after drag starts
  requestAnimationFrame(() => {
    document.body.removeChild(clone)
  })
}

async function reload() {
  const composition = await compositions.getCompositionById(props.compositionId)
  attachments.value = composition.attachments
}

async function deleteCompositionAttachment(attachmentId: number) {
  await compositions.deleteCompositionAttachment(attachmentId)
  await reload()
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
            |
            <a href="#" @click.prevent="deleteCompositionAttachment(attachment.id)"> - </a>
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

  /* Prevent text selection during drag */
  user-select: none;
  /* Prevent interference from children */
  /*pointer-events: none;*/
}
.draggable a,
.draggable button,
.draggable input {
  pointer-events: auto;
}
</style>
