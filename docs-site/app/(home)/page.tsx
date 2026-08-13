import Link from 'next/link';

const installCommand =
  'curl -fsSL https://raw.githubusercontent.com/sraveshnandan/x-cli/master/install/install.sh | bash';

const capabilities = [
  {
    index: '01',
    title: 'Run models on your hardware',
    description:
      'ICN profiles memory before loading, chooses an accelerator, and keeps prompts on your machine when you select a local model.',
    detail: 'Metal · CUDA · Vulkan · CPU',
  },
  {
    index: '02',
    title: 'Switch providers without switching tools',
    description:
      'Move between local inference, Anthropic, OpenAI, NVIDIA NIM, Ollama, and compatible endpoints from one session.',
    detail: 'One runtime · many model sources',
  },
  {
    index: '03',
    title: 'Inspect every decision',
    description:
      'Turns, tool calls, worker state, and model activity are captured as replayable events instead of disappearing into a terminal scrollback.',
    detail: 'Sessions · projections · traces',
  },
] as const;

export default function HomePage() {
  return (
    <main className="landing-shell min-h-screen overflow-hidden bg-fd-background text-fd-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Link
          href="/"
          aria-label="x-cli home"
          className="rounded-sm font-mono text-lg font-semibold tracking-[-0.08em] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-fd-background"
        >
          <span className="text-primary">x</span>-cli
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/docs"
            className="min-h-11 rounded-sm px-3 py-3 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Docs
          </Link>
          <a
            href="https://github.com/sraveshnandan/x-cli"
            target="_blank"
            rel="noreferrer"
            className="min-h-11 rounded-sm border border-fd-border px-4 py-3 text-sm font-medium transition-colors hover:border-primary/60 hover:bg-fd-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            GitHub
          </a>
        </nav>
      </header>

      <section className="relative mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16">
        <div className="relative z-10">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.24em] text-primary">
            Open source · local first · agentic
          </p>
          <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">
            The coding agent that can stay on your machine.
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-fd-muted-foreground">
            x-cli pairs a durable multi-agent runtime with native local inference. Use your own GPU, connect a cloud model, and keep one inspectable workflow.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/docs/quickstart"
              className="inline-flex min-h-12 items-center justify-center rounded-sm bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-fd-background motion-reduce:transform-none"
            >
              Start with x-cli
            </Link>
            <Link
              href="/docs/architecture"
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-fd-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-fd-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              See how it works
            </Link>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 border-y border-fd-border py-5">
            <Stat value="100%" label="local capable" />
            <Stat value="5" label="worker roles" />
            <Stat value="0" label="local token fees" />
          </dl>
        </div>

        <RuntimeGraphic />
      </section>

      <section className="border-y border-fd-border bg-fd-card/50">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">The operating model</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                One agent surface. Three layers you control.
              </h2>
            </div>
            <div className="divide-y divide-fd-border border-y border-fd-border">
              {capabilities.map((capability) => (
                <article key={capability.index} className="grid gap-3 py-7 sm:grid-cols-[3rem_1fr] sm:gap-5">
                  <span className="font-mono text-sm text-primary" aria-hidden="true">
                    {capability.index}
                  </span>
                  <div>
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
                      <h3 className="text-xl font-semibold tracking-[-0.02em]">{capability.title}</h3>
                      <span className="font-mono text-xs text-fd-muted-foreground">{capability.detail}</span>
                    </div>
                    <p className="mt-3 max-w-2xl leading-7 text-fd-muted-foreground">{capability.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Install</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Start from one command.</h2>
          <p className="mt-5 max-w-lg leading-7 text-fd-muted-foreground">
            The installer uses a platform release when available. Until the first public release is published, it transparently keeps a source checkout and runs x-cli through Bun.
          </p>
          <Link
            href="/docs/installation"
            className="mt-6 inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Installation options →
          </Link>
        </div>
        <div className="overflow-hidden rounded-md border border-fd-border bg-[#090d13] shadow-[0_24px_80px_-38px_rgba(0,154,255,0.55)]">
          <div className="flex min-h-11 items-center justify-between border-b border-white/10 px-4">
            <span className="font-mono text-xs text-slate-400">terminal</span>
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-cyan-400">macOS · Linux · WSL</span>
          </div>
          <pre className="overflow-x-auto p-5 text-sm leading-7 text-slate-200 sm:p-7">
            <code className="font-mono">
              <span className="text-cyan-400">$</span> {installCommand}
            </code>
          </pre>
        </div>
      </section>

      <section className="border-t border-fd-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Build in the open</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Your code, your models, your runtime.
            </h2>
          </div>
          <a
            href="https://github.com/sraveshnandan/x-cli"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-sm border border-fd-border px-6 py-3 text-sm font-semibold transition-colors hover:border-primary/60 hover:bg-fd-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Explore the repository
          </a>
        </div>
      </section>

      <footer className="border-t border-fd-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-5 font-mono text-xs text-fd-muted-foreground sm:flex-row sm:px-8">
          <p><span className="text-primary">x</span>-cli · Apache 2.0</p>
          <p>Built for local-first software work.</p>
        </div>
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-fd-border px-3 first:border-l-0 first:pl-0 sm:px-5">
      <dt className="font-mono text-lg font-semibold text-fd-foreground">{value}</dt>
      <dd className="mt-1 text-xs leading-4 text-fd-muted-foreground">{label}</dd>
    </div>
  );
}

function RuntimeGraphic() {
  return (
    <figure className="runtime-map relative z-10 rounded-md border border-fd-border bg-fd-card p-3 shadow-[0_28px_100px_-55px_rgba(0,154,255,0.8)] sm:p-5">
      <figcaption className="flex items-center justify-between border-b border-fd-border px-2 pb-4 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-fd-muted-foreground">
        <span>Runtime map</span>
        <span className="text-primary">session active</span>
      </figcaption>
      <div className="grid gap-3 py-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <FlowNode eyebrow="01 / Input" title="Your workspace" lines={['prompt + context', 'files + terminal']} />
        <FlowArrow />
        <FlowNode eyebrow="02 / Coordinate" title="x-cli runtime" lines={['plan · delegate', 'edit · verify']} active />
      </div>
      <div className="flex justify-center py-1" aria-hidden="true">
        <span className="font-mono text-primary">↓</span>
      </div>
      <div className="grid gap-3 pt-2 sm:grid-cols-2">
        <FlowNode eyebrow="03A / Private" title="Local inference" lines={['Metal · CUDA', 'Vulkan · CPU']} />
        <FlowNode eyebrow="03B / Connected" title="Cloud providers" lines={['Anthropic · OpenAI', 'NVIDIA · Ollama']} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-fd-border bg-fd-border text-center font-mono text-[0.65rem] uppercase tracking-widest text-fd-muted-foreground">
        <span className="bg-fd-background px-2 py-3">event log</span>
        <span className="bg-fd-background px-2 py-3">replay</span>
        <span className="bg-fd-background px-2 py-3">traces</span>
      </div>
    </figure>
  );
}

function FlowNode({
  eyebrow,
  title,
  lines,
  active = false,
}: {
  eyebrow: string;
  title: string;
  lines: readonly string[];
  active?: boolean;
}) {
  return (
    <div className={`min-h-36 rounded-sm border p-4 ${active ? 'border-primary/60 bg-primary/5' : 'border-fd-border bg-fd-background'}`}>
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      <div className="mt-4 space-y-1 font-mono text-xs text-fd-muted-foreground">
        {lines.map((line) => <p key={line}>{line}</p>)}
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <span className="flex h-8 items-center justify-center font-mono text-primary sm:w-6 sm:rotate-0" aria-hidden="true">
      <span className="sm:hidden">↓</span>
      <span className="hidden sm:inline">→</span>
    </span>
  );
}
