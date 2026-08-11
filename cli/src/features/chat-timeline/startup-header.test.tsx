import { act } from 'react'
import { testRender } from '@opentui/react/test-utils'
import stringWidth from 'string-width'
import { describe, expect, it, vi } from 'vitest'
import {
  COMPACT_X_CLI_LOGO_HEIGHT,
  COMPACT_X_CLI_LOGO_LINES,
  COMPACT_X_CLI_LOGO_WIDTH,
} from '../../components/compact-x-cli-logo'
import { StartupHeader } from './startup-header'

vi.mock('../../hooks/use-theme', () => ({
  useTheme: () => ({ primary: 'cyan', foreground: 'white', muted: 'gray' }),
}))

describe('startup header', () => {
  it('preserves the complete compact mark at its verified cell geometry', () => {
    expect(COMPACT_X_CLI_LOGO_LINES).toHaveLength(COMPACT_X_CLI_LOGO_HEIGHT)
    expect(Math.max(...COMPACT_X_CLI_LOGO_LINES.map((line) => stringWidth(line)))).toBe(COMPACT_X_CLI_LOGO_WIDTH)
    expect(COMPACT_X_CLI_LOGO_LINES).toEqual([
      ' ╭━━━━━╮ ',
      ' ┃ ◕ ◕ ┃ ',
      ' ┃  ◡  ┃ ',
      ' ╰━━━━━╯ ',
    ])
  })

  it('uses two columns at standard terminal widths', async () => {
    const view = await testRender(
      <StartupHeader width={80} workingDirectory="~/x-cli" recentChats={<text>Recent</text>} />,
      { width: 80, height: 18 },
    )
    try {
      await act(view.renderOnce)
      const frame = view.captureCharFrame()
      const lines = frame.split('\n')
      expect(lines[0]?.indexOf('x-cli')).toBe(12)
      expect(frame).toContain('Current directory: ~/x-cli')
      const recentRow = lines.findIndex((line) => line.includes('Recent'))
      expect(recentRow).toBe(6)
      expect(lines[5]?.trim()).toBe('')
    } finally {
      await act(async () => view.renderer.destroy())
    }
  })

  it('stacks the same identity block before text wraps at narrow widths', async () => {
    const view = await testRender(
      <StartupHeader width={60} workingDirectory="~/x-cli" recentChats={null} />,
      { width: 60, height: 20 },
    )
    try {
      await act(view.renderOnce)
      const lines = view.captureCharFrame().split('\n')
      expect(lines.findIndex((line) => line.includes('x-cli'))).toBe(5)
      expect(lines[5]?.indexOf('x-cli')).toBe(1)
    } finally {
      await act(async () => view.renderer.destroy())
    }
  })
})
