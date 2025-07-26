<template>
  <h1 v-if="mogul">{{ $t('settings.title') }}</h1>
  <div v-for="settingsPage in settingsRef" v-bind:key="settingsPage.category">
    <form class="pure-form pure-form-stacked">
      <fieldset>
        <legend>
          {{ $t('publications.plugins.' + settingsPage.category + '.title') }}
        </legend>
        <div v-for="setting in settingsPage.settings" v-bind:key="setting.name">
          <div class="pure-control-group">
            <label :for="textAreaElementId(settingsPage.category, setting.name)">
              {{ $t('publications.plugins.' + settingsPage.category + '.' + setting.name) }}
              <PrivatePasswordInputComponent
                :prompt="$t('podcasts.episodes.episode.description.ai-prompt')"
              />
            </label>
            <input
              :id="textAreaElementId(settingsPage.category, setting.name)"
              v-model="setting.value"
              :required="!setting.valid"
              class="secret"
              type="password"
            />
            <span class="pure-form-message-inline">
              <span v-if="!setting.valid">{{ $t('labels.required-value') }}</span>
            </span>
          </div>
        </div>
        <div class="pure-controls">
          <button
            v-if="settingsPage.settings.length > 0"
            class="pure-button pure-button-primary"
            type="submit"
            @click.prevent="save(settingsPage.category)"
          >
            {{
              $t('settings.save-button', {
                plugin: $t('publications.plugins.' + settingsPage.category + '.title')
              })
            }}
          </button>
          <div
            v-if="settingsPage.settings.length == 0"
            v-html="
              $t('settings.no-configuration-for-plugin', {
                plugin: $t('publications.plugins.' + settingsPage.category + '.title')
              })
            "
          ></div>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { mogul as mogulService, Setting, settings as settingsService, SettingsPage } from '@/services'
import PrivatePasswordInputComponent from '@/ui/input/PrivatePasswordInputComponent.vue'

const mogul = ref('')
const settingsRef = ref<Array<SettingsPage>>([])
const loadedSettingsRef = ref<Array<SettingsPage>>([])

const reloadSettings = async () => {
  settingsRef.value = await settingsService.settings()
  const newSettings: Array<SettingsPage> = []
  settingsRef.value.forEach((sp: SettingsPage) => {
    const sub = sp.settings.map(
      (setting) => new Setting(setting.name, setting.valid, setting.value)
    )
    const nsp = new SettingsPage(sp.valid, sp.category, sub)
    newSettings.push(nsp)
  })
  loadedSettingsRef.value = newSettings
}

const save = async (category: string) => {
  function findSettingWithMatchingKey(haystack: Array<Setting>, k: string): Setting | null {
    const matches = haystack.filter((s) => s.name == k)
    if (matches && matches.length > 0) return matches[0]
    return null
  }

  const pageForCategory = settingsRef.value.filter((sp) => sp.category == category)[0]
  const settings = pageForCategory.settings
  const loadedPageForCategory = loadedSettingsRef.value.filter((sp) => sp.category == category)[0]
  const loadedSettings = loadedPageForCategory.settings

  for (const setting of settings) {
    const matching = findSettingWithMatchingKey(loadedSettings, setting.name)
    if (matching != null && matching.value != setting.value) {
      await settingsService.updateSetting(pageForCategory.category, setting.name, setting.value)
      await reloadSettings()
    }
  }
}

const textAreaElementId = (category: string, settingName: string): string => {
  return 'secret-' + category + '-' + settingName
}

onMounted(async () => {
  const u = await mogulService.user()
  mogul.value = u.displayName
  await reloadSettings()
})
</script>

<style scoped>
.secret {
  width: 100%;
}

/* standard stuff */
.pure-controls .pure-button {
  margin-top: calc(0.5 * var(--gutter-space));
}
</style>
