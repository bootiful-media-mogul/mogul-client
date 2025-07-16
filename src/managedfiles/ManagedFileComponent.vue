<style>
.managed-file-row {
  /*align-items: center;
  grid-template-rows: minmax( var(--row-height) ,auto);*/
  grid-template-areas: 'controls choose visible written  preview   contentType   filename';
  grid-template-columns:
    min-content
    var(--icon-column)
    var(--icon-column)
    var(--icon-column)
    var(--icon-column)
    5em
    auto;
  display: grid;
}

.managed-file-row .visible {
  grid-area: visible;
}

.managed-file-row .controls {
  grid-area: controls;
}

.managed-file-row .filename {
  grid-area: filename;
}

.managed-file-row .contentType {
  grid-area: contentType;
  font-size: small;

  text-align: center;
}

.managed-file-row .written {
  grid-area: written;
}

.managed-file-row .preview {
  grid-area: preview;
}

.managed-file-row .choose {
  grid-area: choose;
}

.managed-file-row a:hover {
  text-decoration: none;
}

/*
  hide the file upload off screen so it doesn't ruin the ui.
  (display: none doesn't work)
*/
.managed-file-file-upload {
  display: none;
  z-index: -1;
  opacity: 10;
  position: absolute;
  top: -1000px;
  left: -1000px;
}
</style>

<template>
  <input
    ref="realFileUploadInputField"
    :accept="accept ? accept : '*/*'"
    class="managed-file-file-upload"
    type="file"
    @change="uploadFile($event)"
  />

  <div class="managed-file-row row">
    <span class="controls">
      <slot></slot>
    </span>

    <a class="choose" href="#" @click="launchFileUpload">
      <span :title="$t('managedfiles.upload')" class="folder-icon"></span>
    </a>
    <a class="visible" href="#">
      <input v-model="visible" :title="$t('managedfiles.visible')" type="checkbox" />
    </a>

    <span class="written">
      <span v-if="uploading"> 🕒 </span>
      <span v-else>
        <Icon v-if="written" :icon-hover="checkmarkAsset" :icon="checkmarkAsset" />
      </span>
    </span>
    <span class="preview">
      <a
        :class="'mogul-icon preview-icon ' + (written ? '' : ' disabled')"
        :title="$t('managedfiles.preview')"
        href="#"
        @click="preview"
      >
      </a>
    </span>

    <span class="contentType">
      <span v-if="contentType">
        <code :title="$t('managedfiles.content-type')">{{ contentType }}</code>
      </span>
    </span>

    <span class="filename">
      <span v-if="filename" :title="$t('managedfiles.file-name')" class="form-prompt"
        >{{ filename }}
      </span>
      <span v-else class="form-prompt">{{ $t('managedfiles.please-upload-a-file') }}</span>
    </span>
  </div>
</template>
<script lang="ts" setup>
import axios from 'axios'
import { managedFiles, previewManagedFile } from '@/services'
import { onMounted, ref, watch } from 'vue'
import checkmarkAsset from '@/assets/images/checkbox.png'
import Icon from '@/ui/Icon.vue'

interface Props {
  readonly disabled?: boolean
  readonly accept: string
  readonly managedFileId: number
}

const props = defineProps<Props>()
const filename = ref<string>('')
const contentType = ref<string>('')
const size = ref<number>(0)
const uploading = ref<boolean>(false)
const written = ref<boolean>(false)
const realFileUploadInputField = ref<HTMLElement>()
const visible = ref<boolean>(false)
const loaded = ref<boolean>(false)

onMounted(async () => {
  await loadManagedFileIntoEditor()
  loaded.value = true
})

watch(
  () => visible.value,
  async (n: boolean, o: boolean) => {
    if (!loaded.value) return

    console.log(
      'setting managed file visibility because the old value was ',
      o,
      'and the new value is ',
      n
    )
    await managedFiles.setManagedFileVisibility(props.managedFileId, n)
  }
)

watch(
  () => props.managedFileId,
  async (o: any, n: any) => {
    await loadManagedFileIntoEditor()
  }
)

function mfId(): number {
  // sigh. typescript is not great at types.
  function isNumber(value: any): value is number {
    return typeof value === 'number' && !isNaN(value)
  }

  const m: any = props.managedFileId
  if (isNumber(m)) return m as number
  else return props.managedFileId
}

const preview = async () => {
  if (written.value) {
    previewManagedFile(mfId())
  }
}

const launchFileUpload = async () => {
  realFileUploadInputField.value!!.click()
}

const loadManagedFileIntoEditor = async () => {
  const managedFile = await managedFiles.managedFileById(mfId())
  filename.value = managedFile.filename
  written.value = managedFile.written
  if (managedFile.contentType && managedFile.contentType.indexOf('/') != -1) {
    contentType.value = managedFile.contentType.split('/')[1]
  }
  size.value = managedFile.size
  visible.value = managedFile.visible
}

const uploadFile = async (event: Event) => {
  event.preventDefault()
  const target = event.target as HTMLInputElement
  const data = new FormData()
  const file = target!!.files!![0] as File
  data.set('file', file)
  const uploadPath: string = '/api/managedfiles/' + props.managedFileId
  uploading.value = true
  const response = await axios.post(uploadPath, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  console.assert(
    response.status >= 200 && response.status <= 300,
    'the http post to upload the archive did not succeed.'
  )
  written.value = true
  uploading.value = false
  await loadManagedFileIntoEditor()
}
</script>
