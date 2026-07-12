<template>
  <h1>{{ t('home.title') }}</h1>
  <p>{{ t('home.activity-feed') }}</p>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
