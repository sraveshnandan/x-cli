import { Schema } from "effect"

/**
 * Schema for ACN process registry entries.
 *
 * Each running ACN writes a `registry.json` file under
 * `~/.x-cli/acn/<entry>/registry.json` containing a `registration` payload.
 * The dashboard reads these files to discover and probe running ACNs.
 */
export const AcnRegistrationSchema = Schema.Struct({
  url: Schema.NonEmptyString,
  version: Schema.NonEmptyString,
  pid: Schema.Number,
  timestamp: Schema.Number,
})
export type AcnRegistration = typeof AcnRegistrationSchema.Type

export const AcnVersionRegistryJson = Schema.Struct({
  registration: AcnRegistrationSchema,
})
