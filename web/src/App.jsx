import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
const deviceId = new URLSearchParams(window.location.search).get("deviceId") ?? "web-dashboard";

function App() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncInfo, setSyncInfo] = useState(null);
  const [error, setError] = useState(null);

  const fetchThemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/themes`);
      if (!response.ok) throw new Error("Failed to load themes");
      const data = await response.json();
      setThemes(data.themes ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  const handleSync = async (themeId) => {
    setSyncInfo({ status: "syncing", themeId });
    try {
      const response = await fetch(`${API_BASE}/api/themes/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, themeId })
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.errors ? Object.values(payload.errors).flat()[0] : "Sync failed");
      }
      const payload = await response.json();
      setSyncInfo({ status: "synced", themeId, appliedAt: payload.applied?.appliedAt ?? new Date().toISOString() });
    } catch (err) {
      setSyncInfo({ status: "error", message: err.message, themeId });
    }
  };

  const deviceBadge = useMemo(() => `${deviceId} (web)` , []);

  return (
    <main className="dashboard">
      <header>
        <div>
          <h1>Theme Hub Dashboard</h1>
          <p>Device token: <strong>{deviceBadge}</strong></p>
        </div>
        <button className="sync-button" onClick={fetchThemes} disabled={loading}>
          Refresh catalog
        </button>
      </header>

      {loading && <p>Loading themes...</p>}
      {error && <p style={{ color: "#f87171" }}>Error: {error}</p>}

      <section className="theme-grid">
        {themes.map((theme) => (
          <article className="theme-card" key={theme.id}>
            <h3>{theme.name}</h3>
            <p>{theme.description}</p>
            <div className="token-row">
              <span className="token-chip">Primary</span>
              <span>{theme.tokens.primary}</span>
              <span className="token-swatch" style={{ background: theme.tokens.primary }} />
            </div>
            <div className="token-row">
              <span className="token-chip">Accent</span>
              <span>{theme.tokens.accent}</span>
              <span className="token-swatch" style={{ background: theme.tokens.accent }} />
            </div>
            <div className="token-row">
              <span className="token-chip">Background</span>
              <span>{theme.tokens.background}</span>
              <span className="token-swatch" style={{ background: theme.tokens.background }} />
            </div>
            <button
              className="sync-button"
              onClick={() => handleSync(theme.id)}
              aria-label={`Sync ${theme.name} to ${deviceId}`}
            >
              Sync {theme.name}
            </button>
          </article>
        ))}
      </section>

      {syncInfo && (
        <p className="sync-feedback">
          {syncInfo.status === "syncing" && "Requesting sync..."}
          {syncInfo.status === "synced" && `Synced ${syncInfo.themeId} at ${syncInfo.appliedAt}`}
          {syncInfo.status === "error" && `Sync failed: ${syncInfo.message}`}
        </p>
      )}
    </main>
  );
}

export default App;
