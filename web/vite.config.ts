import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "node:path"

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@x-cli/web", replacement: resolve(__dirname, "src/index.tsx") },
      { find: /^@x-cli\/sdk$/, replacement: resolve(__dirname, "../packages/sdk/src/browser.ts") },
    ],
  },
  define: {
    "process.platform": JSON.stringify("browser"),
    "process.arch": JSON.stringify("browser"),
    "process.pid": "0",
    "process.env": "{}",
    "process.versions": "{}",
  },
  optimizeDeps: {
    exclude: [
      "@x-cli/sdk",
      "@x-cli/acn-protocol",
      "@x-cli/client-common",
      "@x-cli/generate-id",
    ],
  },
  build: {
    outDir: "dist",
    target: "esnext",
  },
})
