<template>
  <div class="menu">
    <div :class="'unselectable arrow up ' + (disabled ? 'disabled' : '')" ref="up" @click="up">
      ◀
    </div>
    <div class="unselectable icons">
      <slot> the buttons should go here otherwise this will look like crap!</slot>
    </div>
    <div
      :class="'unselectable arrow down ' + (disabled ? 'disabled' : '')"
      ref="down"
      @click="down"
    >
      ▶
    </div>
  </div>
</template>
<style scoped>
.menu {
  display: grid;
  grid-template-areas: ' . up icons down  . ';
  /*
    sort of ugly: the sum of these 3 values has to be duplicated exactly and made 
    into a negative in the `base.css` definition for .writing-tools-container 
  */
  grid-template-columns: auto  var(--gutter-space) var(--icon-width) var(--gutter-space) auto ;
  justify-content: center;
  align-items: center;
  width: var( --icon-column-width );
}

.arrow {
  text-align: center;
  cursor: pointer;
}

.arrow.down {
  grid-area: down;
}

.icons {
  grid-area: icons;
}

.arrow.up {
  grid-area: up;
  text-align: right;
}

.arrow.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
<script lang="ts">
export default {
  methods: {
    up() {
      this.$emit('up')
    },
    down() {
      this.$emit('down')
    },
    enable(r: HTMLElement) {
      r.classList.remove('disabled')
    },
    disable(r: HTMLElement) {
      r.classList.add('disabled')
      // r.style.border = '1px solid orange'
    }
  },
  mounted() {},
  props: { disabled: { type: Boolean, default: false } },
  watch: {
    disabled(oldValue, newValue) {
      const up = this.$refs.up as HTMLElement
      const down = this.$refs.down as HTMLElement
      if (!newValue) {
        this.disable(up)
        this.disable(down)
      } else {
        this.enable(up)
        this.enable(down)
      }
    }
  },
  emits: ['up', 'down']
}
</script>
