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
  components: { NotificationBox, AiChatComponent, PreviewComponent, SidebarPanelComponent },

  methods: {},

  data() {
    const mogul = ''
    return {
      mogul
    }
  },
  async created() {
    this.mogul = await mogul.me()
  }
}
</script>

<template>
  <NotificationBox ref="notifications" />

  <div class="frame">
    <div class="page">
      <div class="welcome">
        {{ $t('hello') }} <span style="font-weight: bold"> {{ mogul }} </span>!
      </div>

      <div class="view">
        <router-view></router-view>
      </div>

      <div class="toolbar">
        <router-link to="/">{{ $t('app.menu.home') }}</router-link>
        |
        <router-link to="/settings">{{ $t('app.menu.settings') }}</router-link>
        |
        <router-link to="/podcasts">{{ $t('app.menu.podcasts') }}</router-link>
      </div>

      <div class="sidebar">
        <SidebarPanelComponent title="A.I.">
          <AiChatComponent />
        </SidebarPanelComponent>

        <SidebarPanelComponent title="Media Preview">
          <PreviewComponent />
        </SidebarPanelComponent>

        <SidebarPanelComponent title="Notes"></SidebarPanelComponent>

        <SidebarPanelComponent title="Transcription"></SidebarPanelComponent>
      </div>
    </div>
    <div class="footer">
      <span
        v-html="
          $t('app.made-with-love', {
            josh: '<a href=\'https://youtube.com/@coffeesoftware\'>Josh Long</a>'
          })
        "
      ></span>
    </div>
  </div>
</template>
