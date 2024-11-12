<template>
  <Icon ref="icon"
        sticky
        class="icon"
        @click.prevent="togglePreview"
        icon-hover="/src/assets/images/privacy-preview.png"
        icon="/src/assets/images/privacy-preview-highlight.png"
  />

<!--  ../../assets/images/writing-tools/proofread.png-->
</template>

<style scoped>
.icon {
  position: absolute;
}
</style>

<script lang="ts" setup>

import { getCurrentInstance, onMounted, ref } from 'vue'

import Icon from '@/ui/Icon.vue'

const icon = ref<HTMLElement>()
const input = ref<HTMLInputElement>()

function formInputForLabel(childElement: HTMLElement) {
  const forElementIdName = childElement.getAttribute('for')
  if (forElementIdName != null && forElementIdName.toString().trim() != '')
    return document.getElementById(forElementIdName) as HTMLElement
  return null
}

function positionIcon(parent: HTMLElement, icon: HTMLElement) {
  const formElement = formInputForLabel(parent)
  input.value = formElement
  const resizeFunction = () => {
    const formElementRect = formElement.getBoundingClientRect()
    const iconRect = icon.getBoundingClientRect()
    const h = iconRect.height == 0 ? 20 : iconRect.height
    const y = formElementRect.top + ((formElementRect.height - h) / 2)
    icon.style.left = formElementRect.right + 5 + 'px'
    icon.style.top = y + 'px'
  }
  new ResizeObserver(resizeFunction).observe(formElement)

}

const togglePreview = function(e: Event) {
  input.value.type = input.value.type.toLowerCase() === 'password' ? 'text' : 'password'
}

onMounted(() => {
  const i = getCurrentInstance()
  if (i?.proxy?.$el) {
    const parent = i?.proxy.$el.parentElement as HTMLElement
    positionIcon(parent, icon.value!!.$el)
  }
})
</script>
