<script setup lang="ts">
import { mogul } from '@/services'
import SidebarPanelComponent from '@/layout/SidebarPanelComponent.vue'
import PreviewComponent from '@/managedfiles/PreviewComponent.vue'
import NotificationBox from '@/notifications/NotificationBox.vue'
import { onMounted, ref } from 'vue'

const mogulUsername = ref<string>()

onMounted(async () => {
  const res = await mogul.user()
  mogulUsername.value = `${res.givenName} ${res.familyName} (${res.email})`
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

        <SidebarPanelComponent title="Notes"></SidebarPanelComponent>
      </div>
    </div>
  </div>
</template>
