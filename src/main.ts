import './assets/base.css'

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

    hello: 'Hi, {mogul}',
    notes: {
      buttons: {
        save: 'Save'
      },
      'system-wide': { title: 'System Notes' },
      entity: { title: 'Notes for {entityName}' },
      new: { prompt: "{entityName}'s Notes" }
    },
    blogs: {
      done: 'Done',
      editing: 'Editing {title}',

      save: 'Save',
      'new-blog': {
        title: 'Title',
        description: 'Description'
      }
    },
    publications: {
      outcomes: {
        'error-message': 'see error message',
        'no-error-message': '(no error message given)',
        keys: {
          ayrshare: 'Ayrshare',
          mock: 'Mock',
          podbean: 'Podbean',
          gmb: 'Google Business Profile',
          audioFile: 'Audio File Download',
          facebook: 'Facebook',
          linkedin: 'LinkedIn',
          instagram: 'Instagram',
          telegram: 'Telegram',
          snapchat: 'Snapchat',
          pinterest: 'Pinterest',
          threads: 'Threads',
          youtube: 'YouTube',
          reddit: 'Reddit',
          bluesky: 'Bluesky',
          tiktok: 'TikTok',
          twitter: 'X (formerly known as Twitter)'
        }
      },
      plugins: {
        ayrshare: {
          platforms: {
            gmb: 'Google Business Profile',
            facebook: 'Facebook',
            linkedin: 'LinkedIn',
            instagram: 'Instagram',
            telegram: 'Telegram',
            snapchat: 'Snapchat',
            pinterest: 'Pinterest',
            threads: 'Threads',
            youtube: 'YouTube',
            reddit: 'Reddit',
            bluesky: 'Bluesky',
            tiktok: 'TikTok',
            twitter: 'X (formerly known as Twitter)'
          },
          'combo-post': 'use the same copy for all enabled platforms',
          ayrshareKey: 'Ayrshare API Key',
          title: 'Ayrshare',
          description: `
            Publish this episode to your Ayrshare.com account for social media syndication. 
            
            Please note that before continuing, you must link and enable 
            the selected target platforms in your Ayrshare account.
            
            Please select to which social media platforms you want to publish, and then compose a post targeted to that
            platform.
            `
        },
        blogPost: {
          description: 'Publish the episode as a blog post'
        },
        publish: 'Publish',
        github: {
          title: 'GitHub',
          clientId: 'Client ID',
          clientSecret: 'Client Secret'
        },
        mock: {
          description: 'Kicks off the production process, and generates dummy data',
          title: 'Mock'
        },
        podcastEpisodeToBlogPost: {
          blogId: 'Blog ID',
          description: 'Publish as a Blog Post',
          title: 'Publish as a Blog Post'
        },
        audioFile: {
          title: 'Download Audio File',
          description: 'Download the finalized (produced) .mp3 file for the episode',
          download: 'Download'
        },
        podbean: {
          title: 'Podbean',
          clientId: 'Client ID',
          clientSecret: 'Client Secret',
          description:
            'Publish this episode to your Podbean.com account for syndication and ad integration.'
        }
      }
    },

    search: {
      navigation: {
        episode: 'visit podcast episode'
      },
      'no-results': {
        prompt: 'There are no results.'
      },
      results: {
        title: 'Search Results',
        result: {
          view: 'view'
        },
        prompt: '{count} result(s) for your search "{term}"'
      },
      prompt: 'Enter a search term and press enter'
    },

    // notifications
    notifications: {
      'blog-updated-event': `The blog "{context}" with ID #{key} has been updated`.trim(),
      'blog-created-event': `The blog "{context}" with ID #{key} has been created`.trim(),
      'ayrshare-publication-completion-event':
        'Publication to the Ayrshare social media platform has completed.',
      'setting-written-event': 'Plugin configuration has been updated.',
      'transcript-processed-event': 'Transcript for #{key} has been processed.',
      'transcript-completed-event': 'Transcript for #{key} has been completed.',
      'podcast-episode-render-finished-event':
        'Finished producing an episode of the podcast episode #{key} ',
      'podcast-episode-render-started-event': 'Producing an episode of the podcast episode #{key}',
      'publication-started-event': 'Publishing podcast episode with ID #{key} has started.',
      'publication-completed-event': 'Publishing podcast episode with ID #{key} has finished.',
      'podcast-episode-completed-event':
        'The podcast with ID #{key} is completed and ready for production',
      'podcast-created-event': `The podcast "{context}", with ID #{key}, has been created.`.trim(),
      'podcast-updated-event': `The podcast "{context}", with ID #{key}, has been updated.`.trim(),
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
    'markdown.add-image-prompt': 'Provide a caption for the image',

    // selections
    'selections.podcasts': 'Select a Podcast',
    'selections.params.podcastIndexerJob.podcastId': 'Podcast ID',
    'selections.params.helloWorldJob.name': 'Name',

    // jobs
    'jobs.name.helloWorldJob': '"Hello World!"',
    'jobs.name.failingJob': 'Fail',
    'jobs.name.notesIndexerJob': 'Notes Indexer',
    'jobs.name.podcastIndexerJob': 'Podcast Indexer',
    'jobs.required-context-attributes': 'Required Context Attributes: {attributes}',
    'jobs.launch': 'Launch {name}',
    'jobs.title': 'Jobs',
    'jobs.busy': 'running {name}',
    'jobs.done': '{name} has completed successfully.',
    'jobs.failed': '{name} failed.',

    // app
    'app.tabs.main': 'Main',
    'app.menu.home': 'Home',
    'app.menu.search': 'Search',
    'app.menu.settings': 'Settings',
    'app.menu.jobs': 'Jobs',
    'app.menu.test': 'Test',
    'app.menu.podcasts': 'Podcasts',
    'app.menu.blogs': 'Blogs',
    'app.menu.about': 'About',
    'app.made-with-love': ` Mogul, made with love ❤️ by {josh} (and with Spring 🍃) `,
    'app.panels.notes': 'Notes',
    'app.panels.transcripts': 'Transcripts',
    'app.panels.media-preview': 'Media Preview',
    'confirm.deletion': `Are you sure you want to delete "{title}"? 
    
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
    // blogs
    'blogs.title': 'Blogs',
    'blogs.all': "{user}'s blogs",
    // episodes

    'compositions.attachments.drag-and-drop-attachments':
      'Drag one of the attachments onto the text editor to include it inline.',

    'podcasts.done': 'Done',
    'podcasts.episodes.episode': 'Episode',
    'podcasts.episodes': 'Episodes',
    'podcasts.episodes.title': 'Episodes in "{title}"',
    'podcasts.episodes.publications': 'Publications',
    'podcasts.episodes.publications.publishing': 'Publishing...',
    'podcasts.episodes.basics': 'Basics',
    'podcasts.episodes.segments': 'Segments',
    'podcasts.episodes.segments.prompt':
      "(don't forget to normalize your audio clips to the same sample rate and bit depth!)",
    'podcasts.episodes.segments.number': 'Episode segment # {id}',
    'podcasts.episodes.episodes': 'Episodes for Podcast #{id} - "{title}"',
    'podcasts.episodes.new-episode': 'New Episode',
    'podcasts.episodes.buttons.publish': 'Publish',
    'podcasts.episodes.buttons.cancel': 'Cancel',
    'podcasts.episodes.episode.segments.number': 'Segment {order} ',
    'podcasts.episodes.episode.graphic': 'Graphic',
    'podcasts.episodes.buttons.add-segment': 'Add a New Segment',
    'podcasts.episodes.episode.reference': 'the episode titled: {title}',
    'podcasts.episodes.all': "{title}'s episodes",
    'podcasts.episodes.episode.editing': 'Editing {id} "{title}"',
    'podcasts.episodes.episode.edit': 'Episode Editor',
    'podcasts.episodes.buttons.save': 'Save',
    'podcasts.episodes.episode.description.ai-prompt':
      'Please help me make this podcast episode description fun and pithy.',
    'podcasts.episodes.episode.title.ai-prompt':
      'Please help me make this podcast episode title fun and pithy.',
    'podcasts.episodes.episode.description': 'Description',
    'podcasts.episodes.episode.title': 'Title',
    'podcasts.episodes.plugins.please-select-a-plugin': 'Select a plugin',

    // podcasts
    'podcasts.title': 'Podcasts',
    'podcasts.all': "{user}'s podcasts",
    'podcasts.new-podcast': 'New Podcast',
    'podcasts.new-podcast.title': 'Title',
    'podcasts.title.ai.prompt': `Please help me take the following podcast title and make it more pithy and exciting!`,
    'podcasts.save': 'Save',
    'podcasts.editing': 'Editing {podcast}',
    'podcasts.podcasts.delete': 'Delete',

    // settings
    'settings.title': 'Settings',
    'settings.save-button': 'Save configuration changes for {plugin}',
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
