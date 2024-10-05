<template>
  <div class="writing-tools-button">
    <div class="writing-tools-button-icon" :style="backgroundStyle"></div>
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
  background-repeat: no-repeat;
  background-position-x: center;
  background-size: var(--writing-tools-panel-icon-size) var(--writing-tools-panel-icon-size);
  height: var(--writing-tools-panel-icon-size);
}
</style>
<script>
export default {
  name: 'WritingToolsButton',
  mounted() {},
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
