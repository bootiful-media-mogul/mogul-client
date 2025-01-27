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
      'required-value': 'This is a required value!',
      ok: 'OK',
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save',
      create: 'Create'
    },

    hello: 'Hello, {mogul}',
    podbean: 'Podbean',
    mock: 'Mock',
    github: 'GitHub',

    // notifications
    notifications: {
      'transcript-processed-event': 'Transcript for #{key} has been processed.',
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

    // managed files
    'managedfiles.please-upload-a-file': '(please upload a file.)',
    'managedfiles.visible':
      'Is this file publicly visible and accessible? If so, its public URL will show up in the preview panel.',
    'managedfiles.delete': 'Delete this file',
    'managedfiles.preview': 'Preview this file',
    'managedfiles.upload': 'Upload a file',
    'managedfiles.uploaded': 'Has this file been uploaded?',
    'managedfiles.content-type': "This file's content type",
    'managedfiles.file-name': "This file's name",

    // markdown
    'markdown.add-link-prompt': 'Where do you want the link to go to?',

    // app
    'app.menu.home': 'Home',
    'app.menu.settings': 'Settings',
    'app.menu.podcasts': 'Podcasts',
    'app.menu.blogs': 'Blogs',
    'app.menu.about': 'About',
    'app.made-with-love': ` Mogul, made with love ❤️ by {josh} (and with Spring 🍃) `,

    'confirm.deletion': `Are you sure you want to delete {title}? 
    
This is NOT reversible! `,
    ok: 'OK',
    'transcripts.podcasts.episodes.segments': 'Podcast Episode Segment',
    transcripts: {
      text: 'Transcript for {key} #{id}',
      buttons: {
        accept: 'Accept',
        revert: 'Revert',
        refresh: 'Re-transcribe',
        cancel: 'Cancel',
        save: 'Save'
      }
    },
    buttons: {
      accept: 'Accept',
      revert: 'Revert',
      cancel: 'Cancel'
    },
    'about.title': 'About',

    // compositions

    'compositions.buttons.add-attachment': 'Add Attachment',
    'compositions.attachments.drag-and-drop-attachments':
      'Drag one of the attachments onto the text editor to include it inline.',
    // episodes
    'episodes.title': 'All episodes',
    'episodes.publications': 'Publications',
    'episodes.publications.publishing': 'Publishing...',
    'episodes.basics': 'Basics',
    'episodes.segments': 'Segments',
    'episodes.segments.number': 'Episode segment # {id}',
    'episodes.publish': 'Publish',
    'episodes.episodes': 'Episodes for Podcast #{id} - "{title}"',
    'episodes.new-episode': 'New Episode',
    'episodes.buttons.publish': 'Publish',
    'episodes.buttons.cancel': 'Cancel',
    'episodes.episode.segments.number': 'Segment {order} ',
    'episodes.episode.graphic': 'Graphic',
    'episodes.buttons.add-segment': 'Add a New Segment',
    'episodes.episode.reference': 'the episode titled: {title}',
    'episodes.editing-episode': 'Editing episode #{id} - "{title}"',
    'episodes.buttons.save': 'Save',
    'episodes.episode.description.ai-prompt':
      'Please help me make this podcast episode description fun and pithy.',
    'episodes.episode.title.ai-prompt':
      'Please help me make this podcast episode title fun and pithy.',
    'episodes.episode.description': 'Description',
    'episodes.episode.title': 'Title',
    'episodes.plugins.please-select-a-plugin': 'Select a plugin',

    // podcasts
    'podcasts.title': 'Podcasts',
    'podcasts.new-podcast': 'New Podcast',
    'podcasts.new-podcast.title': 'Title',
    'podcasts.title.ai.prompt': `Please help me take the following podcast title and make it more pithy and exciting!`,
    'podcasts.new-podcast.submit': 'Create a new podcast',
    'podcasts.podcasts.delete': 'Delete',
    'podcasts.podcasts.episodes': 'Episodes',

    // settings
    'settings.title': 'Settings',
    'settings.save-button': 'Save configuration changes for {plugin}',
    'settings.github': 'Github',
    'settings.github.clientId': 'Client ID',
    'settings.github.clientSecret': 'Client Secret',
    'settings.podbean': 'Podbean',
    'settings.podbean.clientId': 'Client ID',
    'settings.podbean.clientSecret': 'Client Secret',
    'settings.no-configuration-for-plugin': 'No configuration settings for the {plugin} plugin'
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
