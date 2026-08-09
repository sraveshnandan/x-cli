import { Option } from "effect"
import {
  payloadSample,
  StreamStartProviderCorrectnessViolation,
  StreamStartProviderRejection,
  type ProviderCall,
  type ProviderRejection,
  type RejectedHttpResponse,
} from '@x-cli/ai'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function tryParseErrorBody(body: string): { error: { message: string; type?: string; code?: string } } | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(body)
  } catch {
    return null
  }

  if (!isRecord(parsed)) return null
  const error = parsed.error
  if (!isRecord(error)) return null
  if (typeof error.message !== "string" || error.message.trim().length === 0) return null

  return {
    error: {
      message: error.message,
      type: typeof error.type === "string" ? error.type : undefined,
      code: typeof error.code === "string" ? error.code : undefined,
    },
  }
}

function isContextLimit(message: string): boolean {
  const text = message.toLowerCase()
  return [
    "context length",
    "token limit",
    "max_tokens",
    "too long",
    "context window",
  ].some((pattern) => text.includes(pattern))
}

function classifyNvidiaNimError(
  response: RejectedHttpResponse,
  parsed: { error: { message: string; type?: string; code?: string } },
): ProviderRejection {
  const { error } = parsed

  if (response.status === 401 || response.status === 403) {
    return { _tag: "AuthRejected", message: error.message }
  }

  if (response.status === 429 || error.type === "rate_limit_error") {
    return {
      _tag: "RateLimited",
      message: error.message,
      retryPolicy: {
        retry: true,
        retryAfterMs: response.retryAfterMs,
      },
    }
  }

  if (isContextLimit(error.message)) {
    return { _tag: "ContextLimitExceeded", message: error.message }
  }

  if (error.type === "invalid_request_error") {
    return { _tag: "InvalidRequest", message: error.message }
  }

  return { _tag: "UpstreamFailure", message: error.message, retryPolicy: { retry: true, retryAfterMs: Option.none() } }
}

export function classifyNvidiaNimRejectedResponse(
  call: ProviderCall,
  response: RejectedHttpResponse,
): StreamStartProviderRejection | StreamStartProviderCorrectnessViolation {
  const parsed = tryParseErrorBody(response.body)
  if (parsed === null) {
    return new StreamStartProviderCorrectnessViolation({
      call,
      response,
      violation: {
        _tag: "InvalidErrorEnvelope",
        status: response.status,
        body: payloadSample(response.body),
        issue: { message: "NVIDIA NIM error response did not match the expected envelope shape" },
      },
    })
  }

  return new StreamStartProviderRejection({
    call,
    response,
    rejection: classifyNvidiaNimError(response, parsed),
  })
}
