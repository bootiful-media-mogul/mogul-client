<script lang="ts" setup>
import { mogul } from '@/services'
import SidebarPanelComponent from '@/layout/SidebarPanelComponent.vue'
import PreviewComponent from '@/managedfiles/PreviewComponent.vue'
import NotificationBox from '@/notifications/NotificationBox.vue'
import { onMounted, ref } from 'vue'
import TranscriptionPanel from '@/transcription/TranscriptionComponent.vue'

const mogulUsername = ref<string>()

onMounted(async () => {
  const max = 3
  let i = 0
  while (i < max) {
    const res = await mogul.user()
    if (res.email) {
      mogulUsername.value = `${res.givenName} ${res.familyName} (${res.email})`
      break
    }
    i += 1
    console.debug('it did not work the first time, trying to authenticate again...')
  }
})
</script>

<template>
  <NotificationBox ref="notifications" />

  <div class="frame">
    <div class="page">
      <div class="welcome">
        {{ $t('hello', { mogul: mogulUsername }) }}
      </div>

      <div class="view">
        <router-view></router-view>
      </div>

      <div class="toolbar navigable-section">
        <router-link to="/">{{ $t('app.menu.home') }}</router-link>
        |
        <router-link to="/settings">{{ $t('app.menu.settings') }}</router-link>
        |
        <router-link to="/podcasts">{{ $t('app.menu.podcasts') }}</router-link>
        |
        <router-link to="/about">{{ $t('app.menu.about') }}</router-link>
      </div>

      <div class="sidebar">
        <SidebarPanelComponent title="Media Preview">
          <PreviewComponent />
        </SidebarPanelComponent>

        <SidebarPanelComponent title="Transcription">
          <TranscriptionPanel />
        </SidebarPanelComponent>

        <SidebarPanelComponent title="Notes" />
      </div>
    </div>
  </div>
</template>
