<template>
  <div class="writing-tools-container">
    <div ref="writingToolsRoot" class="input-wrapper">
      <slot></slot>
      <div class="toggle-icon" @click="togglePanel">✏️</div>
    </div>

    <div v-if="panelVisible" class="writing-tools-panel">


      <div class="button rewrite-button">
        <div class="button-icon rewrite-icon"></div>
        <div class="button-label">rewrite</div>
      </div>
      <div class="button proofread-button">
        <div class="button-icon proofread-icon"></div>
        <div class="button-label">proofread</div>
      </div>


    </div>
  </div>
</template>
<style>

.writing-tools-panel {
  --writing-tools-panel-icon-size: 30px;
  //border: 10px solid royalblue;
  display: grid;
  grid-template-areas:  ' proofread-button . rewrite-button ';
  grid-template-columns: auto auto auto;
  margin-right: calc(calc(var(--gutter-space) / 3) + calc(var(--gutter-space) * 1.2));
  margin-top: calc(var(--gutter-space) / 3);
  padding: var(--gutter-space);
  background-color: #f9f9f9;
  border-radius: 4px;
}

.proofread-button {
  grid-area: proofread-button;
  background-color: orange;
}

.rewrite-button {
  grid-area: rewrite-button;
  background-color: orange;
}

.rewrite-icon {
  background-image: url('src/assets/images/writing-tools/rewrite.png');
}

.proofread-icon {
  background-image: url('src/assets/images/writing-tools/proofread.png');
}

.button {
  display: grid;
  grid-template-areas: '. icon .'
                        '. label .';
  grid-template-columns:  auto auto auto;
}

.button-label {
  text-align: center;
  grid-area: label;
}

.button-icon {
  border: 1px solid red;
  align-self: center;

  grid-area: icon;
  background-color: lightgrey;
  background-repeat: no-repeat;
  background-size: var(--writing-tools-panel-icon-size) var(--writing-tools-panel-icon-size);
  height: var(--writing-tools-panel-icon-size);
  //width: var(--writing-tools-panel-icon-size);
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

/*

.writing-tools-container {
  display: flex;
  flex-direction: column;
}



.icon {
  cursor: pointer;
  margin-left: calc(var(--gutter-space) / 3);
  width: calc(var(--gutter-space) * 1.2);
  height: calc(var(--gutter-space) * 1.2);
}
 

.apply-or-deny-panel {
  display: none;
}

.writing-tools-button {
  background-color: lightgrey;
  border-radius: var(--gutter-space);
}

.writing-tools-icon {
  background-size: var(--writing-tools-panel-icon-size) var(--writing-tools-panel-icon-size);
  height: var(--writing-tools-panel-icon-size);
  width: var(--writing-tools-panel-icon-size);
}

.proofread {
  background-image: url('src/assets/images/writing-tools/proofread.png');
  grid-area: proofread;
  justify-self: center;
}

.rewrite {
  justify-self: center;
  grid-area: rewrite;
  background-image: url('src/assets/images/writing-tools/rewrite.png');
}

.writing-tools-panel-button {
  display: grid;
  grid-template-areas: 
      'icon'
      'label'
;
}

.writing-tools-panel-button .label {
  grid-area: label;
}

.writing-tools-panel-button .icon {
  grid-area: icon;
}

.tools {
  display: grid;
  grid-template-areas:  '       proofread . rewrite      ' 
                        'friendly  professional  concise';
  grid-template-columns: auto auto auto;
}
*/


</style>
<script>

export default {
  name: 'WritingToolsButton',
  data() {
    return {}
  },
  props: {},
  setup() {
    return {}
  },
  methods: {
    togglePanel() {}
  }
}
</script>
