<template>
  <h1>{{ t('jobs.title') }}</h1>
  <div class="jobs">
    <form class="pure-form pure-form-stacked">
      <div class="job-row" v-for="job in allJobs" :key="job.job.name">
        <fieldset class="job-name">
          <legend>{{ t('jobs.name.' + job.job.name) }}</legend>
        </fieldset>

        <div class="attributes">
          <div
            class="attribute"
            v-for="attribute in job.job.requiredContextAttributes"
            :key="attribute"
          >
            <label class="attribute-label">
              {{ t('selections.params.' + job.job.name + '.' + attribute) }}
            </label>

            <div class="attribute-input">
              <component
                :is="resolveComponent(attribute)"
                v-model="job.selections[attribute]"
                @change="validate"
              />
            </div>
          </div>
        </div>

        <div class="launch">
          <button
            :disabled="!job.ready"
            class="pure-button"
            type="submit"
            value="create"
            @click.prevent="launch(job)"
          >
            {{ t('jobs.launch', { name: t('jobs.name.' + job.job.name) }) }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { Job, jobs } from '@/services'
import { onMounted, reactive, ref } from 'vue'
import PodcastsSelect from '@/podcasts/PodcastsSelect.vue'
import Input from '@/ui/Input.vue'
import { type SelectOption } from '@/ui/Select.vue'
import { useI18n } from 'vue-i18n'
import BlogsSelect from '@/blogs/BlogsSelect.vue'

const { t } = useI18n()

const paramComponents = new Map<string, any>()
paramComponents.set('podcastId', PodcastsSelect)
paramComponents.set('blogId', BlogsSelect)

function validate() {
  allJobs.value.forEach((job: JobRequest) => {
    job.ready = Object.values(job.selections).every((v) => v != null)
  })
}

function resolveComponent(paramName: string): any {
  return paramComponents.get(paramName) ?? Input
}

const allJobs = ref<Array<JobRequest>>([])

async function launch(req: JobRequest) {
  const payload = new Map<string, any>()
  const valueKey = 'value'
  for (const [k, v] of Object.entries(req.selections)) {
    if (v != null && typeof v === 'object' && valueKey in v) {
      payload.set(k, v[valueKey])
    } //
    else {
      payload.set(k, v)
    }
  }
  return await jobs.launch(req.job.name, payload)
}

class JobRequest {
  readonly job: Job
  ready: boolean = false
  selections: Record<string, SelectOption | string | number | null>

  constructor(job: Job) {
    this.job = job
    this.selections = reactive({})
    for (const attr of job.requiredContextAttributes) {
      this.selections[attr] = null
    }
  }
}

onMounted(async () => {
  const jobsResults = await jobs.jobs()
  allJobs.value = jobsResults.map((job) => new JobRequest(job))
  validate()
})
</script>

<style>
.jobs {
  display: grid;

  .job-row {
    grid-template-areas:
      ' job-name '
      ' attributes'
      ' launch ';

    padding-bottom: var(--gutter-space);

    .job-name {
      grid-area: job-name;
    }

    .attributes {
      .attribute {
        grid-area: attributes;
      }
    }

    .launch {
      grid-area: launch;
    }
  }
}
</style>
