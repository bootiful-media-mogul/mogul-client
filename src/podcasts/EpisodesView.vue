<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  computed
} from 'vue'
import { events, type TranscriptEditedEvent } from '@/services'

import ManagedFileComponent from '@/managedfiles/ManagedFileComponent.vue'

import {
  editTranscript,
  Notification,
  notifications,
  Podcast,
  PodcastEpisode,
  PodcastEpisodeSegment,
  podcasts,
  Publication
} from '@/services'

import { dateTimeToString } from '@/dates'
import InputWrapper from '@/ui/input/InputWrapper.vue'
import InputTools from '@/ui/InputTools.vue'


const transcriptEventPrefix = 'transcripts.podcasts.episodes.segments'

events.on('transcript-edited-event', async (event) => {
  const updatedEvent = event as TranscriptEditedEvent
  if (!updatedEvent.key.startsWith(transcriptEventPrefix))
    return
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
const title = ref('')
const description = ref('')
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

const save = async (e: Event) => {

  e.preventDefault()

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

const cancel = async (e: Event) => {
  e.preventDefault()
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
  await podcasts.deletePodcastEpisode(episode.id)
  await cancel(new Event(''))
}

const unpublish = async (publication: Publication) => {
  await podcasts.unpublish(publication)
}

// Arrow Classes
const downArrowClasses = (pid: PodcastEpisode, segment: PodcastEpisodeSegment) => ({
  'down-arrow-icon': true,
  disabled: draftEpisodeSegments.value[draftEpisodeSegments.value.length - 1].id === segment.id
})

const upArrowClasses = (pid: PodcastEpisode, segment: PodcastEpisodeSegment) => ({
  'up-arrow-icon': true,
  disabled: draftEpisodeSegments.value?.[0]?.id === segment.id
})

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

  notifications.listenForCategory(
    'publication-completed-event',
    async (_: Notification) => {
      await refreshEpisode(draftEpisode.id)
    }
  )

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
      </legend>
      <!--
      todo: 
        create an icon for the podcast thing
        build out the podcast subsystem
        show the icon as disabled (instead of hiding it outright) if its not possible to publish a podcast
      -->
      <div v-if="draftEpisode.id" class="episode-actions subject-actions">
        <a href="#"> blog<!-- from episode-->
        </a> |
        <a href="#">
          analyse<!-- (for improvements, clippability, etc.)-->
        </a>
      </div>


      <div class="form-section">
        <div class="form-section-title">{{ $t('episodes.basics') }}</div>
        <div class="form-row">
          <label for="episodeTitle">
            {{ $t('episodes.episode.title') }}
          </label>
          <InputWrapper v-model="title">
            <input id="episodeTitle" required v-model="title" type="text" />
            <InputTools v-model="title" />
          </InputWrapper>
        </div>
        <div class="form-row">
          <label for="episodeDescription">
            {{ $t('episodes.episode.description') }}
          </label>
          <InputWrapper v-model="description">
            <textarea id="episodeDescription" rows="10" required v-model="description" />
            <InputTools v-model="description" />
          </InputWrapper>
        </div>
        <div class="podcast-episode-controls-row">
          <span class="save">
            <button
              @click="save"
              :disabled="buttonsDisabled "
              type="submit"
              class="pure-button pure-button-primary"
            >
              {{ $t('episodes.buttons.save') }}
            </button>
          </span>
          <span class="cancel">
            <button
              @click="cancel"
              type="submit"
              :disabled="description == '' && title == ''"
              class="pure-button pure-button-primary"
            >
              {{ $t('episodes.buttons.cancel') }}
            </button>
          </span>
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
                accept=".jpg,.jpeg,.png,image/jpeg,image/jpg,image/png"
                :managed-file-id="draftEpisode.graphic.id"
              >
                <div class="segment-controls"></div>
              </ManagedFileComponent>
            </div>
          </div>

          <div v-bind:key="segment.id" v-for="segment in draftEpisodeSegments">
            <div class="pure-g episode-managed-file-row">
              <div class="pure-u-3-24">
                <label>
                  {{ $t('episodes.episode.segments.number', { order: segment.order }) }}
                </label>
              </div>
              <div class="pure-u-21-24">
                <ManagedFileComponent
                  accept=".mp3,audio/mpeg"
                  :managed-file-id="segment.audio.id"
                >
                  <div class="segment-controls">
                    <a
                      @click.prevent="movePodcastEpisodeSegmentUp(draftEpisode, segment)"
                      :class="upArrowClasses(draftEpisode, segment)"
                      href="#"
                    ></a>
                    <a
                      @click.prevent="movePodcastEpisodeSegmentDown(draftEpisode, segment)"
                      :class="downArrowClasses(draftEpisode, segment)"
                      href="#"
                    ></a>
                    <a
                      @click.prevent="deletePodcastEpisodeSegment(draftEpisode, segment)"
                      class="delete-icon"
                      href="#"
                    ></a>
                    <a
                      @click.prevent="editPodcastEpisodeSegmentTranscript(segment)"
                      class="transcript-icon"
                      href="#"
                    ></a>

                  </div>
                </ManagedFileComponent>
              </div>
            </div>
          </div>

          <div class="podcast-episode-controls-row">
            <span class="save">
              <button
                @click.prevent="addNewPodcastEpisodeSegment(draftEpisode)"
                type="submit"
                class="pure-button pure-button-primary"
              >
                {{ $t('episodes.buttons.add-segment') }}
              </button>
            </span>
          </div>
        </div>

        <div class="form-section">
          <div class="form-section-title">{{ $t('episodes.publications') }}</div>
          <div>
            <div class="publish-menu">
              <select
                v-model="selectedPlugin"
                @change="pluginSelected"
                :disabled="!draftEpisode.complete"
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
                @click="publish"
                type="submit"
                :key="draftEpisode.id"
                ref="publishButton"
                class="pure-button pure-button-primary publish-button"
                :disabled="publishButtonDisabled"
              >
                {{ $t('episodes.buttons.publish') }}
              </button>
            </div>
          </div>

          <div class="publications">
            <div
              class="pure-g form-row publications-row"
              v-bind:key="publication.id"
              v-for="publication in publications"
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
                <a href="#" @click="unpublish(publication)" class="delete-icon"></a>
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
      </div>
    </fieldset>
  </form>

  <form class="pure-form">
    <fieldset class="episodes-table">
      <legend>
        {{ $t('episodes.title') }}
      </legend>

      <div class="pure-g episodes-row" v-bind:key="episode.id" v-for="episode in episodes">
        <div class="id id-column">
          #<b>{{ episode.id }}</b>
        </div>
        <div class="created">{{ dts(episode.created) }}</div>
        <div class="edit">
          <a href="#" @click="refreshEpisode(episode.id)" class="edit-icon"> </a>
        </div>
        <div class="delete">
          <a href="#" @click="deletePodcastEpisode(episode)" class="delete-icon"></a>
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
  grid-template-areas: 'id   created   url delete plugin published  . ';
  grid-template-columns:
    var(--id-column) var(--date-column) var(--icon-column) var(--icon-column) var(--date-column)
    auto;
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

.podcast-episode-controls-row {
}

.podcast-episode-controls-row .save {
  grid-area: save;
}

.podcast-episode-controls-row .cancel {
  grid-area: cancel;
}

.podcast-episode-controls-row .publish-button {
  grid-area: publish-button;
}

.podcast-episode-controls-row .publish-menu {
  display: grid;
  grid-area: publish;
  grid-template-columns: min-content var(--form-buttons-gutter-space) min-content;
  grid-template-areas: '  publish-select  . publish-button';
}

.publish-menu button {
  grid-area: publish-button;
}

.publish-menu select {
  grid-area: publish-select;
}

.episodes-row {
  /*grid-template-rows: 100px ;*/

  grid-template-areas: 'id created edit delete  title';
  grid-template-columns:
    var(--id-column)
    var(--date-column)
    var(--icon-column)
    var(--icon-column)
    auto;
  display: grid;
  margin-bottom: calc(0.5 * 1em);
}

fieldset.episodes-table {
  padding-bottom: calc(var(--footer-height) * 1);
}

.episode-managed-file-row {
  height: calc(var(--gutter-space) * 1);
  margin-bottom: var(--gutter-space);
  margin-top: var(--gutter-space);
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