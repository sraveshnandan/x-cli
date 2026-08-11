import type { ModelRequestProgress } from '@x-cli/ai'
import { Ambient } from '@x-cli/event-core'

interface ModelRequestTurn {
  readonly turnId: string
  readonly chainId: string
  readonly forkId: string | null
}

export interface ModelRequestActivityObservation {
  readonly turn: ModelRequestTurn
  readonly progress: ModelRequestProgress
}

export const ModelRequestActivityAmbient =
  Ambient.define<ModelRequestActivityObservation | null>({
    name: 'ModelRequestActivity',
    initial: null,
  })
