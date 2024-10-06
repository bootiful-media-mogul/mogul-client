<template>
  <div class="writing-tools-button">
    <div class="writing-tools-button-icon">
      <slot />
    </div>
    <div class="writing-tools-button-label">{{ label }}</div>
  </div>
</template>
<style>
.writing-tools-button {
  display: grid;
  grid-template-areas:
    '. icon  .'
    '. label .';
  grid-template-columns: auto auto auto;
  cursor: pointer;

  border-radius: var(--button-radius);
  background-color: lightgrey;
  padding: calc(var(--gutter-space) / 2);
}

.writing-tools-button-label {
  text-align: center;
  grid-area: label;
}

.writing-tools-button-icon {
  align-self: center;
  grid-area: icon;
  align-items: center;
  background-repeat: no-repeat;
  background-position-x: center;
  background-size: var(--writing-tools-panel-icon-size) var(--writing-tools-panel-icon-size);
  height: var(--writing-tools-panel-icon-size);
  display: grid;
  grid-template-areas: '. icon .';
  grid-template-columns: auto var(--writing-tools-panel-icon-size) auto ;
}

.writing-tools-button-icon img {
  width: var(--writing-tools-panel-icon-size);
  grid-area: icon;
}
</style>
<script lang="ts">
export default {
  name: 'WritingToolsButton',
  mounted() {
  },
  data() {
    return {
      backgroundStyle: ` background-image: url('${this.iconImage}')  `
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
