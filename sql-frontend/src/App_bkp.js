import { useState } from "react";

const ACTIONS = [
  { key: "explain", label: "Explain", icon: "💡", desc: "Plain English explanation" },
  { key: "optimize", label: "Optimize", icon: "⚡", desc: "Performance improvements" },
  { key: "errors", label: "Debug", icon: "🔍", desc: "Find & fix errors" },
  { key: "generate", label: "Generate", icon: "✨", desc: "Write from description" },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Sora', sans-serif;
    background: #f0f2f5;
    min-height: 100vh;
  }

  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  /* Top Nav */
  .nav {
    background: #ffffff;
    border-bottom: 1px solid #e4e7ec;
    padding: 0 32px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .nav-logo {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #0f4c81, #1a73e8);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .nav-title {
    font-size: 1rem;
    font-weight: 700;
    color: #0d1b2a;
    letter-spacing: -0.3px;
  }

  .nav-subtitle {
    font-size: 0.7rem;
    color: #8a94a6;
    font-weight: 400;
    margin-left: 4px;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .history-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    background: #f5f7fa;
    border: 1px solid #e4e7ec;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 500;
    color: #4a5568;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    transition: all 0.15s;
  }

  .history-btn:hover {
    background: #eef0f4;
    border-color: #d0d5dd;
  }

  .badge {
    background: #1a73e8;
    color: white;
    border-radius: 10px;
    padding: 1px 7px;
    font-size: 0.7rem;
    font-weight: 600;
  }

  /* Action Tabs */
  .action-bar {
    background: #ffffff;
    border-bottom: 1px solid #e4e7ec;
    padding: 0 32px;
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }

  .action-tab {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 12px 18px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    color: #6b7280;
    border-bottom: 2px solid transparent;
    transition: all 0.15s;
    position: relative;
    top: 1px;
  }

  .action-tab:hover {
    color: #1a73e8;
    background: #f0f6ff;
  }

  .action-tab.active {
    color: #1a73e8;
    border-bottom-color: #1a73e8;
    font-weight: 600;
  }

  .tab-icon { font-size: 0.9rem; }

  /* Main split layout */
  .main {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* Left Panel */
  .left-panel {
    width: 48%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e4e7ec;
    background: #ffffff;
  }

  .panel-header {
    padding: 16px 24px 12px;
    border-bottom: 1px solid #f0f2f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .panel-label {
    font-size: 0.72rem;
    font-weight: 600;
    color: #8a94a6;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .char-count {
    font-size: 0.72rem;
    color: #b0b8c4;
    font-family: 'IBM Plex Mono', monospace;
  }

  .editor-area {
    flex: 1;
    padding: 20px 24px;
    overflow-y: auto;
  }

  .sql-textarea {
    width: 100%;
    height: 100%;
    min-height: 300px;
    border: none;
    outline: none;
    resize: none;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.85rem;
    line-height: 1.7;
    color: #1a2332;
    background: transparent;
    caret-color: #1a73e8;
  }

  .sql-textarea::placeholder {
    color: #c4cdd6;
  }

  .left-footer {
    padding: 16px 24px;
    border-top: 1px solid #f0f2f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fafbfc;
  }

  .error-msg {
    font-size: 0.78rem;
    color: #e53e3e;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .submit-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    background: #1a73e8;
    color: white;
    border: none;
    border-radius: 8px;
    font-family: 'Sora', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    box-shadow: 0 1px 3px rgba(26,115,232,0.3);
  }

  .submit-btn:hover:not(:disabled) {
    background: #1557b0;
    box-shadow: 0 3px 8px rgba(26,115,232,0.35);
    transform: translateY(-1px);
  }

  .submit-btn:disabled {
    background: #93b8f5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .clear-btn {
    padding: 8px 14px;
    background: transparent;
    border: 1px solid #e4e7ec;
    border-radius: 8px;
    font-family: 'Sora', sans-serif;
    font-size: 0.78rem;
    color: #8a94a6;
    cursor: pointer;
    transition: all 0.15s;
  }

  .clear-btn:hover {
    background: #f5f7fa;
    color: #4a5568;
  }

  /* Spinner */
  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* Right Panel */
  .right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f8f9fb;
  }

  .result-header {
    padding: 16px 24px 12px;
    border-bottom: 1px solid #e4e7ec;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
  }

  .result-meta {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .result-badge {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    background: #e8f0fe;
    color: #1a73e8;
  }

  .copy-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 14px;
    background: white;
    border: 1px solid #e4e7ec;
    border-radius: 7px;
    font-family: 'Sora', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    color: #4a5568;
    cursor: pointer;
    transition: all 0.15s;
  }

  .copy-btn:hover {
    background: #f0f6ff;
    border-color: #1a73e8;
    color: #1a73e8;
  }

  .result-body {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
  }

  .result-text {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.82rem;
    line-height: 1.8;
    color: #2d3748;
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* Empty state */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 12px;
    color: #b0b8c4;
    text-align: center;
    padding: 40px;
  }

  .empty-icon {
    font-size: 2.5rem;
    opacity: 0.5;
  }

  .empty-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: #8a94a6;
  }

  .empty-desc {
    font-size: 0.78rem;
    color: #b0b8c4;
    max-width: 220px;
    line-height: 1.6;
  }

  /* Loading state */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 16px;
  }

  .loading-bar {
    width: 200px;
    height: 3px;
    background: #e4e7ec;
    border-radius: 2px;
    overflow: hidden;
  }

  .loading-fill {
    height: 100%;
    background: linear-gradient(90deg, #1a73e8, #4da3ff, #1a73e8);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 2px;
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .loading-text {
    font-size: 0.8rem;
    color: #8a94a6;
    font-weight: 500;
  }

  /* History Panel */
  .history-panel {
    position: fixed;
    top: 60px;
    right: 0;
    width: 380px;
    height: calc(100vh - 60px);
    background: white;
    border-left: 1px solid #e4e7ec;
    box-shadow: -4px 0 20px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    z-index: 100;
    animation: slideIn 0.2s ease;
  }

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .history-head {
    padding: 20px 24px;
    border-bottom: 1px solid #f0f2f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .history-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: #0d1b2a;
  }

  .history-actions {
    display: flex;
    gap: 8px;
  }

  .close-btn {
    width: 28px;
    height: 28px;
    background: #f5f7fa;
    border: 1px solid #e4e7ec;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .close-btn:hover { background: #eef0f4; }

  .clear-hist-btn {
    padding: 4px 10px;
    background: #fff5f5;
    border: 1px solid #fed7d7;
    border-radius: 6px;
    font-size: 0.72rem;
    color: #e53e3e;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    font-weight: 500;
    transition: all 0.15s;
  }

  .clear-hist-btn:hover { background: #ffe4e4; }

  .history-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
  }

  .history-item {
    padding: 14px;
    border-radius: 10px;
    border: 1px solid #f0f2f5;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.15s;
    background: #fafbfc;
  }

  .history-item:hover {
    border-color: #1a73e8;
    background: #f0f6ff;
    transform: translateX(-2px);
  }

  .hist-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .hist-badge {
    font-size: 0.68rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 12px;
    background: #e8f0fe;
    color: #1a73e8;
  }

  .hist-time {
    font-size: 0.68rem;
    color: #b0b8c4;
    font-family: 'IBM Plex Mono', monospace;
  }

  .hist-query {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.75rem;
    color: #4a5568;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 6px;
    background: #f0f2f5;
    padding: 6px 8px;
    border-radius: 5px;
  }

  .hist-preview {
    font-size: 0.75rem;
    color: #8a94a6;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .empty-hist {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #b0b8c4;
    gap: 8px;
    font-size: 0.82rem;
  }

  /* Copied toast */
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #0d1b2a;
    color: white;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    animation: fadeInUp 0.2s ease;
    z-index: 200;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #dde2ea; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #c4cdd6; }
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
    if (!query.trim()) {
      setError("Please enter a SQL query or description.");
      return;
    }
    setError("");
    setResult("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/sql", {
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
        setHistory((prev) => [
          {
            id: Date.now(),
            action,
            query,
            result: data.result,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
          ...prev,
        ]);
      }
    } catch (err) {
      setError("Could not connect to backend. Make sure Flask is running on port 5000.");
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
    setAction(item.action);
    setQuery(item.query);
    setResult(item.result);
    setActiveAction(item.action);
    setShowHistory(false);
  };

  const currentAction = ACTIONS.find((a) => a.key === action);

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* Nav */}
        <nav className="nav">
          <div className="nav-brand">
            <div className="nav-logo">🛢️</div>
            <span className="nav-title">SQL Assistant</span>
            <span className="nav-subtitle">powered by Claude AI</span>
          </div>
          <div className="nav-right">
            <button className="history-btn" onClick={() => setShowHistory(!showHistory)}>
              📋 History
              {history.length > 0 && <span className="badge">{history.length}</span>}
            </button>
          </div>
        </nav>

        {/* Action Tabs */}
        <div className="action-bar">
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              className={`action-tab ${action === a.key ? "active" : ""}`}
              onClick={() => { setAction(a.key); setError(""); }}
            >
              <span className="tab-icon">{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>

        {/* Split Layout */}
        <div className="main">

          {/* Left: Editor */}
          <div className="left-panel">
            <div className="panel-header">
              <span className="panel-label">
                {action === "generate" ? "Description" : "SQL Editor"}
              </span>
              <span className="char-count">{query.length} chars</span>
            </div>

            <div className="editor-area">
              <textarea
                className="sql-textarea"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setError(""); }}
                placeholder={
                  action === "generate"
                    ? "Describe what you want...\n\ne.g. Get all customers who haven't placed an order in the last 90 days, along with their email and total lifetime spend."
                    : "Paste your SQL query here...\n\nSELECT\n    u.name,\n    COUNT(o.id) AS order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id"
                }
              />
            </div>

            <div className="left-footer">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {query && (
                  <button className="clear-btn" onClick={() => { setQuery(""); setResult(""); setError(""); }}>
                    Clear
                  </button>
                )}
                {error && <span className="error-msg">⚠️ {error}</span>}
              </div>
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <><div className="spinner" /> Processing...</>
                ) : (
                  <>{currentAction?.icon} {currentAction?.label}</>
                )}
              </button>
            </div>
          </div>

          {/* Right: Results */}
          <div className="right-panel">
            {loading ? (
              <div className="loading-state">
                <div className="loading-bar">
                  <div className="loading-fill" />
                </div>
                <span className="loading-text">Claude is thinking...</span>
              </div>
            ) : result ? (
              <>
                <div className="result-header">
                  <div className="result-meta">
                    <span className="panel-label">Result</span>
                    {activeAction && (
                      <span className="result-badge">
                        {ACTIONS.find((a) => a.key === activeAction)?.icon}{" "}
                        {ACTIONS.find((a) => a.key === activeAction)?.label}
                      </span>
                    )}
                  </div>
                  <button className="copy-btn" onClick={handleCopy}>
                    {copied ? "✓ Copied!" : "⎘ Copy"}
                  </button>
                </div>
                <div className="result-body">
                  <pre className="result-text">{result}</pre>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  {currentAction?.icon || "💡"}
                </div>
                <div className="empty-title">{currentAction?.label}</div>
                <div className="empty-desc">
                  {currentAction?.desc}. Paste your query on the left and click submit.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <div className="history-panel">
            <div className="history-head">
              <span className="history-title">Query History</span>
              <div className="history-actions">
                {history.length > 0 && (
                  <button className="clear-hist-btn" onClick={() => setHistory([])}>
                    Clear all
                  </button>
                )}
                <button className="close-btn" onClick={() => setShowHistory(false)}>✕</button>
              </div>
            </div>
            <div className="history-list">
              {history.length === 0 ? (
                <div className="empty-hist">
                  <span>📭</span>
                  <span>No history yet</span>
                </div>
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
                    <div className="hist-query">
                      {item.query.slice(0, 60)}{item.query.length > 60 ? "..." : ""}
                    </div>
                    <div className="hist-preview">{item.result.slice(0, 100)}...</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Toast */}
        {copied && <div className="toast">✓ Copied to clipboard</div>}
      </div>
    </>
  );
}