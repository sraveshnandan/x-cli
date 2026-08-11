/**
 * Skill loader interface — abstracts the skill listing RPC so client-common
 * doesn't depend on the vanilla client. Each app provides its own impl
 * from its agent client.
 */
import type { SkillListEntry } from "@x-cli/sdk"

export interface SkillLoader {
  listSkills(cwd: string): Promise<readonly SkillListEntry[]>
}

export interface SlashCommandDefinition {
  id: string
  label: string
  description: string
  aliases?: string[]
  source?: 'skill'
  skillPath?: string
  featureFlag?: string
}

export async function loadSkillCommands(
  skillLoader: SkillLoader | null,
  cwd: string | null,
): Promise<SlashCommandDefinition[]> {
  if (!skillLoader || !cwd) return []
  const entries = await skillLoader.listSkills(cwd)
  return entries.map((s) => ({
    id: s.name,
    label: s.name,
    description: s.description,
    source: 'skill' as const,
    skillPath: s.path,
  }))
}

const SLASH_COMMANDS: SlashCommandDefinition[] = [
  { id: 'new',        label: 'new',        description: 'Start a new conversation' },
  { id: 'resume',     label: 'resume',     description: 'Resume a previous conversation' },
  { id: 'exit',       label: 'exit',       description: 'Exit x-cli', aliases: ['quit', 'q'] },
  { id: 'bash',       label: 'bash',       description: 'Enter bash mode' },
  { id: 'init',       label: 'init',       description: 'Generate AGENTS.md for this project' },
  { id: 'settings',   label: 'settings',   description: 'Open model settings', aliases: ['s'] },
  { id: 'transcript', label: 'transcript', description: 'Toggle transcript display mode' },
  { id: 'connect',    label: 'connect',    description: 'Manage cloud & model provider connections', aliases: ['cloud'] },
  { id: 'mcp',        label: 'mcp',        description: 'Manage Model Context Protocol (MCP) servers and tools' },
  { id: 'plan',       label: 'plan',       description: 'Formulate a step-by-step implementation plan' },
  { id: 'goal',       label: 'goal',       description: 'Execute an autonomous long-running task until completion' },
  { id: 'schedule',   label: 'schedule',   description: 'Set recurring background timers or cron tasks' },
  { id: 'grill-me',   label: 'grill-me',   description: 'Interactive design alignment interview' },
  { id: 'learn',      label: 'learn',      description: 'Persist developer corrections into memory' },
  { id: 'autopilot',  label: 'autopilot',  description: 'Toggle autopilot mode', featureFlag: 'MAGNITUDE_ENABLE_AUTOPILOT' },
]

let skillCommands: SlashCommandDefinition[] = []
let clientCommands: SlashCommandDefinition[] = []

export function registerSkillCommands(skills: SlashCommandDefinition[]) {
  skillCommands = skills
}

/** Register commands owned by the active client surface. */
export function registerClientCommands(commands: SlashCommandDefinition[]) {
  clientCommands = commands
}

export function getAllCommands(): SlashCommandDefinition[] {
  return [...SLASH_COMMANDS, ...clientCommands, ...skillCommands]
}
