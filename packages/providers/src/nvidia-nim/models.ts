import { Effect } from "effect"
import {
  NativeChatCompletions,
  Option,
  type BaseCallOptions,
  type BoundModel,
  type ModelSpec,
  type ProviderModelBindOptions,
  type ToolChoice as AiToolChoice,
} from '@x-cli/ai'
import { classifyNvidiaNimRejectedResponse } from "./errors"
import type { NvidiaNimAdditionalOptions, NvidiaNimCallOptions } from "./contract"

export type { NvidiaNimCallOptions, NvidiaNimAdditionalOptions }
export type { NvidiaNimModelInfo } from "./contract"

export function createNvidiaNimCompatibleSpec(modelId: string, endpoint: string): ModelSpec<NvidiaNimCallOptions> {
  return NativeChatCompletions.model({
    modelId,
    endpoint,
    options: {
      maxTokens: NativeChatCompletions.options.maxTokens,
      temperature: Option.define(
        (v: number) => ({ temperature: v }),
      ),
      topP: Option.define(
        (v: number) => ({ top_p: v }),
      ),
      frequencyPenalty: Option.define(
        (v: number) => ({ frequency_penalty: v }),
      ),
      presencePenalty: Option.define(
        (v: number) => ({ presence_penalty: v }),
      ),
      nvidiaNimAdditionalOptions: Option.define(
        (v: NvidiaNimAdditionalOptions) => ({ ...v }),
      ),
      toolChoice: Option.define(
        (v: AiToolChoice) => ({ tool_choice: v }),
      ),
    },
    classifyRejectedResponse: classifyNvidiaNimRejectedResponse,
  })
}

export function wrapAsBaseModel(
  internal: BoundModel<NvidiaNimCallOptions>,
  bakedOptions: NvidiaNimAdditionalOptions,
): BoundModel<BaseCallOptions> {
  return {
    stream: (prompt, tools, options) =>
      internal.stream(prompt, tools, {
        ...options,
        nvidiaNimAdditionalOptions: { ...bakedOptions },
      }),
  }
}

export function bindNvidiaNimModel(
  modelId: string,
  endpoint: string,
  auth: (headers: Headers) => void,
  options?: ProviderModelBindOptions,
): Effect.Effect<BoundModel<BaseCallOptions>, never, never> {
  const internal = createNvidiaNimCompatibleSpec(modelId, endpoint).bind({
    auth,
    defaults: options?.defaults as Partial<NvidiaNimCallOptions> | undefined,
    ...(options?.imagePlaceholders ? { imagePlaceholders: options.imagePlaceholders } : {}),
  })

  const baked: NvidiaNimAdditionalOptions = {}
  return Effect.succeed(wrapAsBaseModel(internal, baked))
}
