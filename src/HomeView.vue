<template>
  <h1>{{ t('home.title') }}</h1>
  <p>{{ t('home.activity-feed') }}</p>
</template>
<script lang="ts" setup>
import 'v-calendar/style.css'

import { useI18n } from 'vue-i18n'
// import { ref } from 'vue'

// const date = ref({ start: new Date(), end: new Date() })
const { t } = useI18n()
</script>
