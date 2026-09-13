import { onUnmounted } from 'vue'
import { type NotificationListener, notifications } from '@/services'

/**
 * registers notification listeners and tears them down when the component goes
 * away. a component can mount many times in a session -- navigate into an episode,
 * back out, into the next one -- and the notifications service holds its callbacks
 * in a module singleton, so every listener left behind stays subscribed forever.
 * one notification then does the same work once per component that ever mounted.
 *
 * call this during setup. the returned function can be called later, including
 * from inside onMounted.
 */
export function useNotificationListeners() {
  const unsubscribes: Array<() => void> = []

  onUnmounted(() => {
    unsubscribes.forEach((unsubscribe) => unsubscribe())
    unsubscribes.length = 0
  })

  function listenForCategory(category: string, listener: NotificationListener) {
    unsubscribes.push(notifications.listenForCategory(category, listener))
  }

  return { listenForCategory }
}
