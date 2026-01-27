<template>
  <div>
    <form class="pure-form pure-form-stacked">
      <fieldset>
        <legend>
          {{ t('blogs.editing', { blog: title }) }}
        </legend>
        <div class="pure-control-group">
          <label for="title">
            {{ t('blogs.new-blog.title') }}
          </label>
          <InputWrapper v-model="title">
            <input id="title" v-model="title" required type="text" />
            <InputTools v-model="title" />
          </InputWrapper>
        </div>
        <div class="pure-control-group">
          <label for="description">
            {{ t('blogs.new-blog.description') }}
          </label>
          <InputWrapper v-model="description">
            <textarea id="description" v-model="description" rows="4" />
            <InputTools v-model="description" />
          </InputWrapper>
        </div>
        <div class="pure-controls">
          <button
            :disabled="updateDisabled()"
            class="pure-button pure-button-primary"
            type="submit"
            value="update"
            @click.prevent="updateBlog"
          >
            {{ t('blogs.save') }}
          </button>
          <button
            class="pure-button pure-button-primary"
            type="button"
            @click.prevent="emit('done')"
          >
            {{ t('blogs.done') }}
          </button>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<style>
.id-column b {
  font-weight: bold;
  font-size: medium;
}
</style>
<script lang="ts" setup>
import { Blog, blogs, mogul } from '@/services'
import InputWrapper from '@/ui/input/InputWrapper.vue'
import InputTools from '@/ui/InputTools.vue'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

function computeDirtyKey() {
  return title.value + '|' + description.value
}

const dirtyKey = ref<string>('')

const title = ref<string>('')
const description = ref<string>('')

const mogulId = ref<number>(0)

const props = defineProps<{
  blog: Blog
}>()

const emit = defineEmits<{
  done: []
}>()

const updateBlog = async function (e: Event) {
  await blogs.update(props.blog.id, title.value, description.value)
  updateKey()
}

function updateKey() {
  dirtyKey.value = computeDirtyKey()
}

function updateDisabled() {
  return (
    computeDirtyKey() === dirtyKey.value ||
    (description.value + ':' + title.value + '').trim() === ''
  )
}

onMounted(async () => {
  mogulId.value = (await mogul.user()).id
  const blog = await blogs.blogById(props.blog.id)
  title.value = blog.title
  description.value = blog.description
  updateKey()
})
</script>
