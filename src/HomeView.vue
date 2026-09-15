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
        :show-existing-publications="false"
        :type="'mogulStatus'"
      >
        <Ayrshare />
      </PublicationsSectionComponent>
    </div>
  </div>

  <!-- the last N days, each with what went out on it. gated on today's status
       existing: child mounted hooks run before the parent's, so without this the
       first load of a new day would fetch before today's row was created. -->
  <MogulStatusHistoryComponent v-if="mogulStatusId" />
</template>
<script lang="ts" setup>
import 'v-calendar/style.css'

import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { mogul } from '@/services'
import PublicationsSectionComponent from '@/publications/PublicationsSectionComponent.vue'
import Ayrshare from '@/home/publications/Ayrshare.vue'
import MogulStatusHistoryComponent from '@/home/MogulStatusHistoryComponent.vue'

const { t } = useI18n()

// we publish today's status, not the mogul: the mogul is an identity that never
// ends, and publications hung off one accumulate forever.
const mogulStatusId = ref<number | null>(null)

onMounted(async () => {
  mogulStatusId.value = (await mogul.todayStatus()).id
})
</script>
