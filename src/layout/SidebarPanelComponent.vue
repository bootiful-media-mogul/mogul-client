<template>
  <div ref="element" :class="visibilityCss">
    <div class="top">
      <div class="title navigable-section">
        {{ title }}
      </div>
      <div class="controls">
        <SidebarPanelWindowButtonComponent v-if="!maximized" class="maximize">
          <img alt="maximize" src="../assets/images/panel-maximize.png" @click="maximize" />
        </SidebarPanelWindowButtonComponent>

        <SidebarPanelWindowButtonComponent v-if="!(expanded || maximized)" class="show-hide">
          <img alt="minimize" src="../assets/images/panel-minimize.png" @click="show" />
        </SidebarPanelWindowButtonComponent>

        <SidebarPanelWindowButtonComponent v-if="expanded || maximized" class="show-hide">
          <img alt="close" src="../assets/images/panel-close.png" @click="hide" />
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
  background-color: #e6e6e6;
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
  font-size: smaller;
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
  z-index: 100;
  border-radius: 10px;
}

.closed {
  background-color: black;
}

.closed .content {
  display: none;
}
</style>

<script lang="ts" setup>
import { events } from '@/services'
import SidebarPanelWindowButtonComponent from './SidebarPanelWindowButtonComponent.vue'
import { computed, onMounted, ref } from 'vue'

const bgPanelNode = ref<HTMLElement>()
const expanded = ref<boolean>(false)
const maximized = ref<boolean>(false)
const element = ref<HTMLElement>()
const visibilityCss = computed(() => {
  return (
    ' panel sidebar-panel ' +
    (expanded.value ? 'expanded' : 'closed') +
    ' ' +
    (maximized.value ? 'maximized' : '')
  )
})

interface Props {
  readonly title: string
}

const props = defineProps<Props>()
const hide = function () {
  maximized.value = false
  expanded.value = false
  if (bgPanelNode.value) bgPanelNode.value.style.display = 'none'
}
const show = function () {
  expanded.value = true
  maximized.value = false
}
const maximize = function () {
  expanded.value = true
  maximized.value = true
  if (bgPanelNode.value) bgPanelNode.value.style.display = 'block'
}
onMounted(() => {
  const bpn = document.createElement('div')
  bpn.classList.add('bg-panel')
  document.body.appendChild(bpn)
  bgPanelNode.value = bpn
  //
  events.on('sidebar-panel-closed', (event: any) => {
    if (element.value!!.contains(event)) {
      hide()
    }
  })
  events.on('sidebar-panel-opened', (event: any) => {
    const contains = element.value!!.contains(event)
    if (contains) {
      show()
    }
  })
})
</script>
