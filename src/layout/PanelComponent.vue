<style>
.panel-menu {
  background-color: black;
  padding: calc(var(--gutter-space) / 2);
  display: grid;
  grid-template-columns: auto min-content min-content;
}

.panel-menu-subtitle {
  font-size: smaller;
  text-transform: uppercase;
  font-family: 'arial Black', sans-serif;
  color: #777777;
}
.panel {
  background-color: lightgray;
  border-radius: var(--radius);
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  overflow: hidden;
  margin-bottom: var(--gutter-space);
  /* shadow */
  box-shadow: 0 var(--gutter-space) 40px rgba(0, 0, 0, 0.2);
}

.panel-menu-buttons {
  display: grid;
  grid-auto-flow: column;
  gap: calc(var(--gutter-space) / 3);
  grid-template-columns: repeat(auto-fill, max-content);
  place-items: center;
}

.panel-content {
  padding: var(--gutter-space);
  display: none;
}

.panel-content-visible {
  display: block;
}

.panel-menu-buttons-img {
  filter: invert(100%);
  cursor: pointer;
  width: calc(var(--gutter-space) * 0.7);
  height: calc(var(--gutter-space) * 0.7);
}

.panel-menu-title {
  font-size: smaller;
  text-transform: uppercase;
  color: white;
  font-family: 'arial Black', sans-serif;
}

.panel-maximized {
  position: absolute;
  top: 10%;
  left: 10%;
  right: 10%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 100;
  border-radius: var(--radius);
}
</style>

<template>
  <div ref="element" :class="{ 'panel-maximized': maximized }" class="panel">
    <div class="panel-menu">
      <div class="panel-menu-title navigable-section">
        {{ props.title }}
      </div>
      <div class="panel-menu-buttons">
        <div v-if="!maximized">
          <div v-if="!visible" class="open" @click.prevent="toggleVisible">
            <img :src="open" alt="open" class="panel-menu-buttons-img" />
          </div>
          <div v-else class="close" @click.prevent="toggleVisible">
            <img :src="minimize" alt="minimize" class="panel-menu-buttons-img" />
          </div>
        </div>
        <div>
          <img
            :src="max"
            alt="maximize"
            class="panel-menu-buttons-img"
            @click.prevent="toggleMaximize"
          />
        </div>
      </div>
    </div>
    <div :class="{ 'panel-content': true, 'panel-content-visible': visible }">
      <slot />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

import max from '@/assets/images/panel/simple-panel-open.png'
import minimize from '@/assets/images/panel/simple-panel-collapse.png'
import open from '@/assets/images/panel/simple-panel-maximize.png'
import { events } from '@/services'

const element = ref<HTMLElement>()

const visible = ref<boolean>(false)
const maximized = ref<boolean>(false)

const props = defineProps<{ title: string }>()

function toggleMaximize() {
  maximized.value = !maximized.value
  visible.value = maximized.value
}

function toggleVisible() {
  visible.value = !visible.value
}

events.on('sidebar-panel-closed', (event: any) => {
  if (element.value!!.contains(event)) {
    visible.value = false
  }
})

events.on('sidebar-panel-opened', (event: any) => {
  const contains = element.value!!.contains(event)
  if (contains) {
    visible.value = true
  }
})
</script>
