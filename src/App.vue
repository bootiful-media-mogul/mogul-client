<script lang="ts" setup>
import { mogul } from '@/services'
import PreviewComponent from '@/managedfiles/PreviewComponent.vue'
import NotificationBoxComponent from '@/notifications/NotificationBoxComponent.vue'
import { onMounted, ref } from 'vue'
import TranscriptComponent from '@/transcripts/TranscriptComponent.vue'
import PanelComponent from '@/layout/PanelComponent.vue'
import Search from '@/search/Search.vue'

const mogulUsername = ref<string | null>(null)

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

<template>
  <div v-if="mogulUsername">
    <NotificationBoxComponent ref="notifications" />

    <div class="frame">
      <div class="page">
        <div class="hello">{{ $t('hello', { mogul: mogulUsername }) }}</div>
        <div class="search">
          <Search />
        </div>
        <div class="view">
          <router-view :key="$route.fullPath"></router-view>
        </div>

        <div class="toolbar">
          <div class="navigable-section navigation-links">
            <router-link to="/">{{ $t('app.menu.home') }}</router-link>
            |
            <router-link to="/settings">{{ $t('app.menu.settings') }}</router-link>
            |
            <router-link
              :to="{
                path: '/podcasts',
                query: {
                  when: Date.now()
                }
              }"
              >{{ $t('app.menu.podcasts') }}
            </router-link>
            |
            <router-link to="/blogs">{{ $t('app.menu.blogs') }}</router-link>
            |
            <router-link to="/about">{{ $t('app.menu.about') }}</router-link>
          </div>
        </div>
        <div class="sidebar">
          <PanelComponent :title="$t('app.panels.media-preview')">
            <PreviewComponent />
          </PanelComponent>

          <PanelComponent :title="$t('app.panels.transcripts')">
            <TranscriptComponent />
          </PanelComponent>

          <PanelComponent :title="$t('app.panels.notes')"></PanelComponent>
        </div>
      </div>
    </div>
  </div>
</template>
