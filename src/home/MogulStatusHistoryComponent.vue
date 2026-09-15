<template>
  <div class="form-section">
    <div class="form-section-title">{{ t('home.history.title') }}</div>

    <div class="history-controls">
      <label for="history-days">{{ t('home.history.days') }}</label>
      <select id="history-days" v-model.number="limit">
        <option v-for="choice in dayChoices" :key="choice" :value="choice">{{ choice }}</option>
      </select>
    </div>

    <div v-if="days.length === 0" class="history-empty">
      {{ t('home.history.nothing') }}
    </div>

    <div v-for="day in days" :key="day.status.id" class="history-day">
      <div class="history-day-date">{{ day.status.date }}</div>

      <div v-if="day.publications.length === 0" class="history-empty">
        {{ t('home.history.no-publications') }}
      </div>

      <div
        v-for="publication in day.publications"
        :key="publication.id"
        class="history-publication"
      >
        <div class="history-publication-row">
          <span class="plugin">{{ t('publications.outcomes.keys.' + publication.plugin) }}</span>
          <span class="created">{{ dateTimeToString(publication.created) }}</span>
          <span class="state">{{ publication.state }}</span>
        </div>

        <div v-for="outcome in publication.outcomes" :key="outcome.id" class="history-outcome">
          <Icon v-if="outcome.success" :icon="checkmarkAsset" :icon-hover="checkmarkAsset" />
          <Icon v-else :icon="errorAsset" :icon-hover="errorHighlightAsset" />
          <span class="key">{{ t('publications.outcomes.keys.' + outcome.key) }}</span>
          <a v-if="outcome.url" :href="outcome.url" class="uri" target="_blank">{{ outcome.url }}</a>
          <a
            v-else-if="outcome.serverErrorMessage"
            href="#"
            @click.prevent="popupErrorMessage(outcome.serverErrorMessage)"
          >
            {{ t('publications.outcomes.error-message') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-controls {
  padding-bottom: var(--gutter-space);
}

.history-day {
  padding-top: var(--gutter-space);
}

.history-day-date {
  font-weight: bolder;
  border-bottom: 1px solid black;
}

.history-publication-row {
  display: flex;
  gap: var(--gutter-space);
  padding-top: calc(var(--radius) * 1);
}

.history-publication-row .plugin {
  font-weight: bolder;
}

.history-outcome {
  display: flex;
  align-items: center;
  gap: calc(var(--gutter-space) / 2);
}

.history-outcome .uri {
  overflow-wrap: anywhere;
}

.history-empty {
  font-style: italic;
}
</style>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { mogulStatuses, type MogulStatusPublications } from '@/services'
import { dateTimeToString } from '@/dates'
import Icon from '@/ui/Icon.vue'
import checkmarkAsset from '@/assets/images/checkbox.png'
import errorAsset from '@/assets/images/error.png'
import errorHighlightAsset from '@/assets/images/error-highlight.png'
import { useNotificationListeners } from '@/composables/useNotificationListeners'

const { t } = useI18n()
const { listenForCategory } = useNotificationListeners()

const dayChoices = [7, 10, 30, 90]
const limit = ref<number>(10)
const days = ref<Array<MogulStatusPublications>>([])

async function refresh() {
  // one request for the whole window: the server batch-loads each day's publications
  // together, so raising this from 7 to 90 doesn't multiply the queries.
  days.value = await mogulStatuses.recent(limit.value)
}

async function popupErrorMessage(message: string) {
  if (message !== null) window.alert(message)
}

onMounted(refresh)
watch(limit, refresh)

listenForCategory('publication-completed-event', refresh)
</script>
