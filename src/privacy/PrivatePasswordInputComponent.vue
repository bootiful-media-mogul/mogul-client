<template>
  <a ref="icon" class="private-password-preview-link" href="#" @click="togglePreview"></a>
</template>

<style>
.private-password-preview-link {
  background: url('../assets/images/privacy-preview.png');
  height: var(--icon-size);
  width: var(--icon-size);
  background-size: var(--icon-size) var(--icon-size);
  background-repeat: no-repeat;
  background-position: left;
}

.private-password-preview-link:hover,
.private-password-preview-link.clicked {
  background: url('../assets/images/privacy-preview-highlight.png');
  background-size: var(--icon-size) var(--icon-size);
  background-repeat: no-repeat;
  background-position: left;
}

label .private-password-preview-link {
  position: absolute;
  padding-top: calc(var(--icon-size) - calc(var(--icon-size) / 2));
}
</style>

<script lang="ts" setup>
import { formInputForLabel, positionIconRelativeToFormInputForParentLabel } from '@/components'
import { onMounted, ref } from 'vue'

const icon = ref<HTMLElement>()

const togglePreview = function (e: Event) {
  e.preventDefault()
  const iconEl = icon.value!!
  const input = formInputForLabel(iconEl.parentElement as HTMLElement) as HTMLInputElement
  input.type = input.type.toLowerCase() === 'password' ? 'text' : 'password'
  if (input.type == 'text') {
    iconEl.classList.add('clicked')
  } //
  else {
    iconEl.classList.remove('clicked')
  }
}

onMounted(() => {
  positionIconRelativeToFormInputForParentLabel(icon.value!!, (x) => x)
})
</script>
