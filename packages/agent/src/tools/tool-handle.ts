import type { ProviderToolCallId, ToolCallId } from '@x-cli/ai'
import { createToolHandle as harnessCreateToolHandle, type ToolHandle } from '@x-cli/harness'
import type { Toolkit } from '@x-cli/harness'
import { Option } from 'effect'

export type { ToolHandle } from '@x-cli/harness'

export function createToolHandleFromToolkit(
  toolCallId: ToolCallId,
  providerToolCallId: ProviderToolCallId,
  toolKey: string,
  toolkit: Toolkit,
): Option.Option<ToolHandle> {
  const entry = toolkit.entries[toolKey]
  if (!entry?.state) return Option.none()
  return Option.some(harnessCreateToolHandle(toolCallId, providerToolCallId, toolKey, entry.state))
}
