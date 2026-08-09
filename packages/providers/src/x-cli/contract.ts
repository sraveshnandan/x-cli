/**
 * Magnitude provider contract types.
 *
 * These types define the x-cli-specific extension of ProviderModel
 * and the call options for the Magnitude provider.
 */

import type { RoleId } from "./roles"
import type { SlotId } from '@x-cli/roles'
import type { ProviderModel, ReasoningEffort, ModelPricingInfo } from '@x-cli/ai'
import { Schema } from "effect"
import { ProviderModelIdSchema } from '@x-cli/ai'

export type { ReasoningEffort, ModelPricingInfo } from '@x-cli/ai'
export type { ProviderModelCapabilities as ModelCapabilities } from '@x-cli/ai'

/**
 * A model in the Magnitude provider's catalog.
 * Extends ProviderModel with x-cli-specific fields.
 */
export interface XCliModelInfo extends ProviderModel {
  readonly object: "model"
  readonly owned_by: string
  readonly roles: readonly RoleId[]
  readonly slots: readonly SlotId[]
  readonly type?: "utility"
}

const MagnitudeRoleIdSchema: Schema.Schema<RoleId> = Schema.Literal(
  "leader",
  "scout",
  "architect",
  "engineer",
  "critic",
  "scientist",
  "artisan",
  "advisor",
)

const MagnitudeSlotIdSchema: Schema.Schema<SlotId> = Schema.Literal("primary", "secondary")

/** Validated raw model shape returned by Magnitude model-list endpoints. */
export const XCliRawModelSchema = Schema.Struct({
  id: ProviderModelIdSchema,
  object: Schema.Literal("model"),
  owned_by: Schema.String,
  displayName: Schema.String,
  roles: Schema.Array(MagnitudeRoleIdSchema),
  slots: Schema.Array(MagnitudeSlotIdSchema),
  tiers: Schema.optionalWith(Schema.Array(Schema.String), { as: "Option", exact: true }),
  type: Schema.optionalWith(Schema.Literal("utility"), { as: "Option", exact: true }),
  contextWindow: Schema.Number,
  maxOutputTokens: Schema.Number,
  capabilities: Schema.optionalWith(Schema.Struct({
    vision: Schema.Boolean,
    structuredOutput: Schema.optionalWith(Schema.Boolean, { as: "Option", exact: true }),
  }), { as: "Option", exact: true }),
  pricing: Schema.optionalWith(Schema.Struct({
    input: Schema.Number,
    output: Schema.Number,
    cached_input: Schema.NullOr(Schema.Number),
  }), { as: "Option", exact: true }),
})
export type XCliRawModel = Schema.Schema.Type<typeof XCliRawModelSchema>

export const XCliModelListResponseSchema = Schema.Struct({
  object: Schema.Literal("list"),
  data: Schema.Array(XCliRawModelSchema),
})
export type ModelListResponse = Schema.Schema.Type<typeof XCliModelListResponseSchema>

export type ToolChoice =
  | "none"
  | "auto"
  | "required"
  | NamedFunctionToolChoice
  | AllowedToolsToolChoice
  | GrammarToolChoice

export type NamedFunctionToolChoice = {
  type: "function"
  function: { name: string }
}

export type AllowedToolsToolChoice = {
  type: "allowed_tools"
  allowed_tools: {
    mode: "auto" | "required"
    tools: Array<{ type: "function"; function: { name: string } }>
  }
}

export type GrammarToolChoice = {
  type: "grammar"
  grammar: string
}

export type TurnConstraintMessage = "force" | "allow" | "forbid"

export type TurnConstraints = {
  message?: TurnConstraintMessage
}

export type XCliAdditionalOptions = {
  traits?: string[]
  forceTrait?: string
  turn_constraints?: TurnConstraints
  session_id?: string
  agent_id?: string
  include_raw?: boolean
  prefer_provider?: string
}

export type {
  BillingWindowBudget,
  BillingWindowName,
  XCliApiError,
  XCliErrorCode,
  XCliErrorDetails,
  XCliErrorType,
  ProSubscriptionStatus,
  SubscriptionRequiredDetails,
  UsageLimitDetails,
} from "./generated-contract/errors"
