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
import { dateToString } from '@/dates'

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
    dts(date: number): string {
      return dateToString(date)
    },

    publishButtonDisabled() {
      return !this.draftEpisode.complete || !this.selectedPlugin || this.selectedPlugin == ''
    },

    //todo we're calling this from loadEpisode. any chance this is grossly inefficient and could be optimized away? 
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
      this.draftEpisode.complete = false
      await podcasts.deletePodcastEpisodeSegment(episodeSegment.id)
      await this.loadEpisodeSegments(episode)
    },
    async deletePodcastEpisode(episode: PodcastEpisode) {
      await podcasts.deletePodcastEpisode(episode.id)
      await this.cancel(new Event(''))
    },
    async addNewPodcastEpisodeSegment(episode: PodcastEpisode) {
      this.draftEpisode.complete = false
      await podcasts.addPodcastEpisodeSegment(episode.id)
      await this.loadEpisodeSegments(episode)
    },


    async refreshEpisode(episodeId: number) {
      if (!episodeId) console.error('the episode you gave me to refresh isnt valid ' + episodeId + '!')
      await this.loadEpisode(await podcasts.podcastEpisodeById(episodeId))
    },

    async refreshEpisodePublicationControls(id: number, completed: boolean) {
      this.draftEpisode.complete = completed // set it up so that the UI sees the change.
      if (!id) {
        console.error('no episode provided in refreshEpisodePublicationControls, returning')
      }
      const episode = await podcasts.podcastEpisodeById(id)
      if (episode) {
        if (episode.publications && episode.publications.length > 0) {
          this.publications = episode.publications.sort(
            (a: Publication, b: Publication) => b.created - a.created
          )
        } //  

        if (episode.availablePlugins) {
          const plugins = episode.availablePlugins
          if (plugins && plugins.length == 1)
            this.selectedPlugin = plugins[0]
        }
      } else {
        console.error('there is no episode in the SQL DB for ' +
          'refreshEpisodePublicationControls. returning. ')
      }
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
      await this.refreshEpisodePublicationControls(episode.id, this.draftEpisode.complete)
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
        await this.loadEpisode(await podcasts.podcastEpisodeById(this.draftEpisode.id))
      } //
      else {
        const episode = await podcasts.createPodcastEpisodeDraft(
          this.selectedPodcastId,
          this.title,
          this.description
        )
        await this.loadEpisode(await podcasts.podcastEpisodeById(episode.id))
      }
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
    },

    /**
     * returns TRUE if the buttons should be disabled because there's no change in the data in the form.
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
      if (ep && ep.segments && ep.segments.length > 0) {
        this.draftEpisodeSegments = ep.segments
      } 
    }
  },
  created() {
    this.dirtyKey = this.computeDirtyKey()
    const that = this

    // todo these event handlers should <em>only</em> reload the UI 
    //  state if the user is doing something w/ an entity 
    //  affected by the event. that is, why refresh a screen
    //  belonging to something else completely if that thing isn't 
    //  visible on the screen in the first place?


    notifications.listenForCategory(
      'podcast-episode-completion-event',
      async function(notification: Notification) {
        const jsonMap = JSON.parse(notification.context) as any
        const complete = jsonMap['complete'] as boolean
        const episodeId = parseInt(notification.key)
        await that.refreshEpisodePublicationControls(episodeId, complete) // get it from the event
      }
    )

    notifications.listenForCategory(
      'publication-completed-event',
      async function(notification: Notification) {
        await that.refreshEpisode(that.draftEpisode.id)
      }
    )

    notifications.listenForCategory(
      'publication-started-event',
      async function(notification: Notification) {
        await that.refreshEpisode(that.draftEpisode.id)
        that.publications
          .filter((pub) => pub.id === parseInt(notification.key))
          .forEach((p) => {
            p.publishing = true
          })
      }
    )
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
                :key="draftEpisode.id"
                ref="publishButton"
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

      <div class="pure-g form-row episodes-row" v-bind:key="episode.id" v-for="episode in episodes">
        <div class="id id-column">
          #<b>{{ episode.id }}</b>
        </div>
        <div class="created">{{ dts(episode.created) }}</div>
        <div class="edit"><a href="#" @click="refreshEpisode(episode.id)" class="edit-icon"> </a></div>
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
