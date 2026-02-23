import { useRouter } from 'vue-router'
import { type EntityContext, results } from '@/services'

export function usePendingAction() {
  const router = useRouter()

  async function resume() {
    const raw = sessionStorage.getItem('pending_action')
    if (!raw) {
      return
    }
    sessionStorage.removeItem('pending_action')
    const context = JSON.parse(raw) as EntityContext
    const navigationFunction = results.navigation(context.resolvedType)
    const navigationContext = navigationFunction(context.context)
    const m = navigationContext.params
    const serializable = m instanceof Map ? Object.fromEntries(m) : m
    const x = { name: navigationContext.name, params: serializable }
    await router.push(x)
  }

  return { resume }
}
