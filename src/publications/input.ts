import type { Slot } from 'vue'

export class PanelSlotIcon {
  constructor(
    public icon: string,
    public iconHover: string
  ) {}
}

export class PanelSlot {
  constructor(
    public selected: boolean,
    public plugin: string,
    public panel: Slot,
    public icon: PanelSlotIcon
  ) {}
}
export type RegisterChildFunction = (child: PanelSlot) => void
