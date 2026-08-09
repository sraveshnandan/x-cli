import type { ProviderModel } from '@x-cli/ai'
import { Schema } from "effect"
import { ProviderModelIdSchema } from '@x-cli/ai'

export type { ModelPricingInfo, ProviderModelCapabilities } from '@x-cli/ai'

export interface NvidiaNimModelInfo extends ProviderModel {
  readonly object: "model"
  readonly owned_by: string
}

const NvidiaNimRawModelSchema = Schema.Struct({
  id: ProviderModelIdSchema,
  object: Schema.Literal("model"),
  owned_by: Schema.String,
  displayName: Schema.String,
  contextWindow: Schema.Number,
  maxOutputTokens: Schema.Number,
  capabilities: Schema.optionalWith(
    Schema.Struct({
      vision: Schema.optionalWith(Schema.Boolean, { as: "Option", exact: true }),
      structuredOutput: Schema.optionalWith(Schema.Boolean, { as: "Option", exact: true }),
    }),
    { as: "Option", exact: true },
  ),
  pricing: Schema.optionalWith(
    Schema.Struct({
      input: Schema.Number,
      output: Schema.Number,
      cached_input: Schema.NullOr(Schema.Number),
    }),
    { as: "Option", exact: true },
  ),
})

export type NvidiaNimRawModel = Schema.Schema.Type<typeof NvidiaNimRawModelSchema>

export const NvidiaNimModelListResponseSchema = Schema.Struct({
  object: Schema.Literal("list"),
  data: Schema.Array(NvidiaNimRawModelSchema),
})
export type ModelListResponse = Schema.Schema.Type<typeof NvidiaNimModelListResponseSchema>

export type NvidiaNimAdditionalOptions = {
  temperature?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
}

export type NvidiaNimCallOptions = {
  maxTokens?: number
  temperature?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  nvidiaNimAdditionalOptions?: NvidiaNimAdditionalOptions
}