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

  <div class="publications">
    <div
      v-for="publication in existingPublications"
      v-bind:key="publication.id"
      class="   publications-row row "
    >
      <div class="id-column">
        #<b>{{ publication.id }}</b>
      </div>
      <div class="plugin-column">
        <div class="plugin-icon-container">
          <Icon
            v-if="iconsAvailable"
            :width="40"
            :icon-hover="getIconForPlugin(publication.plugin).iconHover"
            :icon="getIconForPlugin(publication.plugin).icon"
          />
        </div>
      </div>
      <div class="created-column">{{ dateTimeToString(publication.created) }}</div>
      <div class="published-column">
        {{ dateTimeToString(publication.published) }}
      </div>
      <div class="delete-column">
        <Icon
          :icon="deleteHighlightAsset"
          :icon-hover="deleteAsset"
          class="delete-icon"
          @click.prevent="unpublish(publication.id)"
        />
      </div>

      <div class="url-column preview">
        <span v-if="publication.publishing">
          {{ $t('podcasts.episodes.publications.publishing') }}
        </span>
        <a
          :class="
            'mogul-icon preview-icon ' +
            (publication.url && publication.url !== '' ? '' : ' disabled')
          "
          :href="publication.url"
          target="_blank"
        ></a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Icon from '@/ui/Icon.vue'
import { onMounted, provide, ref, watch } from 'vue'
import { type PanelSlot, PanelSlotIcon, PublicationContext } from '@/publications/input'
import { Notification, notifications, Publication, publications } from '@/services'
import deleteHighlightAsset from '@/assets/images/delete-highlight.png'
import deleteAsset from '@/assets/images/delete.png'
import { dateTimeToString } from '@/dates'

const props = defineProps<{
  disabled: boolean
  publishable: string
  type: string
}>()

const existingPublications = ref<Array<Publication>>([])
const pluginIsDisabled = ref<boolean>(true)
const childSlots = ref<Array<PanelSlot>>([])
const isAnyPanelSelected = ref<boolean>(false)
const iconsAvailable = ref<boolean>(false)
const icons = ref<Map<string, PanelSlotIcon>>(new Map<string, PanelSlotIcon>())

function getIconForPlugin(plugin: string): PanelSlotIcon {
  return icons.value!.get(plugin)!
}

async function refresh() {
  const ctx = getPublicationContext()
  await refreshPublications(ctx.publishableId, ctx.type)
}

onMounted(async () => {
  await refresh()

  childSlots.value.forEach((slot) => {
    icons.value.set(slot.plugin, slot.icon)
  })

  iconsAvailable.value = childSlots.value.length == icons.value.size
})

notifications.listenForCategory('publication-started-event', async (notification: Notification) => {
  await refresh()
  existingPublications.value
    .filter((pub) => pub.id === parseInt(notification.key))
    .forEach((p) => {
      p.publishing = true
    })
})

notifications.listenForCategory('publication-completed-event', async () => {
  await refresh()
})

async function refreshPublications(publishableId: number, type: string) {
  existingPublications.value = await publications.publications(publishableId, type)
}

watch(
  () => props.disabled,
  async (n: any, o: any) => {
    pluginIsDisabled.value = n
  }
)

async function unpublish(id: number) {
  await publications.unpublish(id)
}

async function publish(type: string, id: number, context: Map<string, any>, plugin: string) {
  await publications.publish(type, id, JSON.stringify(context), plugin)
}

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
    !props.disabled && (await publications.canPublish(id, type, JSON.stringify(context), plugin))
  )
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
  padding: calc(var(--gutter-space) / 2);
  margin: 0;
}

.publication-panel-selected {
  border-top-left-radius: 0;
}

.toolbar-icons {
  padding-left: var(--gutter-space);
}

.toolbar-icon-disabled {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.publications {
  margin-top: var(--gutter-space);
}

.publications .publications-row {
  display: grid;

  grid-template-areas: 'id url delete created published plugin ';
 
 
  grid-template-columns: var(--id-column) var(--icon-column) var(--icon-column) var(--date-column) var(
      --date-column
    ) auto;
}

.publications .publications-row .plugin-icon-container {
  background-color: black;
  border-radius: var(--radius);
  overflow: hidden;
  width: 40px;
  height: 40px;
}

.publications .publications-row .delete-column {
  grid-area: delete;
}

.publications .publications-row .id-column {
  grid-area: id;
}

.publications .publications-row .plugin-column {
  grid-area: plugin;
}

.publications .publications-row .created-column {
  grid-area: created;
}

.publications .publications-row .published-column {
  grid-area: published;
}

.publications .publications-row .url-column {
  grid-area: url;
}
</style>
