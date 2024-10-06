<template>
  <div :class="visibilityCss">
    <div class="top">
      <div class="title navigable-section">
        {{ title }}
      </div>
      <div class="controls">
        <SidebarPanelWindowButtonComponent v-if="!maximized" class="maximize">
          <img @click="maximize" src="../assets/images/panel-maximize.png" alt="maximize" />
        </SidebarPanelWindowButtonComponent>

        <SidebarPanelWindowButtonComponent class="show-hide" v-if="!(expanded || maximized)">
          <img @click="show" src="../assets/images/panel-minimize.png" alt="minimize" />
        </SidebarPanelWindowButtonComponent>

        <SidebarPanelWindowButtonComponent v-if="expanded || maximized" class="show-hide">
          <img @click="hide" src="../assets/images/panel-close.png" alt="close" />
        </SidebarPanelWindowButtonComponent>
      </div>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style>
.bg-panel {
  background-color: white;
  opacity: 0.6;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: none;
}

.sidebar-panel {
  width: var(--sidebar-width);
  right: 0;
  overflow: hidden;
  padding: var(--gutter-space);
  background-color: white;
  margin-bottom: var(--gutter-space);
}

.sidebar-panel .content {
  padding-top: var(--gutter-space);
}

.sidebar-panel .top {
  background-color: black;

  padding-bottom: calc(0.5 * var(--gutter-space));
  margin-left: calc(-1 * var(--gutter-space));
  margin-top: calc(-1 * var(--gutter-space));
  margin-right: calc(-1 * var(--gutter-space));
  padding-left: var(--gutter-space);
  padding-top: var(--gutter-space);

  display: grid;
  grid-template-areas: 'title controls';
  grid-template-columns: 1fr auto;
  gap: 0;
}

.sidebar-panel .top .title {
  grid-area: title;
  color: white;
  text-transform: uppercase;
  text-decoration: none;
  font-weight: bold;
}

.sidebar-panel .top .controls {
  grid-area: controls;
  display: grid;
  grid-template-areas: 'maximize show-hide';
  grid-template-columns: auto auto;
  position: relative;
  align-items: center;
  padding-right: var(--gutter-space);
}

.sidebar-panel .top .controls .title {
  grid-area: title;
}

.sidebar-panel .top .controls .show-hide {
  grid-area: show-hide;
  margin-left: calc(var(--gutter-space) / 2);
}

.sidebar-panel .top {
}

.maximized {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  border-radius: 10px;
}

.closed {
  background-color: black;
}

.closed .content {
  display: none;
}
</style>

<script lang="ts">
import { events } from '@/services'
import SidebarPanelWindowButtonComponent from './SidebarPanelWindowButtonComponent.vue'

export default {
  computed: {
    visibilityCss() {
      return (
        ' panel sidebar-panel ' +
        (this.expanded ? 'expanded' : 'closed') +
        ' ' +
        (this.maximized ? 'maximized' : '')
      )
    }
  },
  mounted() {
    const bgPanelNode = document.createElement('div')
    bgPanelNode.classList.add('bg-panel')
    document.body.appendChild(bgPanelNode)
    this.bgPanelNode = bgPanelNode
  },
  created() {
    console.log('created')
    // allow child components to ask for visibility in their parent panels
    events.on('sidebar-panel-closed', (event: any) => {
      if (this.$el.contains(event)) {
        this.hide()
      }
    })
    events.on('sidebar-panel-opened', (event: any) => {
      const contains = this.$el.contains(event)
      if (contains) {
        this.show()
      }
    })
  },

  components: {
    SidebarPanelWindowButtonComponent
  },

  data() {
    return {
      bgPanelNode: null as HTMLElement | null,
      expanded: false,
      maximized: false
    }
  },

  props: ['title'],
  methods: {
    debug() {
    },
    hide() {
      this.maximized = false
      this.expanded = false
      if (this.bgPanelNode) this.bgPanelNode.style.display = 'none'
      this.debug()
    },
    show() {
      this.expanded = true
      this.maximized = false
      this.debug()
    },
    maximize() {
      this.expanded = true
      this.maximized = true

      if (this.bgPanelNode) this.bgPanelNode.style.display = 'block'

      this.debug()
    }
  }
}
</script>
