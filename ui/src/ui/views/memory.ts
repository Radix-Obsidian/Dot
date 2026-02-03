import { html, nothing } from "lit";

export type MemorySource = "memory" | "sessions";

export type MemoryStatusData = {
  enabled: boolean;
  agentId: string;
  files?: number;
  chunks?: number;
  dirty?: boolean;
  workspaceDir?: string;
  dbPath?: string;
  provider?: string;
  model?: string;
  requestedProvider?: string;
  sources?: MemorySource[];
  extraPaths?: string[];
  sourceCounts?: Array<{ source: MemorySource; files: number; chunks: number }>;
  cache?: { enabled: boolean; entries?: number; maxEntries?: number };
  fts?: { enabled: boolean; available: boolean; error?: string };
  fallback?: { from: string; reason?: string };
  vector?: {
    enabled: boolean;
    available?: boolean;
    extensionPath?: string;
    loadError?: string;
    dims?: number;
  };
  batch?: {
    enabled: boolean;
    failures: number;
    limit: number;
    wait: boolean;
    concurrency: number;
    pollIntervalMs: number;
    timeoutMs: number;
    lastError?: string;
    lastProvider?: string;
  };
  error?: string;
};

export type MemorySearchResultItem = {
  path: string;
  startLine: number;
  endLine: number;
  score: number;
  snippet: string;
  source: MemorySource;
};

export type MemoryProps = {
  loading: boolean;
  status: MemoryStatusData | null;
  error: string | null;
  searchQuery: string;
  searchResults: MemorySearchResultItem[];
  searching: boolean;
  syncing: boolean;
  onRefresh: () => void;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  onSync: () => void;
};

export function renderMemory(props: MemoryProps) {
  const status = props.status;
  const enabled = status?.enabled ?? false;

  return html`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: flex-start;">
        <div>
          <div class="card-title">Memory</div>
          <div class="card-sub">
            Durable memory files and vector search index status.
          </div>
        </div>
        <div class="row" style="gap: 8px;">
          <button
            class="btn"
            ?disabled=${props.syncing || props.loading || !enabled}
            @click=${props.onSync}
          >
            ${props.syncing ? "Syncing…" : "Sync Index"}
          </button>
          <button class="btn" ?disabled=${props.loading} @click=${props.onRefresh}>
            ${props.loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      ${props.error
        ? html`<div class="callout danger" style="margin-top: 12px;">${props.error}</div>`
        : nothing}

      ${!enabled && !props.loading
        ? html`
            <div class="callout warning" style="margin-top: 16px;">
              Memory search is disabled. Enable it in your configuration to use memory features.
              ${status?.error ? html`<br /><br />Error: ${status.error}` : nothing}
            </div>
          `
        : nothing}

      ${enabled ? renderStatusSection(status!) : nothing}
      ${enabled ? renderSearchSection(props) : nothing}
    </section>
  `;
}

function renderStatusSection(status: MemoryStatusData) {
  return html`
    <div class="memory-status" style="margin-top: 20px;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">Index Status</h3>

      <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px;">
        ${renderStatCard("Files", status.files ?? 0)}
        ${renderStatCard("Chunks", status.chunks ?? 0)}
        ${renderStatCard("Provider", status.provider ?? "—")}
        ${renderStatCard("Model", status.model ?? "—")}
      </div>

      <div class="chip-row" style="margin-top: 16px; flex-wrap: wrap; gap: 6px;">
        <span class="chip ${status.dirty ? "chip-warn" : "chip-ok"}">
          ${status.dirty ? "Index dirty" : "Index synced"}
        </span>
        ${status.sources?.map(
          (source) => html`<span class="chip">${source}</span>`
        )}
        ${status.fts?.available
          ? html`<span class="chip chip-ok">FTS enabled</span>`
          : html`<span class="chip chip-muted">FTS disabled</span>`}
        ${status.vector?.available
          ? html`<span class="chip chip-ok">Vector enabled</span>`
          : html`<span class="chip chip-muted">Vector disabled</span>`}
        ${status.cache?.enabled
          ? html`<span class="chip">Cache: ${status.cache.entries ?? 0} entries</span>`
          : nothing}
      </div>

      ${status.fallback
        ? html`
            <div class="callout info" style="margin-top: 12px;">
              Fallback active: ${status.fallback.from} → ${status.provider}
              ${status.fallback.reason ? html`<br />Reason: ${status.fallback.reason}` : nothing}
            </div>
          `
        : nothing}

      ${status.vector?.loadError
        ? html`
            <div class="callout warning" style="margin-top: 12px;">
              Vector extension error: ${status.vector.loadError}
            </div>
          `
        : nothing}

      ${status.batch?.failures && status.batch.failures > 0
        ? html`
            <div class="callout warning" style="margin-top: 12px;">
              Batch failures: ${status.batch.failures}/${status.batch.limit}
              ${status.batch.lastError ? html`<br />Last error: ${status.batch.lastError}` : nothing}
            </div>
          `
        : nothing}

      ${status.sourceCounts && status.sourceCounts.length > 0
        ? html`
            <details style="margin-top: 16px;">
              <summary style="cursor: pointer; font-size: 13px; color: var(--muted-color);">
                Source breakdown
              </summary>
              <div style="margin-top: 8px; font-size: 13px;">
                ${status.sourceCounts.map(
                  (sc) => html`
                    <div style="margin-bottom: 4px;">
                      <strong>${sc.source}:</strong> ${sc.files} files, ${sc.chunks} chunks
                    </div>
                  `
                )}
              </div>
            </details>
          `
        : nothing}

      ${status.extraPaths && status.extraPaths.length > 0
        ? html`
            <details style="margin-top: 12px;">
              <summary style="cursor: pointer; font-size: 13px; color: var(--muted-color);">
                Extra indexed paths (${status.extraPaths.length})
              </summary>
              <div style="margin-top: 8px; font-size: 12px; font-family: monospace;">
                ${status.extraPaths.map((p) => html`<div>${p}</div>`)}
              </div>
            </details>
          `
        : nothing}
    </div>
  `;
}

function renderStatCard(label: string, value: string | number) {
  return html`
    <div
      class="stat-card"
      style="
        background: var(--card-bg-color, #1a1a1a);
        border: 1px solid var(--border-color, #333);
        border-radius: 8px;
        padding: 12px;
      "
    >
      <div style="font-size: 11px; color: var(--muted-color); text-transform: uppercase; letter-spacing: 0.5px;">
        ${label}
      </div>
      <div style="font-size: 18px; font-weight: 600; margin-top: 4px;">
        ${value}
      </div>
    </div>
  `;
}

function renderSearchSection(props: MemoryProps) {
  return html`
    <div class="memory-search" style="margin-top: 24px; border-top: 1px solid var(--border-color, #333); padding-top: 20px;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">Search Memory</h3>

      <div class="row" style="gap: 8px;">
        <label class="field" style="flex: 1;">
          <input
            type="text"
            placeholder="Search your memory…"
            .value=${props.searchQuery}
            @input=${(e: Event) => props.onSearchQueryChange((e.target as HTMLInputElement).value)}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === "Enter") props.onSearch();
            }}
          />
        </label>
        <button
          class="btn primary"
          ?disabled=${props.searching || !props.searchQuery.trim()}
          @click=${props.onSearch}
        >
          ${props.searching ? "Searching…" : "Search"}
        </button>
      </div>

      ${props.searchResults.length > 0
        ? html`
            <div class="search-results" style="margin-top: 16px;">
              <div class="muted" style="margin-bottom: 8px;">
                ${props.searchResults.length} result${props.searchResults.length === 1 ? "" : "s"}
              </div>
              <div class="list">
                ${props.searchResults.map((result) => renderSearchResult(result))}
              </div>
            </div>
          `
        : nothing}
    </div>
  `;
}

function renderSearchResult(result: MemorySearchResultItem) {
  const scorePercent = Math.round(result.score * 100);
  return html`
    <div class="list-item" style="padding: 12px;">
      <div class="list-main" style="flex: 1;">
        <div class="list-title" style="font-family: monospace; font-size: 13px;">
          ${result.path}:${result.startLine}-${result.endLine}
        </div>
        <div
          class="list-sub"
          style="margin-top: 6px; white-space: pre-wrap; font-size: 13px; line-height: 1.5;"
        >
          ${result.snippet}
        </div>
        <div class="chip-row" style="margin-top: 8px;">
          <span class="chip">${result.source}</span>
          <span class="chip ${scorePercent >= 70 ? "chip-ok" : scorePercent >= 50 ? "chip-warn" : "chip-muted"}">
            ${scorePercent}% match
          </span>
        </div>
      </div>
    </div>
  `;
}
