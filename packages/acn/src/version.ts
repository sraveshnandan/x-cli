import {
  ACN_COORDINATION_REVISION,
  X_CLI_VERSION,
} from "@x-cli/version"
import {
  AcnIdentitySchema,
  AcnRevisionSchema,
  type AcnTarget,
} from "@x-cli/acn-protocol"

/**
 * ACN version, overridable via `MAGNITUDE_ACN_VERSION` env var for dev/testing.
 * Lets development clients and their candidate ACN use one explicit identity.
 */
export const ACN_VERSION = AcnIdentitySchema.make(
  process.env.X_CLI_ACN_VERSION ?? X_CLI_VERSION,
)

export const ACN_REVISION = AcnRevisionSchema.make(ACN_COORDINATION_REVISION)

export const ACN_TARGET: AcnTarget = {
  identity: ACN_VERSION,
  revision: ACN_REVISION,
}
