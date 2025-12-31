<template>
  <div class="jobs">
    <div class="job-row" v-for="job in allJobs" :key="job.job.name">
      <div class="job-name">
        {{ t('jobs.name.' + job.job.name) }}
      </div>

      <div class="attributes">
        <div
          class="attribute"
          v-for="attribute in job.job.requiredContextAttributes"
          :key="attribute"
        >
          <div class="attribute-label">
            {{ t('selections.params.' + job.job.name + '.' + attribute) }}
          </div>
          <div class="attribute-input">
            <component :is="resolveComponent(attribute)" v-model="job.selections[attribute]" />
          </div>
        </div>
      </div>

      <div class="launch">
        <button class="pure-button" type="submit" value="create" @click.prevent="launch(job)">
          {{ t('jobs.launch', { name: t('jobs.name.' + job.job.name) }) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Job, jobs } from '@/services'
import { onMounted, reactive, ref } from 'vue'
import PodcastsSelect from '@/podcasts/PodcastsSelect.vue'
import Input from '@/ui/Input.vue'
import type { SelectOption } from '@/ui/Select.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const paramComponents = new Map<string, any>()
paramComponents.set('podcastId', PodcastsSelect)

function resolveComponent(paramName: string): any {
  return paramComponents.get(paramName) ?? Input
}
const allJobs = ref<Array<JobRequest>>([])

async function launch(req: JobRequest) {
  const payload = new Map<string, any>()
  for (const [k, v] of Object.entries(req.selections)) {
    payload.set(k, v)
  }
  return jobs.launch(req.job.name, payload)
}

class JobRequest {
  readonly job: Job

  selections: Record<string, SelectOption | string | number | null>

  constructor(job: Job) {
    this.job = job
    this.selections = reactive({})

    // initialize for required attributes
    for (const attr of job.requiredContextAttributes) {
      this.selections[attr] = null
    }
  }
}

onMounted(async () => {
  const jobsResults = await jobs.jobs()
  allJobs.value = jobsResults.map((job) => new JobRequest(job))
})
</script>

<style>
/*
  the following grid uses "subgrid" which lets me
  style the columns using the .jobs class,
  even though the divs are defined for each row
*/
.jobs {
  display: grid;

  .job-row {
    border-top: 1px solid black;

    padding-bottom: var(--gutter-space);

    grid-template-areas:
      ' job-name '
      ' attributes'
      ' launch ';

    .job-name {
      background-color: #129fea;
      grid-area: job-name;
    }

    .attributes {
      .attribute {
        display: grid;
        grid-area: attributes;
        grid-template: 'attribute-label . attribute-input';
        grid-template-columns: 200px var(--gutter-space) auto;

        .attribute-label {
          grid-area: attribute-label;
        }
        .attribute-input {
          border: 1px solid yellow;
          grid-area: attribute-input;
        }
      }
    }

    .launch {
      grid-area: launch;
    }
  }
}
</style>
