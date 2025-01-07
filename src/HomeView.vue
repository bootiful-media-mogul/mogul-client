<script lang="ts" setup>
// import InputWrapper from '@/ui/input/InputWrapper.vue'
// import InputTools from '@/ui/InputTools.vue'
// import { ref } from 'vue'
// import InputTools from '@/ui/InputTools.vue'
// import InputWrapper from '@/ui/input/InputWrapper.vue'
//
// const blog = ref<string>('')
import { ref } from 'vue'
import CompositionComponent from '@/compositions/CompositionComponent.vue'

interface DraggableManagedFile {
  readonly id: number
  readonly message: string
}

const text = ref<string>('')
const draggables = ref<DraggableManagedFile[]>([])

for (let i = 0; i < 10; i++) draggables.value.push({ id: i, message: 'message #' + i })

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
const handleDragStart = (event: DragEvent, draggable: DraggableManagedFile) => {
  console.log('drag start')
  event.dataTransfer!!.setData('text', 'Dropped' + draggable.id + ' text here!')
}
</script>

<template>
  <h1>Home</h1>

  <p>Here is your activity feed...</p>

  {{ text }}

  <!--  <form class="pure-form pure-form-stacked">
    <fieldset>
      <legend>a nice form</legend>
      <div class="pure-control-group">
        <label for="title">input </label>
        <InputWrapper v-model="blog">
          <textarea type="text" id="title" rows="10" name="title" :value="blog"></textarea>
          <InputTools v-model="blog" />
        </InputWrapper>
      </div>
      <div class="pure-controls">
        <button class="pure-button pure-button-primary" type="submit" value="create">
          do the thing
        </button>
      </div>
    </fieldset>
  </form>
  <div>what did the user type? {{ blog }}</div>
  -->

  <CompositionComponent :composition-id="2" />
</template>

<style></style>
