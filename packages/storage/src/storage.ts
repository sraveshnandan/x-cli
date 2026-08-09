import { Context, Effect, Layer } from 'effect'

import { makeAuthStorage } from './auth/storage'
import { makeConfigStorage } from './config/storage'
import { makeLogStorage } from './logs/storage'
import { makeMemoryStorage } from './memory/storage'
import { makeSessionStorage } from './sessions/storage'
import type { AuthStorageShape } from './auth/contracts'
import type { ConfigStorageShape } from './config/contracts'
import type { LogStorageShape } from './logs/contracts'
import type { MemoryStorageShape } from './memory/contracts'
import type { SessionStorageShape } from './sessions/contracts'

export interface XCliStorageShape {
  readonly sessions: SessionStorageShape
  readonly auth: AuthStorageShape
  readonly config: ConfigStorageShape
  readonly memory: MemoryStorageShape
  readonly logs: LogStorageShape
}

export class XCliStorage extends Context.Tag('XCliStorage')<
  XCliStorage,
  XCliStorageShape
>() {}

export const StorageLive = Layer.effect(
  XCliStorage,
  Effect.gen(function* () {
    return XCliStorage.of({
      sessions: yield* makeSessionStorage(),
      auth: yield* makeAuthStorage(),
      config: yield* makeConfigStorage(),
      memory: yield* makeMemoryStorage(),
      logs: yield* makeLogStorage(),
    })
  })
)
