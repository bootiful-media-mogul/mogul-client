<style>
.panel-menu {
  background-color: black;
  padding: calc(var(--gutter-space) / 2);

  display: grid;
  grid-template-columns: auto min-content min-content;
  gap: var(--gutter-space);
}

.panel {
  background-color: white;
  border-radius: var(--radius);

  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  overflow: hidden;

  right: 0;
  width: 300px;
  border: 1px solid black;
  margin-bottom: var(--gutter-space);
}

.panel-menu-buttons {
  display: grid;
  grid-template-columns: auto auto;
  gap: calc(var(--gutter-space) / 2);
}

.panel-content {
  padding: var(--gutter-space);
}

.panel-menu-buttons-img {
  filter: invert(100%);
  width: calc(var(--gutter-space) * 0.7);
}

.panel-menu-title {
  font-size: smaller;

  text-transform: uppercase;
  color: white;
}
</style>

<template>
  <div class="panel">
    <div class="panel-menu">
      <div class="panel-menu-title navigable-section">transcription</div>
      <div class="panel-menu-buttons">

        <div v-if="!visible" class="open" @click.prevent="toggleVisible">
          <img :src="open" alt="plus" class="panel-menu-buttons-img" />
        </div>
        <div v-else  class="close" @click.prevent="toggleVisible">
          <img :src="minimize" alt="plus" class="panel-menu-buttons-img" />
        </div>

        <img :src="max" alt="plus" class="panel-menu-buttons-img" />
        
      </div>
    </div>
    <div v-if="visible" class="panel-content">this is a panel</div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

import max from '@/assets/images/panel/simple-panel-open.png'
import minimize from '@/assets/images/panel/simple-panel-collapse.png'
import open from '@/assets/images/panel/simple-panel-maximize.png'
import close from '@/assets/images/panel/simple-panel-close.png'

const visible = ref<boolean>(false)

function toggleVisible() {
  visible.value = !visible.value
}
</script>
