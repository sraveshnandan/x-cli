import { Context, Schema } from "effect"
import type * as HttpClient from "@effect/platform/HttpClient"
import { Effect } from "effect"
import { ModelCatalogError } from "@x-cli/ai"
import type {
  BaseCallOptions,
  BoundModel,
  ModelDiscoveryOperationId,
  ModelPropertyDiscoveryError,
  ModelPropertyDiscoveryRequest,
  ProviderId,
  ProviderModel,
  ProviderModelBindOptions,
  ProviderModelId,
  ProviderRejection,
  RequestAttribution,
  UsageQuery,
  WebSearchResult,
} from "@x-cli/ai"
import type { ModelCatalog } from "@x-cli/ai"
import { makeFileBackedModelCatalog } from "@x-cli/ai"
import {
  createXCliProvider,
  createExaWebSearch,
  makeProviderRegistry,
  WebSearchNotConfigured,
  WebSearchProviderSchema,
  type DiscoverableProviderInstance,
  type XCliProviderInstance,
  type XCliClientConfig,
  type XCliCallOptions,
  type XCliAdditionalOptions,
  type XCliClientError,
  type XCliModelInfo,
  type WebSearchError,
  type FetchUsageOptions,
  type CloudUsageResponse,
  type ProviderCatalogOutcome,
} from "@x-cli/providers"
import type { ProviderInfo as RegistryProviderInfo } from "@x-cli/providers"

// =============================================================================
// Re-exported types with provider-agnostic names
// =============================================================================

export type {
  ProviderRejection,
  BaseCallOptions,
  ProviderModelBindOptions,
  ProviderModel,
  ProviderModelAvailability,
  ProviderModelDisabledReason,
  ProviderId,
  ProviderModelId,
  ModelFamilyId,
} from "@x-cli/ai"
export {
  AVAILABLE_PROVIDER_MODEL,
  isProviderModelAvailable,
  ModelCatalogError,
  ProviderIdSchema,
  ProviderModelIdSchema,
  ModelFamilyIdSchema,
  ProviderModelAvailabilitySchema,
  ProviderModelSchema,
  ModelDiscoveryOperationIdSchema,
  ModelPropertyDiscoveryErrorSchema,
  ModelPropertyDiscoveryRequestSchema,
  ModelPropertyNameSchema,
  ReasoningEffortSchema,
  ReasoningProperty,
  VisionProperty,
} from "@x-cli/ai"
export type {
  ModelDiscoveryOperationId,
  ModelPropertyDiscoveryError,
  ModelPropertyDiscoveryRequest,
  ModelPropertyName,
  ReasoningEffort,
} from "@x-cli/ai"
export type ProviderClientError = XCliClientError
export type ProviderRegistryInfo = RegistryProviderInfo
export type { ProviderCatalogOutcome } from "@x-cli/providers"

export interface ProviderClientConfig extends XCliClientConfig {
  readonly discoverableProviders?: readonly DiscoverableProviderInstance[]
  readonly exaApiKey?: string
  readonly exaEndpoint?: string
}

export type {
  XCliModelInfo,
  FetchUsageOptions,
  CloudUsageResponse,
  XCliCallOptions,
  XCliAdditionalOptions,
} from "@x-cli/providers"
export type { WebSearchResult, UsageQuery } from "@x-cli/ai"
export type { WebSearchError } from "@x-cli/providers"
export { formatWebSearchError } from "@x-cli/providers"
export type { UsagePeriod } from "@x-cli/acn-protocol"

// =============================================================================
// Re-exported constants and helpers
// =============================================================================

export {
  classifyModelFamilyFromEvidence,
  classifyXCliRejectedResponse,
  tryParseErrorBody,
  type ParsedXCliApiError,
} from "@x-cli/providers"
export { makeFileBackedModelCatalog } from "@x-cli/ai"
export {
  createXCliCompatibleSpec,
  XCliModelListResponseSchema,
  toXCliModelInfo,
} from "@x-cli/providers"

// =============================================================================
// Runtime config (provider-specific env vars read behind the boundary)
// =============================================================================

export interface ProviderRuntimeConfig {
  readonly preferProvider?: string
  readonly disableTraits: boolean
}

export const WebSearchSourceSchema = Schema.Union(
  WebSearchProviderSchema,
  Schema.Literal("unavailable"),
)
export type WebSearchSource = typeof WebSearchSourceSchema.Type

// =============================================================================
// Provider Client Shape
// =============================================================================

/**
 * The provider client boundary. ONE method to resolve any model from any
 * registered provider. No per-provider methods, no qualified ID parsing.
 */
export interface ProviderClientShape {
  readonly catalog: ModelCatalog<ProviderModel>
  readonly catalogs: {
    readonly list: Effect.Effect<readonly ProviderCatalogOutcome[], never, HttpClient.HttpClient>
    readonly refresh: (providerId?: ProviderId) => Effect.Effect<readonly ProviderCatalogOutcome[], never, HttpClient.HttpClient>
  }
  readonly listProviders: Effect.Effect<readonly ProviderRegistryInfo[], never, HttpClient.HttpClient>
  readonly sessionId: string | null
  readonly resolveModel: (
    providerId: ProviderId,
    providerModelId: ProviderModelId,
    options?: ProviderModelBindOptions,
  ) => Effect.Effect<BoundModel<BaseCallOptions>, never, never>
  readonly discoverModelProperties: (
    providerId: ProviderId,
    request: ModelPropertyDiscoveryRequest,
  ) => Effect.Effect<ModelDiscoveryOperationId, ModelPropertyDiscoveryError>
  readonly requestAttribution: (
    providerId: ProviderId,
    providerModelId: ProviderModelId,
    key: string,
  ) => RequestAttribution
  readonly webSearchSource: Effect.Effect<WebSearchSource>
  readonly webSearch: (
    query: string,
    schema?: Record<string, unknown>,
  ) => Effect.Effect<WebSearchResult, WebSearchError, HttpClient.HttpClient>
  readonly usage: (
    query?: UsageQuery,
  ) => Effect.Effect<CloudUsageResponse, ProviderClientError, HttpClient.HttpClient>
  readonly runtimeConfig: ProviderRuntimeConfig
}

// =============================================================================
// Provider Client Tag
// =============================================================================

/** @effect-expect-leaking HttpClient */
export class ProviderClient extends Context.Tag("ProviderClient")<
  ProviderClient,
  ProviderClientShape
>() {}

// =============================================================================
// Factory
// =============================================================================

export function createProviderClient(config?: ProviderClientConfig): ProviderClientShape {
  const xCliInstance: XCliProviderInstance = createXCliProvider(config)
  const exaInstance = createExaWebSearch({
    ...(config?.exaApiKey === undefined ? {} : { apiKey: config.exaApiKey }),
    ...(config?.exaEndpoint === undefined ? {} : { endpoint: config.exaEndpoint }),
  })
  const sessionId = config?.sessionId ?? null
  // Cloud is disabled.
  const webSearchSource: WebSearchSource = exaInstance.configured
    ? "exa"
    : "unavailable"
  const webSearch = webSearchSource === "exa"
    ? exaInstance.webSearch
    : () => Effect.fail(new WebSearchNotConfigured())
  // const webSearch = webSearchSource === "xCli"
  //   ? xCliInstance.provider.webSearch
  //   : webSearchSource === "exa"
  //     ? exaInstance.webSearch
  //     : () => Effect.fail(new WebSearchNotConfigured())

  const registry = makeProviderRegistry({
    // xCli: xCliInstance,
    xCli: null,
    discoverableProviders: config?.discoverableProviders ?? [],
  })

  return {
    catalog: registry.aggregatedCatalog,
    catalogs: registry.catalogs,
    listProviders: registry.listProviders,
    sessionId,
    resolveModel: (providerId, providerModelId, options) =>
      registry.resolveModel(providerId, providerModelId, options),
    discoverModelProperties: registry.discoverModelProperties,
    requestAttribution: (_providerId, _providerModelId, key) => ({ key, requestStarted: Effect.void }),
    webSearchSource: Effect.succeed(webSearchSource),
    webSearch,
    usage: xCliInstance.provider.usage,
    runtimeConfig: {
      preferProvider: process.env.MAGNITUDE_PREFER_PROVIDER || undefined,
      disableTraits: !!process.env.MAGNITUDE_DISABLE_TRAITS,
    },
  }
}
