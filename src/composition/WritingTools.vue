<template>
  <div class="writing-tools-container">
    <div ref="writingToolsRoot" class="input-wrapper">
      <slot></slot>
      <div class="icon" @click="togglePanel">✏️</div>
    </div>

    <div v-if="panelVisible" class="writing-tools-panel">
      <div class="tools-panel">
        <div class="tools">
          <div class="proofread"></div>
          <div class="rewrite"></div>
        </div>
        <div class="rewrite-tone">
          <div class="friendly"></div>
          <div class="professional"></div>
          <div class="concise"></div>
        </div>
        <div class="generate">
          <div class="summary"></div>
          <div class="key-points"></div>
        </div>
      </div>
      <div class="apply-or-deny-panel">
      <!--
      visible when the suggestion has been made 
      -->
        <button value="confirm"></button>
        <button value="revert"></button>
      </div>
    </div>
  </div>


</template>
<style>

.writing-tools-input-clicked {
  border-top-right-radius: 0;
  border: 10px solid #129fea;
  border-top-left-radius: 0;
}


.writing-tools-container {
  display: flex;
  flex-direction: column;
}

.input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.icon {
  cursor: pointer;
  margin-left: calc(var(--gutter-space) / 3);
  width: calc(var(--gutter-space) * 1.2);
  height: calc(var(--gutter-space) * 1.2);
}

.writing-tools-panel {
  margin-right: calc(calc(var(--gutter-space) / 3) + calc(var(--gutter-space) * 1.2));
  margin-top: calc(var(--gutter-space) / 3);
  padding: var(--gutter-space);
  background-color: #f9f9f9;
  border-radius: 4px; /* this is the same radius used for inputs in pure.css */

}
</style>
<script>

import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'WritingTools',
  data() {
    return {
      panelVisible: false
    }
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const text = ref('')
    const inputElement = ref(null)

    const updateValue = (event) => {
      const value = event.target.value
      emit('update:modelValue', value)
      text.value = value
    }

    onMounted(() => {
      
      // todo
      // I can export the change to the nested component in this way:
      // setTimeout( () => emit('update:modelValue' , 'hello, world'), 5 * 1000)
      // 
      inputElement.value = document.querySelector('input, textarea')
      if (inputElement.value) {
        inputElement.value.addEventListener('input', updateValue)
      }
    })

    onBeforeUnmount(() => {
      if (inputElement.value) {
        inputElement.value.removeEventListener('input', updateValue)
      }
    })

    return {
      text,
      inputElement
    }
  },
  methods: {
    togglePanel() {
      this.panelVisible = !this.panelVisible
    }
  }
}
</script>