import { definePrompt } from '../prompt'
import { denyForbiddenCommands, denyMutatingGit, denyWritesOutside, denyMassDestructiveIn, allowAll } from '../policy'
import type { RoleDefinition } from '../types'
import advisorPromptRaw from '../prompts/advisor.txt' with { type: 'text' }
import { homedir } from 'node:os'
import { join } from 'node:path'

export function createAdvisorRole(): RoleDefinition {
  return {
    id: 'advisor',
    description: 'Provides strategic guidance',
    prompt: definePrompt<never>(advisorPromptRaw),
    defaultRecipient: 'coordinator',
    agentKind: 'peer',
    spawnable: true,
    maxThoughtChars: 20000,
    policy: [
      denyForbiddenCommands(),
      denyMutatingGit(),
      denyWritesOutside(ctx => [ctx.cwd, ctx.scratchpadPath, join(homedir(), '.x-cli')]),
      denyMassDestructiveIn(ctx => [join(homedir(), '.x-cli')]),
      allowAll(),
    ],
    lifecycle: {
      coordinatorOnSpawn: undefined,
      coordinatorOnIdle: "Review the advisor's recommendations.",
    },
    initialContext: { coordinatorConversation: true },
  }
}
