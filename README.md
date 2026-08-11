# x-cli

**x-cli** is a high-performance open-source AI coding agent built with native local model support and multi-provider cloud connectivity. 100% private, offline-capable, with zero rate limits or token costs for local execution.

![x-cli logo](docs/logo.svg)

---

## Quick Start

```sh
# Install x-cli globally
npm install -g @x-cli/cli

# Run in any workspace directory
cd your-project
x-cli
```

`x-cli` natively supports Linux and macOS. Windows is supported via WSL2.

---

## Unlocking x-cli to its Full Potential

### 1. Model Setup & Multi-Provider Configuration

`x-cli` automatically profiles your hardware (GPU, VRAM, RAM) on first launch to recommend optimal local models. You can easily switch between **Local Hardware Models** and **Online Cloud Providers** at any time.

#### A. Interactive Model Switcher & Setup
Inside the TUI or Web UI:
* Press `Ctrl+P` or open **Settings** to open the **Model Setup Chooser**.
* Choose between **Local Models** (Balanced, Best Quality, Fastest, Lightweight) or **Online Providers**.

#### B. Connecting External Providers via Configuration
You can configure external model providers and API keys globally in `~/.x-cli/config.json`:

```json
{
  "models": {
    "providers": {
      "openai": {
        "apiKey": "sk-...",
        "baseUrl": "https://api.openai.com/v1"
      },
      "anthropic": {
        "apiKey": "sk-ant-..."
      },
      "nvidia": {
        "apiKey": "nvapi-...",
        "baseUrl": "https://integrate.api.nvidia.com/v1"
      },
      "ollama": {
        "baseUrl": "http://localhost:11434/v1"
      },
      "custom-openai": {
        "apiKey": "your-key",
        "baseUrl": "https://your-custom-endpoint/v1"
      }
    },
    "slots": {
      "primary": {
        "providerId": "openai",
        "modelId": "gpt-4o"
      }
    }
  }
}
```

---

### 2. Model Context Protocol (MCP) & Custom Skills

`x-cli` provides an extensible skill system and support for **Model Context Protocol (MCP)** tool extensions.

#### A. Installing Pre-built Skills
You can install pre-built skills from directories like [skills.sh](https://www.skills.sh):

```sh
npx skills add vercel-labs/agent-browser   # Drive your Chrome browser
npx skills add anthropics/skills/xlsx      # Read & build Excel spreadsheets
npx skills add anthropics/skills/pptx      # Build PowerPoint decks
npx skills add anthropics/skills/docx      # Read & write Word documents
npx skills add anthropics/skills/pdf       # Fill & generate PDFs
```

#### B. Creating Custom Workspace Skills & MCP Extensions
Add custom skills to your workspace under `.agents/skills/<skill-name>/SKILL.md` or globally under `~/.x-cli/skills/`:

```markdown
---
name: database-query
description: Execute read-only SQL queries against the local PostgreSQL dev container
---

# Database Query Skill

When asked to query the database, run the helper script in `scripts/query.py`.

## Available Commands:
- `python scripts/query.py --sql "<query>"`
```

`x-cli` automatically loads skills at runtime, parsing frontmatter metadata, tool schemas, and background execution scripts into the agent context.

---

### 3. Interactive Slash Commands

Maximize efficiency in your terminal workflow with built-in slash commands:

| Command | Usage |
| :--- | :--- |
| `/plan` | Formulate step-by-step implementation plans before executing code edits |
| `/goal` | Execute long-running background goals thoroughly without stopping |
| `/schedule` | Set recurring background timers or cron schedules for tasks |
| `/grill-me` | Interactive design alignment interview to resolve architecture decisions |
| `/learn` | Persist corrections or setup details into memory for future sessions |

---

### 4. Telemetry & Observability

`x-cli` integrates a local OpenTelemetry collector (**Motel**) for deep observability into AI calls, token consumption, and span traces.

```sh
# Launch live telemetry & tracing dashboard
bun run dash
```
Open `http://127.0.0.1:27686` to inspect prompt payloads, completion timings, and subagent spans live.

---

### 5. Session History & Inspection

All agent turns, tool calls, and addressed states are preserved as structured JSONL logs in `~/.x-cli/sessions/`:

```sh
bun session list                     # List recent sessions and message summaries
bun session events <id>              # Stream events for a specific session ID
bun session search <keyword>         # Search event payloads across sessions
bun session projection <id> Window   # Inspect replayed projection state
```

---

## How It Works

### Custom Local Inference Engine
`x-cli` includes a custom Rust inference engine powered by `llama.cpp`. It pre-calculates VRAM & RAM overhead before loading models, optimizes KV-cache reuse, and manages GPU layer offloading. Nothing leaves your machine when running locally.

### Multi-Agent Workspace Runtime
`x-cli` uses Effect-TS native event-sourcing and addressed worker roles (Leader, Architect, Engineer, Scout, Critic) to manage multi-step reasoning, background shell tasks, and tool execution cleanly.

---

## License

`x-cli` is licensed under the [Apache License 2.0](LICENSE).
