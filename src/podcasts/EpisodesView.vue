<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  Composition,
  editTranscript,
  events,
  Notification,
  notifications,
  Podcast,
  PodcastEpisode,
  PodcastEpisodeSegment,
  podcasts,
  Publication,
  type TranscriptEditedEvent,
  utils
} from '@/services'

import ManagedFileComponent from '@/managedfiles/ManagedFileComponent.vue'
import { useI18n } from 'vue-i18n'

import { dateTimeToString } from '@/dates'
import InputWrapper from '@/ui/input/InputWrapper.vue'
import InputTools from '@/ui/InputTools.vue'
import Icon from '@/ui/Icon.vue'

import editHighlightAsset from '@/assets/images/edit-highlight.png'
import editAsset from '@/assets/images/edit.png'

import downHighlightAsset from '@/assets/images/down-highlight.png'
import downAsset from '@/assets/images/down.png'

import upHighlightAsset from '@/assets/images/up-highlight.png'
import upAsset from '@/assets/images/up.png'

import transcriptHighlightAsset from '@/assets/images/transcript-highlight.png'
import transcriptAsset from '@/assets/images/transcript.png'

import deleteHighlightAsset from '@/assets/images/delete-highlight.png'
import deleteAsset from '@/assets/images/delete.png'
import CompositionComponent from '@/compositions/CompositionComponent.vue'

const { t } = useI18n()

const transcriptEventPrefix = 'transcripts.podcasts.episodes.segments'

events.on('transcript-edited-event', async (event) => {
  const updatedEvent = event as TranscriptEditedEvent
  if (!updatedEvent.key.startsWith(transcriptEventPrefix)) return
  await podcasts.setPodcastEpisodesSegmentTranscript(updatedEvent.id, true, updatedEvent.transcript)
})

// Props
const props = defineProps<{ id: number | string }>()

// State
const draftEpisodeSegments = ref<PodcastEpisodeSegment[]>([])
const selectedPlugin = ref('')
const created = ref(-1)
const draftEpisode = reactive<PodcastEpisode>({} as PodcastEpisode)
const episodes = ref<PodcastEpisode[]>([])
const publications = ref<Publication[]>([])
const currentPodcast = ref<Podcast>()
const selectedPodcastId = ref(props.id)

// title
const title = ref('')
const titleComposition = ref<Composition>()

// description
const description = ref('')
const descriptionComposition = ref<Composition>()

const dirtyKey = ref('')

// Computed
const publishButtonDisabled = computed(() => {
  return !draftEpisode.complete || !selectedPlugin.value || selectedPlugin.value === ''
})

const buttonsDisabled = computed(() => {
  let changed = false
  if (!draftEpisode.id) {
    const hasData = description.value.trim() !== '' && title.value.trim() !== ''
    if (hasData) {
      changed = true
    }
  } else {
    changed = dirtyKey.value !== computeDirtyKey()
  }
  return !changed
})

const refreshEpisode = async (episodeId: number) => {
  if (!episodeId) {
    console.error('the episode you gave to refresh is not valid ' + episodeId + '!')
    return
  }
  const ep = await podcasts.podcastEpisodeById(episodeId)
  await loadEpisode(ep)
}

// Methods
const dts = (date: number): string | null => {
  return dateTimeToString(date)
}

const computeDirtyKey = (): string => {
  return `${draftEpisode.id ? draftEpisode.id : ''}${description.value}:${title.value}`
}

const loadPodcast = async () => {
  const newPodcastId = parseInt(selectedPodcastId.value + '')
  currentPodcast.value = await podcasts.podcastById(newPodcastId)
  const podcastEpisodes = await podcasts.podcastEpisodes(newPodcastId)
  if (podcastEpisodes) {
    podcastEpisodes.sort((a, b) => b.created - a.created)
  }
  episodes.value = podcastEpisodes
}

const loadEpisodeSegments = async (episode: PodcastEpisode) => {
  const ep = await podcasts.podcastEpisodeById(episode.id)
  if (ep?.segments?.length > 0) {
    draftEpisodeSegments.value = ep.segments
  }
}

const refreshPublications = async (episode: PodcastEpisode) => {
  if (episode.publications?.length > 0) {
    console.debug('there are ' + episode.publications.length + ' publications.')
    publications.value = episode.publications.sort((a, b) => b.created - a.created)
    episode.publications = publications.value
  } else {
    publications.value = []
  }
}

const loadEpisode = async (episode: PodcastEpisode) => {
  Object.assign(draftEpisode, episode)
  description.value = episode.description
  title.value = episode.title
  created.value = episode.created
  dirtyKey.value = computeDirtyKey()
  draftEpisodeSegments.value = episode.segments
  descriptionComposition.value = episode.descriptionComposition
  titleComposition.value = episode.titleComposition
  await refreshEpisodePublicationControls(episode.id, draftEpisode.complete)
}

const refreshEpisodePublicationControls = async (id: number, completed: boolean) => {
  draftEpisode.complete = completed
  if (!id) {
    console.error('no episode provided in refreshEpisodePublicationControls, returning')
    return
  }

  const episode = await podcasts.podcastEpisodeById(id)
  if (episode) {
    await refreshPublications(episode)
    if (episode.availablePlugins?.length === 1) {
      selectedPlugin.value = episode.availablePlugins[0]
    }
  }
}

const editPodcastEpisodeSegmentTranscript = (seg: PodcastEpisodeSegment) => {
  editTranscript(transcriptEventPrefix, seg.id, seg.transcript)
}

const save = async () => {
  if (draftEpisode.id) {
    await podcasts.updatePodcastEpisode(draftEpisode.id, title.value, description.value)
    await loadEpisode(await podcasts.podcastEpisodeById(draftEpisode.id))
  } else {
    const episode = await podcasts.createPodcastEpisodeDraft(
      parseInt(selectedPodcastId.value + ''),
      title.value,
      description.value
    )
    await loadEpisode(await podcasts.podcastEpisodeById(episode.id))
  }
}

const cancel = async () => {
  Object.assign(draftEpisode, {} as PodcastEpisode)
  title.value = ''
  description.value = ''
  draftEpisodeSegments.value = []
  publications.value = []
  await loadPodcast()
}

// Segment Methods
const movePodcastEpisodeSegmentDown = async (
  episode: PodcastEpisode,
  episodeSegment: PodcastEpisodeSegment
) => {
  await podcasts.movePodcastEpisodeSegmentDown(episode.id, episodeSegment.id)
  await loadEpisodeSegments(episode)
}

const movePodcastEpisodeSegmentUp = async (
  episode: PodcastEpisode,
  episodeSegment: PodcastEpisodeSegment
) => {
  await podcasts.movePodcastEpisodeSegmentUp(episode.id, episodeSegment.id)
  await loadEpisodeSegments(episode)
}

const deletePodcastEpisodeSegment = async (
  episode: PodcastEpisode,
  episodeSegment: PodcastEpisodeSegment
) => {
  const segmentDetails = t('episodes.segments.number', { id: episodeSegment.order })
  const msg = t('confirm.deletion', { title: segmentDetails })
  if (!utils.confirmDeletion(msg)) return

  draftEpisode.complete = false
  await podcasts.deletePodcastEpisodeSegment(episodeSegment.id)
  await loadEpisodeSegments(episode)
}

const addNewPodcastEpisodeSegment = async (episode: PodcastEpisode) => {
  draftEpisode.complete = false
  await podcasts.addPodcastEpisodeSegment(episode.id)
  await loadEpisodeSegments(episode)
}

// Publication Methods
const publish = async (e: Event) => {
  e.preventDefault()
  await podcasts.publishPodcastEpisode(draftEpisode.id, selectedPlugin.value)
}

const pluginSelected = async (e: Event) => {
  e.preventDefault()
}

const deletePodcastEpisode = async (episode: PodcastEpisode) => {
  const podcastEpisodeDescription = t('episodes.episode.reference', { title: episode.title })
  const msg = t('confirm.deletion', { title: podcastEpisodeDescription })
  if (!utils.confirmDeletion(msg)) return

  await podcasts.deletePodcastEpisode(episode.id)
  await cancel()
}

const unpublish = async (publication: Publication) => {
  await podcasts.unpublish(publication)
}

// Arrow Classes
const downArrowDisabled = (pid: PodcastEpisode, segment: PodcastEpisodeSegment) => {
  return draftEpisodeSegments.value[draftEpisodeSegments.value.length - 1].id === segment.id
}
const upArrowDisabled = (pid: PodcastEpisode, segment: PodcastEpisodeSegment) => {
  return draftEpisodeSegments.value?.[0]?.id === segment.id
}

// Lifecycle Hooks
onMounted(async () => {
  await loadPodcast()
  dirtyKey.value = computeDirtyKey()

  // Event Listeners
  notifications.listenForCategory(
    'podcast-episode-completion-event',
    async (notification: Notification) => {
      const jsonMap = JSON.parse(notification.context) as any
      const complete = jsonMap['complete'] as boolean
      const episodeId = parseInt(notification.key)
      await refreshEpisodePublicationControls(episodeId, complete)
    }
  )

  notifications.listenForCategory('publication-completed-event', async (_: Notification) => {
    await refreshEpisode(draftEpisode.id)
  })

  notifications.listenForCategory(
    'publication-started-event',
    async (notification: Notification) => {
      await refreshEpisode(draftEpisode.id)
      publications.value
        .filter((pub) => pub.id === parseInt(notification.key))
        .forEach((p) => {
          p.publishing = true
        })
    }
  )
})
</script>
<template>
  <h1 v-if="currentPodcast">
    {{ $t('episodes.episodes', { id: currentPodcast.id, title: currentPodcast.title }) }}
  </h1>

  <form class="pure-form pure-form-stacked">
    <fieldset>
      <legend>
        <span v-if="title">
          {{ $t('episodes.editing-episode', { id: draftEpisode.id, title: title }) }}
        </span>
        <span v-else>
          {{ $t('episodes.new-episode') }}
        </span>
        <span v-if="draftEpisode.id"> ({{ dts(draftEpisode.created) }}) </span>
      </legend>
      <!--
      todo: 
        create an icon for the podcast thing
        build out the podcast subsystem
        show the icon as disabled (instead of hiding it outright) if its not possible to publish a podcast
      
      <div v-if="draftEpisode.id" class="episode-actions subject-actions">
        <a href="#">blog</a> |
        <a href="#">analyse</a>
      </div>
      -->

      <div class="form-section">
        <div class="form-section-title">{{ $t('episodes.basics') }}</div>
        <div class="form-row">
          <label for="episodeTitle">
            {{ $t('episodes.episode.title') }}
          </label>
          <InputWrapper v-model="title">
            <input id="episodeTitle" v-model="title" required type="text" />
            <InputTools v-model="title" />
          </InputWrapper>
        </div>
        <div class="form-row">
          <label for="episodeDescription">
            {{ $t('episodes.episode.description') }}
          </label>
          <InputWrapper v-model="description">
            <textarea id="episodeDescription" v-model="description" required rows="10" />
            <CompositionComponent
              v-if="draftEpisode.descriptionComposition"
              :composition-id="parseInt(draftEpisode.descriptionComposition.id + '')"
            />
            <InputTools v-model="description" />
          </InputWrapper>
        </div>
        <div>
          <button
            :disabled="buttonsDisabled"
            class="pure-button pure-button-primary"
            type="submit"
            @click.prevent="save"
          >
            {{ $t('episodes.buttons.save') }}
          </button>

          <button
            :disabled="description == '' && title == ''"
            class="pure-button pure-button-primary"
            type="submit"
            @click="cancel"
          >
            {{ $t('episodes.buttons.cancel') }}
          </button>
        </div>
      </div>

      <div class="form-section">
        <div class="form-section-title">{{ $t('episodes.segments') }}</div>

        <div v-if="draftEpisode">
          <div v-if="draftEpisode.graphic" class="pure-g episode-managed-file-row">
            <div class="pure-u-3-24">
              <label>{{ $t('episodes.episode.graphic') }}</label>
            </div>
            <div class="pure-u-21-24">
              <ManagedFileComponent
                :managed-file-id="draftEpisode.graphic.id"
                accept=".jpg,.jpeg,.png,image/jpeg,image/jpg,image/png"
              >
                <div class="segment-controls"></div>
              </ManagedFileComponent>
            </div>
          </div>

          <div v-for="segment in draftEpisodeSegments" v-bind:key="segment.id">
            <div class="pure-g episode-managed-file-row">
              <div class="pure-u-3-24">
                <label>
                  {{ $t('episodes.episode.segments.number', { order: segment.order }) }}
                </label>
              </div>
              <div class="pure-u-21-24">
                <ManagedFileComponent :managed-file-id="segment.audio.id" accept=".mp3,audio/mpeg">
                  <div class="segment-controls">
                    <Icon
                      :disabled="upArrowDisabled(draftEpisode, segment)"
                      :icon="upHighlightAsset"
                      :icon-hover="upAsset"
                      @click.prevent="movePodcastEpisodeSegmentUp(draftEpisode, segment)"
                    />
                    <Icon
                      :disabled="downArrowDisabled(draftEpisode, segment)"
                      :icon="downHighlightAsset"
                      :icon-hover="downAsset"
                      @click.prevent="movePodcastEpisodeSegmentDown(draftEpisode, segment)"
                    />
                    <Icon
                      :icon="deleteHighlightAsset"
                      :icon-hover="deleteAsset"
                      class="delete-icon"
                      @click.prevent="deletePodcastEpisodeSegment(draftEpisode, segment)"
                    />
                    <Icon
                      :icon="transcriptHighlightAsset"
                      :icon-hover="transcriptAsset"
                      class="transcript-icon"
                      @click.prevent="editPodcastEpisodeSegmentTranscript(segment)"
                    />
                  </div>
                </ManagedFileComponent>
              </div>
            </div>
          </div>

          <div class="podcast-episode-controls-row">
            <span class="save">
              <button
                class="pure-button pure-button-primary"
                type="submit"
                :disabled="draftEpisode.id === undefined"
                @click.prevent="addNewPodcastEpisodeSegment(draftEpisode)"
              >
                {{ $t('episodes.buttons.add-segment') }}
              </button>
            </span>
          </div>
        </div>

        <div class="form-section-title">{{ $t('episodes.publications') }}</div>

        <div class="publish-menu">
          <select
            v-model="selectedPlugin"
            :disabled="!draftEpisode.complete"
            @change="pluginSelected"
          >
            <option disabled value="">
              {{ $t('episodes.plugins.please-select-a-plugin') }}
            </option>

            <option
              v-for="(option, index) in draftEpisode.availablePlugins"
              :key="index"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
          <button
            :key="draftEpisode.id"
            ref="publishButton"
            :disabled="publishButtonDisabled"
            class="pure-button pure-button-primary publish-button"
            type="submit"
            @click="publish"
          >
            {{ $t('episodes.buttons.publish') }}
          </button>
        </div>
        <div class="publications">
          <div
            v-for="publication in publications"
            v-bind:key="publication.id"
            class="pure-g form-row publications-row"
          >
            <div class="id-column">
              #<b>{{ publication.id }}</b>
            </div>
            <div class="plugin-column">
              {{ publication.plugin }}
            </div>
            <div class="created-column">{{ dts(publication.created) }}</div>
            <div class="published-column">
              {{ dts(publication.published) }}
            </div>
            <div class="delete-column">
              <Icon
                :icon="deleteHighlightAsset"
                :icon-hover="deleteAsset"
                class="delete-icon"
                @click.prevent="unpublish(publication)"
              />
            </div>

            <div class="url-column preview">
              <span v-if="publication.publishing"> publishing... </span>
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
      </div>
    </fieldset>
  </form>

  <form class="pure-form">
    <fieldset class="episodes-table">
      <legend>
        {{ $t('episodes.title') }}
      </legend>

      <div v-for="episode in episodes" v-bind:key="episode.id" class="pure-g form-row episodes-row">
        <div class="id-column">
          #<b>{{ episode.id }}</b>
        </div>
        <div class="created-column">{{ dts(episode.created) }}</div>
        <div class="edit">
          <Icon
            :icon="editHighlightAsset"
            :icon-hover="editAsset"
            @click.prevent="refreshEpisode(episode.id)"
          />
        </div>
        <div class="delete">
          <Icon
            :icon="deleteHighlightAsset"
            :icon-hover="deleteAsset"
            @click.prevent="deletePodcastEpisode(episode)"
          />
        </div>
        <div class="title">{{ episode.title }}</div>
      </div>
    </fieldset>
  </form>
</template>

<style>
.episode-actions {
}

/* publications */
.publications {
  margin-top: var(--gutter-space);
}

.publications .publications-row {
  display: grid;
  grid-template-areas: 'id                url                delete               created             published          plugin ';
  grid-template-columns:
    var(--id-column) var(--icon-column) var(--icon-column) var(--date-column) var(--date-column)
    auto;
}

.episodes-row {
  grid-template-areas: 'id edit delete created title';
  grid-template-columns:
    var(--id-column)
    var(--icon-column)
    var(--icon-column)
    var(--date-column)
    auto;
  display: grid;
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

.publish-menu button {
  grid-area: publish-button;
}

.publish-menu select {
  grid-area: publish-select;
}

fieldset.episodes-table {
  padding-bottom: calc(var(--footer-height) * 1);
}

.episode-managed-file-row label {
  text-align: right;
  padding-right: var(--gutter-space);
}

div.segment-controls {
  display: grid;
  grid-template-areas: 'up down delete transcript ';
  grid-template-columns: var(--icon-column) var(--icon-column) var(--icon-column) var(--icon-column);
}
</style>
