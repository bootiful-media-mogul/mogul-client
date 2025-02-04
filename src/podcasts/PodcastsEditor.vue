<template>
    <form class="pure-form pure-form-stacked">
      <fieldset>
        <legend>
          {{ $t('podcasts.editing', { podcast: title }) }}
        </legend>
        <div class="pure-control-group">
          <label for="title">
            {{ $t('podcasts.new-podcast.title') }}
          </label>

          <InputWrapper v-model="title">
            <input id="title" v-model="title" required type="text" />
            <InputTools v-model="title" />
          </InputWrapper>
        </div>
        <div class="pure-controls">
          <button
            :disabled="updateDisabled()"
            class="pure-button pure-button-primary"
            type="submit"
            value="create"
            @click.prevent="updatePodcast"
          >
            {{ $t('podcasts.save') }}
          </button>
        </div>
      </fieldset>
    </form>
</template>

<style>
.id b {
  font-weight: bold;
  font-size: medium;
}
</style>
<script lang="ts" setup>
import { mogul, Podcast, podcasts } from '@/services'
import InputWrapper from '@/ui/input/InputWrapper.vue'
import InputTools from '@/ui/InputTools.vue'
import { onMounted, ref } from 'vue'

function computeDirtyKey() {
  return title.value + ''
}

const dirtyKey = ref<string>('')

const title = ref<string>('')

const mogulId = ref<number>(0)

const props = defineProps<{
  podcast: Podcast
}>()

const updatePodcast = async function (e: Event) {
  const podcast = await podcasts.update(props.podcast.id, title.value)
  title.value = podcast.title
}

function updateDisabled() {
  return computeDirtyKey() === dirtyKey.value || (title.value + '').trim() === ''
}

onMounted(async () => {
  mogulId.value = (await mogul.user()).id
  const podcast = await podcasts.podcastById(props.podcast.id)
  title.value = podcast.title
  dirtyKey.value = computeDirtyKey()
})
</script>
