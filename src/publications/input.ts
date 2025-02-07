import type { Slot } from 'vue'
 
export class PanelSlot {
  
  constructor(public selected: boolean, 
              public plugin: string,
              public panel: Slot,
              public icon: Slot
  ) {}
}
export type RegisterChildFunction = (child: PanelSlot) => void
