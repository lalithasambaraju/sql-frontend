import { useState } from "react";

const ACTIONS = [
  { key: "explain", label: "Explain", icon: "💡", desc: "Understand your query in plain English" },
  { key: "optimize", label: "Optimize", icon: "⚡", desc: "Boost query performance" },
  { key: "errors", label: "Debug", icon: "🔍", desc: "Find and fix errors" },
  { key: "generate", label: "Generate", icon: "✨", desc: "Write SQL from description" },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-base: #0a0d12;
    --bg-surface: #111620;
    --bg-elevated: #181e2a;
    --bg-hover: #1e2536;
    --border: #242c3d;
    --border-bright: #2e3a50;
    --accent: #00d4ff;
    --accent-dim: rgba(0, 212, 255, 0.12);
    --accent-glow: rgba(0, 212, 255, 0.25);
    --green: #00e5a0;
    --green-dim: rgba(0, 229, 160, 0.1);
    --red: #ff5c7a;
    --text-primary: #e8edf5;
    --text-secondary: #8896ac;
    --text-muted: #4a5568;
    --font-ui: 'Outfit', sans-serif;
    --font-code: 'JetBrains Mono', monospace;
  }

  body {
    font-family: var(--font-ui);
    background: var(--bg-base);
    color: var(--text-primary);
    min-height: 100vh;
    overflow: hidden;
  }

  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg-base);
    position: relative;
  }

  .app::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .app > * { position: relative; z-index: 1; }

  .nav {
    height: 56px;
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border);
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }

  .nav-brand { display: flex; align-items: center; gap: 12px; }

  .nav-logo {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #0a1628, #0d2045);
    border: 1px solid var(--accent);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    box-shadow: 0 0 12px var(--accent-glow), inset 0 1px 0 rgba(0,212,255,0.1);
  }

  .nav-title { font-size: 1rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.2px; }

  .nav-dot {
    width: 5px; height: 5px;
    background: var(--accent); border-radius: 50%;
    box-shadow: 0 0 8px var(--accent);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .nav-powered { font-size: 0.7rem; color: var(--text-muted); font-weight: 400; }
  .nav-powered span { color: var(--accent); font-weight: 500; }

  .history-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 7px 16px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-bright);
    border-radius: 8px;
    font-size: 0.78rem; font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer; font-family: var(--font-ui);
    transition: all 0.2s;
  }

  .history-btn:hover {
    border-color: var(--accent); color: var(--accent);
    background: var(--accent-dim);
    box-shadow: 0 0 12px var(--accent-glow);
  }

  .badge {
    background: var(--accent); color: #000;
    border-radius: 10px; padding: 1px 7px;
    font-size: 0.68rem; font-weight: 700;
  }

  .action-bar {
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border);
    padding: 0 24px;
    display: flex; gap: 2px;
    flex-shrink: 0;
  }

  .action-tab {
    display: flex; align-items: center; gap: 7px;
    padding: 11px 20px;
    border: none; background: transparent;
    cursor: pointer; font-family: var(--font-ui);
    font-size: 0.82rem; font-weight: 500;
    color: var(--text-muted);
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    position: relative; top: 1px;
  }

  .action-tab:hover { color: var(--text-secondary); background: var(--bg-hover); }
  .action-tab.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }

  .main { display: flex; flex: 1; overflow: hidden; }

  .left-panel {
    width: 46%;
    display: flex; flex-direction: column;
    border-right: 1px solid var(--border);
    background: var(--bg-surface);
  }

  .panel-header {
    padding: 14px 20px 10px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }

  .panel-label {
    font-size: 0.68rem; font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 1.2px;
  }

  .char-count { font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-code); }

  .editor-area {
    flex: 1; padding: 20px;
    overflow-y: auto; position: relative;
  }

  .editor-area::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: linear-gradient(to bottom, var(--accent), transparent 60%);
    opacity: 0.3;
  }

  .sql-textarea {
    width: 100%; height: 100%; min-height: 280px;
    border: none; outline: none; resize: none;
    font-family: var(--font-code);
    font-size: 0.84rem; line-height: 1.75;
    color: #c9d4e8; background: transparent;
    caret-color: var(--accent);
  }

  .sql-textarea::placeholder { color: var(--text-muted); opacity: 0.7; }

  .left-footer {
    padding: 14px 20px;
    border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    background: var(--bg-base);
  }

  .footer-left { display: flex; align-items: center; gap: 10px; }

  .error-msg { font-size: 0.75rem; color: var(--red); display: flex; align-items: center; gap: 5px; }

  .clear-btn {
    padding: 6px 12px; background: transparent;
    border: 1px solid var(--border-bright); border-radius: 6px;
    font-family: var(--font-ui); font-size: 0.75rem;
    color: var(--text-muted); cursor: pointer; transition: all 0.2s;
  }

  .clear-btn:hover { border-color: var(--red); color: var(--red); background: rgba(255,92,122,0.08); }

  .submit-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 22px;
    background: linear-gradient(135deg, #00b8d9, #00d4ff);
    color: #000; border: none; border-radius: 8px;
    font-family: var(--font-ui); font-size: 0.83rem; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 0 16px var(--accent-glow), 0 2px 8px rgba(0,0,0,0.3);
  }

  .submit-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #00d4ff, #40e0ff);
    box-shadow: 0 0 24px var(--accent-glow), 0 4px 12px rgba(0,0,0,0.4);
    transform: translateY(-1px);
  }

  .submit-btn:disabled {
    background: #1a2535; color: var(--text-muted);
    cursor: not-allowed; box-shadow: none; transform: none;
    border: 1px solid var(--border);
  }

  .spinner {
    width: 13px; height: 13px;
    border: 2px solid rgba(0,0,0,0.2); border-top-color: #000;
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .right-panel { flex: 1; display: flex; flex-direction: column; background: var(--bg-base); }

  .result-header {
    padding: 14px 20px 10px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    background: var(--bg-surface);
  }

  .result-meta { display: flex; align-items: center; gap: 10px; }

  .result-badge {
    font-size: 0.68rem; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
    background: var(--accent-dim); color: var(--accent);
    border: 1px solid rgba(0,212,255,0.2);
  }

  .copy-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 12px;
    background: var(--bg-elevated); border: 1px solid var(--border-bright);
    border-radius: 6px; font-family: var(--font-ui);
    font-size: 0.73rem; font-weight: 500;
    color: var(--text-secondary); cursor: pointer; transition: all 0.2s;
  }

  .copy-btn:hover { border-color: var(--green); color: var(--green); background: var(--green-dim); }

  .result-body { flex: 1; padding: 24px; overflow-y: auto; }

  .result-text {
    font-family: var(--font-code);
    font-size: 0.82rem; line-height: 1.85;
    color: #b8c8e0; white-space: pre-wrap; word-break: break-word;
  }

  .empty-state {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    height: 100%; gap: 14px; padding: 40px;
  }

  .empty-icon-wrap {
    width: 64px; height: 64px; border-radius: 16px;
    background: var(--bg-elevated); border: 1px solid var(--border-bright);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem;
    box-shadow: 0 0 20px rgba(0,212,255,0.05);
  }

  .empty-title { font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); }

  .empty-desc {
    font-size: 0.78rem; color: var(--text-muted);
    max-width: 200px; text-align: center; line-height: 1.65;
  }

  .empty-hint {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: 20px; font-size: 0.72rem; color: var(--text-muted);
    margin-top: 4px;
  }

  .loading-state {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    height: 100%; gap: 20px;
  }

  .loading-orb {
    width: 48px; height: 48px; border-radius: 50%;
    background: radial-gradient(circle, var(--accent-dim), transparent);
    border: 1px solid rgba(0,212,255,0.3);
    display: flex; align-items: center; justify-content: center;
    animation: orbPulse 1.5s ease-in-out infinite;
  }

  @keyframes orbPulse {
    0%, 100% { box-shadow: 0 0 0 0 var(--accent-glow); transform: scale(1); }
    50% { box-shadow: 0 0 0 12px transparent; transform: scale(1.05); }
  }

  .loading-bar { width: 180px; height: 2px; background: var(--border); border-radius: 2px; overflow: hidden; }

  .loading-fill {
    height: 100%;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite;
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .loading-text { font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-code); }

  .history-panel {
    position: fixed; top: 56px; right: 0;
    width: 360px; height: calc(100vh - 56px);
    background: var(--bg-surface); border-left: 1px solid var(--border-bright);
    box-shadow: -8px 0 40px rgba(0,0,0,0.5);
    display: flex; flex-direction: column;
    z-index: 100; animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .history-head {
    padding: 18px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }

  .history-title { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
  .history-actions { display: flex; gap: 8px; align-items: center; }

  .close-btn {
    width: 28px; height: 28px;
    background: var(--bg-elevated); border: 1px solid var(--border-bright);
    border-radius: 6px; cursor: pointer; font-size: 0.8rem;
    color: var(--text-secondary);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }

  .close-btn:hover { border-color: var(--red); color: var(--red); background: rgba(255,92,122,0.08); }

  .clear-hist-btn {
    padding: 4px 10px; background: transparent;
    border: 1px solid var(--border-bright); border-radius: 6px;
    font-size: 0.7rem; color: var(--text-muted);
    cursor: pointer; font-family: var(--font-ui); font-weight: 500; transition: all 0.15s;
  }

  .clear-hist-btn:hover { border-color: var(--red); color: var(--red); background: rgba(255,92,122,0.08); }

  .history-list { flex: 1; overflow-y: auto; padding: 12px; }

  .history-item {
    padding: 14px; border-radius: 10px;
    border: 1px solid var(--border); margin-bottom: 8px;
    cursor: pointer; transition: all 0.2s;
    background: var(--bg-elevated);
  }

  .history-item:hover {
    border-color: var(--accent); background: var(--accent-dim);
    transform: translateX(-3px); box-shadow: 4px 0 0 var(--accent);
  }

  .hist-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 9px; }

  .hist-badge {
    font-size: 0.66rem; font-weight: 700; padding: 2px 9px;
    border-radius: 12px; background: var(--accent-dim); color: var(--accent);
    border: 1px solid rgba(0,212,255,0.15);
  }

  .hist-time { font-size: 0.66rem; color: var(--text-muted); font-family: var(--font-code); }

  .hist-query {
    font-family: var(--font-code); font-size: 0.72rem;
    color: var(--text-secondary); white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis; margin-bottom: 7px;
    background: var(--bg-base); padding: 6px 9px;
    border-radius: 5px; border: 1px solid var(--border);
  }

  .hist-preview {
    font-size: 0.73rem; color: var(--text-muted); line-height: 1.5;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }

  .empty-hist {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    height: 200px; color: var(--text-muted); gap: 8px; font-size: 0.8rem;
  }

  .toast {
    position: fixed; bottom: 24px; right: 24px;
    background: var(--green); color: #000;
    padding: 10px 18px; border-radius: 8px;
    font-size: 0.78rem; font-weight: 700;
    box-shadow: 0 0 20px rgba(0,229,160,0.4), 0 4px 12px rgba(0,0,0,0.3);
    animation: fadeInUp 0.2s ease; z-index: 200;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-bright); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
`;

export default function App() {
  const [action, setAction] = useState("explain");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  const handleSubmit = async () => {
    if (!query.trim()) { setError("Please enter a SQL query or description."); return; }
    setError(""); setResult(""); setLoading(true);
    try {
      const response = await fetch("https://web-production-390c3.up.railway.app/api/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, query }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result);
        setActiveAction(action);
        setHistory((prev) => [{
          id: Date.now(), action, query, result: data.result,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }, ...prev]);
      }
    } catch (err) {
      setError("Cannot connect to backend. Make sure Flask is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadFromHistory = (item) => {
    setAction(item.action); setQuery(item.query);
    setResult(item.result); setActiveAction(item.action);
    setShowHistory(false);
  };

  const currentAction = ACTIONS.find((a) => a.key === action);

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-brand">
            <div className="nav-logo">🛢️</div>
            <span className="nav-title">SQL Assistant</span>
            <div className="nav-dot" />
            <span className="nav-powered">powered by <span>Claude AI</span></span>
          </div>
          <button className="history-btn" onClick={() => setShowHistory(!showHistory)}>
            📋 History
            {history.length > 0 && <span className="badge">{history.length}</span>}
          </button>
        </nav>

        <div className="action-bar">
          {ACTIONS.map((a) => (
            <button key={a.key} className={`action-tab ${action === a.key ? "active" : ""}`}
              onClick={() => { setAction(a.key); setError(""); }}>
              {a.icon} {a.label}
            </button>
          ))}
        </div>

        <div className="main">
          <div className="left-panel">
            <div className="panel-header">
              <span className="panel-label">{action === "generate" ? "Description" : "SQL Editor"}</span>
              <span className="char-count">{query.length} chars</span>
            </div>
            <div className="editor-area">
              <textarea className="sql-textarea" value={query}
                onChange={(e) => { setQuery(e.target.value); setError(""); }}
                placeholder={action === "generate"
                  ? "Describe what you want...\n\ne.g. Get all customers who haven't placed an order in the last 90 days, along with their email and total spend."
                  : "Paste your SQL query here...\n\nSELECT\n    u.name,\n    COUNT(o.id) AS order_count\nFROM users u\nLEFT JOIN orders o\n    ON u.id = o.user_id\nGROUP BY u.id\nHAVING COUNT(o.id) > 5"
                }
              />
            </div>
            <div className="left-footer">
              <div className="footer-left">
                {query && <button className="clear-btn" onClick={() => { setQuery(""); setResult(""); setError(""); }}>Clear</button>}
                {error && <span className="error-msg">⚠ {error}</span>}
              </div>
              <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? <><div className="spinner" /> Processing...</> : <>{currentAction?.icon} {currentAction?.label}</>}
              </button>
            </div>
          </div>

          <div className="right-panel">
            {loading ? (
              <div className="loading-state">
                <div className="loading-orb">✨</div>
                <div className="loading-bar"><div className="loading-fill" /></div>
                <span className="loading-text">claude is thinking_</span>
              </div>
            ) : result ? (
              <>
                <div className="result-header">
                  <div className="result-meta">
                    <span className="panel-label">Output</span>
                    {activeAction && (
                      <span className="result-badge">
                        {ACTIONS.find((a) => a.key === activeAction)?.icon}{" "}
                        {ACTIONS.find((a) => a.key === activeAction)?.label}
                      </span>
                    )}
                  </div>
                  <button className="copy-btn" onClick={handleCopy}>
                    {copied ? "✓ Copied" : "⎘ Copy"}
                  </button>
                </div>
                <div className="result-body">
                  <pre className="result-text">{result}</pre>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon-wrap">{currentAction?.icon}</div>
                <div className="empty-title">{currentAction?.label}</div>
                <div className="empty-desc">{currentAction?.desc}</div>
                <div className="empty-hint">← paste query and hit submit</div>
              </div>
            )}
          </div>
        </div>

        {showHistory && (
          <div className="history-panel">
            <div className="history-head">
              <span className="history-title">Query History</span>
              <div className="history-actions">
                {history.length > 0 && <button className="clear-hist-btn" onClick={() => setHistory([])}>Clear all</button>}
                <button className="close-btn" onClick={() => setShowHistory(false)}>✕</button>
              </div>
            </div>
            <div className="history-list">
              {history.length === 0 ? (
                <div className="empty-hist"><span>📭</span><span>No history yet</span></div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="history-item" onClick={() => loadFromHistory(item)}>
                    <div className="hist-meta">
                      <span className="hist-badge">
                        {ACTIONS.find((a) => a.key === item.action)?.icon}{" "}
                        {ACTIONS.find((a) => a.key === item.action)?.label}
                      </span>
                      <span className="hist-time">{item.timestamp}</span>
                    </div>
                    <div className="hist-query">{item.query.slice(0, 55)}{item.query.length > 55 ? "..." : ""}</div>
                    <div className="hist-preview">{item.result.slice(0, 100)}...</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {copied && <div className="toast">✓ Copied to clipboard</div>}
      </div>
    </>
  );
}