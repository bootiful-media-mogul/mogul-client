import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import type * as Ably from 'ably'
import { notifications } from '../../src/services'
import { useNotificationListeners } from '../../src/composables/useNotificationListeners'

function message(category: string): Ably.InboundMessage {
  const notification = {
    category: category,
    key: 'the-key',
    mogulId: 1,
    context: 'the-context',
    when: '2026-09-13T00:00:00Z',
    modal: false,
    visible: true
  }
  return { data: JSON.stringify(notification) } as Ably.InboundMessage
}

function componentListeningWith(listener: () => void) {
  return defineComponent({
    setup() {
      const { listenForCategory } = useNotificationListeners()
      listenForCategory('job-stopped-event', listener)
      return () => h('div')
    }
  })
}

describe('useNotificationListeners', () => {
  it('delivers notifications while the component is mounted', async () => {
    const listener = vi.fn()
    const wrapper = mount(componentListeningWith(listener))

    await notifications.dispatch(message('job-stopped-event'))

    expect(listener).toHaveBeenCalledOnce()
    wrapper.unmount()
  })

  it('stops delivering once the component unmounts', async () => {
    const listener = vi.fn()
    const wrapper = mount(componentListeningWith(listener))

    await notifications.dispatch(message('job-stopped-event'))
    wrapper.unmount()
    await notifications.dispatch(message('job-stopped-event'))

    expect(listener).toHaveBeenCalledOnce()
  })

  it('does not accumulate a listener per mount', async () => {
    const listener = vi.fn()
    const component = componentListeningWith(listener)
    // navigating in and out of an editor three times used to leave three live
    // listeners behind, so one notification did the work four times over.
    for (let i = 0; i < 3; i++) {
      mount(component).unmount()
    }
    const live = mount(component)

    await notifications.dispatch(message('job-stopped-event'))

    expect(listener).toHaveBeenCalledOnce()
    live.unmount()
  })
})
