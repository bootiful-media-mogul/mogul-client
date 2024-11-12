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

.formatting-menu-toolbar {
  display: grid;
  grid-template-areas: ' . toolbar . ';
  grid-template-columns: auto auto auto;
}

.formatting-menu {
  display: grid;
  grid-auto-flow: column;
  gap: 0;
  grid-area: toolbar;
  justify-self: center;
  max-width: fit-content;
  align-items: center;
  padding-top: var(--gutter-space);
  padding-bottom: var(--gutter-space);
}

.formatting-menu img {
  max-width: calc(var(--icon-width) * 0.8);
  padding: 0 calc(var(--icon-width) / 2);
}
</style>
<template>
  <InputWrapperChild>
    <template v-slot:panel>
      <div>
        <div class="rendered-preview">
          <div v-if="props.modelValue.trim() !== ''" v-html="rendered"></div>
          <div v-if="props.modelValue.trim() === ''">(nothing to preview)</div>
        </div>
      </div>
    </template>
    <template v-slot:toolbar>
      <div class="formatting-menu-toolbar">
        <div class="formatting-menu">
          <Icon
            @click.prevent="formatText('strong')"
            icon-hover="../src/assets/images/formatting-icons/bold.png"
            icon="../src/assets/images/formatting-icons/bold.png"
          />
          <Icon
            @click.prevent="formatText('em')"
            icon-hover="../src/assets/images/formatting-icons/italics.png"
            icon="../src/assets/images/formatting-icons/italics.png"
          />
          <Icon
            @click.prevent="formatText('link')"
            icon-hover="../src/assets/images/link.png"
            icon="../src/assets/images/link-highlight.png"
          />
          <Icon
            @click.prevent="formatText('list')"
            icon-hover="../src/assets/images/formatting-icons/list.png"
            icon="../src/assets/images/formatting-icons/list.png"
          />
        </div>
      </div>
    </template>
    <template v-slot:icon>
      <Icon :icon="asset" :icon-hover="assetHighlight" />
    </template>
  </InputWrapperChild>
</template>
<script lang="ts" setup>
import asset from '@/assets/images/markdown/markdown-preview.png'
import assetHighlight from '@/assets/images/markdown/markdown-preview-highlight.png'
import InputWrapperChild from '@/ui/input/InputWrapperChild.vue'
import { markdown } from '@/services'
import { inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { GetInputElementFunction, UpdateValueFunction } from '@/ui/input/input'
import Icon from '@/ui/Icon.vue'

const updateValue = inject<UpdateValueFunction>('updateInputValue')!
const getInputElement = inject<GetInputElementFunction>('getInputElement')!


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
  }, 100)
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
