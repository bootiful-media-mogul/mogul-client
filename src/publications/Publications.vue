<template>
  <slot />
  <div class="publications">
    <div class="publications-toolbar">
      <div v-for="(slot, index) in childSlots" :key="index">
        <div
          class="toolbar-icon"
          :class="{
            'toolbar-icon-selected': slot.selected,
            'toolbar-icon-disabled': isAnyPanelSelected
          }"
        >
          <Icon
            :alt="slot.plugin"
            :width="50"
            :icon="slot.icon.icon"
            :icon-hover="slot.icon.iconHover"
            @click.prevent="showPanelForSlot(slot)"
          />
        </div>
      </div>
    </div>
    <div v-for="(slot, index) in childSlots" :key="index">
      <div
        class="publication-panel"
        :class="{ 'publication-panel-selected': isAnyPanelSelected }"
        v-if="slot.selected"
      >
        <component :is="slot.panel" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Icon from '@/ui/Icon.vue'
import { provide, ref, watch } from 'vue'
import { type PanelSlot, PublicationContext } from '@/publications/input'
import { publications } from '@/services'

const props = defineProps<{
  disabled: boolean
  publishable: string
  type: string
}>()

const pluginIsDisabled = ref<boolean>(true)
const childSlots = ref<Array<PanelSlot>>([])
const isAnyPanelSelected = ref<boolean>(false)

watch(
  () => props.disabled,
  async (n: any, o: any) => {
    pluginIsDisabled.value = n
  }
)

function showPanelForSlot(slot: PanelSlot) {
  const selected = childSlots.value.filter((s) => s.plugin === slot.plugin && s.selected)
  if (selected.length > 0) {
    selected[0].selected = false
  } //
  else {
    childSlots.value.forEach((s) => {
      s.selected = slot.plugin === s.plugin
    })
  }
  isAnyPanelSelected.value = childSlots.value.filter((cs) => cs.selected).length > 0
}

function registerPublicationPanel(slotPair: PanelSlot) {
  if (childSlots.value.filter((slot) => slot.plugin == slotPair.plugin).length == 0)
    childSlots.value.push(slotPair)
}

function getPublicationContext(): PublicationContext {
  return new PublicationContext(parseInt(props.publishable), props.type)
}

async function isPluginReady(type: string, id: number, context: Map<string, any>, plugin: string) {
  return (
    !props.disabled && (await publications.canPublish(type, id, JSON.stringify(context), plugin))
  )
}

async function publish(type: string, id: number, context: Map<string, any>, plugin: string) {
  await publications.publish(type, id, JSON.stringify(context), plugin)
}

provide('getPublicationContext', getPublicationContext)
provide('isPluginReady', isPluginReady)
provide('publish', publish)
provide('registerPublicationPanel', registerPublicationPanel)
</script>

<style scoped>
.publications-toolbar {
  display: grid;
  grid-template-columns: repeat(auto-fill, 50px);
  gap: calc(var(--gutter-space) / 3);
}

.toolbar-icon {
  border-radius: var(--radius);
  background-color: black;
}

.toolbar-icon:hover {
  background-color: white;
}

.toolbar-icon-selected {
  background-color: white;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.publication-panel {
  border-radius: var(--radius);
  background-color: white;
  padding: var(--gutter-space);
  margin: 0;
}

.publication-panel-selected {
  border-top-left-radius: 0;
}

.toolbar-icon-disabled {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
