<template></template>
<style scoped></style>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { inject, onMounted } from 'vue'

import type { GetInputElementFunction, UpdateValueFunction } from '@/ui/input/input'

const { t } = useI18n()

const updateValue = inject<UpdateValueFunction>('updateInputValue')!
const getInputElement = inject<GetInputElementFunction>('getInputElement')!

onMounted(() => {})
</script>
