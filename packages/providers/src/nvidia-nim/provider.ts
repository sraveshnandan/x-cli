import { Effect, Option, Schema } from "effect"
import * as HttpClient from "@effect/platform/HttpClient"
import {
  Auth,
  type AuthApplicator,
  type BaseCallOptions,
  type BoundModel,
  type ModelCatalog,
  type ModelDiscoveryOperationId,
  type ModelPropertyDiscoveryError,
  type ModelPropertyDiscoveryRequest,
  type Provider,
  type ProviderModelBindOptions,
  type ProviderModelId,
  ModelDiscoveryOperationIdSchema,
  ProviderIdSchema,
  type ModelFamilyId,
} from '@x-cli/ai'
import { isEnvFlagOn } from '@x-cli/utils'
import { classifyModelFamily as classifyModelFamilyRaw } from "../family-registry"
import { createNvidiaNimCatalog, type NvidiaNimAuthentication } from "./catalog"
import { wrapAsBaseModel, createNvidiaNimCompatibleSpec, type NvidiaNimCallOptions } from "./models"
import type { NvidiaNimAdditionalOptions, NvidiaNimModelInfo } from "./contract"

export const PROVIDER_ID = ProviderIdSchema.make("nvidia-nim")

export interface NvidiaNimClientConfig {
  readonly apiKey?: string
  readonly endpoint?: string
}

const DEFAULT_ENDPOINT = "https://integrate.api.nvidia.com/v1"

export interface NvidiaNimProviderInstance {
  readonly provider: Provider<NvidiaNimModelInfo>
  readonly catalog: ModelCatalog<NvidiaNimModelInfo>
  readonly authentication: NvidiaNimAuthentication
}

export function createNvidiaNimProvider(config?: NvidiaNimClientConfig): NvidiaNimProviderInstance {
  const endpoint = config?.endpoint ?? process.env.NVIDIA_NIM_ENDPOINT ?? DEFAULT_ENDPOINT
  const apiKey = config?.apiKey ?? process.env.NVIDIA_NIM_API_KEY ?? ""

  const authentication: NvidiaNimAuthentication = apiKey
    ? {
        _tag: "Configured",
        apply: Auth.bearer(apiKey),
      }
    : {
        _tag: "Configured",
        apply: (headers: Headers) => {
          if (apiKey) {
            Auth.bearer(apiKey)(headers)
          }
        },
      }

  const classifyModelFamily = (model: Omit<NvidiaNimModelInfo, "modelFamilyId">): Option.Option<ModelFamilyId> =>
    classifyModelFamilyRaw(model.providerModelId)

  const catalog = createNvidiaNimCatalog({
    endpoint,
    authentication,
    classify: classifyModelFamily,
  })

  const bindModel = (
    id: ProviderModelId,
    options?: ProviderModelBindOptions,
  ): Effect.Effect<BoundModel<BaseCallOptions>, never, never> =>
    Effect.gen(function* () {
      const bakedOptions: NvidiaNimAdditionalOptions = {}

      const internal = createNvidiaNimCompatibleSpec(id, endpoint).bind({
        auth: authentication.apply,
        defaults: options?.defaults as Partial<NvidiaNimCallOptions> | undefined,
        ...(options?.imagePlaceholders ? { imagePlaceholders: options.imagePlaceholders } : {}),
      })

      return wrapAsBaseModel(internal, bakedOptions)
    })

  const provider: Provider<NvidiaNimModelInfo> = {
    id: PROVIDER_ID,
    displayName: "NVIDIA NIM",
    catalog,
    discoverModelProperties: () =>
      Effect.succeed(ModelDiscoveryOperationIdSchema.make("nvidia-nim-authoritative")),
    bindModel,
    classifyModelFamily,
  }

  return { provider, catalog, authentication }
}
