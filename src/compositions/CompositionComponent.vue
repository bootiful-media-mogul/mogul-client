<script lang="ts" setup>
//
// this is an unusual component. it lets us attach attachments (which has managedFiles)
// to a composition, nominally so we can then include references to them in
// text blocks via drag and drop.
//
import { onMounted, ref } from 'vue'
import { Attachment, compositions, ManagedFile, podcasts } from '@/services'
import ManagedFileComponent from '@/managedfiles/ManagedFileComponent.vue'
import { at } from 'vitest/dist/reporters-5f784f42'

const attachments = ref<Array<Attachment>>()

const props = defineProps<{
  compositionId: number
}>()

const text = ref<string>(
  `Oh, the Code You Can Type!

In the land of the web where the brackets do dance,
JavaScript leaps like a code circus chance!
It’s wild and it’s free, no rules to obey—
You can undefined your way through the day!
“Just toss in a var! Or a let! Or a const!
Who cares what it does? Just write it—it flaunts!”
But beware of the bugs, oh those sneaky code glitches,
Where NaN makes you twitch in your debugging stitches!

But wait! Typescript arrives with a bowtie and flair,
“Let me bring structure! Let me tame the despair!”
“No any too loose, no guesswork or fright—
I’ll tell you the type, and I’ll get it just right!”
With interfaces, enums, and strict by your side,
Your functions and classes will beam with great pride.
Yet for all its straight lines in this coder’s delight,
JavaScript still whispers: “Come play in the night!”
`
)

const textareaRef = ref<HTMLTextAreaElement>()
const lastCursorPos = ref<number>(0)

const setText = (txt: string) => {
  console.log('setting the text to be ' + txt)
  text.value = txt
}

const handleTextareaFocus = () => {
  lastCursorPos.value = textareaRef.value!!.selectionStart
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
  const dropPosition = textareaRef.value!!.selectionStart

  // Insert the dropped text at the cursor position
  const newText =
    text.value!!.slice(0, dropPosition) + droppedText + text.value!!.slice(dropPosition)

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
}

onMounted(async () => {
  await reload()
})

async function reload() {
  const composition = await compositions.getCompositionById(props.compositionId)
  attachments.value = composition.attachments
}

async function addCompositionAttachment(compositionId: number) {
  console.log('adding attachment')
  await compositions.createCompositionAttachment(compositionId)
  console.log('added attachment')
  await reload()
  console.log('reloaded')
}
</script>
<template>
  <div>
    <textarea
      @change="handleTextChange"
      @focus="handleTextareaFocus"
      @click="handleTextareaFocus"
      @drop="handleDrop"
      @dragover="handleDragOver"
      rows="10"
      ref="textareaRef"
      v-model="text"
    ></textarea>

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
<style></style>
