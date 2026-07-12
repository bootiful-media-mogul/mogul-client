<template>
  <PublicationPanelComponent plugin="transcript">
    <template v-slot:panel>{{ t('publications.plugins.transcript.download') }}</template>
    <template v-slot:icon>{{ t('publications.plugins.transcript.title') }}</template>
  </PublicationPanelComponent>
</template>
<script lang="ts" setup>
import PublicationPanelComponent from '@/publications/PublicationPanelComponent.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
