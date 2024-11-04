<template>
  <form ref="el" class="pure-form pure-form-stacked">
    <fieldset>
      <div>
        <img
          v-if="isImage"
          class="managed-file-preview-image"
          :alt="'a preview for managed file ' + managedFileId"
          :src="url"
        />

        <audio :src="url" v-if="isAudio" class="managed-file-preview-audio" controls></audio>
      </div>
      <div>
        <div>
          <b>{{ filename }}</b>
        </div>
        <div>
          <code>{{ contentType }}</code>
        </div>
        <div>
          <code>{{ size }}</code>
        </div>
        <div v-if="url">
          <a
            :title="url"
            @click.prevent="launchPublicUrl"
            class="link-icon"
            :href="url"
          ></a>
        </div>
      </div>
    </fieldset>
  </form>
</template>
<style>
.link-icon {
  background: url('../assets/images/link-highlight.png');
  height: var(--icon-width);
  display: inline-block;
  width: var(--icon-width);
  background-size: var(--icon-width) var(--icon-width);
}

.link-icon:hover {
  background: url('../assets/images/link.png');
  height: var(--icon-width);
  display: inline-block;
  width: var(--icon-width);
  background-size: var(--icon-width) var(--icon-width);
}
</style>
<script setup lang="ts">
import { events, managedFiles } from '@/services'
import { prettyPrintInBytes } from '@/managedfiles/files'
import { onMounted, ref, watch } from 'vue'

const el = ref<HTMLElement>()
const isImage = ref(false)
const isAudio = ref(false)
const url = ref('')
const filename = ref('')
const size = ref('')
const contentType = ref('')

async function doLoad(mfid: any) {
  const managedFile = await managedFiles.getManagedFileById(parseInt(mfid))
  if (managedFile.visible) {
    url.value = managedFile.visibleUrl
  } else {
    url.value = '/api'+ managedFile.url
  }
  console.log('url for preview for managed file # ' + managedFile.id + 'is ' + url.value)
  // url.value = '/api/managedfiles/' + managedFile.id
  const ext = managedFile.contentType.toLowerCase()
  isImage.value =
    ext.endsWith('jpg') || ext.endsWith('jpeg') || ext.endsWith('png') || ext.endsWith('gif')
  isAudio.value = ext.endsWith('mp3') || ext.endsWith('wav') || ext.endsWith('mpeg')
  contentType.value = ext
  size.value = prettyPrintInBytes(managedFile.size)
  filename.value = managedFile.filename

}

const launchPublicUrl = () => {
  window.open(url.value, 'managedFilePublicUrl')
}

interface Props {
  readonly managedFileId?: string | number
}

const props = defineProps<Props>()

async function load() {
  if (!props.managedFileId) return
  await doLoad(props.managedFileId)
}

const callback = async (id: any) => await doLoad(id)

events.on('preview-managed-file-event', async (event) => {
  console.log('received an event for a preview for managed file ' + event)
  await callback(event)
  events.emit('sidebar-panel-opened', el.value)
})

onMounted(async () => {
  await load()
})

watch(
  () => props.managedFileId,
  async (o: any, n: any) => {
    await load()
  }
)
</script>
