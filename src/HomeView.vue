<template>
  <h1>{{ t('home.title') }}</h1>
  <p>{{ t('home.activity-feed') }}</p>

  <!-- publications -->
  <div v-if="mogulId" class="form-section">
    <div class="form-section-title">{{ t('home.publications') }}</div>
    <div class="publish-menu">
      <PublicationsSectionComponent :disabled="false" :publishable="mogulId + ''" :type="'mogul'">
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

const mogulId = ref<number | null>(null)

onMounted(async () => {
  mogulId.value = (await mogul.user()).id
})
</script>
