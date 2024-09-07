<template>
  <div :class="visibilityCss">
    <div class="sidebar-panel-top">
      <div class="visibility-controls">
        <a href="#" @click="hide" v-if="expanded">{{ $t('labels.close') }}</a>
        <a href="#" @click="show" v-if="!expanded">{{ title }}</a>
        | <a href="#" @click="maximize">+</a>
      </div>
    </div>
    <div class="sidebar-panel-content">
      <slot />
    </div>
    <div class="sidebar-panel-bottom"></div>
  </div>
</template>

<style>
.sidebar-panel-hidden .sidebar-panel-content {
  display: none;
}

.visibility-controls {
  text-transform: uppercase;
  font-weight: bold;
  font-size: smaller;
}

.visibility-controls a {
  color: white;
  font-size: small;
}

.sidebar-panel {
  width: var(--sidebar-width);
  right: 0;
  overflow: hidden;
  padding: var(--gutter-space);
  background-color: white;
  margin-bottom: var(--gutter-space);
}


/* Maximized (modal-like) state */
.sidebar-panel.maximized {
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

.sidebar-panel-hidden {
  background-color: black;
}


.sidebar-panel-visible .sidebar-panel-top {
  background-color: black;

  padding-bottom: calc(0.5 * var(--gutter-space));
  margin-left: calc(-1 * var(--gutter-space));
  margin-top: calc(-1 * var(--gutter-space));
  margin-right: calc(-1 * var(--gutter-space));
  padding-left: var(--gutter-space);
  padding-top: var(--gutter-space);
}

.sidebar-panel-visible .sidebar-panel-content {
  padding-top: var(--gutter-space);
}

.sidebar-panel a {
  text-decoration: none;
}

.sidebar-panel-visible {
}
</style>

<script lang="ts">
import { events } from '@/services'

export default {
  created() {
    // allow child components to ask for visibility in their parent panels
    events.on('sidebar-panel-closed', (event: any) => {
      if (this.$el.contains(event)) {
        this.hide()
      }
    })
    events.on('sidebar-panel-opened', (event: any) => {
      // does event match any of our children nodes? if so, we show visibility
      if (this.$el.contains(event)) {
        this.show()
      }
    })
  },

  data() {
    return {
      expanded: false,
      maximized: false
    }
  },

  props: ['title'],
  methods: {
    hide() {
      this.maximized = false
      this.expanded = false
    },
    show() {
      this.expanded = true
      this.maximized = false
    },
    maximize() {
      this.expanded = true
      this.maximized = true
    }
  },
  computed: {

    visibilityCss() {
      return (
        'panel sidebar-panel ' + (this.expanded ? 'sidebar-panel-visible' : 'sidebar-panel-hidden') + ' ' +
        (this.maximized ? 'maximized' : '')
      )
    }
  }
}
</script>
