import Mogul from '@/mogul'
import mitt from 'mitt'
import { Client, errorExchange, fetchExchange } from '@urql/core'
import router from '@/index'
import { marked } from 'marked'


export const graphqlClient = new Client({
  url: '/api/graphql',
  exchanges: [
    fetchExchange,
    errorExchange({
      onError: async (error) => {
        if (error) {
          console.error('got an error! ' + JSON.stringify(error))
          events.emit('unauthorized', error)
          await router.replace('/')
        }
      }
    })
  ]
})

export function previewManagedFile(managedFileId: number) {
  events.emit('preview-managed-file-event', managedFileId)
}

export interface TranscriptEditEvent {
  readonly key: string
  readonly id: number
  readonly transcript: string
}

export interface TranscriptEditedEvent {
  readonly key: string
  readonly id: number
  readonly transcript: string
}

export function editTranscript(key: string, id: number, text: string) {
  events.emit('edit-transcript-event', {
    key: key,
    transcript: text,
    id: id
  } as TranscriptEditEvent)
}

export class Podcast {
  readonly title: string
  readonly id: number
  readonly created: number

  constructor(id: number, title: string, created: number) {
    this.id = id
    this.title = title
    this.created = created
  }
}


export class Podcasts {
  private readonly client: Client

  constructor(client: Client) {
    this.client = client
  }

  async addPodcastEpisodeSegment(episodeId: number) {
    // console.log('add a new podcast episode segment #' + episodeId)
    const mutation = ` 
          mutation AddPodcastEpisodeSegment($episodeId: ID  ){ 
            addPodcastEpisodeSegment(episodeId:$episodeId  ) 
          }
        `
    await this.client.mutation(mutation, {
      episodeId: episodeId
    })
    return true
  }

  async publishPodcastEpisode(episodeId: number, pluginName: string): Promise<boolean> {
    const mutation = ` 
          mutation PublishPodcastEpisode  ($episode: ID, $pluginName: String ){ 
            publishPodcastEpisode ( episodeId: $episode,  pluginName: $pluginName ) 
          }
    `
    const publication = await this.client.mutation(mutation, {
      episode: episodeId,
      pluginName: pluginName
    })
    return (await publication.data['publishPodcastEpisode']) as boolean
  }

  async updatePodcastEpisode(
    episodeId: number,
    title: string,
    description: string
  ): Promise<PodcastEpisode> {
    const mutation = `
         mutation UpdatePodcastEpisode  ($episode: ID, $title: String, $description: String ){ 
          updatePodcastEpisode ( episodeId: $episode, title: $title, description: $description) { 
             id 
          }
         }
        `
    //console.debug(episodeId + ':' + title + ':' + description)
    const result = await this.client.mutation(mutation, {
      episode: episodeId,
      title: title,
      description: description
    })

    const res = await result.data['updatePodcastEpisode']
    // console.debug('updated results: ', res)
    return await this.podcastEpisodeById(res['id'])
  }

  async podcastEpisodeById(id: number): Promise<PodcastEpisode> {
    const q = `
        query GetPodcastEpisodeById ( $id: ID){
            podcastEpisodeById ( id : $id) {
              availablePlugins, 
              created, 
              id, 
              title, 
              description, 
              complete,  
              graphic { id  },
              segments { 
                id, name, audio { id } , order , crossFadeDuration , transcript 
              }
              publications {
                id,
                plugin,
                created,
                published ,
                url
              }
          }
        }
        `
    const res = await this.client.query(q, { id: id })
    return (await res.data['podcastEpisodeById']) as PodcastEpisode
  }

  async create(title: string): Promise<Podcast> {
    const mutation = `
         mutation CreatePodcast ($title: String){ 
          createPodcast(title: $title) { 
           id, title
          }
         }
    `
    const result = await this.client.mutation(mutation, {
      title: title
    })
    return (await result.data['createPodcast']) as Podcast
  }

  async podcastEpisodes(podcastId: number): Promise<Array<PodcastEpisode>> {
    const q = `
        query GetPodcastEpisodesByPodcast( $podcastId: ID){
            podcastEpisodesByPodcast ( podcastId : $podcastId) {
                availablePlugins,  
                created, 
                id , 
                title, 
                description, 
                complete, 
                graphic { id  } ,
                publications { 
                  id,
                  plugin ,
                  created, 
                  published ,
                  url
                },
                segments { 
                  id, 
                  name, 
                  audio { id } , 
                  order , 
                  crossFadeDuration,
                  transcript 
                } 
            }
        }
        `
    const res = await this.client.query(q, { podcastId: podcastId })
    return (await res.data['podcastEpisodesByPodcast']) as Array<PodcastEpisode>
  }

  // transcript
  async setPodcastEpisodesSegmentTranscript(
    episodeSegmentId: number,
    transcribable: boolean,
    transcript: string
  ): Promise<boolean> {
    // episodeSegmentId: ID, transcribable: Boolean, transcript: String)
    const mutation = ` 
          mutation SetPodcastEpisodesSegmentTranscript  ($episodeSegmentId: ID, $transcribable: Boolean , $transcript:String ){ 
            setPodcastEpisodesSegmentTranscript ( episodeSegmentId: $episodeSegmentId,  transcribable: $transcribable, transcript: $transcript )  
          }
    `
    const publication = await this.client.mutation(mutation, {
      episodeSegmentId: episodeSegmentId,
      transcribable: transcribable,
      transcript: transcript
    })
    return (await publication.data['publishPodcastEpisode']) as boolean
  }

  // transcript

  async deletePodcastEpisodeSegment(id: number) {
    const mutation = `
         mutation DeletePodcastEpisodeSegment ($id: ID ){ 
          deletePodcastEpisodeSegment(id: $id)  
         }
        `
    const result = await this.client.mutation(mutation, {
      id: id
    })
    return (await result.data['deletePodcastEpisodeSegment']) as Number
  }

  async deletePodcastEpisode(id: number) {
    const mutation = `
         mutation DeletePodcastEpisode ($id: ID ){ 
          deletePodcastEpisode(id: $id)  
         }
        `
    const result = await this.client.mutation(mutation, {
      id: id
    })
    return (await result.data['deletePodcastEpisode']) as Number
  }

  async deletePodcast(id: number) {
    const mutation = `
         mutation DeletePodcast ($id: ID ){ 
          deletePodcast(id: $id)  
         }
        `
    const result = await this.client.mutation(mutation, {
      id: id
    })
    return (await result.data['deletePodcast']) as Number
  }

  async podcasts() {
    const q = `
        query {
          podcasts  { 
           id, title ,created 
          }
         }
        `
    const result = await this.client.query(q, {})
    return (await result.data['podcasts']) as Array<Podcast>
  }

  async createPodcastEpisodeDraft(
    podcastId: number,
    title: string,
    description: string
  ): Promise<PodcastEpisode> {
    const mutation = `
         mutation CreatePodcastEpisodeDraft ($podcast: ID, $title: String, $description: String ){ 
          createPodcastEpisodeDraft( podcastId: $podcast, title: $title, description: $description) { 
               id  
          }
         }
        `
    //console.log(podcastId + ':' + title + ':' + description)
    const result = await this.client.mutation(mutation, {
      podcast: podcastId,
      title: title,
      description: description
    })

    const idBag = (await result.data['createPodcastEpisodeDraft'])['id']
    return await this.podcastEpisodeById(idBag)
  }

  async podcastById(podcastId: number): Promise<Podcast> {
    const q = `
       
            query GetPodcastById( $id: ID){
                podcastById ( id : $id) { 
                    id,
                    title 
                }
            }
        `
    const result = await this.client.query(q, { id: podcastId })
    return (await result.data['podcastById']) as Podcast
  }

  async movePodcastEpisodeSegmentDown(episodeId: number, episodeSegmentId: number) {
    const mutation = `
         mutation MovePodcastEpisodeSegmentDown ($episodeId: ID, $episodeSegmentId: ID   ){ 
          movePodcastEpisodeSegmentDown(  episodeId: $episodeId,  episodeSegmentId: $episodeSegmentId  ) 
         }
        `
    // todo for some reason these are showing up as `strings` and causing issues when i send them to the server-side.
    //
    const result = await this.client.mutation(mutation, {
      episodeId: episodeId,
      episodeSegmentId: episodeSegmentId
    })
    // console.debug('movePodcastEpisodeSegmentDown #' + JSON.stringify(result))
  }

  async movePodcastEpisodeSegmentUp(episodeId: number, episodeSegmentId: number) {
    const mutation = `
         mutation MovePodcastEpisodeSegmentUp ($episodeId: ID  , $episodeSegmentId: ID    ){ 
          movePodcastEpisodeSegmentUp(  episodeId: $episodeId,  episodeSegmentId: $episodeSegmentId )  
         }
        `
    const result = await this.client.mutation(mutation, {
      episodeId: episodeId,
      episodeSegmentId: episodeSegmentId
    })
  }

  async unpublish(publication: Publication) {
    const mutation = `
         mutation UnpublishPodcastEpisodePublication ($publicationId: ID   ){ 
            unpublishPodcastEpisodePublication( publicationId: $publicationId )  
         }
        `
    await this.client.mutation(mutation, {
      publicationId: publication.id
    })
  }
}

export class Setting {
  name: string
  valid: boolean
  value: string

  constructor(name: string, valid: boolean, value: string) {
    this.name = name
    this.valid = valid
    this.value = value
  }
}

export class SettingsPage {
  valid: boolean
  category: string
  settings: Array<Setting>

  constructor(valid: boolean, category: string, settings: Array<Setting>) {
    this.valid = valid
    this.category = category
    this.settings = settings
  }
}

export class ManagedFile {
  id: number
  bucket: string
  folder: string
  filename: string
  size: number
  written: boolean
  visible: boolean
  contentType: string

  constructor(
    id: number,
    bucket: string,
    folder: string,
    filename: string,
    size: number,
    written: boolean,
    contentType: string,
    visible: boolean
  ) {
    this.id = id
    this.bucket = bucket
    this.folder = folder
    this.filename = filename
    this.written = written
    this.size = size
    this.contentType = contentType
    this.visible = visible
  }
}

export class PodcastEpisodeSegment {
  id: number
  name: string
  audio: ManagedFile
  order: number
  transcript: string

  constructor(id: number, name: string, audio: ManagedFile, order: number, transcript: string) {
    this.id = id
    this.name = name
    this.audio = audio
    this.order = order
    this.transcript = transcript
  }
}

export class Publication {
  id: number
  plugin: string
  created: number
  published: number
  url: string
  // this is meant to be set by the UI if and only if we're in the middle of publishing an episode
  publishing: boolean = false

  constructor(id: number, plugin: string, created: number, published: number, url: string) {
    this.id = id
    this.url = url
    this.plugin = plugin
    this.created = created
    this.published = published
  }
}

export class PodcastEpisode {
  availablePlugins: Array<string>
  id: number
  title: string
  description: string
  graphic: ManagedFile
  complete: boolean = false
  created: number = 0
  segments: Array<PodcastEpisodeSegment>
  publications: Array<Publication>

  constructor(
    id: number,
    title: string,
    description: string,
    graphic: ManagedFile,
    complete: boolean,
    created: number,
    availablePlugins: Array<string>,
    segments: Array<PodcastEpisodeSegment>,
    publications: Array<Publication>
  ) {
    this.availablePlugins = availablePlugins
    this.id = id
    this.title = title
    this.description = description
    this.graphic = graphic
    this.complete = complete
    this.created = created
    this.segments = segments
    this.publications = publications
  }
}

export class Notification {
  readonly when: Date
  readonly key: string
  readonly category: string
  readonly context: string
  readonly mogulId: number
  readonly modal: boolean
  readonly visible: boolean

  constructor(
    mogulId: number,
    key: string,
    context: string,
    category: string,
    when: Date,
    modal: boolean,
    visible: boolean
  ) {
    this.context = context
    this.mogulId = mogulId
    this.modal = modal
    this.category = category
    this.when = when
    this.visible = visible
    this.key = key
  }
}

export class Notifications {
  private readonly client: Client

  private callbacks: Array<(notification: Notification) => void> = []

  private callbacksByCategory: Map<string, Array<(notification: Notification) => void>> = new Map()

  constructor(client: Client) {
    this.client = client
    const that = this
    setInterval(async () => {
      // don't run a network call if there are no callbacks to benefit from it
      if (that.callbacks.length == 0) {
        return
      }

      const q = `
          query   {
            notifications { 
              mogulId , 
              category , 
              key , 
              when , 
              context ,  
              visible ,  
              modal 
            }
           }
          `
      const result = await this.client.query(q, {})
      const data = await result.data
      const d = data['notifications']
      // don't run a network call if there is no notification to show
      if (d !== null) {
        const notificationObj = d as Notification
        that.callbacks.forEach((callback) => callback(notificationObj))
        that.callbacksByCategory.forEach((array, key) => {
          if (key === notificationObj.category) {
            // console.log('dispatching event with key [' + key + '] to function...')
            array.forEach((cb) => cb(notificationObj))
          }
        })
      }
    }, 5000)
  }

  listenForCategory(category: string, callback: (notification: Notification) => void) {
    if (!this.callbacksByCategory.has(category)) {
      this.callbacksByCategory.set(category, [])
    }
    this.callbacksByCategory.get(category)!.push(callback)
  }

  listen(callback: (notification: Notification) => void) {
    if (this.callbacks.indexOf(callback) === -1) {
      this.callbacks.push(callback)
      // console.log('registering a callback for Notifications')
    }
  }
}

/**
 * handles updating and inspecting all the configuration values.
 */
export class Settings {
  private readonly client: Client

  constructor(client: Client) {
    this.client = client
  }

  async updateSetting(category: string, name: string, value: string) {
    const mutation = `
      mutation UpdateSetting($category : String , $name:String, $value:String){ 
       updateSetting (  category: $category, name: $name, value: $value)
      }
    `
    const result = await this.client.mutation(mutation, {
      category: category,
      name: name,
      value: value
    })

    return (await result.data['updateSetting']) as boolean
  }

  async settings(): Promise<Array<SettingsPage>> {
    const q = `
            query {
                settings { 
                 valid 
                 category 
                 settings  {
                  name 
                  valid 
                  value
                 }
                }
            }
        `
    const json = await this.client.query(q, {})
    return json.data['settings']
  }
}

export class ManagedFiles {
  private readonly client: Client

  constructor(client: Client) {
    this.client = client
  }

  async setManagedFileVisibility(managedFileId: number, visible: boolean) {
    const mutation = `
      mutation SetManagedFileVisibility( $managedFileId : ID , $visible:Boolean ){ 
       setManagedFileVisibility (  managedFileId: $managedFileId, visible: $visible )
      }
    `
    const result = await this.client.mutation(mutation, {
      managedFileId: managedFileId ,
      visible: visible
    })
    return (await result.data['setManagedFileVisibility']) as boolean
  }

  async getManagedFileById(id: number): Promise<ManagedFile> {
    const q = `
        query ($id: ID) {
          managedFileById( id : $id )  { 
            id, bucket, folder, filename, size, written ,contentType, visible
          }
        }
        `
    const result = await this.client.query(q, { id: id })
    const managedFileId = await result.data['managedFileById']
    return managedFileId as ManagedFile
  }
}

export class Ai {
  private readonly client: Client

  constructor(client: Client) {
    this.client = client
  }

  /* generate text responses */
  async chat(prompt: string): Promise<string> {
    const query = `
            query AiChatQuery ( $prompt: String) { 
             aiChat( prompt : $prompt ) 
            }
     `
    const result = await this.client.query(query, {
      prompt: prompt
    })
    return (await result['data']['aiChat']) as string
  }

  /** todo renders images given a prompt */
  render(prompt: string): string {
    return ''
  }

  /**
   * i think we'd have a little drag-and-drop panel in the AiClient where we'd be allowed to drop {@code .mp3} or
   * {@code .mp4} or {@code .wav} files,
   * */
  transcribe(path: string): string {
    return ''
  }
}

export class Markdown {
  private readonly client: Client

  constructor(client: Client) {
    this.client = client
  }

  async render(markdown: string): Promise<string> {
    return Promise.resolve(marked.parse(markdown, {}))
  }
}


export class Utils {

  confirmDeletion(msg: string): boolean {
    return window.confirm(msg)
  }
}

export const utils = new Utils()
export const markdown = new Markdown(graphqlClient)
export const ai = new Ai(graphqlClient)
export const notifications = new Notifications(graphqlClient)
export const mogul = new Mogul(graphqlClient)
export const events = mitt()
export const podcasts = new Podcasts(graphqlClient)
export const managedFiles = new ManagedFiles(graphqlClient)
export const settings = new Settings(graphqlClient)
