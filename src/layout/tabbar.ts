export interface TabRegistration {
  id: string
  label: string
  slot: any
  visible: boolean
}

export type RegisterTabFunction = (tab: TabRegistration) => void
export type GetActiveTabFunction = () => string
