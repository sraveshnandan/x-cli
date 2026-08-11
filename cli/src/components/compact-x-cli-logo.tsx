import { useTheme } from '../hooks/use-theme'

/** Compact x-cli mark at its exact 9×5 terminal-cell geometry. */
export const COMPACT_X_CLI_LOGO_WIDTH = 9
export const COMPACT_X_CLI_LOGO_HEIGHT = 4

export const COMPACT_X_CLI_LOGO_LINES = [
  ' ╭━━━━━╮ ',
  ' ┃ ◕ ◕ ┃ ',
  ' ┃  ◡  ┃ ',
  ' ╰━━━━━╯ ',
] as const

export function CompactXCliLogo() {
  const theme = useTheme()
  return (
    <box style={{
      width: COMPACT_X_CLI_LOGO_WIDTH,
      height: COMPACT_X_CLI_LOGO_HEIGHT,
      flexShrink: 0,
      flexDirection: 'column',
    }}>
      {COMPACT_X_CLI_LOGO_LINES.map((line, index) => (
        <text key={index} style={{ fg: theme.primary }}>{line}</text>
      ))}
    </box>
  )
}
