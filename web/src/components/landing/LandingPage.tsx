import React, { useState } from "react"
import {
  Terminal,
  Zap,
  Shield,
  Cpu,
  Layers,
  Activity,
  Code2,
  BookOpen,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Github,
  Play,
  Settings,
  Sparkles,
  Command,
} from "lucide-react"
import "./landing.css"

interface LandingPageProps {
  onLaunchApp?: () => void
  onOpenDocs?: () => void
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp, onOpenDocs }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null)
  const [installMethod, setInstallMethod] = useState<"mac" | "linux" | "windows" | "npm">("mac")
  const [activeTab, setActiveTab] = useState<"quickstart" | "providers" | "mcp" | "telemetry">("quickstart")

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd)
    setCopiedCmd(cmd)
    setTimeout(() => setCopiedCmd(null), 2000)
  }

  const getInstallCmd = () => {
    switch (installMethod) {
      case "mac":
        return "curl -fsSL https://x-cli.dev/install.sh | bash"
      case "linux":
        return "curl -fsSL https://x-cli.dev/install.sh | bash"
      case "windows":
        return "irm https://x-cli.dev/install.ps1 | iex"
      case "npm":
        return "npm install -g @x-cli/cli"
    }
  }

  return (
    <div className="landing-container">
      {/* Navigation Header */}
      <header className="landing-header">
        <a href="#" className="landing-brand">
          <div className="landing-brand-logo">X</div>
          <span>x-cli</span>
          <span className="landing-version-badge">v1.0</span>
        </a>

        <nav className="landing-nav">
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#architecture" className="landing-nav-link">Architecture</a>
          <a href="#commands" className="landing-nav-link">Commands</a>
          <a href="#telemetry" className="landing-nav-link">Observability</a>
          {onOpenDocs ? (
            <button onClick={onOpenDocs} className="landing-nav-link" style={{ background: "none", border: "none" }}>
              Documentation
            </button>
          ) : (
            <a href="/docs" className="landing-nav-link">Documentation</a>
          )}
        </nav>

        <div className="landing-nav-actions">
          <a
            href="https://github.com/sraveshnandan/x-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="landing-btn-secondary"
          >
            <Github size={16} />
            GitHub
          </a>
          {onLaunchApp && (
            <button onClick={onLaunchApp} className="landing-btn-primary">
              <Play size={16} />
              Launch Web Studio
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-badge">
          <Sparkles size={14} />
          High-Performance Open Source AI Coding Agent
        </div>

        <h1 className="landing-hero-title">
          100% Private Local Inference. <br />
          <span className="landing-hero-title-accent">Multi-Agent Autonomy.</span>
        </h1>

        <p className="landing-hero-subtitle">
          Engineered with native Rust <code style={{ color: '#34d399' }}>llama.cpp</code> GPU bindings, zero rate limits or token costs, hardware profiling, multi-provider cloud fallback, and event-sourced agent runtime.
        </p>

        <div className="landing-platform-selector">
          <button
            className={`landing-platform-tab ${installMethod === "mac" ? "active" : ""}`}
            onClick={() => setInstallMethod("mac")}
          >
            🍏 macOS
          </button>
          <button
            className={`landing-platform-tab ${installMethod === "linux" ? "active" : ""}`}
            onClick={() => setInstallMethod("linux")}
          >
            🐧 Linux
          </button>
          <button
            className={`landing-platform-tab ${installMethod === "windows" ? "active" : ""}`}
            onClick={() => setInstallMethod("windows")}
          >
            🪟 Windows (.exe)
          </button>
          <button
            className={`landing-platform-tab ${installMethod === "npm" ? "active" : ""}`}
            onClick={() => setInstallMethod("npm")}
          >
            📦 npm
          </button>
        </div>

        <div className="landing-hero-actions">
          <div className="landing-install-bar">
            <span>$ {getInstallCmd()}</span>
            <button
              className="landing-copy-btn"
              onClick={() => copyCommand(getInstallCmd())}
              title="Copy command"
            >
              {copiedCmd === getInstallCmd() ? (
                <Check size={16} color="#34d399" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>

          {onLaunchApp && (
            <button onClick={onLaunchApp} className="landing-btn-primary">
              <Play size={16} />
              Open Web Studio
            </button>
          )}

          {onOpenDocs && (
            <button onClick={onOpenDocs} className="landing-btn-secondary">
              <BookOpen size={16} />
              Explore Docs
            </button>
          )}
        </div>

        {/* Hero Visual */}
        <div className="landing-hero-visual">
          <img src="/hero.jpg" alt="x-cli Developer Dashboard Mockup" className="landing-preview-img" />
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="landing-section">
        <h2 className="landing-section-title">Built for Performance & Freedom</h2>
        <p className="landing-section-subtitle">
          Combine native offline model acceleration with multi-provider cloud intelligence when needed.
        </p>

        <div className="landing-grid">
          <div className="landing-card">
            <div className="landing-card-icon">
              <Cpu size={22} />
            </div>
            <h3 className="landing-card-title">Native Rust Inference Engine</h3>
            <p className="landing-card-desc">
              Custom Rust bindings to <code style={{ color: '#34d399' }}>llama.cpp</code>. Automatically profiles VRAM/RAM on startup to load optimal GGUF models on your local GPU with zero network lag or token fees.
            </p>
          </div>

          <div className="landing-card">
            <div className="landing-card-icon">
              <Shield size={22} />
            </div>
            <h3 className="landing-card-title">100% Offline & Private</h3>
            <p className="landing-card-desc">
              Your source code and conversation context never leave your workstation. Fully functional in air-gapped offline environments with local structured JSONL session persistence.
            </p>
          </div>

          <div className="landing-card">
            <div className="landing-card-icon">
              <Zap size={22} />
            </div>
            <h3 className="landing-card-title">Multi-Provider Cloud Fallback</h3>
            <p className="landing-card-desc">
              Need extra heavy reasoning? Switch seamlessly between local GGUF models and cloud API providers (OpenAI, Anthropic, NVIDIA NIM, Ollama, or custom endpoints) in real-time.
            </p>
          </div>

          <div className="landing-card">
            <div className="landing-card-icon">
              <Layers size={22} />
            </div>
            <h3 className="landing-card-title">MCP & Skills Ecosystem</h3>
            <p className="landing-card-desc">
              Supports Model Context Protocol (MCP) tool extensions, <code style={{ color: '#34d399' }}>skills.sh</code> ecosystem, and local workspace custom instructions in <code style={{ color: '#34d399' }}>.agents/skills</code>.
            </p>
          </div>

          <div className="landing-card">
            <div className="landing-card-icon">
              <Command size={22} />
            </div>
            <h3 className="landing-card-title">Automated Slash Commands</h3>
            <p className="landing-card-desc">
              Drive workflow automation with built-in commands: <code style={{ color: '#34d399' }}>/plan</code> for architecture breakdown, <code style={{ color: '#34d399' }}>/goal</code> for long-running autonomous tasks, and <code style={{ color: '#34d399' }}>/schedule</code>.
            </p>
          </div>

          <div className="landing-card">
            <div className="landing-card-icon">
              <Activity size={22} />
            </div>
            <h3 className="landing-card-title">Motel OpenTelemetry Tracing</h3>
            <p className="landing-card-desc">
              Integrated local OpenTelemetry collector (**Motel**) at <code style={{ color: '#34d399' }}>http://127.0.0.1:27686</code> for live token inspection, completion timing, and subagent span trees.
            </p>
          </div>
        </div>
      </section>

      {/* Tabbed Interactive Preview */}
      <section className="landing-section">
        <h2 className="landing-section-title">Developer Experience</h2>
        <p className="landing-section-subtitle">Inspect configuration, setup, and real-time execution in action.</p>

        <div className="landing-demo-container">
          <div className="landing-demo-header">
            <button
              className={`landing-demo-tab ${activeTab === "quickstart" ? "active" : ""}`}
              onClick={() => setActiveTab("quickstart")}
            >
              Quick Start CLI
            </button>
            <button
              className={`landing-demo-tab ${activeTab === "providers" ? "active" : ""}`}
              onClick={() => setActiveTab("providers")}
            >
              Provider Config
            </button>
            <button
              className={`landing-demo-tab ${activeTab === "mcp" ? "active" : ""}`}
              onClick={() => setActiveTab("mcp")}
            >
              MCP & Skills
            </button>
            <button
              className={`landing-demo-tab ${activeTab === "telemetry" ? "active" : ""}`}
              onClick={() => setActiveTab("telemetry")}
            >
              Session Inspection
            </button>
          </div>

          <div className="landing-demo-body">
            {activeTab === "quickstart" && (
              <>
                <div className="landing-code-comment"># Install x-cli globally and launch in your project</div>
                <div className="landing-code-line">
                  <span className="landing-code-prompt">$</span> npm install -g @x-cli/cli
                </div>
                <div className="landing-code-line">
                  <span className="landing-code-prompt">$</span> cd my-project
                </div>
                <div className="landing-code-line">
                  <span className="landing-code-prompt">$</span> x-cli
                </div>
                <br />
                <div className="landing-code-comment"># Hardware auto-profile check</div>
                <div className="landing-code-line" style={{ color: "#34d399" }}>
                  [Hardware Engine] Detected NVIDIA RTX 4090 (24 GB VRAM) — Selected Q4_K_M GGUF model
                </div>
                <div className="landing-code-line" style={{ color: "#38bdf8" }}>
                  [Worker Roles] Leader, Architect, Engineer, Scout, Critic initialized.
                </div>
              </>
            )}

            {activeTab === "providers" && (
              <>
                <div className="landing-code-comment">// ~/.x-cli/config.json — Multi-provider setup</div>
                <div className="landing-code-line">{"{"}</div>
                <div className="landing-code-line">&nbsp;&nbsp;"models": {"{"}</div>
                <div className="landing-code-line">&nbsp;&nbsp;&nbsp;&nbsp;"providers": {"{"}</div>
                <div className="landing-code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"openai": {"{ \"apiKey\": \"sk-...\" }"},</div>
                <div className="landing-code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"anthropic": {"{ \"apiKey\": \"sk-ant-...\" }"},</div>
                <div className="landing-code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"ollama": {"{ \"baseUrl\": \"http://localhost:11434/v1\" }"}</div>
                <div className="landing-code-line">&nbsp;&nbsp;&nbsp;&nbsp;{"}"}</div>
                <div className="landing-code-line">&nbsp;&nbsp;{"}"}</div>
                <div className="landing-code-line">{"}"}</div>
              </>
            )}

            {activeTab === "mcp" && (
              <>
                <div className="landing-code-comment"># Add custom skills from skills.sh or local directory</div>
                <div className="landing-code-line">
                  <span className="landing-code-prompt">$</span> npx skills add vercel-labs/agent-browser
                </div>
                <div className="landing-code-line">
                  <span className="landing-code-prompt">$</span> npx skills add anthropics/skills/xlsx
                </div>
                <br />
                <div className="landing-code-comment"># Local skill definition at .agents/skills/db-query/SKILL.md</div>
                <div className="landing-code-line" style={{ color: "#a78bfa" }}>
                  ---
                </div>
                <div className="landing-code-line" style={{ color: "#a78bfa" }}>
                  name: database-query
                </div>
                <div className="landing-code-line" style={{ color: "#a78bfa" }}>
                  description: Execute read-only SQL queries against local PostgreSQL container
                </div>
                <div className="landing-code-line" style={{ color: "#a78bfa" }}>
                  ---
                </div>
              </>
            )}

            {activeTab === "telemetry" && (
              <>
                <div className="landing-code-comment"># Inspect session history and event projections</div>
                <div className="landing-code-line">
                  <span className="landing-code-prompt">$</span> bun session list
                </div>
                <div className="landing-code-line" style={{ color: "#94a3b8" }}>
                  ID: 2026-08-11T14:30:00Z | Title: "Refactor UI system" | Events: 48
                </div>
                <br />
                <div className="landing-code-line">
                  <span className="landing-code-prompt">$</span> bun session projection &lt;id&gt; Window
                </div>
                <div className="landing-code-line" style={{ color: "#34d399" }}>
                  [Motel Collector] Telemetry active at http://127.0.0.1:27686
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Architecture Flow */}
      <section id="architecture" className="landing-section">
        <h2 className="landing-section-title">Layered Architecture</h2>
        <p className="landing-section-subtitle">
          Clean Effect-TS native layering and decoupled worker roles guarantee stability and zero side-effects.
        </p>

        <div className="landing-arch-box">
          <div className="landing-arch-flow">
            <div className="landing-arch-node">Client (CLI / Web)</div>
            <div className="landing-arch-arrow">→</div>
            <div className="landing-arch-node">client-common</div>
            <div className="landing-arch-arrow">→</div>
            <div className="landing-arch-node">SDK</div>
            <div className="landing-arch-arrow">→</div>
            <div className="landing-arch-node">ACN Server Daemon</div>
            <div className="landing-arch-arrow">→</div>
            <div className="landing-arch-node">Agent Runtime</div>
          </div>

          <div style={{ color: "#94a3b8", fontSize: "0.95rem", textAlign: "center", maxWidth: "700px", marginTop: "1rem" }}>
            Decoupled worker roles (Leader, Architect, Engineer, Scout, Critic) execute specialized projections and parallel file operations safely over RPC.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-brand">
            <div className="landing-brand-logo">X</div>
            <span>x-cli</span>
          </div>

          <div className="landing-footer-copy">
            Licensed under Apache 2.0. Built with Effect-TS & llama.cpp.
          </div>

          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a href="https://github.com/sraveshnandan/x-cli" target="_blank" rel="noopener noreferrer" className="landing-nav-link">
              GitHub
            </a>
            <a href="https://discord.gg/EHt48pPWdC" target="_blank" rel="noopener noreferrer" className="landing-nav-link">
              Discord
            </a>
            <a href="https://x.com/usemagnitude" target="_blank" rel="noopener noreferrer" className="landing-nav-link">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
