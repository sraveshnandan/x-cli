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
  Github,
  Play,
  Sparkles,
  Command,
  CheckCircle2,
  Box,
  GitBranch,
} from "lucide-react"
import "./landing.css"

interface LandingPageProps {
  onLaunchApp?: () => void
  onOpenDocs?: () => void
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp, onOpenDocs }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null)
  const [installMethod, setInstallMethod] = useState<"mac" | "linux" | "windows" | "npm">("mac")

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
      {/* Floating Header */}
      <div className="landing-header-wrap">
        <header className="landing-header">
          <a href="#" className="landing-brand">
            <div className="landing-brand-logo">
              <Terminal size={18} />
            </div>
            <span className="landing-brand-title">x-cli</span>
          </a>

          <nav className="landing-nav">
            {onOpenDocs ? (
              <button onClick={onOpenDocs} className="landing-nav-link">
                Docs
              </button>
            ) : (
              <a href="/docs" className="landing-nav-link">
                Docs
              </a>
            )}
            <a href="#features" className="landing-nav-link">
              Features
            </a>
            <a href="#quickstart" className="landing-nav-link">
              CLI
            </a>
            <a href="#architecture" className="landing-nav-link">
              Architecture
            </a>
          </nav>

          <div className="landing-nav-actions">
            {onLaunchApp && (
              <button onClick={onLaunchApp} className="landing-btn-install">
                Launch App
              </button>
            )}
            <a
              href="https://github.com/sraveshnandan/x-cli"
              target="_blank"
              rel="noreferrer"
              className="landing-nav-link"
              title="GitHub Repository"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", padding: 0 }}
            >
              <GitBranch size={16} />
            </a>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-card">
          <div className="landing-pill-badge">
            <Terminal size={13} />
            AI Coding Agent Platform
          </div>

          <h1 className="landing-hero-title">
            Build with local model intelligence and{" "}
            <span className="landing-gradient-text">multi-agent autonomy</span>.
          </h1>

          <p className="landing-hero-subtitle">
            The high-performance AI coding agent.{" "}
            <span style={{ color: "#f1f5f9", fontWeight: 500 }}>
              Profile hardware, run 100% private local Rust llama.cpp models, and switch to multi-provider cloud fallback
            </span>{" "}
            from one unified toolkit.
          </p>

          <div className="landing-hero-ctas">
            {onOpenDocs ? (
              <button onClick={onOpenDocs} className="landing-btn-primary-mcp">
                Get started <ArrowRight size={15} />
              </button>
            ) : (
              <a href="/docs" className="landing-btn-primary-mcp">
                Get started <ArrowRight size={15} />
              </a>
            )}

            {onLaunchApp && (
              <button onClick={onLaunchApp} className="landing-btn-secondary-mcp">
                <Play size={15} /> Launch Web Studio
              </button>
            )}
          </div>

          {/* Feature Pills */}
          <div className="landing-feature-pills">
            <span className="landing-feature-pill">
              <Check size={13} color="#34d399" /> Native Rust Inference
            </span>
            <span className="landing-feature-pill">
              <Check size={13} color="#34d399" /> Multi-Agent Worker Roles
            </span>
            <span className="landing-feature-pill">
              <Check size={13} color="#34d399" /> MCP & Skills Support
            </span>
            <span className="landing-feature-pill">
              <Check size={13} color="#34d399" /> bun · npm · standalone binary
            </span>
          </div>

          {/* Terminal Showcase Card */}
          <div className="landing-terminal-card">
            <div className="landing-terminal-bar">
              <span className="landing-dot dot-red"></span>
              <span className="landing-dot dot-yellow"></span>
              <span className="landing-dot dot-green"></span>
              <span className="landing-terminal-tab">
                <Sparkles size={13} /> x-cli terminal
              </span>
            </div>

            <div className="landing-terminal-body">
              <div style={{ color: "#34d399" }}>$ npm install -g @x-cli/cli</div>
              <div style={{ color: "#e2e8f0" }}>$ x-cli --workspace ./my-project</div>
              <div style={{ color: "#64748b", marginTop: "0.5rem" }}>
                [Hardware Engine] Profiling GPU & Memory headroom...
              </div>

              <div className="landing-status-cards">
                <div className="landing-status-item">
                  <CheckCircle2 size={16} color="#34d399" style={{ marginTop: "2px" }} />
                  <div>
                    <div className="landing-status-title">Hardware Profiling</div>
                    <div className="landing-status-desc">Detected NVIDIA GPU (24GB VRAM) — Loaded GGUF Q4_K_M</div>
                  </div>
                </div>

                <div className="landing-status-item">
                  <CheckCircle2 size={16} color="#34d399" style={{ marginTop: "2px" }} />
                  <div>
                    <div className="landing-status-title">Multi-Agent Autonomy</div>
                    <div className="landing-status-desc">Leader, Architect, Engineer, Scout & Critic online</div>
                  </div>
                </div>

                <div className="landing-status-item">
                  <CheckCircle2 size={16} color="#34d399" style={{ marginTop: "2px" }} />
                  <div>
                    <div className="landing-status-title">MCP & Skills Ecosystem</div>
                    <div className="landing-status-desc">Loaded skills from .agents/skills & skills.sh</div>
                  </div>
                </div>

                <div className="landing-status-item">
                  <CheckCircle2 size={16} color="#34d399" style={{ marginTop: "2px" }} />
                  <div>
                    <div className="landing-status-title">Motel Telemetry Active</div>
                    <div className="landing-status-desc">Tracing live at http://127.0.0.1:27686</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="landing-section">
        <div className="landing-section-header">
          <h2 className="landing-section-title">Built for Performance & Privacy</h2>
          <p className="landing-section-subtitle">
            Zero token costs, native offline model loading, and multi-provider fallback.
          </p>
        </div>

        <div className="landing-cards-grid">
          <div className="landing-feature-card">
            <div className="landing-card-icon-wrap">
              <Cpu size={20} />
            </div>
            <h3 style={{ fontSize: "1.15rem", color: "#ffffff", fontWeight: 600 }}>
              Native Rust Inference Engine
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.92rem", lineHeight: 1.6 }}>
              Powered by native Rust bindings to <code style={{ color: "#34d399" }}>llama.cpp</code>. Automatically profiles VRAM & RAM to load optimal local models.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-card-icon-wrap">
              <Shield size={20} />
            </div>
            <h3 style={{ fontSize: "1.15rem", color: "#ffffff", fontWeight: 600 }}>
              100% Air-Gapped Privacy
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.92rem", lineHeight: 1.6 }}>
              No prompts or source code leave your machine when executing locally. Structured JSONL logs persist turns safely.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-card-icon-wrap">
              <Zap size={20} />
            </div>
            <h3 style={{ fontSize: "1.15rem", color: "#ffffff", fontWeight: 600 }}>
              Multi-Provider Cloud Fallback
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.92rem", lineHeight: 1.6 }}>
              Switch seamlessly between local GGUF models and cloud providers (OpenAI, Anthropic, NVIDIA, Ollama, custom endpoints).
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-card-icon-wrap">
              <Layers size={20} />
            </div>
            <h3 style={{ fontSize: "1.15rem", color: "#ffffff", fontWeight: 600 }}>
              MCP & Skills System
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.92rem", lineHeight: 1.6 }}>
              Supports Model Context Protocol (MCP) tool extensions, <code style={{ color: "#34d399" }}>skills.sh</code>, and custom workspace skills.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-card-icon-wrap">
              <Command size={20} />
            </div>
            <h3 style={{ fontSize: "1.15rem", color: "#ffffff", fontWeight: 600 }}>
              Slash Commands
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.92rem", lineHeight: 1.6 }}>
              Drive workflow automation with <code style={{ color: "#34d399" }}>/plan</code>, <code style={{ color: "#34d399" }}>/goal</code>, <code style={{ color: "#34d399" }}>/schedule</code>, and <code style={{ color: "#34d399" }}>/learn</code>.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-card-icon-wrap">
              <Activity size={20} />
            </div>
            <h3 style={{ fontSize: "1.15rem", color: "#ffffff", fontWeight: 600 }}>
              Motel OpenTelemetry Tracing
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.92rem", lineHeight: 1.6 }}>
              Integrated local OpenTelemetry collector at <code style={{ color: "#34d399" }}>http://127.0.0.1:27686</code> for live token & subagent span inspection.
            </p>
          </div>
        </div>
      </section>

      {/* Quickstart / Install Selector */}
      <section id="quickstart" className="landing-section">
        <div className="landing-install-card">
          <h2 className="landing-section-title">Install & Get Started</h2>
          <p className="landing-section-subtitle" style={{ marginBottom: "1.5rem" }}>
            Choose your platform or package manager:
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

          <div className="landing-install-bar-mcp">
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
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-brand">
            <div className="landing-brand-logo">
              <Terminal size={18} />
            </div>
            <span className="landing-brand-title">x-cli</span>
          </div>

          <div style={{ color: "#64748b", fontSize: "0.88rem" }}>
            Licensed under Apache 2.0. Built with Effect-TS & llama.cpp.
          </div>

          <div style={{ display: "flex", gap: "1.25rem" }}>
            <a href="https://github.com/sraveshnandan/x-cli" target="_blank" rel="noreferrer" className="landing-nav-link">
              GitHub
            </a>
            {onOpenDocs ? (
              <button onClick={onOpenDocs} className="landing-nav-link">
                Docs
              </button>
            ) : (
              <a href="/docs" className="landing-nav-link">
                Docs
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
