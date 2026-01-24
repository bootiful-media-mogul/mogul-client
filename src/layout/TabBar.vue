<template>
  <div class="tab-bar-container">
    <div class="tab-bar">
      <a
        href="#"
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab', { 'tab-active': activeTab === tab.id }]"
        @click.prevent="selectTab(tab.id)"
        >{{ tab.label }}</a
      >
    </div>
    <div class="tab-bar-bumper"><div class="tab-bar-bumper-corners"></div></div>
  </div>
</template>

<style scoped>
.tab-bar-bumper {
  background-color: black;

  position: relative;
  margin-bottom: var(--gutter-space);
  .tab-bar-bumper-corners {
    border-top-left-radius: var(--radius);
    border-top-right-radius: var(--radius);
    background-color: var(--bg-color);
    height: var(--gutter-space);
  }
}

.tab-bar-container {
  display: block;
}

.tab-bar {
  display: flex;
  background-color: black;

  padding-left: var(--gutter-space);
  gap: var(--gutter-space-half);
  padding-top: var(--gutter-space-third);
  padding-bottom: var(--gutter-space-third);
}

.tab {
  background-color: transparent;
  cursor: pointer;
  text-align: center;
  font-size: smaller;
  text-transform: uppercase;
  color: white;
  font-family: 'arial Black', sans-serif;
  /*border-top-left-radius: var(--radius);
  border-top-right-radius: var(--radius);*/

  padding: var(--gutter-space-third);
  text-decoration: none;
  border-radius: var(--radius);
}

.tab-active {
  background-color: white;
  color: black;
}

.tab:hover:not(.tab-active) {
  background-color: gray;
  color: rgba(0, 0, 0, 0.7);
}

/* Hide on desktop */
@container app (min-width: 900px) {
  .tab-bar-container {
    display: none;
  }
}
</style>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { events } from '@/services'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

export interface Tab {
  id: string
  label: string
}

interface Props {
  modelValue?: string
}

const props = defineProps<Props>()

const tabs = ref<Tab[]>([
  { id: 'main', label: t('app.tabs.main') },
  { id: 'notes', label: t('app.panels.notes') },
  { id: 'media', label: t('app.panels.media-preview') },
  { id: 'transcripts', label: t('app.panels.transcripts') }
])

const activeTab = ref<string>(props.modelValue || 'main')

const emit = defineEmits<{
  (e: 'update:modelValue', tabId: string): void
}>()

function selectTab(tabId: string) {
  activeTab.value = tabId
  emit('update:modelValue', tabId)
}

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && newValue !== activeTab.value) {
      activeTab.value = newValue
    }
  }
)

onMounted(() => {
  // todo yuck refactor this so that there's a new Tab component that self-aggregates into this TabBar
  // Listen for sidebar panel events and switch to appropriate tab
  events.on('sidebar-panel-opened', (element: any) => {
    // Determine which panel was opened by checking the parent element
    if (element && element.closest) {
      const panelElement = element.closest('.panel')
      if (panelElement) {
        const title = panelElement.querySelector('.panel-menu-title')?.textContent?.trim()
        // Match panel title to tab
        if (title === t('app.panels.notes')) {
          selectTab('notes')
        } else if (title === t('app.panels.media-preview')) {
          selectTab('media')
        } else if (title === t('app.panels.transcripts')) {
          selectTab('transcripts')
        }
      }
    }
  })
})
</script>
