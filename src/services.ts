import Mogul from '@/mogul'
import mitt from 'mitt'
import { Client, errorExchange, fetchExchange } from '@urql/core'
import router from '@/index'
import { marked } from 'marked'
import * as Ably from 'ably'
import { ErrorInfo, type TokenDetails, type TokenParams, type TokenRequest } from 'ably'


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
  events.emit('transcript-edit-event', {
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

  async createPodcastEpisodeSegment(podcastEpisodeId: number) {
    const mutation = ` 
      mutation ($podcastEpisodeId: Int ){ 
        createPodcastEpisodeSegment(podcastEpisodeId : $podcastEpisodeId  ) 
      }
    `
    await this.client.mutation(mutation, {
      podcastEpisodeId: podcastEpisodeId
    })
    return true
  }

  async updatePodcastEpisode(
    podcastEpisodeId: number,
    title: string,
    description: string
  ): Promise<PodcastEpisode> {
    const mutation = `
         mutation ($podcastEpisodeId: Int, $title: String, $description: String ){ 
          updatePodcastEpisode( podcastEpisodeId: $podcastEpisodeId, title: $title, description: $description) 
         }
        `
    const result = await this.client.mutation(mutation, {
      podcastEpisodeId: podcastEpisodeId,
      title: title,
      description: description
    })

    const res = await result.data['updatePodcastEpisode']
    return await this.podcastEpisodeById(podcastEpisodeId)
  }

  async podcastEpisodeById(podcastEpisodeId: number): Promise<PodcastEpisode> {
    const q = `
        query($podcastEpisodeId: Int ){
            podcastEpisodeById (podcastEpisodeId: $podcastEpisodeId) {
              created, 
              id, 
              title, 
              description, 
              complete,  
              producedAudio { id  },
              graphic { id  },
              segments { 
                id, name, audio { id } , order , crossFadeDuration , transcript 
              }
              descriptionComposition { 
                id,
                field ,
                attachments {
                  id,
                  caption,
                  managedFile { id }
                }
              }
              
              titleComposition { 
                id,
                field ,
                attachments {
                  id,
                  caption,
                  managedFile {  id }
                }                
              }
          }
        }
        `
    const res = await this.client.query(q, { podcastEpisodeId: podcastEpisodeId })
    return (await res.data['podcastEpisodeById']) as PodcastEpisode
  }

  async update(podcastId: number, title: string): Promise<Podcast> {
    const mutation = `
       mutation( $podcastId: Int , $title: String){ 
        updatePodcast(podcastId: $podcastId , title: $title) 
       }
    `
    const result = await this.client.mutation(mutation, {
      podcastId: podcastId,
      title: title
    })
    const res = (await result.data['updatePodcast']) as boolean
    return await this.podcastById(podcastId)
  }

  async create(title: string): Promise<Podcast> {
    const mutation = `
         mutation   ($title: String){ 
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

  async podcastEpisodesPreviews(podcastId: number): Promise<Array<PodcastEpisode>> {
    const q = `
        query GetPodcastEpisodesByPodcast( $podcastId:  Int ){
            podcastEpisodesByPodcast ( podcastId : $podcastId) {
                created, 
                id , 
                title, 
                description, 
                complete 
            }
        } 
    `
    const res = await this.client.query(q, { podcastId: podcastId })
    return (await res.data['podcastEpisodesByPodcast']) as Array<PodcastEpisode>
  }

  async podcastEpisodes(podcastId: number): Promise<Array<PodcastEpisode>> {
    const q = `
        query GetPodcastEpisodesByPodcast( $podcastId:  Int ){
            podcastEpisodesByPodcast ( podcastId : $podcastId) {
                created, 
                id , 
                title, 
                description, 
                complete, 
                graphic { id  } ,
               
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
  async transcribePodcastEpisodeSegment(podcastEpisodeSegmentId: number): Promise<boolean> {
    const mutation = ` 
          mutation ($podcastEpisodeSegmentId :  Int  ){ 
            transcribePodcastEpisodeSegment ( podcastEpisodeSegmentId: $podcastEpisodeSegmentId   )  
          }
    `
    const refresh = await this.client.mutation(mutation, {
      podcastEpisodeSegmentId: podcastEpisodeSegmentId
    })
    return (await refresh.data['transcribePodcastEpisodeSegment']) as boolean
  }

  async setPodcastEpisodeSegmentTranscript(
    podcastEpisodeSegmentId: number,
    transcribable: boolean,
    transcript: string
  ): Promise<boolean> {
    const mutation = ` 
          mutation ($podcastEpisodeSegmentId: Int, $transcribable: Boolean , $transcript:String ){ 
            setPodcastEpisodeSegmentTranscript(podcastEpisodeSegmentId: $podcastEpisodeSegmentId,  transcribable: $transcribable, transcript: $transcript )  
          }
    `
    const segmentTranscript = await this.client.mutation(mutation, {
      podcastEpisodeSegmentId: podcastEpisodeSegmentId,
      transcribable: transcribable,
      transcript: transcript
    })
    return (await segmentTranscript.data['setPodcastEpisodeSegmentTranscript']) as boolean
  }

  // transcript

  async deletePodcastEpisodeSegment(podcastEpisodeSegmentId: number) {
    const mutation = `
         mutation   ($podcastEpisodeSegmentId:  Int  ){ 
          deletePodcastEpisodeSegment(podcastEpisodeSegmentId: $podcastEpisodeSegmentId)  
         }
        `
    const result = await this.client.mutation(mutation, {
      podcastEpisodeSegmentId: podcastEpisodeSegmentId
    })
    return (await result.data['deletePodcastEpisodeSegment']) as Number
  }

  async deletePodcastEpisode(podcastEpisodeId: number) {
    const mutation = `
         mutation ($podcastEpisodeId:  Int  ){ 
          deletePodcastEpisode( podcastEpisodeId: $podcastEpisodeId)  
         }
        `
    const result = await this.client.mutation(mutation, {
      podcastEpisodeId: podcastEpisodeId
    })
    return (await result.data['deletePodcastEpisode']) as Number
  }

  async deletePodcast(podcastId: number) {
    const mutation = `
       mutation ($podcastId:  Int  ){ 
        deletePodcast(podcastId: $podcastId)  
       }
    `
    const result = await this.client.mutation(mutation, {
      podcastId: podcastId
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
         mutation   ($podcastId:  Int , $title: String, $description: String ){ 
          createPodcastEpisodeDraft( podcastId: $podcastId, title: $title, description: $description) { 
               id  
          }
         }
        `
    const result = await this.client.mutation(mutation, {
      podcastId: podcastId,
      title: title,
      description: description
    })

    const idBag = (await result.data['createPodcastEpisodeDraft'])['id']
    return await this.podcastEpisodeById(idBag)
  }

  async podcastById(podcastId: number): Promise<Podcast> {
    const q = `
      query( $podcastId: Int ){
          podcastById(podcastId: $podcastId) {
           id,
           title 
          }
      }
        `
    const result = await this.client.query(q, { podcastId: podcastId })
    return (await result.data['podcastById']) as Podcast
  }

  async movePodcastEpisodeSegmentDown(episodeId: number, episodeSegmentId: number) {
    const mutation = `
         mutation (
           $podcastEpisodeId: Int, 
           $podcastEpisodeSegmentId: Int    
         ){ 
            movePodcastEpisodeSegmentDown(
                podcastEpisodeId: $podcastEpisodeId, 
                podcastEpisodeSegmentId : $podcastEpisodeSegmentId  
            ) 
         }
        `
    // todo for some reason these are showing up as `strings` and causing issues when i send them to the server-side.
    //
    const result = await this.client.mutation(mutation, {
      podcastEpisodeId: episodeId,
      podcastEpisodeSegmentId: episodeSegmentId
    })
  }

  async movePodcastEpisodeSegmentUp(episodeId: number, episodeSegmentId: number) {
    const mutation = `
         mutation (
              $podcastEpisodeId: Int, 
              $podcastEpisodeSegmentId:Int
          ){ 
          movePodcastEpisodeSegmentUp(
             podcastEpisodeId: $podcastEpisodeId,
             podcastEpisodeSegmentId: $podcastEpisodeSegmentId 
           )  
         }
        `
    const result = await this.client.mutation(mutation, {
      podcastEpisodeId: episodeId,
      podcastEpisodeSegmentId: episodeSegmentId
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
  visibleUrl: string
  downloadableUrl: string
  url: string

  constructor(
    id: number,
    bucket: string,
    folder: string,
    filename: string,
    size: number,
    written: boolean,
    contentType: string,
    visible: boolean,
    publicUrl: string,
    url: string,
    downloadableVisibleUrl: string
  ) {
    this.id = id
    this.downloadableUrl = downloadableVisibleUrl
    this.bucket = bucket
    this.folder = folder
    this.filename = filename
    this.written = written
    this.size = size
    this.contentType = contentType
    this.visible = visible
    this.visibleUrl = publicUrl
    this.url = url
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
  state: string
  outcomes: Array<PublicationOutcome>

  constructor(
    id: number,
    plugin: string,
    created: number,
    published: number,
    url: string,
    state: string,
    outcomes: Array<PublicationOutcome>
  ) {
    this.id = id
    this.url = url
    this.plugin = plugin
    this.created = created
    this.published = published
    this.state = state
    this.outcomes = outcomes
  }
}

export class PodcastEpisode {
  availablePlugins: Array<string>
  id: number
  title: string
  description: string
  graphic: ManagedFile
  producedAudio: ManagedFile
  complete: boolean = false
  created: number = 0
  segments: Array<PodcastEpisodeSegment>
  publications: Array<Publication> //todo remove this i dont think its necessary any more.
  descriptionComposition?: Composition
  titleComposition?: Composition

  constructor(
    id: number,
    title: string,
    description: string,
    graphic: ManagedFile,
    complete: boolean,
    created: number,
    availablePlugins: Array<string>,
    segments: Array<PodcastEpisodeSegment>,
    publications: Array<Publication>,
    producedAudio: ManagedFile,
    descriptionComposition?: Composition,
    titleComposition?: Composition
  ) {
    this.descriptionComposition = descriptionComposition
    this.titleComposition = titleComposition
    this.availablePlugins = availablePlugins
    this.id = id
    this.title = title
    this.description = description
    this.graphic = graphic
    this.complete = complete
    this.created = created
    this.producedAudio = producedAudio
    this.segments = segments
    this.publications = publications
  }
}

export class AblyTokenRequest {
  keyName: string
  nonce: string
  mac: string
  ttl: number
  capability: string
  timestamp: number

  constructor(
    keyName: string,
    nonce: string,
    mac: string,
    ttl: number,
    capability: string,
    timestamp: number
  ) {
    this.keyName = keyName
    this.nonce = nonce
    this.mac = mac
    this.ttl = ttl
    this.capability = capability
    this.timestamp = timestamp
  }
}

export class NotificationContext {
  ablyChannel: string
  ablyTokenRequest: AblyTokenRequest

  constructor(ablyChannel: string, ablyTokenRequest: AblyTokenRequest) {
    this.ablyChannel = ablyChannel
    this.ablyTokenRequest = ablyTokenRequest
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

  async startGraphql() {
    const q = `
        query {
          notificationContext  { 
            ablyChannel
            ablyTokenRequest { 
              keyName
              nonce
              mac
              ttl
              capability
              timestamp
            }
          }
         }
        `
    const result = await this.client.query(q, {})
    const nc = (await result.data['notificationContext']) as NotificationContext
    const ably = new Ably.Realtime({
      async authCallback(
        data: TokenParams,
        callback: (
          error: ErrorInfo | string | null,
          tokenRequestOrDetails: TokenDetails | TokenRequest | string | null
        ) => void
      ) {
        callback(null, nc.ablyTokenRequest as Ably.TokenRequest)
      }
    })
    const channel = ably.channels.get(nc.ablyChannel)
    await channel.subscribe(async (message) => await this.dispatch(message))
  }

  async start() {
    const channelName = (await (await window.fetch('/api/notifications/ably/channel')).json())[
      'channel'
      ]
    console.log('channel name is ' + channelName)

    const ably = new Ably.Realtime({ authUrl: '/api/notifications/ably/token' })
    const channel = ably.channels.get(channelName)
    await channel.subscribe(async (message) => await this.dispatch(message))
  }

  async dispatch(message: Ably.InboundMessage) {
    if (this.callbacks.length == 0) {
      return
    }

    const notification = JSON.parse(message.data) as Notification
    this.callbacks.forEach((callback) => callback(notification))
    this.callbacksByCategory.forEach((array, key) => {
      if (key === notification.category) {
        array.forEach((cb) => cb(notification))
      }
    })
  }

  constructor(client: Client) {
    this.client = client
    this.startGraphql() // don't care that  ignored
  }

  async notify(visible: boolean, modal: boolean) {
    const mutation = `
      mutation Notify($visible:Boolean, $modal:Boolean){ 
        notify(visible: $visible, modal: $modal)
      }
    `
    const result = await this.client.mutation(mutation, {
      visible: visible,
      modal: modal
    })
    return (await result.data['notify']) as boolean
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
      mutation SetManagedFileVisibility( $managedFileId :  Int  , $visible:Boolean ){ 
       setManagedFileVisibility (  managedFileId: $managedFileId, visible: $visible )
      }
    `
    const result = await this.client.mutation(mutation, {
      managedFileId: managedFileId,
      visible: visible
    })
    return (await result.data['setManagedFileVisibility']) as boolean
  }

  async managedFileById(managedFileId: number): Promise<ManagedFile> {
    const q = `
        query ($managedFileId:  Int ) {
          managedFileById( managedFileId : $managedFileId )  { 
            id, bucket, folder, filename, size, written ,contentType, visible , url, visibleUrl , downloadableUrl
          }
        }
        `
    const result = await this.client.query(q, { managedFileId: managedFileId })
    const managedFileIdRes = await result.data['managedFileById']
    return managedFileIdRes as ManagedFile
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

export class Compositions {
  private readonly client: Client

  constructor(client: Client) {
    this.client = client
  }

  async deleteCompositionAttachment(attachmentId: number) {
    const mutation = `
         mutation ($compositionAttachmentId:  Int ) { 
          deleteCompositionAttachment( compositionAttachmentId: $attachmentId ) 
         }
        `
    const result = await this.client.mutation(mutation, {
      attachmentId: attachmentId
    })
    const idBag = (await result.data['deleteCompositionAttachment']) as Number
    return true
  }

  async createCompositionAttachment(compositionId: number) {
    const mutation = `
         mutation ($compositionId:  Int ){ 
          createCompositionAttachment(  compositionId: $compositionId ) { 
             id  
          }
         }
        `
    const result = await this.client.mutation(mutation, {
      compositionId: compositionId
    })
    const res = (await result.data['createCompositionAttachment'])['id']
    return true
  }

  async getCompositionById(id: number): Promise<Composition> {
    const q = `
        query ($id: Int ) {
          compositionById( compositionId : $id )  { 
            id, 
            field, 
            attachments { 
              id,
              caption, 
              embedding,
              managedFile {
                id 
              } 
            } 
          }
        }
        `
    const result = await this.client.query(q, { id: id })
    return (await result.data['compositionById']) as Composition
  }
}

// COMPOSITIONS
export class Attachment {
  readonly id: number
  readonly caption: string
  readonly managedFile: ManagedFile
  readonly embedding: string

  constructor(id: number, caption: string, managedFile: ManagedFile, embedding: string) {
    this.caption = caption
    this.id = id
    this.managedFile = managedFile
    this.embedding = embedding
    console.debug(`got the embedding ${this.embedding} for attachment`)
  }
}

export class Composition {
  readonly id: number
  readonly field: string
  readonly attachments: Array<Attachment>

  constructor(id: number, field: string, attachments: Array<Attachment>) {
    this.id = id
    this.attachments = attachments
    this.field = field
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

export class Ayrshare {
  private readonly client: Client

  constructor(client: Client) {
    this.client = client
  }

  async platforms(): Promise<Array<string>> {
    const q = `
        query {
           ayrsharePlatforms      
       }
     `
    const result = await this.client.query(q, {})
    return (await result.data['ayrsharePlatforms']) as Array<string>
  }
}

export class PublicationOutcome {

  readonly id: number
  readonly success: boolean
  readonly url: string
  readonly key: string

  constructor(id: number,  success: boolean, url: string, key: string) {
    this.id = id
    this.success = success
    this.url = url
    this.key = key
  }
}

export class Publications {
  private readonly client: Client

  constructor(client: Client) {
    this.client = client
  }

  async publications(id: number, type: string): Promise<Array<Publication>> {
    const q = `
        query ( 
          $type: String,   
          $id: Int
        ) {
           publicationsForPublishable( 
             id: $id, 
             type : $type  
           ){
              id,
              plugin,
              created,
              published,
              url,
              state, 
              outcomes  { 
                id,
                created,
                success,
                url,
                key
              }
           }
       }
     `
    const result = await this.client.query(q, {
      id: id,
      type: type
    })
    return (await result.data['publicationsForPublishable']) as Array<Publication>
  }

  async unpublish(publicationId: number): Promise<boolean> {
    const mutation = `
         mutation ( $publicationId: Int ){ 
            unpublish( publicationId: $publicationId )  
         }
        `

    const result = await this.client.mutation(mutation, {
      publicationId: publicationId
    })

    return (await result.data['unpublish']) as boolean
  }

  async publish(
    publishableType: string,
    id: number,
    contextJson: string,
    plugin: string
  ): Promise<boolean> {
    const q = `
        mutation ( 
             $publishableId: Int ,
             $publishableType: String, 
             $contextJson: String,
             $plugin: String
          ) {
           publish (  
             publishableId: $publishableId, 
             publishableType: $publishableType,
             contextJson: $contextJson, 
             plugin: $plugin 
           )   
        }
        `
    const result = await this.client.mutation(q, {
      publishableType: publishableType,
      publishableId: id,
      contextJson: contextJson,
      plugin: plugin
    })
    return (await result.data['publish']) as boolean
  }

  async canPublish(
    publishableId: number,
    publishableType: string,
    contextJson: string,
    plugin: string
  ): Promise<boolean> {
    const q = `
        query ( 
             $publishableId: Int ,
             $publishableType: String, 
             $contextJson: String,
             $plugin: String
          ) {
           canPublish(
             publishableId : $publishableId  ,
             publishableType: $publishableType,
             contextJson : $contextJson, 
             plugin : $plugin 
           )   
        }
        `
    const result = await this.client.query(q, {
      publishableType: publishableType,
      publishableId: publishableId,
      contextJson: contextJson,
      plugin: plugin
    })
    return (await result.data['canPublish']) as boolean
  }
}

export const publications = new Publications(graphqlClient)
export const utils = new Utils()
export const markdown = new Markdown(graphqlClient)
export const ai = new Ai(graphqlClient)
export const notifications = new Notifications(graphqlClient)
export const mogul = new Mogul(graphqlClient)
export const events = mitt()
export const podcasts = new Podcasts(graphqlClient)
export const managedFiles = new ManagedFiles(graphqlClient)
export const settings = new Settings(graphqlClient)
export const compositions = new Compositions(graphqlClient)
export const ayrshare = new Ayrshare(graphqlClient)
