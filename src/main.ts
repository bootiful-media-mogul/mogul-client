import './assets/main.css'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './index'

// i18n
const translations = {
  en: {
    labels: {
      'required-value': 'this is a required value!',
      ok: 'OK',
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save',
      create: 'Create'
    },

    hello: 'hello, {mogul}',
    podbean: 'Podbean',
    mock: 'Mock',
    github: 'GitHub',

    // notifications
    notifications: {
      'podcast-episode-render-finished-event':
        'Finished producing an episode of the podcast episode #{key} ',
      'podcast-episode-render-started-event': 'Producing an episode of the podcast episode #{key}',
      'publication-started-event': 'Publishing podcast episode with ID #{key} has started.',
      'publication-completed-event': 'Publishing podcast episode with ID #{key} has finished.',
      'podcast-episode-completion-event':
        'The podcast with ID #{key} is completed and ready for production',
      'podcast-created-event': `The podcast "{context}", with ID #{key}, has been created.`.trim(),
      'podcast-deleted-event': `The podcast "{context}", with ID #{key}, has been deleted.`.trim()
    },

    // previews

    // managed files
    'managedfiles.please-upload-a-file': '(please upload a file.)',
    'managedfiles.visible':
      'is this file publicly visible and accessible? If so, its public URL will show up in the preview panel.',
    'managedfiles.delete': 'delete this file',
    'managedfiles.preview': 'preview this file',
    'managedfiles.upload': 'upload a file',
    'managedfiles.uploaded': 'has this file been uploaded?',
    'managedfiles.content-type': "this file's content type",
    'managedfiles.file-name': "this file's name",

    // markdown
    'markdown.add-link-prompt': 'Where do you want the link to go to?',

    // app
    'app.menu.home': 'home',
    'app.menu.settings': 'settings',
    'app.menu.podcasts': 'podcasts',
    'app.menu.blogs': 'blogs',
    'app.menu.about': 'about',
    'app.made-with-love': ` Mogul, made with love ❤️ by {josh} (and with Spring 🍃) `,

    // episode segments
    'episodes.episode.segments.number': 'segment {order} ',
    'episodes.episode.graphic': 'graphic',
    'episodes.buttons.add-segment': 'add a new segment',
    'episodes.episode.reference': 'the episode titled: {title}',

    'confirm.deletion': `Are you sure you want to delete {title}? 
    
This is NOT reversible! `,
    ok: 'OK',
    'transcripts.podcasts.episodes.segments': 'Podcast Episode Segment',
    transcripts: {
      // 'podcasts.episodes.segments': 'Podcast Episode Segment' ,
      text: 'Transcript for {key} #{id}',
      buttons: {
        accept: 'accept',
        revert: 'revert',
        cancel: 'cancel',
        save: 'update transcript'
      }
    },
    buttons: {
      accept: 'accept',
      revert: 'revert',
      cancel: 'cancel'
    },
    'about.title': 'About',

    'episodes.title': 'all episodes',
    'episodes.publications': 'Publications',
    'episodes.basics': 'Basics',
    'episodes.segments': 'Segments',
    'episodes.segments.number': 'episode segment # {id}',
    'episodes.publish': 'Publish',
    'episodes.episodes': 'episodes for podcast #{id} - "{title}"',
    'episodes.new-episode': 'new episode',
    'episodes.buttons.publish': 'publish',
    'episodes.buttons.cancel': 'cancel',
    'episodes.editing-episode': 'editing episode #{id} - "{title}"',
    'episodes.buttons.save': 'save',
    'episodes.episode.description.ai-prompt':
      'please help me make this podcast episode description fun and pithy',
    'episodes.episode.title.ai-prompt':
      'please help me make this podcast episode title fun and pithy',
    'episodes.episode.description': 'description',
    'episodes.episode.title': 'title',
    'episodes.plugins.please-select-a-plugin': 'please select a plugin',

    // podcasts
    'podcasts.title': 'Podcasts',
    'podcasts.new-podcast': 'New Podcast',
    'podcasts.new-podcast.title': 'title',
    'podcasts.title.ai.prompt': `please help me take the following podcast title and make it more pithy and exciting!`,
    'podcasts.new-podcast.submit': 'create a new podcast',
    'podcasts.podcasts.delete': 'delete',
    'podcasts.podcasts.episodes': 'episodes',

    // settings
    'settings.title': 'Settings',
    'settings.save-button': 'save configuration changes for {plugin}',
    'settings.github': 'Github',
    'settings.github.clientId': 'Client ID',
    'settings.github.clientSecret': 'Client Secret',
    'settings.podbean': 'Podbean',
    'settings.podbean.clientId': 'Client ID',
    'settings.podbean.clientSecret': 'Client Secret'
  }
}

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: translations,
  // warnHtmlInMessage : false
  legacy: false, // why is this defaulted to true?
  warnHtmlInMessage: 'off'
})

const app = createApp(App)

app.use(i18n)
app.use(router)
app.use(createPinia())

app.mount('#app')
