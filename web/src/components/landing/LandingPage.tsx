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
  ChevronDown,
  Lock,
  HardDrive,
  FileText,
  Search,
  Sliders,
  Share2,
  Download,
} from "lucide-react"
import "./landing.css"

interface LandingPageProps {
  onLaunchApp?: () => void
  onOpenDocs?: () => void
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp, onOpenDocs }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null)
  const [installMethod, setInstallMethod] = useState<"mac" | "linux" | "windows" | "npm" | "bun">("mac")

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd)
    setCopiedCmd(cmd)
    setTimeout(() => setCopiedCmd(null), 2000)
  }

  const getInstallCmd = () => {
    switch (installMethod) {
      case "mac":
        return "curl -fsSL https://raw.githubusercontent.com/sraveshnandan/x-cli/master/install.sh | bash"
      case "linux":
        return "curl -fsSL https://raw.githubusercontent.com/sraveshnandan/x-cli/master/install.sh | bash"
      case "windows":
        return "powershell -c \"irm https://raw.githubusercontent.com/sraveshnandan/x-cli/master/install.ps1 | iex\""
      case "npm":
        return "npm install -g @x-cli/cli"
      case "bun":
        return "bun install -g @x-cli/cli"
    }
  }

  const handleDocsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onOpenDocs) {
      onOpenDocs()
    } else {
      window.location.href = "/docs"
    }
  }

  return (
    <div className="landing-container">
      {/* Navigation Header */}
      <header className="landing-header">
        <a href="#" className="landing-brand">
          <Terminal size={22} color="#60a5fa" />
          <span>x-cli</span>
          <span className="landing-brand-badge">v1.0</span>
        </a>

        <nav className="landing-nav">
          <button onClick={handleDocsClick} className="landing-nav-link">
            Docs
          </button>
          <a href="#integrated-system" className="landing-nav-link">
            Architecture
          </a>
          <a href="#usecases" className="landing-nav-link">
            Use Cases
          </a>
          <a href="#faq" className="landing-nav-link">
            FAQ
          </a>
          {onLaunchApp && (
            <button onClick={onLaunchApp} className="landing-nav-link" style={{ color: "#60a5fa", fontWeight: 600 }}>
              Launch Studio
            </button>
          )}
        </nav>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <a
            href="https://discord.gg/EHt48pPWdC"
            target="_blank"
            rel="noopener noreferrer"
            className="landing-btn-discord"
          >
            Discord
          </a>
          <a
            href="https://github.com/sraveshnandan/x-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="landing-btn-github"
          >
            <Github size={16} />
            GitHub
          </a>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="landing-section" style={{ paddingTop: "6rem", textAlign: "center" }}>
        <h1 className="landing-hero-title">Your actually local agent</h1>
        <p className="landing-hero-subtitle">
          Built on local models, 100% private and offline. Analyze sensitive data, manage private notes, review code and logs.
        </p>

        {/* Platform Tabs & Install Box — Redesigned to fix user screenshot */}
        <div style={{ maxWidth: "36rem", margin: "0 auto 1.5rem" }}>
          <div className="landing-tabs-wrap">
            <button
              className={`landing-tab-btn ${installMethod === "mac" ? "active" : ""}`}
              onClick={() => setInstallMethod("mac")}
            >
              🍏 macOS
            </button>
            <button
              className={`landing-tab-btn ${installMethod === "linux" ? "active" : ""}`}
              onClick={() => setInstallMethod("linux")}
            >
              🐧 Linux
            </button>
            <button
              className={`landing-tab-btn ${installMethod === "windows" ? "active" : ""}`}
              onClick={() => setInstallMethod("windows")}
            >
              🪟 Windows (.exe)
            </button>
            <button
              className={`landing-tab-btn ${installMethod === "npm" ? "active" : ""}`}
              onClick={() => setInstallMethod("npm")}
            >
              📦 npm
            </button>
            <button
              className={`landing-tab-btn ${installMethod === "bun" ? "active" : ""}`}
              onClick={() => setInstallMethod("bun")}
            >
              🥟 bun
            </button>
          </div>

          <div className="landing-install-box">
            <code className="landing-install-code">$ {getInstallCmd()}</code>
            <button
              className="landing-copy-icon-btn"
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

        <p style={{ fontSize: "0.82rem", color: "#94a3b8", fontFamily: "var(--font-mono)", marginBottom: "2rem" }}>
          Open source · Apache 2.0 · macOS / Linux / Windows
        </p>

        {/* Binary Download Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "3.5rem" }}>
          {installMethod === "mac" && (
            <>
              <a
                href="https://github.com/sraveshnandan/x-cli/releases/latest/download/x-cli-cli-darwin-arm64.tar.gz"
                className="landing-dl-btn"
              >
                <Download size={14} /> macOS Apple Silicon (.tar.gz)
              </a>
              <a
                href="https://github.com/sraveshnandan/x-cli/releases/latest/download/x-cli-cli-darwin-x64.tar.gz"
                className="landing-dl-btn"
              >
                <Download size={14} /> macOS Intel (.tar.gz)
              </a>
            </>
          )}
          {installMethod === "linux" && (
            <>
              <a
                href="https://github.com/sraveshnandan/x-cli/releases/latest/download/x-cli-cli-linux-x64-gnu.tar.gz"
                className="landing-dl-btn"
              >
                <Download size={14} /> Linux x86_64 (.tar.gz)
              </a>
              <a
                href="https://github.com/sraveshnandan/x-cli/releases/latest/download/x-cli-cli-linux-arm64-gnu.tar.gz"
                className="landing-dl-btn"
              >
                <Download size={14} /> Linux ARM64 (.tar.gz)
              </a>
            </>
          )}
          {installMethod === "windows" && (
            <a
              href="https://github.com/sraveshnandan/x-cli/releases/latest/download/x-cli-cli-windows-x64-msvc.exe"
              className="landing-dl-btn"
            >
              <Download size={14} /> Windows Executable (.exe)
            </a>
          )}
          {onLaunchApp && (
            <button onClick={onLaunchApp} className="landing-dl-btn" style={{ borderColor: "#3b82f6", color: "#60a5fa" }}>
              <Play size={14} /> Open Web Studio
            </button>
          )}
        </div>

        {/* Hero Visual Mockup */}
        <div style={{ borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)", overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.6)" }}>
          <img src="/hero.jpg" alt="x-cli agent demonstration dashboard" style={{ width: "100%", height: "auto", display: "block" }} />
        </div>
      </section>

      {/* SECTION 2: INTEGRATED ARCHITECTURE SYSTEM */}
      <section id="integrated-system" className="landing-section landing-section-border">
        <div style={{ maxWidth: "54rem", margin: "0 auto", textAlign: "left" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.035em", marginBottom: "1rem" }}>
            Today's agents are local. The model isn't.
          </h2>
          <p style={{ fontSize: "1.15rem", color: "#cbd5e1", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Every prompt, every file, every secret gets sent to a datacenter. x-cli runs the whole stack itself. The inference engine is part of the agent, so the models run inside it, right on your machine.
          </p>

          {/* Comparison Figure */}
          <div className="landing-comparison-grid">
            <div className="landing-comp-box-left">
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                TODAY'S AGENTS
              </span>
              <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "1rem", minHeight: "120px" }}>
                <div style={{ padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(0,0,0,0.2)", color: "#64748b" }}>
                  <HardDrive size={32} />
                </div>
                <div style={{ flex: 1, textAlign: "center", color: "#64748b", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
                  <div>─────────►</div>
                  <div style={{ marginTop: "0.25rem" }}>prompts, files, secrets</div>
                </div>
                <div style={{ padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)", background: "rgba(0,0,0,0.2)", color: "#64748b", textAlign: "center" }}>
                  <Share2 size={32} />
                  <div style={{ fontSize: "0.65rem", marginTop: "0.25rem" }}>Datacenter</div>
                </div>
              </div>
            </div>

            <div className="landing-comp-box-right">
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "#60a5fa", letterSpacing: "0.08em" }}>
                X-CLI PLATFORM
              </span>
              <div style={{ marginTop: "2rem", minHeight: "120px", display: "flex", alignItems: "center" }}>
                <div style={{ width: "100%", borderRadius: "12px", border: "1px solid rgba(96, 165, 250, 0.35)", background: "rgba(30, 58, 138, 0.2)", padding: "1.25rem" }}>
                  <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#60a5fa", marginBottom: "0.75rem" }}>
                    🔒 YOUR WORKSTATION (AIR-GAPPED)
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid rgba(96, 165, 250, 0.3)", background: "rgba(59, 130, 246, 0.15)", color: "#ffffff", fontWeight: 600, textAlign: "center", fontSize: "0.9rem" }}>
                      Agent Runtime
                    </div>
                    <div style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid rgba(96, 165, 250, 0.3)", background: "rgba(59, 130, 246, 0.15)", color: "#ffffff", fontWeight: 600, textAlign: "center", fontSize: "0.9rem" }}>
                      Local Llama Model
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: USE CASES GRID */}
      <section id="usecases" className="landing-section landing-section-border">
        <div style={{ maxWidth: "54rem", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.035em", marginBottom: "0.75rem" }}>
            Use it for everyday work.
          </h2>
          <p style={{ fontSize: "1.15rem", color: "#cbd5e1", lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Out of the box, x-cli can use your shell, edit files, and run scripts. Add skills and it can work with Excel, PowerPoint, PDFs, or Chrome.
          </p>

          <div className="landing-usecases-grid">
            <div className="landing-usecase-item">
              <Shield size={26} color="#60a5fa" />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#ffffff", marginTop: "1rem" }}>
                Analyze sensitive data
              </h3>
            </div>
            <div className="landing-usecase-item">
              <FileText size={26} color="#60a5fa" />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#ffffff", marginTop: "1rem" }}>
                Manage private notes
              </h3>
            </div>
            <div className="landing-usecase-item">
              <Code2 size={26} color="#60a5fa" />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#ffffff", marginTop: "1rem" }}>
                Review code and logs
              </h3>
            </div>
            <div className="landing-usecase-item">
              <Search size={26} color="#60a5fa" />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#ffffff", marginTop: "1rem" }}>
                Search and organize files
              </h3>
            </div>
            <div className="landing-usecase-item">
              <Sliders size={26} color="#60a5fa" />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#ffffff", marginTop: "1rem" }}>
                Build docs or slides
              </h3>
            </div>
            <div className="landing-usecase-item">
              <Terminal size={26} color="#60a5fa" />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#ffffff", marginTop: "1rem" }}>
                Create automation scripts
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: FAQ */}
      <section id="faq" className="landing-section">
        <div style={{ maxWidth: "42rem", margin: "0 auto", textAlign: "left" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "2rem" }}>
            Frequently Asked Questions
          </h2>

          <details className="landing-faq-item">
            <summary className="landing-faq-summary">
              <span>What is x-cli?</span>
              <ChevronDown size={18} />
            </summary>
            <div className="landing-faq-answer">
              x-cli is a high-performance open-source AI coding agent built with native local model support (`llama.cpp`) and multi-provider cloud connectivity. It runs 100% private and offline on your machine.
            </div>
          </details>

          <details className="landing-faq-item">
            <summary className="landing-faq-summary">
              <span>What hardware do I need?</span>
              <ChevronDown size={18} />
            </summary>
            <div className="landing-faq-answer">
              There is no strict minimum. x-cli profiles your workstation GPU VRAM and System RAM to automatically recommend and load optimal GGUF models.
            </div>
          </details>

          <details className="landing-faq-item">
            <summary className="landing-faq-summary">
              <span>Does my data ever go to the cloud?</span>
              <ChevronDown size={18} />
            </summary>
            <div className="landing-faq-answer">
              No. When executing local hardware models, every prompt, source file, and secret stays strictly on your machine.
            </div>
          </details>

          <details className="landing-faq-item">
            <summary className="landing-faq-summary">
              <span>Do I need Ollama or another external server?</span>
              <ChevronDown size={18} />
            </summary>
            <div className="landing-faq-answer">
              No. x-cli embeds its own native Rust inference engine to manage GGUF model downloads, GPU memory offload, and hardware acceleration automatically.
            </div>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-brand">
            <Terminal size={20} color="#60a5fa" />
            <span>x-cli</span>
          </div>

          <div style={{ color: "#64748b", fontSize: "0.88rem" }}>
            Apache 2.0 Licensed · Built with Effect-TS & llama.cpp
          </div>

          <div style={{ display: "flex", gap: "1.25rem" }}>
            <button onClick={handleDocsClick} className="landing-nav-link">
              Docs
            </button>
            <a href="https://github.com/sraveshnandan/x-cli" target="_blank" rel="noopener noreferrer" className="landing-nav-link">
              GitHub
            </a>
            <a href="https://discord.gg/EHt48pPWdC" target="_blank" rel="noopener noreferrer" className="landing-nav-link">
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
