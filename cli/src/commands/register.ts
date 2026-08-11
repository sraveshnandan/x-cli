import { registerClientCommands } from "@x-cli/client-common"

export function registerCliCommands(): void {
  registerClientCommands([
    {
      id: "models",
      label: "models",
      description: "Choose a ready model",
    },
    {
      id: "catalog",
      label: "catalog",
      description: "Find and download local models",
    },
    {
      id: "hardware",
      label: "hardware",
      description: "Inspect local inference hardware",
    },
    {
      id: "connect",
      label: "connect",
      description: "Manage x-cli Cloud & model provider connections",
      aliases: ["cloud"],
    },
    {
      id: "mcp",
      label: "mcp",
      description: "Inspect and manage MCP server tools and context",
    },
  ])
}
