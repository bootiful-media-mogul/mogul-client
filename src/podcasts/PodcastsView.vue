<template>
  <h1>{{ $t('podcasts.title') }}</h1>
  <form class="pure-form pure-form-stacked">
    <fieldset>
      <legend>{{ $t('podcasts.new-podcast') }}</legend>
      <div class="pure-control-group">
        <label for="title">
          {{ $t('podcasts.new-podcast.title') }}
        </label>

        <InputWrapper v-model="title">
          <input type="text" required id="title" v-model="title" />
          <WritingAssistant v-model="title" />
        </InputWrapper>
      </div>
      <div class="pure-controls">
        <button
          class="pure-button pure-button-primary"
          type="submit"
          :disabled="title == null || title.trim().length == 0"
          @click="createPodcast"
          value="create"
        >
          {{ $t('podcasts.new-podcast.submit') }}
        </button>
      </div>
    </fieldset>
  </form>
  <form class="pure-form">
    <fieldset>
      <legend>Podcasts</legend>

      <div class="pure-g form-row podcast-rows" v-for="podcast in podcasts" v-bind:key="podcast.id">
        <div class="id">
          #<b>{{ podcast.id }}</b>
        </div>
        <div class="created">
          {{ dts(podcast.created) }}
        </div>

        <div class="links">
          <a href="#" @click="navigateToEpisodesPageForPodcast(podcast.id, $event)">
            {{ $t('podcasts.podcasts.episodes') }}
          </a>
        </div>
        <div class="delete">
          <a
            v-if="podcasts.length > 1"
            @click.prevent="deletePodcast(podcast.id)"
            href="#"
            class="delete-icon"
          ></a>
          <span v-if="podcasts.length == 1" href="#" class="delete-icon disabled"></span>
        </div>
        <div class="title">
          {{ podcast.title }}
        </div>
      </div>
    </fieldset>
  </form>
</template>

<style>
.id {
  font-weight: normal;
}

.links {
  grid-area: links;
}

.created {
  grid-area: created;
}

.id b {
  font-weight: bold;
  font-size: medium;
}

.delete {
  grid-area: delete;
}

.title {
  grid-area: title;
}

.podcast-rows {
  display: grid;
  grid-template-areas: 'id delete links created title';
  grid-template-columns: var(--id-column) 30px 100px var(--date-column) auto;
}
</style>
<script lang="ts">
import { Podcast, podcasts } from '@/services'
import { dateTimeToString } from '@/dates'
import WritingAssistant from '@/ui/writing/WritingAssistant.vue'
import InputWrapper from '@/ui/input/InputWrapper.vue'

async function refresh() {
  return await podcasts.podcasts()
}

export default {
  components: { WritingAssistant, InputWrapper },

  async created() {
    this.podcasts = await refresh()
  },

  methods: {
    dts: function (date: number) {
      return dateTimeToString(date)
    },
    async deletePodcast(id: number) {
      const deleted = await podcasts.deletePodcast(id)
      // nb: i tried just setting the variable podcasts to a new array, but vue.js didn't 'see' that
      // so it's safer to modify the existing collection
      this.podcasts = this.podcasts.filter((p) => p.id != deleted)
    },

    async navigateToEpisodesPageForPodcast(podcastId: number, e: Event) {
      e.preventDefault()
      this.$router.push({
        name: 'podcast-episodes',
        params: { id: podcastId }
      })
    },

    async createPodcast(e: Event) {
      e.preventDefault()
      await podcasts.create(this.title)
      this.podcasts = await refresh()
      this.title = ''
    }
  },

  data() {
    return {
      podcasts: [] as Array<Podcast>,
      title: ''
    }
  }
}
</script>
