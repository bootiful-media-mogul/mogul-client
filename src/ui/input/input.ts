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

export type UpdateValueFunction = (text: string) => void
export type ReadValueFunction = () => string
export type GetInputElementFunction = () => HTMLInputElement
export type RegisterChildFunction = (child: ChildRegistration) => void
