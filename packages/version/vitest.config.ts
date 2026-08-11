import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    name: "@x-cli/version",
    include: ["scripts/**/*.test.ts"],
  },
})
