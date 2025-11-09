<style>


.top-right-trigger {
  position: fixed;
  top: var(--gutter-space);
  right: var(--gutter-space);
  background: #fff;
}

/* hidden by default; JS will add .is-open */
.expanding-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9998;
  overflow-y: auto; /* so tall content can scroll */
  transform-origin: top right;
  transform: scale(0); /* start collapsed in top-right */
  opacity: 0;
  pointer-events: none;
}

/* animation class */
.expanding-panel.is-open {
  animation: expandPanel 350ms ease-out forwards;
  pointer-events: auto;
}

/* the actual white background that fades in */
.expanding-panel__bg {
  min-height: 100vh;
  /* start transparent at the top-right, go to white */
  background: white;
  padding: 24px;
  box-sizing: border-box;
}

@keyframes expandPanel {
  0% {
    transform: scale(0);
    opacity: 0;
    background: rgba(255, 255, 255, 0);
  }
  40% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
    background: rgba(255, 255, 255, 1);
  }
}

/* optional: close button inside */
.panel-close {
  position: sticky;
  top: 0;
  right: 0;
  display: inline-block;
  margin-left: auto;
  background: #eee;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 4px;
}
</style>
<template>
  <a class="top-right-trigger" ref="openPanelElement">
    <input  @keydown.enter="openPanelFunction"   :value="search" />
  </a>

  <div class="expanding-panel" ref="expandingPanel" aria-hidden="true">
    <div class="expanding-panel__bg">
      <button class="panel-close" ref="closePanel">Close</button>
     <div>


       <!-- the search forms -->
       <h1>Your content here</h1>
       <p>Make this as tall as you like...</p>
       <p style="height: 1200px; background: rgba(0, 0, 0, 0.03)">
         Tall content demo
       </p>
       <!-- the search forms -->
     </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'

const openPanelElement = ref<HTMLElement>()

const expandingPanel = ref<HTMLElement>()
const search = ref('')
const closePanel = ref<HTMLElement>()

onMounted(() => {
  // const element = openPanelElement!!.value!!
  // element.addEventListener('click', openPanelFunction)
  closePanel!!.value!!.addEventListener('click', closePanelFunction)
})

function openPanelFunction() {
  const element = expandingPanel!!.value!!
  element.classList.add('is-open')
  element.setAttribute('aria-hidden', 'false')
}

function closePanelFunction() {
  const element = expandingPanel!!.value!!
  element.classList.remove('is-open')
  element.setAttribute('aria-hidden', 'true')
}
</script>
