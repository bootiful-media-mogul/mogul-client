<template>
  <h1>{{ t('home.title') }}</h1>
  <p>{{ t('home.activity-feed') }}</p>

  <!-- publications -->
  <div v-if="mogulStatusId" class="form-section">
    <div class="form-section-title">{{ t('home.publications') }}</div>
    <div class="publish-menu">
      <PublicationsSectionComponent
        :disabled="false"
        :publishable="mogulStatusId + ''"
        :type="'mogulStatus'"
      >
        <Ayrshare />
      </PublicationsSectionComponent>
    </div>
  </div>
</template>
<script lang="ts" setup>
import 'v-calendar/style.css'

import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { mogul } from '@/services'
import PublicationsSectionComponent from '@/publications/PublicationsSectionComponent.vue'
import Ayrshare from '@/home/publications/Ayrshare.vue'

const { t } = useI18n()

// we publish today's status, not the mogul: the mogul is an identity that never
// ends, and publications hung off one accumulate forever.
const mogulStatusId = ref<number | null>(null)

onMounted(async () => {
  mogulStatusId.value = (await mogul.todayStatus()).id
})
</script>
