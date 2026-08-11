// Classifier
export {
  type Atom,
  type AtomType,
  atomizeModelId,
  isAllDigits,
} from "./classifier/atomizer"
export {
  type PatternSymbol,
  lit,
  sep,
  dot,
  num,
  ver,
  opt,
} from "./classifier/symbols"
export {
  type ClassifyResult,
  type Family,
  type PatternEntry,
  classify,
} from "./classifier/classify"
export {
  MODEL_FAMILIES,
  getModelFamily,
  classifyModelFamily,
  classifyModelFamilyFromEvidence,
  FAMILY_DEFINITIONS,
} from "./family-registry"

// Registry & aggregation
export {
  ProviderRegistry,
  type ProviderRegistryService,
  type DiscoverableProviderInstance,
  type ProviderInfo,
  type AuthStatus,
  makeProviderRegistry,
  ProviderRegistryLive,
} from "./registry"
export {
  makeAggregatedCatalog,
  inspectProviderCatalogs,
  type ProviderCatalogOutcome,
  buildFamilies,
} from "./catalog-aggregator"

// x-cli provider
export {
  createXCliProvider,
  fetchUsage,
  PROVIDER_ID as MAGNITUDE_PROVIDER_ID,
  type XCliProviderInstance,
  type XCliClientConfig,
  type FetchUsageOptions,
  XCliClientError,
} from "./x-cli/provider"
export {
  createExaWebSearch,
  type ExaWebSearchConfig,
  type ExaWebSearchInstance,
} from "./exa/web-search"
export {
  WebSearchProviderSchema,
  WebSearchNotConfigured,
  WebSearchRequestEncodingFailed,
  WebSearchRequestFailed,
  WebSearchTimedOut,
  WebSearchRejected,
  WebSearchResponseReadFailed,
  WebSearchInvalidResponse,
  formatWebSearchError,
  type WebSearchProvider,
  type WebSearchError,
} from "./web-search-error"
export type { WebSearchResult, UsageQuery } from "@x-cli/ai"
export { createXCliCatalog, toXCliModelInfo, type XCliAuthentication } from "./x-cli/catalog"
export { XCliModelListResponseSchema, XCliRawModelSchema } from "./x-cli/contract"
export {
  createXCliCompatibleSpec,
  type XCliCallOptions,
  type XCliModelSpec,
  type XCliCompatibleSpecConfig,
} from "./x-cli/models"
export {
  classifyXCliRejectedResponse,
  tryParseErrorBody,
  type ParsedXCliApiError,
} from "./x-cli/errors"
export type {
  XCliModelInfo,
  XCliRawModel,
  ModelListResponse,
  XCliAdditionalOptions,
  XCliApiError,
  XCliErrorType,
  XCliErrorCode,
  XCliErrorDetails,
  UsageLimitDetails,
  SubscriptionRequiredDetails,
  BillingWindowBudget,
  BillingWindowName,
  ProSubscriptionStatus,
  ReasoningEffort,
  ModelPricingInfo,
} from "./x-cli/contract"

// Nvidia NIM provider
export {
  createNvidiaNimProvider,
  type NvidiaNimProviderInstance,
  type NvidiaNimClientConfig,
  PROVIDER_ID as NVIDIA_NIM_PROVIDER_ID,
} from "./nvidia-nim/provider"
export { createNvidiaNimCatalog } from "./nvidia-nim/catalog"
export type { ToolChoice } from "@x-cli/ai"
export type { CloudUsageResponse, UsagePeriod } from "./x-cli/usage"
