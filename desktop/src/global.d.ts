/**
 * Global type augmentation for the desktop preload bridge.
 *
 * The preload script injects `window.__x-cliDesktop` via Electron's
 * `contextBridge`. This declaration makes it type-safe to access from
 * the renderer without `as unknown` casts.
 */
import type { DesktopApi } from "./desktop-rpc"

declare global {
  interface Window {
    __x-cliDesktop: DesktopApi
  }
}
