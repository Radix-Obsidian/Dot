import { html, nothing } from "lit";
import { icons } from "../icons";

export type InboxProps = {
  connected: boolean;
  loading: boolean;
  // Inbox items (stubbed for MVP)
  notifications: InboxNotification[];
  needsReply: InboxItem[];
  recommendations: ReplyRecommendation[];
  // Filter state
  filter: "all" | "priority" | "needs-reply";
  // Handlers
  onFilterChange: (filter: "all" | "priority" | "needs-reply") => void;
  onItemClick: (id: string) => void;
  onRecommendationApply: (id: string) => void;
  onNavigateToConnections: () => void;
};

export type InboxNotification = {
  id: string;
  platform: "instagram" | "tiktok" | "youtube" | "twitter" | "discord" | "whatsapp" | "telegram";
  type: "comment" | "dm" | "mention" | "like" | "follow" | "share";
  title: string;
  preview: string;
  timestamp: number;
  isRead: boolean;
  isPriority: boolean;
  senderName?: string;
  senderAvatar?: string;
};

export type InboxItem = {
  id: string;
  platform: string;
  senderName: string;
  preview: string;
  timestamp: number;
  waitingTime: string;
};

export type ReplyRecommendation = {
  id: string;
  forItemId: string;
  suggestedReply: string;
  confidence: "high" | "medium" | "low";
  tone: string;
};

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

function getPlatformIcon(platform: string) {
  switch (platform) {
    case "instagram":
      return "📸";
    case "tiktok":
      return "🎵";
    case "youtube":
      return "▶️";
    case "twitter":
      return "🐦";
    case "discord":
      return "💬";
    case "whatsapp":
      return "💚";
    case "telegram":
      return "✈️";
    default:
      return "📱";
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case "comment":
      return "commented";
    case "dm":
      return "sent a message";
    case "mention":
      return "mentioned you";
    case "like":
      return "liked your post";
    case "follow":
      return "followed you";
    case "share":
      return "shared your post";
    default:
      return "interacted";
  }
}

export function renderInbox(props: InboxProps) {
  const hasAnyContent =
    props.notifications.length > 0 ||
    props.needsReply.length > 0 ||
    props.recommendations.length > 0;

  return html`
    <div class="inbox">
      <!-- Header with filters -->
      <div class="inbox-header">
        <div class="inbox-filters">
          <button
            class="inbox-filter ${props.filter === 'all' ? 'inbox-filter--active' : ''}"
            @click=${() => props.onFilterChange("all")}
          >
            All
          </button>
          <button
            class="inbox-filter ${props.filter === 'priority' ? 'inbox-filter--active' : ''}"
            @click=${() => props.onFilterChange("priority")}
          >
            Priority
          </button>
          <button
            class="inbox-filter ${props.filter === 'needs-reply' ? 'inbox-filter--active' : ''}"
            @click=${() => props.onFilterChange("needs-reply")}
          >
            Needs Reply
          </button>
        </div>
      </div>

      ${props.loading
        ? html`
            <div class="inbox-loading">
              <div class="inbox-loading__spinner">${icons.loader}</div>
              <div class="inbox-loading__text">Loading your inbox...</div>
            </div>
          `
        : hasAnyContent
          ? html`
              <!-- Needs Reply Section -->
              ${props.needsReply.length > 0
                ? html`
                    <section class="inbox-section">
                      <h3 class="inbox-section__title">
                        <span class="inbox-section__icon">${icons.messageSquare}</span>
                        Needs a Reply
                        <span class="inbox-section__count">${props.needsReply.length}</span>
                      </h3>
                      <div class="inbox-items">
                        ${props.needsReply.map(
                          (item) => html`
                            <div
                              class="inbox-item inbox-item--needs-reply"
                              @click=${() => props.onItemClick(item.id)}
                            >
                              <div class="inbox-item__avatar">
                                ${getPlatformIcon(item.platform)}
                              </div>
                              <div class="inbox-item__content">
                                <div class="inbox-item__header">
                                  <span class="inbox-item__sender">${item.senderName}</span>
                                  <span class="inbox-item__waiting">Waiting ${item.waitingTime}</span>
                                </div>
                                <div class="inbox-item__preview">${item.preview}</div>
                              </div>
                            </div>
                          `
                        )}
                      </div>
                    </section>
                  `
                : nothing}

              <!-- Recommendations Section -->
              ${props.recommendations.length > 0
                ? html`
                    <section class="inbox-section">
                      <h3 class="inbox-section__title">
                        <span class="inbox-section__icon">${icons.sparkles}</span>
                        Dot's Reply Suggestions
                      </h3>
                      <div class="inbox-recommendations">
                        ${props.recommendations.map(
                          (rec) => html`
                            <div class="inbox-recommendation">
                              <div class="inbox-recommendation__header">
                                <span class="inbox-recommendation__badge inbox-recommendation__badge--${rec.confidence}">
                                  ${rec.confidence} confidence
                                </span>
                                <span class="inbox-recommendation__tone">${rec.tone}</span>
                              </div>
                              <div class="inbox-recommendation__text">${rec.suggestedReply}</div>
                              <div class="inbox-recommendation__actions">
                                <button
                                  class="btn btn--sm btn--primary"
                                  @click=${() => props.onRecommendationApply(rec.id)}
                                >
                                  Use This Reply
                                </button>
                                <button class="btn btn--sm btn--outline">Edit</button>
                              </div>
                            </div>
                          `
                        )}
                      </div>
                    </section>
                  `
                : nothing}

              <!-- All Notifications -->
              ${props.notifications.length > 0
                ? html`
                    <section class="inbox-section">
                      <h3 class="inbox-section__title">
                        <span class="inbox-section__icon">${icons.inbox}</span>
                        Recent Notifications
                      </h3>
                      <div class="inbox-items">
                        ${props.notifications.map(
                          (notification) => html`
                            <div
                              class="inbox-item ${notification.isRead ? '' : 'inbox-item--unread'} ${notification.isPriority ? 'inbox-item--priority' : ''}"
                              @click=${() => props.onItemClick(notification.id)}
                            >
                              <div class="inbox-item__avatar">
                                ${getPlatformIcon(notification.platform)}
                              </div>
                              <div class="inbox-item__content">
                                <div class="inbox-item__header">
                                  <span class="inbox-item__sender">
                                    ${notification.senderName ?? notification.platform}
                                  </span>
                                  <span class="inbox-item__type">${getTypeLabel(notification.type)}</span>
                                  <span class="inbox-item__time">${formatTimeAgo(notification.timestamp)}</span>
                                </div>
                                <div class="inbox-item__preview">${notification.preview}</div>
                              </div>
                              ${notification.isPriority
                                ? html`<span class="inbox-item__priority-badge">Priority</span>`
                                : nothing}
                            </div>
                          `
                        )}
                      </div>
                    </section>
                  `
                : nothing}
            `
          : html`
              <!-- Empty State -->
              <div class="inbox-empty">
                <div class="inbox-empty__icon">${icons.inbox}</div>
                <h3 class="inbox-empty__title">Your inbox is empty</h3>
                <p class="inbox-empty__description">
                  Connect your social accounts to start receiving notifications and reply recommendations from Dot.
                </p>
                <div class="inbox-empty__platforms">
                  <span class="inbox-empty__platform">📸 Instagram</span>
                  <span class="inbox-empty__platform">🎵 TikTok</span>
                  <span class="inbox-empty__platform">▶️ YouTube</span>
                  <span class="inbox-empty__platform">🐦 Twitter/X</span>
                  <span class="inbox-empty__platform">💬 Discord</span>
                </div>
                <button class="btn btn--primary btn--lg" @click=${props.onNavigateToConnections}>
                  Connect Your Accounts
                </button>
              </div>
            `}
    </div>
  `;
}
