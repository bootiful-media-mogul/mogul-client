<script lang="ts" setup>
import { mogul } from '@/services'
import PreviewComponent from '@/managedfiles/PreviewComponent.vue'
import NotificationBoxComponent from '@/notifications/NotificationBoxComponent.vue'
import { onMounted, ref } from 'vue'
import TranscriptComponent from '@/transcripts/TranscriptComponent.vue'
import PanelComponent from '@/layout/PanelComponent.vue'
import Search from '@/search/Search.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import NotesComponent from '@/notes/NotesComponent.vue'
import TabBar from '@/layout/TabBar.vue'
import Icon from '@/ui/Icon.vue'

import homeIconAsset from '@/assets/images/navbar/home-icon.png'
import homeIconAssetHighlight from '@/assets/images/navbar/home-icon-highlight.png'

import settingsIconAsset from '@/assets/images/navbar/settings-icon.png'
import settingsIconAssetHighlight from '@/assets/images/navbar/settings-icon-highlight.png'

import podcastIconAsset from '@/assets/images/navbar/podcast-icon.png'
import podcastIconAssetHighlight from '@/assets/images/navbar/podcast-icon-highlight.png'

import blogIconAsset from '@/assets/images/navbar/blogs-icon.png'
import blogIconAssetHighlight from '@/assets/images/navbar/blogs-icon-highlight.png'

import jobsIconAsset from '@/assets/images/navbar/jobs-icon.png'
import jobsIconAssetHighlight from '@/assets/images/navbar/jobs-icon-highlight.png'

import router from '@/index'

const { t } = useI18n()
const route = useRoute()
const mogulUsername = ref<string | null>(null)
const activeTab = ref<string>('main')

function goPodcasts() {
  router.push({
    path: '/podcasts',
    query: {
      when: Date.now()
    }
  })
}
function go(view: string) {
  router.push({ name: view })
}

onMounted(async () => {
  const res = await mogul.user()
  if (res && res.email) {
    mogulUsername.value = `${res.givenName} ${res.familyName} (${res.email})`
  } //
  else {
    console.log('could not get user info from mogul.user()')
  }
})
</script>
<style scoped>
.global-toolbar {
  margin-bottom: var(--gutter-space);
  margin-top: var(--gutter-space);
  display: flex;
  grid-area: global-toolbar;

  place-self: center;
  flex: 1;
  gap: var(--gutter-space);

  img {
    max-height: calc(3 * var(--gutter-space));
    width: auto;
  }
}
</style>
<template>
  <div v-if="mogulUsername" class="app-wrapper">
    <NotificationBoxComponent ref="notifications" />
    <div class="frame">
      <div class="page">
        <div class="hello">{{ t('hello', { mogul: mogulUsername }) }}</div>
        <div class="search">
          <Search />
        </div>

        <div class="global-toolbar">
          <Icon
            @click.prevent="go('home')"
            :icon-hover="homeIconAssetHighlight"
            :icon="homeIconAsset"
          />
          <Icon
            @click.prevent="goPodcasts"
            :icon-hover="podcastIconAssetHighlight"
            :icon="podcastIconAsset"
          />
          <Icon
            @click.prevent="go('blogs')"
            :icon-hover="blogIconAssetHighlight"
            :icon="blogIconAsset"
          />
          <Icon
            @click.prevent="go('settings')"
            :icon-hover="settingsIconAssetHighlight"
            :icon="settingsIconAsset"
          />
          <Icon
            @click.prevent="go('jobs')"
            :icon-hover="jobsIconAssetHighlight"
            :icon="jobsIconAsset"
          />
        </div>

        <!-- Mobile Tab Bar -->
        <TabBar v-model="activeTab" />

        <!-- Main content area - shown on desktop always, on mobile only when activeTab is 'main' -->
        <div
          class="view"
          :class="{ 'mobile-tab-content': true, 'mobile-hidden': activeTab !== 'main' }"
        >
          <router-view :key="route.fullPath"></router-view>
        </div>

        <!-- Sidebar - shown on desktop always, on mobile as individual tabs -->
        <div class="sidebar">
          <div :class="{ 'mobile-tab-content': true, 'mobile-hidden': activeTab !== 'notes' }">
            <PanelComponent :title="t('app.panels.notes')">
              <NotesComponent />
            </PanelComponent>
          </div>

          <div :class="{ 'mobile-tab-content': true, 'mobile-hidden': activeTab !== 'media' }">
            <PanelComponent :title="t('app.panels.media-preview')">
              <PreviewComponent />
            </PanelComponent>
          </div>

          <div
            :class="{ 'mobile-tab-content': true, 'mobile-hidden': activeTab !== 'transcripts' }"
          >
            <PanelComponent :title="t('app.panels.transcripts')">
              <TranscriptComponent />
            </PanelComponent>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-bumper"></div>
      <div class="footer-content">
        <router-link to="/about">{{ t('app.menu.about') }}</router-link>
      </div>
    </div>
  </div>
</template>
