import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    name: "@x-cli/acn-protocol",
    include: ["src/**/*.test.ts"],
  },
})
