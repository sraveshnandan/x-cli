import { FetchHttpClient } from "@effect/platform"
import { Context, Effect, Layer, Option } from "effect"
import { SessionOperationFailed, type SessionError } from '@x-cli/acn-protocol'
import {
  ProviderClient,
  ProviderIdSchema,
  type CloudUsageResponse,
  type ProviderClientShape,
  type UsageQuery,
} from '@x-cli/sdk'
import { XCliStorage } from '@x-cli/storage'

const X_CLI_PROVIDER_ID = ProviderIdSchema.make("x-cli")

export interface XCliCloudUsageApi {
  readonly get: (query?: UsageQuery) => Effect.Effect<CloudUsageResponse, SessionError>
}

export class XCliCloudUsage extends Context.Tag("XCliCloudUsage")<
  XCliCloudUsage,
  XCliCloudUsageApi
>() {}

const failure = (operation: string) => (cause: unknown): SessionError =>
  new SessionOperationFailed({ operation, reason: cause instanceof Error ? cause.message : String(cause) })

export const XCliCloudUsageLive: Layer.Layer<
  XCliCloudUsage,
  never,
  ProviderClient | XCliStorage
> = Layer.effect(XCliCloudUsage, Effect.gen(function* () {
  const client = yield* ProviderClient
  const storage = yield* XCliStorage
  const authenticatedClient: Effect.Effect<ProviderClientShape, SessionError> = Effect.gen(function* () {
    const environment = process.env.MAGNITUDE_API_KEY?.trim()
    if (environment) return client
    const stored = yield* storage.auth.get(X_CLI_PROVIDER_ID).pipe(
      Effect.map(Option.fromNullable),
      Effect.orElseSucceed(Option.none),
    )
    if (Option.exists(stored, (auth) => auth.type === "api" && auth.key.trim().length > 0)) return client
    return yield* new SessionOperationFailed({ operation: "get cloud usage", reason: "No x-cli API key found" })
  })
  return XCliCloudUsage.of({
    // Cloud is disabled.
    get: (_query) => Effect.fail(new SessionOperationFailed({
      operation: "get cloud usage",
      reason: "x-cli Cloud is disabled",
    })),
    // get: (query) => authenticatedClient.pipe(
    //   Effect.flatMap((authenticated) => authenticated.usage(query).pipe(Effect.provide(FetchHttpClient.layer))),
    //   Effect.mapError(failure("get cloud usage")),
    // ),
  })
}))
