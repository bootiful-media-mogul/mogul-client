<template>
  <div class="writing-tools-button unselectable">
    <div class="writing-tools-button-content">
      <div class="writing-tools-button-content-icon">
        <slot />
      </div>
      <div class="writing-tools-button-content-label">{{ label }}</div>
    </div>
  </div>
</template>
<style>
.writing-tools-button {
  cursor: pointer;
  display: grid;
  grid-template-areas: ' . content . ';
  grid-template-columns: auto min-content auto;
  border-radius: var(--button-radius);
  background-color: lightgrey;
  padding: calc(var(--gutter-space) / 3);
  font-size: small;
}

.writing-tools-button-content {
  display: grid;
  grid-area: content;
  grid-template-areas: 'icon label';
  grid-template-columns: var(--writing-tools-panel-icon-size) auto;
  align-items: center;
  height: var(--writing-tools-panel-icon-size);
}

.writing-tools-button-content-label {
  padding-left: calc(var(--gutter-space) / 2);
}

.writing-tools-button-content-icon {
  height: var(--writing-tools-panel-icon-size);
}

.writing-tools-button-content-icon img {
  width: var(--writing-tools-panel-icon-size);
  grid-area: icon;
}
</style>

<script lang="ts">
export default {
  name: 'WritingAssistantButton',
  mounted() {},
  data() {
    return {
      backgroundStyle: `background-image: url('${this.iconImage}')  `
    }
  },
  props: {
    label: { type: String, default: '' },
    iconImage: { type: String, default: '' }
  },
  setup() {
    return {}
  },
  methods: {}
}
</script>
