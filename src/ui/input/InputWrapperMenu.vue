<template>
  <div class="menu">
    <div :class="'unselectable arrow up ' + upArrowCss()" ref="up" @click="up">◀</div>
    <div class="unselectable icons">
      <slot> the buttons should go here otherwise this will look like crap! </slot>
    </div>
    <div :class="'unselectable arrow down ' + downArrowCss()" ref="down" @click="down">▶</div>
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
  grid-template-columns: auto var(--gutter-space) var(--icon-width) var(--gutter-space) auto;
  justify-content: center;
  align-items: center;
  width: var(--icon-column-width);
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
  opacity: 0.3;
  pointer-events: none;
}
</style>
<script lang="ts">
export default {
  methods: {
    upArrowCss() {
      const c = () => {
        if (this.disabled) return 'disabled'
        if (!this.enableUpArrow) return 'disabled'
        return ''
      }
      return c()
    },
    downArrowCss() {
      const c = () => {
        if (this.disabled) return 'disabled'
        if (!this.enableDownArrow) return 'disabled'
        return ''
      }
      return c()
    },

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
    }
  },
  mounted() {},
  props: {
    disabled: { type: Boolean, default: false },
    enableUpArrow: { type: Boolean, default: false },
    enableDownArrow: { type: Boolean, default: false }
  },
  watch: {
    disabled(oldValue, newValue) {
      const up = this.$refs.up as HTMLElement
      const down = this.$refs.down as HTMLElement
      const elements = [up, down]
      if (!newValue) {
        elements.forEach((el) => this.disable(el))
      } //
      else {
        //elements.forEach(el => this.enable(el))
      }
    }
  },
  emits: ['up', 'down']
}
</script>
