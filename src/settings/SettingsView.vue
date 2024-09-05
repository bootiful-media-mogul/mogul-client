<script lang="ts">
import {mogul, Setting, settings, SettingsPage} from '@/services'
import PrivatePasswordInputComponent from '@/privacy/PrivatePasswordInputComponent.vue'

export default {
  components: {PrivatePasswordInputComponent},

  async mounted() {
    const u = (await mogul.user())
    this.mogul = u.displayName
    await this.reloadSettings()
  },
  methods: {

    async reloadSettings() {
      this.settings = await settings.settings()

      // clone the settings so we can do dirty checking
      const newSettings: Array<SettingsPage> = []
      this.settings.forEach((sp: SettingsPage) => {
        const sub = sp.settings.map(
          (setting) => new Setting(setting.name, setting.valid, setting.value)
        )
        const nsp = new SettingsPage(sp.valid, sp.category, sub)
        newSettings.push(nsp)
      })
      this.loadedSettings = newSettings
    },
    async save(category: string) {
      const pageForCategory = this.settings.filter((sp) => sp.category == category)[0]
      const loadedPageForCategory = this.loadedSettings.filter((sp) => sp.category == category)[0]

      function findSettingWithMatchingKey(settings: Array<Setting>, k: string): Setting {
        const matches = settings.filter((s) => s.name == k)
        if (matches && matches.length > 0) return matches[0]
        return null as any
      }

      const loadedSettings = loadedPageForCategory.settings
      const updatedSettings = pageForCategory.settings
      for (const setting of updatedSettings) {
        const matching = findSettingWithMatchingKey(loadedSettings, setting.name)
        if (matching != null && matching.value != setting.value) {
          await settings.updateSetting(pageForCategory.category, setting.name, setting.value)
          await this.reloadSettings()
        }
      }
    },
    textAreaElementId(category: string, settingName: string) {
      return 'secret-' + category + '-' + settingName
    }
  },

  data() {
    const loadedSettings: Array<SettingsPage> = []
    const mogul = ''
    const settings: Array<SettingsPage> = []
    return {
      mogul,
      settings,
      loadedSettings
    }
  },

  async created() {}
}
</script>

<template>
  <h1 v-if="mogul">{{ $t('settings.title' ) }}</h1>
  <div v-for="settingsPage in settings" v-bind:key="settingsPage.category">
    <form class="pure-form pure-form-stacked">
      <fieldset>
        <legend>
          {{ $t(settingsPage.category) }}
        </legend>

        <div v-for="setting in settingsPage.settings" v-bind:key="setting.name">
          <div class="pure-control-group">
            <label :for="textAreaElementId(settingsPage.category, setting.name)">
              {{ $t('settings.' + settingsPage.category + '.' + setting.name) }}

              <PrivatePasswordInputComponent
                :prompt="$t('episodes.episode.description.ai-prompt')"
              />
            </label>

            <input
              type="password"
              :id="textAreaElementId(settingsPage.category, setting.name)"
              class="secret"
              :required="!setting.valid"
              v-model="setting.value"
            />

            <span class="pure-form-message-inline">
              <span v-if="!setting.valid"> {{ $t('labels.required-value') }}</span>
            </span>
          </div>
        </div>

        <div class="pure-controls">
          <button
            @click.prevent="save(settingsPage.category)"
            type="submit"
            class="pure-button pure-button-primary"
          >
            {{ $t('settings.save-button', { plugin: $t(settingsPage.category) }) }}
          </button>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<style scoped>
.secret {
  width: 100%;
}

/* standard stuff */
.pure-controls .pure-button {
  margin-top: calc(0.5 * var(--gutter-space));
}
</style>
