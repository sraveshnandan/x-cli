import { Effect, Option, Schema } from "effect"
import * as HttpClient from "@effect/platform/HttpClient"
import * as HttpClientRequest from "@effect/platform/HttpClientRequest"
import {
  AVAILABLE_PROVIDER_MODEL,
  ModelCatalogError,
  ModelFamilyIdSchema,
  ProviderIdSchema,
  ReasoningEffortSchema,
  ReasoningProperty,
  VisionProperty,
  type AuthApplicator,
  type ModelCatalog,
  type ModelFamilyId,
} from '@x-cli/ai'
import { classifyModelFamily as classifyModelFamilyRaw } from "../family-registry"
import type { NvidiaNimModelInfo, NvidiaNimRawModel } from "./contract"
import { NvidiaNimModelListResponseSchema } from "./contract"

type NvidiaNimModelWithoutFamily = Omit<NvidiaNimModelInfo, "modelFamilyId">

const NIM_DEFAULT_REASONING_EFFORT = ReasoningEffortSchema.make("high")

const NIM_REASONING_EFFORTS = ["none", "low", "medium", "high", "max"].map(
  (effort) => ReasoningEffortSchema.make(effort),
)

export function toNvidiaNimModelInfo(raw: NvidiaNimRawModel): NvidiaNimModelWithoutFamily {
  const caps = Option.getOrElse(raw.capabilities, () => ({ vision: null, structuredOutput: null }))
  const vision = Option.fromNullable(caps.vision ?? null).pipe(
    Option.getOrElse(() => false),
  )
  const structuredOutput = Option.fromNullable(caps.structuredOutput ?? null).pipe(
    Option.getOrElse(() => false),
  )
  const pricing = Option.getOrElse(raw.pricing, () => ({ input: 0, output: 0, cached_input: null }))

  return {
    providerModelId: raw.id,
    providerId: ProviderIdSchema.make("nvidia-nim"),
    displayName: raw.displayName,
    contextWindow: raw.contextWindow,
    maxOutputTokens: raw.maxOutputTokens,
    defaultReasoningEffort: NIM_DEFAULT_REASONING_EFFORT,
    properties: {
      vision: new VisionProperty.states.Resolved({ value: vision }),
      reasoning: new ReasoningProperty.states.Resolved({ value: NIM_REASONING_EFFORTS }),
    },
    servingCapabilities: {
      tools: true,
      structuredOutput,
    },
    availability: AVAILABLE_PROVIDER_MODEL,
    pricing,
    object: "model",
    owned_by: raw.owned_by,
  } as NvidiaNimModelWithoutFamily
}

export interface NvidiaNimAuthentication {
  readonly _tag: "Configured"
  readonly apply: AuthApplicator
}

export interface NvidiaNimCatalogConfig {
  readonly endpoint: string
  readonly authentication: NvidiaNimAuthentication
  readonly ttlMs?: number
  readonly classify: (model: NvidiaNimModelWithoutFamily) => Option.Option<ModelFamilyId>
}

export function createNvidiaNimCatalog(config: NvidiaNimCatalogConfig): ModelCatalog<NvidiaNimModelInfo> {
  const { endpoint, authentication, ttlMs = 5 * 60 * 1000, classify } = config

  let cache: readonly NvidiaNimModelInfo[] | null = null
  let fetchedAt = 0

  const fetchModels: Effect.Effect<
    readonly NvidiaNimModelInfo[],
    ModelCatalogError,
    HttpClient.HttpClient
  > = Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient
    const headers = new Headers()
    authentication.apply(headers)

    const headerRecord: Record<string, string> = {}
    headers.forEach((value, key) => {
      headerRecord[key] = value
    })

    const request = HttpClientRequest.get(`${endpoint}/models`).pipe(
      HttpClientRequest.setHeaders(headerRecord),
    )

    const response = yield* client.execute(request).pipe(
      Effect.mapError((cause) =>
        new ModelCatalogError({ message: "Failed to fetch NVIDIA NIM models", cause }),
      ),
    )

    if (response.status < 200 || response.status >= 300) {
      const body = yield* response.text.pipe(Effect.orElseSucceed(() => ""))
      return yield* new ModelCatalogError({
        message: `Failed to fetch NVIDIA NIM models: HTTP ${response.status} - ${body}`,
      })
    }

    const body = yield* response.json.pipe(
      Effect.mapError((cause) =>
        new ModelCatalogError({ message: "Failed to read NVIDIA NIM models response", cause }),
      ),
    )

    const rawModels = yield* Schema.decodeUnknown(NvidiaNimModelListResponseSchema)(body).pipe(
      Effect.mapError((cause) =>
        new ModelCatalogError({ message: "Invalid NVIDIA NIM models response", cause }),
      ),
    )

    const classified: NvidiaNimModelInfo[] = []
    for (const raw of rawModels.data) {
      const model = toNvidiaNimModelInfo(raw)
      const familyOption = classify(model)
      classified.push(
        Option.match(familyOption, {
          onNone: () => model,
          onSome: (familyId) => ({
            ...model,
            modelFamilyId: ModelFamilyIdSchema.make(familyId),
          }),
        }),
      )
    }

    return classified
  })

  const list: ModelCatalog<NvidiaNimModelInfo>["list"] = Effect.gen(function* () {
    if (cache && Date.now() - fetchedAt < ttlMs) {
      return cache
    }
    const models = yield* fetchModels
    cache = models
    fetchedAt = Date.now()
    return models
  })

  const get: ModelCatalog<NvidiaNimModelInfo>["get"] = (_providerId, providerModelId) =>
    Effect.gen(function* () {
      const models = yield* list
      const model = models.find((m) => m.providerModelId === providerModelId)
      if (!model) {
        return yield* new ModelCatalogError({ message: `NVIDIA NIM model not found: ${providerModelId}` })
      }
      return model
    })

  const refresh: ModelCatalog<NvidiaNimModelInfo>["refresh"] = Effect.gen(function* () {
    const models = yield* fetchModels
    cache = models
    fetchedAt = Date.now()
    return models
  })

  const classifyModelFamily = (model: Omit<NvidiaNimModelInfo, "modelFamilyId">) =>
    classifyModelFamilyRaw(model.providerModelId)

  return { list, get, refresh, classifyModelFamily }
}
