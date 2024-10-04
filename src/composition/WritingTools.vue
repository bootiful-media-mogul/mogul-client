<template>
  <div class="writing-tools-container">
    <div ref="writingToolsRoot" class="input-wrapper">
      <slot></slot>
      <div class="toggle-icon" @click="togglePanel">✏️</div>
    </div>

    <div v-if="panelVisible" class="writing-tools-panel">

      <WritingToolsButton
        label="Proofread"
        class="proofread-button"
        icon-image="src/assets/images/writing-tools/proofread.png"
      />

      <WritingToolsButton
        label="Rewrite"
        class="rewrite-button"
        icon-image="src/assets/images/writing-tools/rewrite.png"
      />


    </div>
  </div>
</template>
<style>
.writing-tools-panel {
  --writing-tools-panel-icon-size: 30px;
  display: grid;
  grid-template-areas:  '     proofread-button rewrite-button ';
  grid-template-columns: auto   auto;
  margin-right: calc(calc(var(--gutter-space) / 3) + calc(var(--gutter-space) * 1.2));
  margin-top: calc(var(--gutter-space) / 3);
  padding: var(--gutter-space);
  background-color: #f9f9f9;
  border-radius: 4px;
}

.rewrite-button {
  grid-area: rewrite-button;
}


.proofread-button {
  grid-area: proofread-button;
}

.toggle-icon {
  cursor: pointer;
  margin-left: calc(var(--gutter-space) / 3);
  width: calc(var(--gutter-space) * 1.2);
  height: calc(var(--gutter-space) * 1.2);
}

.input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}


</style>
<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import WritingToolsButton from '@/composition/WritingToolsButton.vue'

export default {
  name: 'WritingTools',
  components: { WritingToolsButton },
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
