<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
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
  type TranscriptEditedEvent,
  utils
} from '@/services'

import ManagedFileComponent from '@/managedfiles/ManagedFileComponent.vue'
import { useI18n } from 'vue-i18n'

import { dateTimeToString } from '@/dates'
import InputWrapper from '@/ui/input/InputWrapper.vue'
import InputTools from '@/ui/InputTools.vue'
import Icon from '@/ui/Icon.vue'

import downHighlightAsset from '@/assets/images/down-highlight.png'
import downAsset from '@/assets/images/down.png'

import upHighlightAsset from '@/assets/images/up-highlight.png'
import upAsset from '@/assets/images/up.png'

import transcriptHighlightAsset from '@/assets/images/transcript-highlight.png'
import transcriptAsset from '@/assets/images/transcript.png'

import deleteHighlightAsset from '@/assets/images/delete-highlight.png'
import deleteAsset from '@/assets/images/delete.png'
import CompositionComponent from '@/compositions/CompositionComponent.vue'
import PublicationsSectionComponent from '@/publications/PublicationsSectionComponent.vue'
import PodcastEpisodeBlogPost from '@/podcasts/publications/PodcastEpisodeBlogPost.vue'
import PodcastEpisodeAudioFile from '@/podcasts/publications/PodcastEpisodeAudioFile.vue'
import Podbean from '@/podcasts/publications/Podbean.vue'
import Ayrshare from '@/podcasts/publications/Ayrshare.vue'
import Mock from '@/podcasts/publications/Mock.vue'

const { t } = useI18n()

const transcriptEventPrefix = 'transcripts.podcasts.episodes.segments'

events.on('transcript-refreshed-event', async (event) => {
  const updatedEvent = event as TranscriptEditedEvent
  if (!updatedEvent.key.startsWith(transcriptEventPrefix)) return
  await podcasts.transcribePodcastEpisodeSegment(updatedEvent.id)
  await loadEpisodeFromDbIntoEditor(draftEpisode.value.id)
})

events.on('transcript-edited-event', async (event) => {
  const updatedEvent = event as TranscriptEditedEvent
  if (!updatedEvent.key.startsWith(transcriptEventPrefix)) return
  await podcasts.setPodcastEpisodeSegmentTranscript(updatedEvent.id, true, updatedEvent.transcript)
})

// Props
const props = defineProps<{
  podcastId: number
  episodeId: number
}>()

// State
const segments = ref<PodcastEpisodeSegment[]>([])
const created = ref(-1)
const draftEpisode = ref<PodcastEpisode>({} as PodcastEpisode)
const podcast = ref<Podcast>()
const podcastId = ref<number>(props.podcastId)
const episodeId = ref<number>(props.episodeId)
const publicationsDisabled = ref<boolean>(false)

onMounted(async () => {
  podcast.value = await podcasts.podcastById(podcastId.value)
  if (props.episodeId) {
    await loadEpisodeFromDbIntoEditor(episodeId.value)
  }
})

// title
const title = ref('')
const titleComposition = ref<Composition>()

// description
const description = ref('')
const descriptionComposition = ref<Composition>()
const dirtyKey = ref('')

const buttonsDisabled = computed(() => {
  let changed = false
  if (!draftEpisode.value.id) {
    const hasData = description.value.trim() !== '' && title.value.trim() !== ''
    if (hasData) {
      changed = true
    }
  } else {
    changed = dirtyKey.value !== computeDirtyKey()
  }
  return !changed
})

const loadEpisodeFromDbIntoEditor = async (episodeId: number): Promise<PodcastEpisode> => {
  const ep = await podcasts.podcastEpisodeById(episodeId)
  await loadEpisodeIntoEditor(ep)
  return ep
}

// Methods
const dts = (date: number): string | null => {
  return dateTimeToString(date)
}

const computeDirtyKey = (): string => {
  return `${draftEpisode.value.id ? draftEpisode.value.id : ''}${description.value}:${title.value}`
}

const loadEpisodeSegments = async (episode: PodcastEpisode) => {
  const ep = await podcasts.podcastEpisodeById(episode.id)
  if (ep?.segments?.length > 0) {
    segments.value = ep.segments
  }
}

const loadEpisodeIntoEditor = async (episode: PodcastEpisode) => {
  Object.assign(draftEpisode.value, episode)
  publicationsDisabled.value = !episode.complete
  description.value = episode.description
  title.value = episode.title
  created.value = episode.created
  segments.value = episode.segments
  descriptionComposition.value = episode.descriptionComposition
  titleComposition.value = episode.titleComposition
  dirtyKey.value = computeDirtyKey()
}

async function editPodcastEpisodeSegmentTranscript(seg: PodcastEpisodeSegment) {
  const episode = await podcasts.podcastEpisodeById(draftEpisode.value.id)
  const match = episode.segments.filter((pes) => pes.id == seg.id)[0]
  editTranscript(transcriptEventPrefix, seg.id, match.transcript)
}

const save = async () => {
  if (draftEpisode.value.id) {
    await podcasts.updatePodcastEpisode(draftEpisode.value.id, title.value, description.value)
    await loadEpisodeIntoEditor(await podcasts.podcastEpisodeById(draftEpisode.value.id))
  } //
  else {
    const episode = await podcasts.createPodcastEpisodeDraft(
      parseInt(podcastId.value + ''),
      title.value,
      description.value
    )
    await loadEpisodeIntoEditor(await podcasts.podcastEpisodeById(episode.id))
  }
}

const cancel = async () => {
  Object.assign(draftEpisode, {} as PodcastEpisode)
  title.value = ''
  description.value = ''
  segments.value = []
  publicationsDisabled.value = true
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
  const segmentDetails = t('podcasts.episodes.segments.number', { id: episodeSegment.order })
  const msg = t('confirm.deletion', { title: segmentDetails })
  if (!utils.confirmDeletion(msg)) return

  publicationsDisabled.value = true
  await podcasts.deletePodcastEpisodeSegment(episodeSegment.id)
  await loadEpisodeSegments(episode)
}

const addNewPodcastEpisodeSegment = async (episode: PodcastEpisode) => {
  publicationsDisabled.value = true
  await podcasts.createPodcastEpisodeSegment(episode.id)
  await loadEpisodeSegments(episode)
}

// Arrow Classes
const downArrowDisabled = (_: PodcastEpisode, segment: PodcastEpisodeSegment) => {
  return segments.value[segments.value.length - 1].id === segment.id
}

const upArrowDisabled = (_: PodcastEpisode, segment: PodcastEpisodeSegment) => {
  return segments.value?.[0]?.id === segment.id
}

// Lifecycle Hooks
onMounted(async () => {
  dirtyKey.value = computeDirtyKey()

  notifications.listenForCategory('podcast-episode-completed-event', async (evt) => {
    const ctx = JSON.parse(evt.context)
    const matches = '' + ctx['key'] === draftEpisode.value.id + ''
    if (!matches) {
      return
    }
    publicationsDisabled.value = ctx['complete'] === false
  })

  notifications.listenForCategory('publication-completed-event', async () => {
    await loadEpisodeFromDbIntoEditor(draftEpisode.value.id)
  })

  notifications.listenForCategory('publication-started-event', async (_: Notification) => {
    await loadEpisodeFromDbIntoEditor(draftEpisode.value.id)
  })
})
</script>
<template>
  <h1>Episode</h1>

  <form class="pure-form pure-form-stacked">
    <fieldset>
      <legend>
        <span v-if="title">
          {{ $t('podcasts.episodes.episode.editing', { id: draftEpisode.id, title: title }) }}
        </span>
        <span v-else>
          {{ $t('podcasts.episodes.new-episode') }}
        </span>
        <span v-if="draftEpisode.id"> ({{ dts(draftEpisode.created) }}) </span>
      </legend>

      <div class="form-section">
        <div class="form-section-title">{{ $t('podcasts.episodes.basics') }}</div>
        <div class="form-row">
          <label for="episodeTitle">
            {{ $t('podcasts.episodes.episode.title') }}
          </label>
          <InputWrapper v-model="title">
            <input id="episodeTitle" v-model="title" required type="text" />
            <InputTools v-model="title" />
          </InputWrapper>
        </div>
        <div class="form-row">
          <label for="episodeDescription">
            {{ $t('podcasts.episodes.episode.description') }}
          </label>
          <InputWrapper v-model="description">
            <textarea id="episodeDescription" v-model="description" required rows="10" />
            <CompositionComponent
              v-if="descriptionComposition"
              :composition-id="parseInt(descriptionComposition.id + '')"
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
            {{ $t('podcasts.episodes.buttons.save') }}
          </button>
          <button
            :disabled="description == '' && title == ''"
            class="pure-button pure-button-primary"
            type="submit"
            @click="cancel"
          >
            {{ $t('podcasts.episodes.buttons.cancel') }}
          </button>
        </div>
      </div>

      <div class="form-section">
        <div class="form-section-title">{{ $t('podcasts.episodes.segments') }}</div>

        <div v-if="draftEpisode">
          <div v-if="draftEpisode.graphic" class="row episode-managed-file-row">
            <div class="segment-controls-type">
              <b>{{ $t('podcasts.episodes.episode.graphic') }}</b>
            </div>
            <div class="segment-controls-row">
              <ManagedFileComponent
                :managed-file-id="draftEpisode.graphic.id"
                accept=".jpg,.jpeg,.png,image/jpeg,image/jpg,image/png"
              >
                <div class="segment-controls"></div>
              </ManagedFileComponent>
            </div>
          </div>

          <div v-for="segment in segments" v-bind:key="segment.id">
            <div class="row episode-managed-file-row">
              <div class="segment-controls-type">
                <b>{{
                  $t('podcasts.episodes.episode.segments.number', { order: segment.order })
                }}</b>
              </div>
              <div class="segment-controls-row">
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
                {{ $t('podcasts.episodes.buttons.add-segment') }}
              </button>
            </span>
          </div>
        </div>

        <div class="form-section-title">{{ $t('podcasts.episodes.publications') }}</div>
        <div class="publish-menu">
          <PublicationsSectionComponent
            v-if="draftEpisode.id"
            :publishable="draftEpisode.id + ''"
            :disabled="publicationsDisabled"
            :type="'episode'"
          >
            <Ayrshare />
            <Podbean />
            <PodcastEpisodeBlogPost />
            <PodcastEpisodeAudioFile />
            <Mock />
          </PublicationsSectionComponent>
        </div>
      </div>
    </fieldset>
  </form>
</template>
<style>
.episodes-row {
  grid-template-areas: 'id edit delete created title';
  grid-template-columns:
    var(--id-column)
    var(--icon-column)
    var(--icon-column)
    var(--date-column)
    auto;
  display: grid;
  grid-template-rows: minmax(var(--row-height), auto);
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

.episode-managed-file-row {
  display: grid;
  grid-template-areas: 'type controls';
  grid-template-columns: 100px auto;
}

.episode-managed-file-row .segment-controls-type {
  grid-area: type;
  font-size: smaller;
  margin-right: var(--gutter-space);
  text-align: right;
}

.episode-managed-file-row .segment-controls-row {
  grid-area: controls;
}

div.segment-controls {
  display: grid;
  grid-template-areas: 'up down delete transcript ';
  grid-template-columns: var(--icon-column) var(--icon-column) var(--icon-column) var(--icon-column);
}
</style>
