import { html, nothing } from "lit";
import { icons } from "../icons";

export type ConnectionsProps = {
  connected: boolean;
  loading: boolean;
  // Connection states
  connections: ConnectionStatus[];
  // Handlers
  onConnect: (platformId: string) => void;
  onDisconnect: (platformId: string) => void;
  onReconnect: (platformId: string) => void;
  onViewDetails: (platformId: string) => void;
};

export type ConnectionStatus = {
  id: string;
  name: string;
  icon: string;
  status: "connected" | "disconnected" | "needs-attention" | "connecting";
  accountName?: string;
  lastSync?: number;
  errorMessage?: string;
  features: string[];
};

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// Default platforms for creators
const DEFAULT_PLATFORMS: ConnectionStatus[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: "📸",
    status: "disconnected",
    features: ["Comments", "DMs", "Mentions", "Story replies"],
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "🎵",
    status: "disconnected",
    features: ["Comments", "Mentions", "Analytics"],
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "▶️",
    status: "disconnected",
    features: ["Comments", "Community posts", "Analytics"],
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: "🐦",
    status: "disconnected",
    features: ["Mentions", "DMs", "Replies"],
  },
  {
    id: "discord",
    name: "Discord",
    icon: "💬",
    status: "disconnected",
    features: ["Server messages", "DMs", "Mentions"],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "💚",
    status: "disconnected",
    features: ["Messages", "Group chats", "Status"],
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: "✈️",
    status: "disconnected",
    features: ["Messages", "Channels", "Groups"],
  },
];

export function renderConnections(props: ConnectionsProps) {
  // Merge provided connections with defaults
  const allConnections = DEFAULT_PLATFORMS.map((platform) => {
    const existing = props.connections.find((c) => c.id === platform.id);
    return existing ?? platform;
  });

  const connectedCount = allConnections.filter((c) => c.status === "connected").length;
  const needsAttentionCount = allConnections.filter((c) => c.status === "needs-attention").length;

  return html`
    <div class="connections">
      <!-- Header -->
      <section class="connections-header">
        <div class="connections-header__content">
          <h1 class="connections-header__title">Connections</h1>
          <p class="connections-header__subtitle">
            Connect your social accounts so Dot can help you manage notifications, suggest replies, and track engagement.
          </p>
        </div>
        <div class="connections-header__stats">
          <div class="connections-stat">
            <span class="connections-stat__value">${connectedCount}</span>
            <span class="connections-stat__label">Connected</span>
          </div>
          ${needsAttentionCount > 0
            ? html`
                <div class="connections-stat connections-stat--warning">
                  <span class="connections-stat__value">${needsAttentionCount}</span>
                  <span class="connections-stat__label">Needs Attention</span>
                </div>
              `
            : nothing}
        </div>
      </section>

      ${props.loading
        ? html`
            <div class="connections-loading">
              <div class="connections-loading__spinner">${icons.loader}</div>
              <div class="connections-loading__text">Loading connections...</div>
            </div>
          `
        : html`
            <!-- Needs Attention -->
            ${needsAttentionCount > 0
              ? html`
                  <section class="connections-section">
                    <h2 class="connections-section__title connections-section__title--warning">
                      <span class="connections-section__icon">⚠️</span>
                      Needs Attention
                    </h2>
                    <div class="connections-grid">
                      ${allConnections
                        .filter((c) => c.status === "needs-attention")
                        .map((connection) => renderConnectionCard(connection, props))}
                    </div>
                  </section>
                `
              : nothing}

            <!-- Connected -->
            ${connectedCount > 0
              ? html`
                  <section class="connections-section">
                    <h2 class="connections-section__title">
                      <span class="connections-section__icon">✓</span>
                      Connected
                    </h2>
                    <div class="connections-grid">
                      ${allConnections
                        .filter((c) => c.status === "connected")
                        .map((connection) => renderConnectionCard(connection, props))}
                    </div>
                  </section>
                `
              : nothing}

            <!-- Available to Connect -->
            <section class="connections-section">
              <h2 class="connections-section__title">
                <span class="connections-section__icon">➕</span>
                Available to Connect
              </h2>
              <div class="connections-grid">
                ${allConnections
                  .filter((c) => c.status === "disconnected" || c.status === "connecting")
                  .map((connection) => renderConnectionCard(connection, props))}
              </div>
            </section>

            <!-- Privacy Notice -->
            <section class="connections-privacy">
              <div class="connections-privacy__card">
                <div class="connections-privacy__icon">🔒</div>
                <div class="connections-privacy__content">
                  <h3 class="connections-privacy__title">Your data stays yours</h3>
                  <p class="connections-privacy__text">
                    Dot only reads notifications and messages to help you respond. We never post, send, or share anything without your explicit approval.
                  </p>
                </div>
              </div>
            </section>
          `}
    </div>
  `;
}

function renderConnectionCard(connection: ConnectionStatus, props: ConnectionsProps) {
  const statusClass = `connection-card--${connection.status}`;

  return html`
    <div class="connection-card ${statusClass}">
      <div class="connection-card__header">
        <div class="connection-card__icon">${connection.icon}</div>
        <div class="connection-card__info">
          <h3 class="connection-card__name">${connection.name}</h3>
          ${connection.accountName
            ? html`<span class="connection-card__account">@${connection.accountName}</span>`
            : nothing}
        </div>
        <div class="connection-card__status">
          ${connection.status === "connected"
            ? html`<span class="connection-card__status-badge connection-card__status-badge--connected">Connected</span>`
            : connection.status === "needs-attention"
              ? html`<span class="connection-card__status-badge connection-card__status-badge--warning">Needs Attention</span>`
              : connection.status === "connecting"
                ? html`<span class="connection-card__status-badge connection-card__status-badge--connecting">Connecting...</span>`
                : nothing}
        </div>
      </div>

      ${connection.errorMessage
        ? html`
            <div class="connection-card__error">
              ${connection.errorMessage}
            </div>
          `
        : nothing}

      <div class="connection-card__features">
        <div class="connection-card__features-label">Features:</div>
        <div class="connection-card__features-list">
          ${connection.features.map(
            (feature) => html`<span class="connection-card__feature">${feature}</span>`
          )}
        </div>
      </div>

      ${connection.lastSync
        ? html`
            <div class="connection-card__sync">
              Last synced ${formatTimeAgo(connection.lastSync)}
            </div>
          `
        : nothing}

      <div class="connection-card__actions">
        ${connection.status === "connected"
          ? html`
              <button
                class="btn btn--sm btn--outline"
                @click=${() => props.onViewDetails(connection.id)}
              >
                Settings
              </button>
              <button
                class="btn btn--sm btn--danger-outline"
                @click=${() => props.onDisconnect(connection.id)}
              >
                Disconnect
              </button>
            `
          : connection.status === "needs-attention"
            ? html`
                <button
                  class="btn btn--sm btn--primary"
                  @click=${() => props.onReconnect(connection.id)}
                >
                  Reconnect
                </button>
              `
            : connection.status === "connecting"
              ? html`
                  <button class="btn btn--sm btn--outline" disabled>
                    ${icons.loader} Connecting...
                  </button>
                `
              : html`
                  <button
                    class="btn btn--sm btn--primary"
                    @click=${() => props.onConnect(connection.id)}
                  >
                    Connect
                  </button>
                `}
      </div>
    </div>
  `;
}
