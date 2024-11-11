<style>
.rendered-preview {
  font-size: small;
  padding: calc(var(--gutter-space) / 3);
}

.rendered-preview {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
    margin-bottom: 0;
    line-height: 1;
  }
}

a.icon {
  height: var(--icon-width);
  display: inline-block;
  width: var(--icon-width);
  background-size: var(--icon-width) var(--icon-width);
  
  .strong-icon {
    background: url('../../../src/assets/images/formatting-icons/bold.png');
  }

  a.em-icon {
    background: url('../../../src/assets/images/formatting-icons/italics.png');

  }

  a.link-icon {

  }

  a.list-icon {
  }

}


</style>
<template>
  <InputWrapperChild>
    <template v-slot:panel>
      <div>
        <div class="formatting-menu">
          <a class="strong-icon" href="#" @click.prevent="formatText('strong')">bold</a> |
          <a class="em-icon" href="#" @click.prevent="formatText('em')">italics</a> |
          <a class="link-icon" href="#" @click.prevent="formatText('link')">link</a> |
          <a class="list-icon" href="#" @click.prevent="formatText('list')">list</a>
        </div>
        <div class="rendered-preview">
          <div v-if="props.modelValue.trim() !== ''" v-html="rendered"></div>
          <div v-if="props.modelValue.trim() === ''">(nothing to preview)</div>
        </div>
      </div>
    </template>
    <template v-slot:icon>
      <InputWrapperMenuButton :icon="asset" :icon-hover="assetHighlight" />
    </template>
  </InputWrapperChild>
</template>
<script lang="ts" setup>
import asset from '@/assets/images/markdown/markdown-preview.png'
import assetHighlight from '@/assets/images/markdown/markdown-preview-highlight.png'
import InputWrapperChild from '@/ui/input/InputWrapperChild.vue'
import InputWrapperMenuButton from '@/ui/input/InputWrapperMenuButton.vue'
import { markdown } from '@/services'
import { inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { GetInputElementFunction, ReadValueFunction, UpdateValueFunction } from '@/ui/input/input'

const updateValue = inject<UpdateValueFunction>('updateInputValue')!
const getInputElement = inject<GetInputElementFunction>('getInputElement')!
const readValue = inject<ReadValueFunction>('readInputValue')!

interface Props {
  readonly modelValue: string
}

let timer = -1
const needed = ref<boolean>(false)
const props = defineProps<Props>()
const rendered = ref<string>('')

const render = async (md: string) => {
  if (!md || md.trim() === '' || !needed.value) return

  rendered.value = await markdown.render(md)
}

/* new editor capabilities */

const formatText = (format: string) => {
  const value: string = getInputElement()!!.value
  const selection = getSelection()
  if (!selection) return

  const { text, start, end } = selection

  const handleListificationOf = function(): string {
    // several scenarios:
    // 1. the text is all the text on a given line
    // 2. the text is part of a body of text before and after it
    // 3. there are several lines with newlines in the text selected

    // 1. simply add a bullet point before the line and call it good
    if (start > 0 && value.charAt(start - 1) == '\n') insertAtCursor(`* ${text}`)

    // 2. add a newline before, a bullet, and a newline after
    if (text.indexOf('\n') == -1) {
      insertAtCursor(`\n * ${text}\n`)
    } //
    else {
      // 3. add bullets before each line
      insertAtCursor(
        text
          .split('\n')
          .map((line) => {
            return `* ${line}`
          })
          .join('\n')
      )
    }
  }

  switch (format) {
    case 'link':
      //todo use vue i18n for this message
      insertAtCursor(`[${text}](${window.prompt('where should the link go?')})`)
      break
    case 'list':
      handleListificationOf(text)
      break
    case 'strong':
      insertAtCursor(`**${text}**`)
      break
    case 'em':
      insertAtCursor(`*${text}*`)
      break
    default:
      insertAtCursor(text)
  }
}

const getSelection = () => {
  const element = getInputElement()
  if (!element) return null
  return {
    text: element.value.substring(element.selectionStart, element.selectionEnd),
    range: null,
    start: element.selectionStart,
    end: element.selectionEnd,
    isContentEditable: false
  }
}

const insertAtCursor = async (text, movePosition = 0) => {
  const element = getInputElement()
  if (!element) return
  const start = element.selectionStart
  const end = element.selectionEnd
  const before = element.value.substring(0, start)
  const after = element.value.substring(end)

  updateValue(before + text + after)
  await render(props.modelValue)
  // Set cursor position
  await nextTick(() => {
    const newPosition = start + text.length + movePosition
    element.selectionStart = newPosition
    element.selectionEnd = newPosition
  })
}

/* new editor capabilities */

const debouncingRender = async () => {
  if (timer && timer > -1) {
    clearTimeout(timer)
  }
  timer = window.setTimeout(async () => {
    await render(props.modelValue)
  }, 1000)
}

onMounted(() => {
  needed.value = true
})

onUnmounted(() => {
  needed.value = false
})

watch(
  () => props.modelValue,
  (o: string, n: string) => {
    debouncingRender()
  }
)
</script>
