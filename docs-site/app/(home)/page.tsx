import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative mx-auto max-w-5xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-3 font-mono text-sm">
            <span className="text-primary text-2xl">x</span>
            <span className="text-2xl text-fd-foreground">-cli</span>
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Your agent.
            <br />
            <span className="text-fd-muted-foreground">Your machine.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg text-fd-muted-foreground sm:text-xl">
            A high-performance open-source AI coding agent with native local model
            support and multi-provider cloud connectivity. 100% private, offline-capable,
            zero rate limits.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/docs/installation"
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Get Started →
            </Link>
            <a
              href="https://github.com/sraveshnandan/x-cli"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-fd-border px-6 py-3 text-sm font-semibold text-fd-foreground transition hover:bg-fd-muted"
            >
              GitHub
            </a>
          </div>

          <div className="mt-12 w-full max-w-3xl overflow-hidden rounded-lg border border-fd-border bg-fd-card shadow-xl">
            <div className="flex items-center gap-2 border-b border-fd-border bg-fd-muted px-4 py-2">
              <span className="size-2 rounded-full bg-red-400" />
              <span className="size-2 rounded-full bg-yellow-400" />
              <span className="size-2 rounded-full bg-green-400" />
              <span className="ml-2 font-mono text-xs text-fd-muted-foreground">
                ~/projects/awesome-app
              </span>
            </div>
            <img
              src="/x-cli/xcli-demo.gif"
              alt="x-cli running in a terminal, picking a model, then editing code"
              className="block w-full"
            />
          </div>
        </div>
      </section>

      {/* Install */}
      <section className="border-t border-fd-border bg-fd-card py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold tracking-tight">Install</h2>
          <p className="mt-3 text-fd-muted-foreground">
            One command. macOS, Linux, and WSL. The installer picks the right
            binary for your platform and adds it to your shell&apos;s{' '}
            <code className="rounded bg-fd-muted px-1.5 py-0.5 font-mono text-sm">
              PATH
            </code>
            .
          </p>

          <div className="mt-6 overflow-hidden rounded-lg border border-fd-border bg-fd-background">
            <div className="flex items-center justify-between border-b border-fd-border bg-fd-muted px-4 py-2">
              <span className="font-mono text-xs text-fd-muted-foreground">sh</span>
            </div>
            <pre className="overflow-x-auto p-4 text-sm">
              <code className="font-mono">
                curl -fsSL https://raw.githubusercontent.com/sraveshnandan/x-cli/master/install/install.sh | bash
              </code>
            </pre>
          </div>

          <p className="mt-4 text-sm text-fd-muted-foreground">
            Need a specific version or a custom install path?{' '}
            <Link href="/docs/installation" className="text-primary underline-offset-4 hover:underline">
              See all install options
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold tracking-tight">Built for serious work</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              title="Native local inference"
              description="A custom Rust engine (ICN) powered by llama.cpp. Runs on your GPU, pre-calculates VRAM, optimizes KV cache. Nothing leaves your machine."
            />
            <Feature
              title="Cloud providers when you want them"
              description="Switch between local models and OpenAI, Anthropic, NVIDIA NIM, Ollama, or any OpenAI-compatible endpoint at runtime."
            />
            <Feature
              title="Multi-agent runtime"
              description="Effect-TS event-sourced core with addressed worker roles (Leader, Architect, Engineer, Scout, Critic) for multi-step reasoning."
            />
            <Feature
              title="First-class skills"
              description="Install skills from skills.sh, write your own in Markdown, or load MCP servers. x-cli auto-loads them at runtime."
            />
            <Feature
              title="Full session replay"
              description="Every turn, tool call, and addressed state is captured as durable JSONL. Replay projections, search payloads, debug step by step."
            />
            <Feature
              title="Local observability"
              description="A bundled OpenTelemetry collector (Motel) gives deep visibility into AI calls, token consumption, and subagent spans — all on localhost."
            />
          </div>
        </div>
      </section>

      {/* Architecture teaser */}
      <section className="border-t border-fd-border bg-fd-card py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-bold tracking-tight">A real platform, not a script</h2>
          <p className="mt-3 max-w-2xl text-fd-muted-foreground">
            x-cli is split into a typed package graph so clients, daemons, providers,
            and the inference engine can evolve independently.
          </p>

          <div className="mt-8 overflow-x-auto rounded-lg border border-fd-border bg-fd-background p-4 font-mono text-sm">
            <pre>
{`clients (cli / web / desktop)
   ↓
client-common        — shared reactive state, AtomRpc hooks
   ↓
sdk                  — typed RPC client, daemon lifecycle
   ↓
acn (daemon)         — agent runtime, sessions, file ops, display streams
   ↓
agent / event-core   — event-sourced projections, addressed workers
   ↓
providers / ai       — provider-agnostic contract + concrete registry
   ↓
inference (ICN)      — Rust + llama.cpp, local model execution`}
            </pre>
          </div>

          <div className="mt-8 flex gap-4">
            <Link
              href="/docs/architecture"
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Read the architecture doc →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-fd-border py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <p className="font-mono text-sm text-fd-muted-foreground">
            <span className="text-primary">x</span>-cli · Apache 2.0
          </p>
          <div className="flex gap-6 text-sm text-fd-muted-foreground">
            <a
              href="https://github.com/sraveshnandan/x-cli"
              target="_blank"
              rel="noreferrer"
              className="hover:text-fd-foreground"
            >
              GitHub
            </a>
            <a
              href="https://github.com/sraveshnandan/x-cli/issues"
              target="_blank"
              rel="noreferrer"
              className="hover:text-fd-foreground"
            >
              Issues
            </a>
            <Link href="/docs" className="hover:text-fd-foreground">
              Docs
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-fd-border bg-fd-background p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-fd-muted-foreground">{description}</p>
    </div>
  );
}
