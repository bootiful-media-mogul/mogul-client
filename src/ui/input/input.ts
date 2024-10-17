import type { Slot } from 'vue'

export interface ChildRegistration {
  iconVisible: boolean
  panelVisible: boolean
  panel: Slot
  icon: Slot
}

export interface PanelSlot extends Slot {
  panelVisible: boolean
  iconVisible: boolean
  panel: HTMLElement
  icon: HTMLElement
}

export type RegisterChildFunction = (child: ChildRegistration) => void
