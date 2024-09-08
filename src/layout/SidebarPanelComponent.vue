<template>
  <div class="panel sidebar-panel">
    <!--    :class="visibilityCss"-->
    <div class="top">
      <div class="title">
        {{ title }}
      </div>
      <div class="controls ">
<!--      
   -->     <!--
        todo refactor this so that the button toggles between hide and show
        -->
<!--      -->
        
<!--        <div style="border:1px solid orange;width: 30px; height: 30px; background-color: white"  >-->
       
<!--        </div>
        <div style="border:1px solid orange;width: 30px; height: 30px; background-color: white"  >
        -->    <SidebarPanelWindowButtonComponent class="show-hide">
        <img @click="show" src="../assets/images/panel-minimize.png" />
      </SidebarPanelWindowButtonComponent><SidebarPanelWindowButtonComponent class="maximize">
            <img @click="maximize" src="../assets/images/panel-maximize.png" />
          </SidebarPanelWindowButtonComponent>
<!--        </div>-->
        
      </div>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>


<style>
.sidebar-panel {
  width: var(--sidebar-width);
  right: 0;
  overflow: hidden;
  padding: var(--gutter-space);
  background-color: white;
  margin-bottom: var(--gutter-space);


}

.sidebar-panel .content {
  padding-top: var(--gutter-space);

}


.sidebar-panel .top {

  background-color: black;


  padding-bottom: calc(0.5 * var(--gutter-space));
  margin-left: calc(-1 * var(--gutter-space));
  margin-top: calc(-1 * var(--gutter-space));
  margin-right: calc(-1 * var(--gutter-space));
  padding-left: var(--gutter-space);
  padding-top: var(--gutter-space);

  display: grid;
  grid-template-areas: 'title controls';
  grid-template-columns: 1fr auto;
  gap: 0;

}

.sidebar-panel .top .title {
  grid-area: title;
  color: white;
  text-transform: uppercase;
  text-decoration: none;
  font-weight: bold;
  font-family: 'Arial Black', sans-serif;
  font-size: small;
}

.sidebar-panel .top .controls {
  grid-area: controls;
  display: grid;
  grid-template-areas: 'show-hide   maximize';
  gap: calc(var(--gutter-space) / 2);
  grid-template-columns:  auto  auto ;
  position: relative;
  align-items: center;
  padding-right: var(--gutter-space);
  
}

.sidebar-panel .top .controls .title {
  grid-area: title;
}

.sidebar-panel .top .controls .show-hide {
  grid-area: show-hide;

}


/*


.sidebar-panel .top .controls .maximize {
  grid-area: maximize;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  z-index: 1000;
  border-radius: 10px;

}
*/

.sidebar-panel .top {


}

.sidebar-panel a {
  text-decoration: none;
}


</style>

<script lang="ts">
import { events } from '@/services'
import SidebarPanelWindowButtonComponent from './SidebarPanelWindowButtonComponent.vue'

export default {
  created() {
    // allow child components to ask for visibility in their parent panels
    events.on('sidebar-panel-closed', (event: any) => {
      if (this.$el.contains(event)) {
        this.hide()
      }
    })
    events.on('sidebar-panel-opened', (event: any) => {
      // does event match any of our children nodes? if so, we show visibility
      if (this.$el.contains(event)) {
        this.show()
      }
    })
  },

  components: {
    SidebarPanelWindowButtonComponent
  },

  data() {
    return {
      expanded: false,
      maximized: false
    }
  },

  props: ['title'],
  methods: {
    hide() {
      this.maximized = false
      this.expanded = false
    },
    show() {
      this.expanded = true
      this.maximized = false
    },
    maximize() {
      this.expanded = true
      this.maximized = true
    }
  },
  computed: {
    visibilityCss() {
      return (
        ' panel  sidebar-panel ' //+ (this.expanded ? 'expanded' : 'closed') + ' ' + (this.maximized ? 'maximized' : '')
      )
    }
  }
}
</script>