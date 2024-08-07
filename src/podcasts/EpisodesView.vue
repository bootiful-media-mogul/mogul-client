<script lang="ts">
import {
  Notification,
  notifications,
  Podcast,
  PodcastEpisode,
  PodcastEpisodeSegment,
  podcasts,
  Publication
} from '@/services'
import AiWorkshopItIconComponent from '@/ai/AiWorkshopItIconComponent.vue'
import ManagedFileComponent from '@/managedfiles/ManagedFileComponent.vue'
import { reactive } from 'vue'
import { dateFormat } from '@/dates'

export default {
  mounted(): void {
    this.loadPodcast()
  },

  components: {
    ManagedFileComponent,
    AiWorkshopItIconComponent
  },

  props: ['id'],

  methods: {
    dateTimeFormatter() {
      return dateFormat
    },

    publishButtonDisabled() {
      const enabled = this.draftEpisode.complete && this.selectedPlugin != ''
      return !enabled
    },

    async loadPodcast() {
      const newPodcastId = this.selectedPodcastId
      this.currentPodcast = await podcasts.podcastById(newPodcastId)
      const episodes = await podcasts.podcastEpisodes(newPodcastId)
      if (episodes) {
        episodes.sort((a: PodcastEpisode, b: PodcastEpisode) => b.created - a.created)
      }
      this.episodes = episodes
    },

    async movePodcastEpisodeSegmentDown(
      episode: PodcastEpisode,
      episodeSegment: PodcastEpisodeSegment
    ) {
      await podcasts.movePodcastEpisodeSegmentDown(episode.id, episodeSegment.id)
      await this.loadEpisodeSegments(episode)
    },

    async movePodcastEpisodeSegmentUp(
      episode: PodcastEpisode,
      episodeSegment: PodcastEpisodeSegment
    ) {
      await podcasts.movePodcastEpisodeSegmentUp(episode.id, episodeSegment.id)
      await this.loadEpisodeSegments(episode)
    },
    async deletePodcastEpisodeSegment(
      episode: PodcastEpisode,
      episodeSegment: PodcastEpisodeSegment
    ) {
      await podcasts.deletePodcastEpisodeSegment(episodeSegment.id)
      await this.loadEpisodeSegments(episode)
    },
    async deletePodcastEpisode(episode: PodcastEpisode) {
      await podcasts.deletePodcastEpisode(episode.id)
      await this.cancel(new Event(''))
    },
    async addNewPodcastEpisodeSegment(episode: PodcastEpisode) {
      await podcasts.addPodcastEpisodeSegment(episode.id)
      await this.loadEpisodeSegments(episode)
    },
    async refreshEpisode() {
      await this.loadEpisode(await podcasts.podcastEpisodeById(this.draftEpisode.id))
      console.log('publications' + JSON.stringify(this.publications))
    },
    async loadEpisode(episode: PodcastEpisode) {
      this.draftEpisode.id = episode.id
      this.draftEpisode.graphic = episode.graphic
      this.draftEpisode.title = episode.title
      this.draftEpisode.description = episode.description
      this.draftEpisode.complete = episode.complete
      this.draftEpisode.created = episode.created
      this.draftEpisode.availablePlugins = episode.availablePlugins
      this.description = this.draftEpisode.description
      this.title = this.draftEpisode.title
      this.created = this.draftEpisode.created
      this.dirtyKey = this.computeDirtyKey()
      this.draftEpisodeSegments = episode.segments

      const publicationsToShow = episode.publications
      this.publications = publicationsToShow.sort(
        (a: Publication, b: Publication) => b.created - a.created
      )
      // this.publications = episode.publications
      const plugins = episode.availablePlugins
      if (plugins && plugins.length == 1) this.selectedPlugin = plugins[0]
      const that = this
      await that.loadPodcast()

      // called when there are enough segments to publish the episode
      notifications.listenForCategory(
        'podcast-episode-completion-event',
        async function (notification: Notification) {
          const good =
            notification?.context !== undefined && notification?.context?.complete !== undefined
          if (good) {
            const contextObj = JSON.parse(notification['context'])
            // const episodeId = contextObj['episodeId']
            if (contextObj.complete) {
              const completed = contextObj.complete
              if (completed !== that.draftEpisode.complete) {
                // only reload if the completion state is different
                await that.refreshEpisode()
              }
            }
          }
        }
      )

      // reload ui state.
      notifications.listenForCategory(
        'publication-completed-event',
        async function (notification: Notification) {
          console.debug('got publication-completed-event: ' + JSON.stringify(notification))
          await that.refreshEpisode()
        }
      )
      notifications.listenForCategory(
        'publication-started-event',
        async function (notification: Notification) {
          console.debug('got publication-started-event: ' + JSON.stringify(notification))
          // todo reload the publications and show some sort of badging indicating the episode is being processed. the problem is that the returned notification doesn't give us a way to link the publication, does it?
          // todo also maybe i can change some of these toast boxes to be non visible? there's too many. we just need the first one and the last one to be toasts, i'd think...
          // todo also why is the url not showing up once the publications are reloaded and there is a url in the server-side entity?
          console.log('old publications: ' + JSON.stringify(that.publications))
          await that.refreshEpisode()
          console.log('new publications: ' + JSON.stringify(that.publications))
          that.publications
            .filter((pub) => pub.id === parseInt(notification.key))
            .forEach((p) =>  {
              p.publishing = true
              console.log('publishing '+ p.id )
            })

        }
      )
    },

    async save(e: Event) {
      e.preventDefault()

      if (this.draftEpisode.id) {
        // we're editing a record, so update it
        const episode = await podcasts.updatePodcastEpisode(
          this.draftEpisode.id,
          this.title,
          this.description
        )
        await this.loadEpisode(episode)
      } //
      else {
        const episode = await podcasts.createPodcastEpisodeDraft(
          this.selectedPodcastId,
          this.title,
          this.description
        )
        await this.loadEpisode(episode)
      }
    },

    dateToString(date: number) {
      if (date && date !== 0) {
        return this.dateTimeFormatter().format(new Date(date))
      }
      return null
    },

    downArrowClasses(episode: PodcastEpisode, segment: PodcastEpisodeSegment) {
      return {
        'down-arrow-icon': true,
        disabled: this.draftEpisodeSegments[this.draftEpisodeSegments.length - 1].id == segment.id
      }
    },

    upArrowClasses(episode: PodcastEpisode, segment: PodcastEpisodeSegment) {
      return {
        'up-arrow-icon': true,
        disabled: this.draftEpisodeSegments && this.draftEpisodeSegments[0].id == segment.id
      }
    },

    async unpublish(publication: Publication) {
      await podcasts.unpublish(publication)
    },
    async publish(e: Event) {
      e.preventDefault()
      await podcasts.publishPodcastEpisode(this.draftEpisode.id, this.selectedPlugin)
    },

    pluginSelected(e: Event) {
      e.preventDefault()
      console.log('plugin selected: ' + JSON.stringify(this.selectedPlugin))
    },

    /**
     * returns true if the buttons should be disabled because there's no change in the data in the form.
     */
    buttonsDisabled() {
      let changed = false
      if (!this.draftEpisode.id) {
        const hasData: boolean = this.description.trim() != '' && this.title.trim() != ''
        if (hasData) {
          changed = true
        }
      } //
      else {
        changed = this.dirtyKey != this.computeDirtyKey()
      }

      return !changed
    },

    computeDirtyKey(): string {
      return (
        '' +
        (this.draftEpisode.id ? this.draftEpisode.id : '') +
        this.description +
        ':' +
        this.title
      )
    },

    async cancel(e: Event) {
      e.preventDefault()
      this.draftEpisode = reactive({} as PodcastEpisode)
      this.title = ''
      this.description = ''
      this.draftEpisodeSegments = []
      this.publications = []
      await this.loadPodcast()
    },

    async loadEpisodeSegments(episode: PodcastEpisode) {
      const ep = await podcasts.podcastEpisodeById(episode.id)
      this.draftEpisodeSegments = ep.segments
    }
  },
  created() {
    this.dirtyKey = this.computeDirtyKey()
  },
  setup() {
    return {}
  },
  data() {
    return {
      draftEpisodeSegments: [] as Array<PodcastEpisodeSegment>,
      completionEventListenersEventSource: null as any as EventSource,
      completionEventListeners: [],
      selectedPlugin: '',
      created: -1,
      draftEpisode: reactive({} as PodcastEpisode),
      episodes: [] as Array<PodcastEpisode>,
      publications: [] as Array<Publication>,
      currentPodcast: null as any as Podcast,
      selectedPodcastId: this.id,
      title: '',
      description: '',
      dirtyKey: ''
    }
  }
}
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
      <div class="form-section">
        <div class="form-section-title">{{ $t('episodes.basics') }}</div>

        <label for="episodeTitle">
          {{ $t('episodes.episode.title') }}
          <AiWorkshopItIconComponent
            :prompt="$t('episodes.episode.title.ai-prompt')"
            :text="title"
            @ai-workshop-completed="title = $event.text"
          />
        </label>
        <input id="episodeTitle" required v-model="title" type="text" />

        <label for="episodeDescription">
          {{ $t('episodes.episode.description') }}

          <AiWorkshopItIconComponent
            :prompt="$t('episodes.episode.description.ai-prompt')"
            :text="description"
            @ai-workshop-completed="description = $event.text"
          />
        </label>
        <textarea id="episodeDescription" rows="10" required v-model="description" />

        <div class="podcast-episode-controls-row">
          <span class="save">
            <button
              @click="save"
              :disabled="buttonsDisabled()"
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
                v-model:managed-file-id="draftEpisode.graphic.id"
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
                  v-model:managed-file-id="segment.audio.id"
                >
                  <div class="segment-controls">
                    <a
                      @click.prevent="movePodcastEpisodeSegmentUp(draftEpisode, segment)"
                      href="#"
                      :class="upArrowClasses(draftEpisode, segment)"
                    ></a>
                    <a
                      @click.prevent="movePodcastEpisodeSegmentDown(draftEpisode, segment)"
                      href="#"
                      :class="downArrowClasses(draftEpisode, segment)"
                    ></a>
                    <a
                      @click.prevent="deletePodcastEpisodeSegment(draftEpisode, segment)"
                      href="#"
                      class="delete-icon"
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
                class="pure-button pure-button-primary publish-button"
                :disabled="publishButtonDisabled()"
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
              <div class="id id-column">
                #<b>{{ publication.id }}</b>
              </div>
              <div class="id plugin-column">
                {{ publication.plugin }}
              </div>
              <div class="created-column">{{ dateToString(publication.created) }}</div>
              <div class="published-column">
                {{ dateToString(publication.published) }}
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

      <div class="pure-g form-row episodes-row" v-bind:key="episode.id" v-for="episode in episodes">
        <div class="id id-column">
          #<b>{{ episode.id }}</b>
        </div>
        <div class="created">{{ dateToString(episode.created) }}</div>
        <div class="edit"><a href="#" @click="loadEpisode(episode)" class="edit-icon"> </a></div>
        <div class="delete">
          <a href="#" @click="deletePodcastEpisode(episode)" class="delete-icon"></a>
        </div>
        <div class="title">{{ episode.title }}</div>
      </div>
    </fieldset>
  </form>
</template>

<style>
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
  display: grid;
  grid-template-areas: 'save . cancel . publish';
  grid-template-columns: min-content var(--form-buttons-gutter-space) min-content auto min-content;
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
  grid-template-areas: 'id created edit delete  title';
  grid-template-columns:
    var(--id-column)
    var(--date-column)
    var(--icon-column)
    var(--icon-column)
    auto;
  display: grid;
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
  font-size: smaller;
  display: grid;
  grid-template-areas: 'up down delete ';
  grid-template-columns: var(--icon-column) var(--icon-column) var(--icon-column);
}
</style>
