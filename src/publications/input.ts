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

export class PublicationContext {
  constructor(
    public publishableId: number,
    public type: string
  ) {
    this.type = type
    this.publishableId = publishableId
  }
}

export type PublishFunction = (
  publishableType: string,
  id: number,
  context: any,
  plugin: string
) => Promise<boolean>

export type IsPluginReadyFunction = (
  publishableType: string,
  id: number,
  context: any,
  plugin: string
) => Promise<boolean>

export type RegisterChildFunction = (child: PanelSlot) => void

export type GetPublicationContextFunction = () => PublicationContext
