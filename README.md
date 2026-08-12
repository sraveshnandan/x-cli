# x-cli

**x-cli** is a high-performance open-source AI coding agent with native local model support and multi-provider cloud connectivity. 100% private, offline-capable, with zero rate limits or token costs for local execution.

---

## Quick Start

### One-line install (macOS, Linux, WSL)

```sh
curl -fsSL https://raw.githubusercontent.com/sraveshnandan/x-cli/master/install/install.sh | bash
```

This downloads the latest platform-native release into `~/.x-cli/bin` (or `~/bin` if it exists) and adds it to your `PATH` in your shell config.

To install a specific version:

```sh
curl -fsSL https://raw.githubusercontent.com/sraveshnandan/x-cli/master/install/install.sh \
  | bash -s -- --version 0.0.1-alpha.38
```

The installer supports `X_CLI_INSTALL_DIR`, `XDG_BIN_DIR`, and `X_CLI_REPO` for forks; see `install/install.sh --help`.

### Run

```sh
cd your-project
x-cli
```

`x-cli` runs natively on Linux and macOS (Apple Silicon and Intel). Windows is supported via WSL2.

---

## What x-cli Does

`x-cli` automatically profiles your hardware (GPU, VRAM, RAM) on first launch to recommend optimal local models. You can switch between **Local Hardware Models** and **Online Cloud Providers** at any time.

### Models

Inside the TUI:

- Press `Ctrl+P` or open **Settings** to open the **Model Setup Chooser**.
- Choose between **Local Models** (Balanced, Best Quality, Fastest, Lightweight) or **Online Providers**.

Configure cloud providers globally in `~/.x-cli/config.json`:

```json
{
  "models": {
    "providers": {
      "openai":    { "apiKey": "sk-...",      "baseUrl": "https://api.openai.com/v1" },
      "anthropic": { "apiKey": "sk-ant-..." },
      "nvidia":    { "apiKey": "nvapi-...",    "baseUrl": "https://integrate.api.nvidia.com/v1" },
      "ollama":    { "baseUrl": "http://localhost:11434/v1" }
    },
    "slots": {
      "primary": { "providerId": "openai", "modelId": "gpt-4o" }
    }
  }
}
```

### Skills

Install skills from directories like [skills.sh](https://www.skills.sh) into your project:

```sh
npx skills add vercel-labs/agent-browser
```

Add custom skills to `.agents/skills/<name>/SKILL.md` (project) or `~/.x-cli/skills/` (global). x-cli auto-loads them at runtime.

### Slash Commands

| Command | What it does |
| :--- | :--- |
| `/plan` | Formulate step-by-step implementation plans before executing code edits |
| `/goal` | Execute long-running background goals thoroughly without stopping |
| `/schedule` | Set recurring background timers or cron schedules for tasks |
| `/grill-me` | Interactive design alignment interview to resolve architecture decisions |
| `/learn` | Persist corrections or setup details into memory for future sessions |

---

## How It Works

### Custom Local Inference Engine

`x-cli` ships a custom Rust inference engine (called **ICN**) powered by `llama.cpp`. It pre-calculates VRAM & RAM overhead before loading models, optimizes KV-cache reuse, and manages GPU layer offloading. Nothing leaves your machine when running locally.

### Multi-Agent Workspace Runtime

The runtime is built on Effect-TS with an event-sourced core, addressed worker roles (Leader, Architect, Engineer, Scout, Critic), and a session protocol that captures every turn and tool call as durable JSONL.

### Observability

A local OpenTelemetry collector (**Motel**) gives deep visibility into AI calls, token consumption, and subagent spans.

```sh
bun run dash   # opens http://127.0.0.1:27686
```

### Session Inspection

All agent turns, tool calls, and addressed states are preserved as structured JSONL logs in `~/.x-cli/sessions/`:

```sh
bun session list                     # List recent sessions
bun session events <id>              # Stream events for a specific session
bun session projection <id> Window   # Inspect replayed projection state
```

---

## Architecture

```
clients (cli / web / desktop) → client-common → sdk → acn (daemon)
```

- **Clients** render the UI. They only import `@x-cli/client-common` and `@x-cli/sdk`.
- **client-common** owns shared reactive state and AtomRpc query atoms.
- **sdk** is the typed RPC client and daemon lifecycle (`DaemonSpawner`).
- **acn** is the server daemon that hosts the agent runtime, sessions, file ops, and display streams.

Read [`AGENTS.md`](./AGENTS.md) for the full package layering and Effect-TS conventions.

---

## License

`x-cli` is licensed under the [Apache License 2.0](LICENSE).
