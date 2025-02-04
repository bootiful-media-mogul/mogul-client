<template>
  <form class="pure-form pure-form-stacked">
    <fieldset>
      <legend>{{ $t('podcasts.new-podcast') }}</legend>
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
          :disabled="title == null || title.trim().length == 0"
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const title = ref<string>('')

const mogulId = ref<number>(0)

const props = defineProps<{
  podcast: Podcast
}>()

const updatePodcast = async function (e: Event) {
  console.log('update podcast', props.podcast.id,  title.value)
  const podcast = await podcasts.update(props.podcast.id, title.value)
  title.value = podcast.title
}

onMounted(async () => {
  mogulId.value = (await mogul.user()).id
  const podcast = await podcasts.podcastById(props.podcast.id)
  title.value = podcast.title
})
</script>
