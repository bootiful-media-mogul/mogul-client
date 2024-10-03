<!--
 renders a list of all the existing podcasts
-->
<script lang="ts">
import AiChatComponent from '@/ai/AiChatComponent.vue'

import { mogul } from '@/services'
import SidebarPanelComponent from '@/layout/SidebarPanelComponent.vue'
import PreviewComponent from '@/managedfiles/PreviewComponent.vue'
import NotificationBox from '@/notifications/NotificationBox.vue'

export default {
  components: {
    NotificationBox, AiChatComponent, PreviewComponent, SidebarPanelComponent
  },

  methods: {},

  data() {
    const mogul = ''
    return {
      mogul
    }
  },
  async created() {
    const user = await mogul.user()
    this.mogul = user.displayName
  }
}
</script>

<template>
  <NotificationBox ref="notifications" />

  <div class="frame">
    <div class="page">
      <div class="welcome">
        {{ $t('hello', { mogul: mogul }) }}
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
        <SidebarPanelComponent title="A.I.">
          <AiChatComponent />
        </SidebarPanelComponent>

        <SidebarPanelComponent title="Media Preview">
          <PreviewComponent />
        </SidebarPanelComponent>

        <SidebarPanelComponent title="Notes"></SidebarPanelComponent>
      </div>
    </div>
  </div>
</template>
