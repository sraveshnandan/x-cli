import {
  NativeChatCompletions,
  Option,
  type ModelSpec,
  type BoundModel,
  type BaseCallOptions,
  type ToolChoice as AiToolChoice,
} from "@x-cli/ai"
import { classifyXCliRejectedResponse } from "./errors"
import type { XCliAdditionalOptions } from "./contract"


export type XCliModelSpec = ModelSpec<XCliCallOptions>

export interface XCliCompatibleSpecConfig {
  modelId: string
  endpoint: string
}

/**
 * Internal call options for the x-cli provider.
 * `XCliAdditionalOptions` is baked in at bind time — callers only see
 * `BaseCallOptions`.
 */
export type XCliCallOptions = {
  maxTokens?: number
  toolChoice?: AiToolChoice
  XCliAdditionalOptions?: XCliAdditionalOptions
  reasoningEffort?: string
}

const XCliOptions = {
  maxTokens: NativeChatCompletions.options.maxTokens,
  toolChoice: Option.define(
    (v: AiToolChoice) => ({ tool_choice: v }),
  ),
  XCliAdditionalOptions: Option.define(
    (v: XCliAdditionalOptions) => ({ x_cli_additional_options: v }),
  ),
  reasoningEffort: Option.define(
    (v: string) => ({ reasoning_effort: v }),
  ),
} as const

export function createXCliCompatibleSpec(config: XCliCompatibleSpecConfig) {
  return NativeChatCompletions.model({
    modelId: config.modelId,
    endpoint: config.endpoint,
    options: XCliOptions,
    classifyRejectedResponse: classifyXCliRejectedResponse,
  })
}

/**
 * Wrap an internal `BoundModel<XCliCallOptions>` to accept
 * `BaseCallOptions` from the caller. `XCliAdditionalOptions` is baked
 * in at bind time and invisible to the caller.
 */
export function wrapAsBaseModel(
  internal: BoundModel<XCliCallOptions>,
  bakedOptions: XCliAdditionalOptions,
): BoundModel<BaseCallOptions> {
  return {
    stream: (prompt, tools, options) =>
      internal.stream(prompt, tools, {
        ...options,
        XCliAdditionalOptions: {
          ...bakedOptions,
        },
      }),
  }
}
