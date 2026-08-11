function normalizePlatform(platform: NodeJS.Platform): string {
  switch (platform) {
    case 'darwin': return 'macOS'
    case 'win32': return 'Windows'
    default: return 'Linux'
  }
}

function detectShell(): string {
  return process.env.SHELL?.split('/').pop() || 'bash'
}

export const CLIENT_PLATFORM = normalizePlatform(process.platform)
export const CLIENT_SHELL = detectShell()

export const HEADER_PLATFORM = 'x-x-cli-platform'
export const HEADER_SHELL = 'x-x-cli-shell'
export const HEADER_SESSION_ID = 'x-x-cli-session-id'
export const HEADER_USE_DEDICATED = 'x-x-cli-use-dedicated'
