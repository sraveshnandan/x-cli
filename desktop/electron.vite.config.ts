import { defineConfig } from "electron-vite"
import react from "@vitejs/plugin-react"
import { resolve } from "node:path"

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "src/main.ts"),
        },
      },
    },
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          preload: resolve(__dirname, "src/preload.ts"),
        },
      },
    },
  },
  renderer: {
    root: ".",
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "index.html"),
        },
      },
    },
    resolve: {
      alias: [
        { find: "@x-cli/web", replacement: resolve(__dirname, "../web/src/index.tsx") },
        { find: /^@x-cli\/sdk$/, replacement: resolve(__dirname, "../packages/sdk/src/browser.ts") },
        { find: "@web-styles", replacement: resolve(__dirname, "../web/src/styles") },
      ],
    },
    server: {
      fs: {
        allow: [resolve(__dirname, "..")],
      },
    },
    plugins: [react()],
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
        "@x-cli/web",
      ],
    },
  },
})
