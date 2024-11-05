import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createI18n } from 'vue-i18n'
import About from '../../src/About.vue'

// Create i18n instance with your messages
const i18n = createI18n({
  legacy: false,  // Important! Enable Composition API mode
  locale: 'en',   // or whatever your default locale is
  messages: {
    en: {
      about: {
        title: 'About Us'
      },
      app: {
        'made-with-love': 'Made with ❤️ by {josh}'
      }
    }
  }
})

describe('About Component', () => {
  it('renders correctly', () => {
    const wrapper = mount(About, {
      global: {
        plugins: [i18n]
      }
    })

    // Test that translations are rendered
    expect(wrapper.find('h1').text()).toBe('About Us')
    expect(wrapper.find('span').html()).toContain('Made with ❤️ by <a href="https://youtube.com/@coffeesoftware">Josh Long</a>')
  })
})