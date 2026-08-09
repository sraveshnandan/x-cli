import { describe, expect, it } from "vitest"
import { Option } from "effect"
import { ProviderModelIdSchema } from '@x-cli/ai'
import { toXCliModelInfo } from "./catalog"
import type { XCliRawModel } from "./contract"

const rawModel = (overrides: Partial<XCliRawModel> = {}): XCliRawModel => ({
  id: ProviderModelIdSchema.make("test-model"),
  object: "model",
  owned_by: "x-cli",
  displayName: "Test Model",
  roles: ["leader"],
  slots: ["primary"],
  tiers: Option.none(),
  type: Option.none(),
  contextWindow: 200_000,
  maxOutputTokens: 128_000,
  capabilities: Option.none(),
  pricing: Option.none(),
  ...overrides,
})

describe("Magnitude model catalog mapping", () => {
  it("assigns the provider-wide reasoning efforts without model-list metadata", () => {
    const model = toXCliModelInfo(rawModel())

    expect(model.properties.reasoning).toMatchObject({
      _tag: "Resolved",
      value: ["none", "low", "medium", "high", "max"],
    })
  })

  it("assigns the same reasoning contract to every cloud model", () => {
    const model = toXCliModelInfo(rawModel({ id: ProviderModelIdSchema.make("another-model") }))

    expect(model.properties.reasoning).toMatchObject({
      _tag: "Resolved",
      value: ["none", "low", "medium", "high", "max"],
    })
  })

  it("treats an empty slot list on a user-facing model as generally selectable", () => {
    const model = toXCliModelInfo(rawModel({ slots: [] }))
    expect(model.slots).toEqual(["primary"])
  })

  it("does not expose utility models as selectable", () => {
    const model = toXCliModelInfo(rawModel({
      slots: [],
      type: Option.some("utility"),
    }))
    expect(model.slots).toEqual([])
  })
})
