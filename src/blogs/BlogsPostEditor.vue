<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { blogs, Post, Blog, loadNotesForNotable } from '@/services'
import EntityViewDecorator from '@/ui/EntityViewDecorator.vue'
import InputWrapper from '@/ui/input/InputWrapper.vue'
import InputTools from '@/ui/InputTools.vue'
import { dateTimeToString } from '@/dates'
import blogIcon from '@/assets/images/navbar/blogs-icon.png'

// Props
const props = defineProps<{
  blogId: number
  postId: number
}>()

// State
const draftPost = ref<Post>({} as Post)
const blog = ref<Blog>()
const created = ref<string | number>(-1)

// Form fields
const title = ref('')
const description = ref('')
const summary = ref('')
const dirtyKey = ref('')

onMounted(async () => {
  blog.value = await blogs.blogById(props.blogId)
  if (props.postId) {
    await loadPostIntoEditor(props.postId)
  }
})

// Methods
const dts = (date: string | number): string | null => {
  return dateTimeToString(date)
}

const computeDirtyKey = (): string => {
  return `${draftPost.value.id ? draftPost.value.id : ''}${title.value}:${description.value}:${
    summary.value
  }`
}

const buttonsDisabled = computed(() => {
  if (!draftPost.value.id) {
    return true
  }
  return dirtyKey.value === computeDirtyKey()
})

const loadPostIntoEditor = async (postId: number) => {
  const post = await blogs.postById(postId)
  Object.assign(draftPost.value, post)
  title.value = post.title
  description.value = post.content
  summary.value = post.summary
  created.value = post.created ?? -1
  dirtyKey.value = computeDirtyKey()
  await loadNotesForNotable('episode', postId, title.value)
}

const save = async () => {
  if (draftPost.value.id) {
    await blogs.updatePost(draftPost.value.id, title.value, description.value, summary.value)
    await loadPostIntoEditor(draftPost.value.id)
  }
}

const cancel = async () => {
  if (draftPost.value.id) {
    await loadPostIntoEditor(draftPost.value.id)
  }
}
</script>

<template>
  <EntityViewDecorator :watermark-image="blogIcon">
    <h1>Blog Post</h1>
    <form class="pure-form pure-form-stacked">
      <fieldset>
        <legend>
          <span v-if="title"> Editing Post #{{ draftPost.id }}: {{ title }} </span>
          <span v-else> New Post </span>
          <span v-if="draftPost.id"> ({{ dts(created) }}) </span>
        </legend>
        <div class="form-section">
          <div class="form-section-title">Basics</div>
          <div class="form-row">
            <label for="postTitle"> Title </label>
            <InputWrapper v-model="title">
              <input id="postTitle" v-model="title" required type="text" />
              <InputTools v-model="title" />
            </InputWrapper>
          </div>
          <div class="form-row">
            <label for="postDescription"> Description </label>
            <InputWrapper v-model="description">
              <textarea id="postDescription" v-model="description" required rows="10" />
              <InputTools v-model="description" />
            </InputWrapper>
          </div>
          <div class="form-row">
            <label for="postSummary"> Summary </label>
            <InputWrapper v-model="summary">
              <textarea id="postSummary" v-model="summary" required rows="5" />
              <InputTools v-model="summary" />
            </InputWrapper>
          </div>
          <div>
            <button
              :disabled="buttonsDisabled"
              class="pure-button pure-button-primary"
              type="submit"
              @click.prevent="save"
            >
              Save
            </button>
            <button
              :disabled="buttonsDisabled"
              class="pure-button pure-button-primary"
              type="submit"
              @click.prevent="cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  </EntityViewDecorator>
</template>

<style scoped></style>
