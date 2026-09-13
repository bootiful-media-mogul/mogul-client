import { beforeEach, describe, expect, it, vi } from 'vitest'
import type * as Ably from 'ably'
import { Notifications } from '../../src/services'

// the constructor eagerly opens the Ably subscription. a query that never settles
// parks startGraphql() before it touches the network, leaving dispatch testable.
function notifications(): Notifications {
  const client = { query: () => new Promise(() => {}) }
  return new Notifications(client as never)
}

// what the service actually puts on the wire; dispatch parses this back out.
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

describe('Notifications#dispatch', () => {
  let subject: Notifications

  beforeEach(() => {
    subject = notifications()
  })

  it('notifies a category listener even when nothing is listening globally', async () => {
    const listener = vi.fn()
    subject.listenForCategory('ayrshare-publication-completion-event', listener)

    await subject.dispatch(message('ayrshare-publication-completion-event'))

    expect(listener).toHaveBeenCalledOnce()
  })

  it('notifies global listeners and only the matching category', async () => {
    const global = vi.fn()
    const matching = vi.fn()
    const other = vi.fn()
    subject.listen(global)
    subject.listenForCategory('job-stopped-event', matching)
    subject.listenForCategory('job-started-event', other)

    await subject.dispatch(message('job-stopped-event'))

    expect(global).toHaveBeenCalledOnce()
    expect(matching).toHaveBeenCalledOnce()
    expect(other).not.toHaveBeenCalled()
  })

  it('stops notifying a listener once it has unsubscribed', async () => {
    const listener = vi.fn()
    const unsubscribe = subject.listenForCategory('job-stopped-event', listener)

    await subject.dispatch(message('job-stopped-event'))
    unsubscribe()
    await subject.dispatch(message('job-stopped-event'))

    expect(listener).toHaveBeenCalledOnce()
  })

  it('still notifies the remaining listeners when one unsubscribes mid-dispatch', async () => {
    const second = vi.fn()
    const unsubscribes: Array<() => void> = []
    unsubscribes.push(
      subject.listenForCategory('job-stopped-event', () => unsubscribes.forEach((u) => u()))
    )
    unsubscribes.push(subject.listenForCategory('job-stopped-event', second))

    await subject.dispatch(message('job-stopped-event'))

    expect(second).toHaveBeenCalledOnce()
  })

  it('still notifies the remaining listeners when one throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const after = vi.fn()
    subject.listenForCategory('job-stopped-event', () => {
      throw new Error('sync boom')
    })
    subject.listenForCategory('job-stopped-event', async () => {
      throw new Error('async boom')
    })
    subject.listenForCategory('job-stopped-event', after)

    await subject.dispatch(message('job-stopped-event'))

    expect(after).toHaveBeenCalledOnce()
  })

  it('survives a message that is not a notification', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const listener = vi.fn()
    subject.listenForCategory('job-stopped-event', listener)

    await subject.dispatch({ data: 'not json' } as Ably.InboundMessage)

    expect(listener).not.toHaveBeenCalled()
  })
})
