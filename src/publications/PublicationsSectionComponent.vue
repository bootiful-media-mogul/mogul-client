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
        <div>
          {{ $t('publications.plugins.' + slot.plugin + '.description') }}
        </div>
        <component :is="slot.panel" />
      </div>
    </div>
  </div>

  <div class="publications">
    <div v-for="publication in existingPublications" v-bind:key="publication.id">
      <div class="publications-row row">
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
            class="delete-icon"
            :icon="deleteHighlightAsset"
            :icon-hover="deleteAsset"
            :disabled="withdrawn(publication)"
            @click.prevent="unpublish(publication.id)"
          />
        </div>
        <div class="url-column preview">
          <span v-if="publication.publishing"> 🕒 </span>
        </div>
      </div>
      <div class="publications-outcomes">
        <div class="publications-outcome row " v-for="outcome in publication.outcomes" v-bind:key="outcome.id">
          <div class="success">
            <Icon
              v-if="outcome.success"
              :icon-hover="checkmarkAsset"
              :icon="checkmarkAsset"
            />
            <Icon v-else
                  :icon-hover="errorHighlightAsset"
                  :icon="errorAsset" />
          </div>
          <div class="uri">
            <a
              class="mogul-icon preview-icon"
              :class="{ disabled: withdrawn(publication) }"
              :href="outcome.url"
              target="_blank"
            ></a>
          </div>
          <div class="key">
            {{ $t('publications.outcomes.keys.' + outcome.key) }}

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.publications {
  --icon-column: 40px;
}

.publications .publications-outcome .success {
  grid-area: success;
}

.publications .publications-row {
  padding-top: calc(var(--radius) * 1);
  border-top: 1px solid black;
}

.publications .publications-outcome {
  margin-top: calc(var(--radius) * -1);
  height: var(--row-height);
  border-radius: var(--radius);
  border-top-left-radius: 0;
  padding-left: var(--gutter-space);
  border: 1px solid black;
  border-top: 0;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  display: grid;
  grid-template-areas:  ' uri success key ';
  grid-column-gap: calc(var(--gutter-space) / 2);
  grid-template-columns: var(--icon-column)  var(--icon-column) auto;
  margin-left: var(--icon-column);
}

.publications .publications-outcome:last-child {
  margin-bottom: calc(var(--radius) * 1);

}

.publications .publications-outcome:first-child {
  margin-top: 0;
  padding-top: 0;
}

.publications .publications-outcome {
  padding-top: var(--radius);
}

.publications .publications-outcome .key {
  grid-area: key;
}

.publications .publications-outcome .uri {
  grid-area: uri;
}

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
  overflow: hidden;
}

.publication-panel .plugin {
  background-color: lightgray;
  padding: var(--gutter-space-half);
  border-bottom-right-radius: var(--radius);
  border-top-right-radius: var(--radius);
  margin-left: calc(var(--gutter-space-half) * -1);
  margin-bottom: var(--gutter-space-half);
  font-weight: bold;
  font-size: smaller;
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


/* PUBLICATIONS */
.publications .publications-row {
  display: grid;

  grid-template-areas: ' plugin . delete  id url  created published   ';

  grid-template-columns:
   min-content var(--gutter-space)   var(--icon-column)   var(--id-column) var(--icon-column) var(--date-column) var(--date-column);
}

.publications .publications-row {
  padding-bottom: var(--gutter-space-half);
  border-bottom: 1px solid black;
}

/*id url delete created published plugin */
.publications .publications-row .created {
  grid-area: created;
}

.publications .publications-row .published {
  grid-area: published;
}

.publications .publications-row .plugin {
  grid-area: plugin;
}

.publications .publications-row .id {
  grid-area: id;
}

.publications .publications-row .url {
  grid-area: url;
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


<script lang="ts" setup>
import Icon from '@/ui/Icon.vue'
import { onMounted, provide, ref } from 'vue'
import { type PanelSlot, PanelSlotIcon, PublicationContext } from '@/publications/input'
import { Notification, notifications, Publication, publications } from '@/services'
import deleteHighlightAsset from '@/assets/images/delete-highlight.png'
import deleteAsset from '@/assets/images/delete.png'
import errorAsset from '@/assets/images/error.png'
import errorHighlightAsset from '@/assets/images/error-highlight.png'
import checkmarkAsset from '@/assets/images/checkbox.png'
import { dateTimeToString } from '@/dates'


const props = defineProps<{
  disabled: boolean
  publishable: string
  type: string
}>()

function withdrawn(publication: Publication) {
  return (
    publication.url === '' || publication.state == 'draft' || publication.state == 'unpublished'
  )
}

const existingPublications = ref<Array<Publication>>([])
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

async function unpublish(id: number) {
  await publications.unpublish(id)
  await refresh()
}

async function publish(type: string, id: number, context: Map<string, any>, plugin: string) {
  await publications.publish(type, id, JSON.stringify(context), plugin)
  await refresh()
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
  return await publications.canPublish(id, type, JSON.stringify(context), plugin)
}

provide('getPublicationContext', getPublicationContext)
provide('isPluginReady', isPluginReady)
provide('publish', publish)
provide('registerPublicationPanel', registerPublicationPanel)
</script>