<template>
  <div class="editor-container">
    <div class="toolbar flex gap-2 p-2 bg-gray-100 border-b">
      <button
        v-for="action in actions"
        :key="action.label"
        @click="action.handler"
        class="px-3 py-1 bg-white rounded border hover:bg-gray-50"
      >
        {{ action.label }}
      </button>
      <select v-model="editorType" class="border rounded px-2">
        <option value="div">ContentEditable</option>
        <option value="textarea">Textarea</option>
        <option value="input">Input</option>
      </select>
    </div>

    <!-- ContentEditable div -->
    <div
      v-if="editorType === 'div'"
      ref="divRef"
      contenteditable
      @input="handleInput"
    
    />

    <!-- Textarea -->
    <textarea
      v-else-if="editorType === 'textarea'"
      ref="textareaRef"
      v-model="content"
      @select="handleInputSelection"
      
    />

    <!-- Input -->
    <input
      v-else
      ref="inputRef"
      type="text"
      v-model="content"
      @select="handleInputSelection"
      class="w-full p-4 focus:outline-none border-0"
    />

    <!-- Markdown Preview -->
    <div v-if="showMarkdown" class="border-t p-4 bg-gray-50">
      <h3 class="font-semibold mb-2">Markdown Output:</h3>
      <pre class="whitespace-pre-wrap font-mono text-sm">{{ markdown }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const editorType = ref('div')
const divRef = ref(null)
const textareaRef = ref(null)
const inputRef = ref(null)
const content = ref('')
const markdown = ref('')
const showMarkdown = ref(true)

// Get the current editor element reference
const currentRef = computed(() => {
  switch (editorType.value) {
    case 'div': return divRef
    case 'textarea': return textareaRef
    case 'input': return inputRef
    default: return null
  }
})

// Get the selected text and position based on editor type
const getSelection = () => {
  const element = currentRef.value?.value
  if (!element) return null

  if (editorType.value === 'div') {
    const selection = window.getSelection()
    if (!selection.rangeCount) return null

    return {
      text: selection.toString(),
      range: selection.getRangeAt(0),
      start: null,
      end: null,
      isContentEditable: true
    }
  } 
  else {
    return {
      text: element.value.substring(element.selectionStart, element.selectionEnd),
      range: null,
      start: element.selectionStart,
      end: element.selectionEnd,
      isContentEditable: false
    }
  }
}

// Insert text at cursor position for input/textarea
const insertAtCursor = (text, movePosition = 0) => {
  const element = currentRef.value?.value
  if (!element || editorType.value === 'div') return

  const start = element.selectionStart
  const end = element.selectionEnd
  const before = element.value.substring(0, start)
  const after = element.value.substring(end)

  content.value = before + text + after

  // Set cursor position
  nextTick(() => {
    const newPosition = start + text.length + movePosition
    element.selectionStart = newPosition
    element.selectionEnd = newPosition
  })
}

// Format text based on editor type
const formatText = (format) => {
  const selection = getSelection()
  if (!selection) return

  if (selection.isContentEditable) {
    // Handle contentEditable div
    const element = document.createElement(format)
    element.appendChild(selection.range.extractContents())
    selection.range.insertNode(element)
  } else {
    // Handle input/textarea
    const { text, start, end } = selection
    let formattedText = ''

    switch (format) {
      case 'strong':
        formattedText = `**${text}**`
        break
      case 'em':
        formattedText = `*${text}*`
        break
      default:
        formattedText = text
    }

    insertAtCursor(formattedText)
  }

  updateMarkdown()
}

const createLink = () => {
  const url = prompt('Enter URL:')
  if (!url) return

  const selection = getSelection()
  if (!selection) return

  if (selection.isContentEditable) {
    const link = document.createElement('a')
    link.href = url
    link.appendChild(selection.range.extractContents())
    selection.range.insertNode(link)
  } else {
    const text = selection.text || url
    insertAtCursor(`[${text}](${url})`)
  }

  updateMarkdown()
}

const createList = (type) => {
  const selection = getSelection()
  if (!selection) return

  if (selection.isContentEditable) {
    const list = document.createElement(type)
    const item = document.createElement('li')

    if (!selection.range.collapsed) {
      item.appendChild(selection.range.extractContents())
    } else {
      item.appendChild(document.createTextNode(''))
    }

    list.appendChild(item)
    selection.range.insertNode(list)
  } else {
    const prefix = type === 'ul' ? '- ' : '1. '
    const text = selection.text ?
      selection.text.split('\n').map(line => prefix + line).join('\n') :
      prefix
    insertAtCursor(text)
  }

  updateMarkdown()
}

const actions = [
  { label: 'Bold', handler: () => formatText('strong') },
  { label: 'Italic', handler: () => formatText('em') },
  { label: 'Link', handler: createLink },
  { label: 'Bullet List', handler: () => createList('ul') },
  { label: 'Numbered List', handler: () => createList('ol') }
]

// Convert content to Markdown
const updateMarkdown = () => {
  if (editorType.value === 'div') {
    const html = divRef.value.innerHTML
    markdown.value = convertHtmlToMarkdown(html)
  } else {
    markdown.value = content.value
  }
}

const handleInput = () => {
  updateMarkdown()
}

const handleInputSelection = () => {
  // You can add any special handling for input/textarea selection here
}

// Helper function to convert HTML to Markdown
const convertHtmlToMarkdown = (html) => {
  return html
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')
    .replace(/<ul>(.*?)<\/ul>/g, (match, p1) => {
      return p1.replace(/<li>(.*?)<\/li>/g, '- $1\n')
    })
    .replace(/<ol>(.*?)<\/ol>/g, (match, p1) => {
      let counter = 1
      return p1.replace(/<li>(.*?)<\/li>/g, () => `${counter++}. $1\n`)
    })
    .replace(/<div>/g, '\n')
    .replace(/<\/div>/g, '')
    .replace(/<br>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .trim()
    .replace(/\n\s*\n/g, '\n\n')
}

defineExpose({
  updateMarkdown,
  getMarkdown: () => markdown.value
})
</script>