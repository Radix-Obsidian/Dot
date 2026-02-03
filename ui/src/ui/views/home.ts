import { html, nothing } from "lit";
import { icons } from "../icons";

export type HomeProps = {
  connected: boolean;
  assistantName: string;
  // Activity data (stubbed for MVP)
  recentActivity: ActivityItem[];
  // Routines status
  dailyRecapEnabled: boolean;
  weeklyPlanEnabled: boolean;
  followUpsEnabled: boolean;
  // Suggestions
  suggestions: SuggestionItem[];
  // Handlers
  onNavigateToInbox: () => void;
  onNavigateToRoutines: () => void;
  onNavigateToChat: () => void;
  onNavigateToConnections: () => void;
};

export type ActivityItem = {
  id: string;
  type: "connection" | "routine" | "memory" | "message";
  title: string;
  description: string;
  timestamp: number;
  icon?: string;
};

export type SuggestionItem = {
  id: string;
  title: string;
  description: string;
  action: string;
  actionLabel: string;
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

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function renderHome(props: HomeProps) {
  const greeting = getGreeting();

  return html`
    <div class="home">
      <!-- Hero Section -->
      <section class="home-hero">
        <div class="home-hero__greeting">
          <h1 class="home-hero__title">${greeting} 👋</h1>
          <p class="home-hero__subtitle">
            ${props.connected
              ? `${props.assistantName} is ready to help you today.`
              : "Connect to get started with Dot."}
          </p>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="home-section">
        <h2 class="home-section__title">Quick Actions</h2>
        <div class="home-actions">
          <button class="home-action-card" @click=${props.onNavigateToChat}>
            <span class="home-action-card__icon">${icons.messageSquare}</span>
            <span class="home-action-card__label">Ask Dot</span>
          </button>
          <button class="home-action-card" @click=${props.onNavigateToInbox}>
            <span class="home-action-card__icon">${icons.inbox}</span>
            <span class="home-action-card__label">Check Inbox</span>
          </button>
          <button class="home-action-card" @click=${props.onNavigateToRoutines}>
            <span class="home-action-card__icon">${icons.zap}</span>
            <span class="home-action-card__label">Routines</span>
          </button>
          <button class="home-action-card" @click=${props.onNavigateToConnections}>
            <span class="home-action-card__icon">${icons.link}</span>
            <span class="home-action-card__label">Connect Apps</span>
          </button>
        </div>
      </section>

      <!-- Routines Status -->
      <section class="home-section">
        <h2 class="home-section__title">Your Routines</h2>
        <div class="home-routines">
          <div class="home-routine-card ${props.dailyRecapEnabled ? 'home-routine-card--active' : ''}">
            <div class="home-routine-card__icon">🌙</div>
            <div class="home-routine-card__content">
              <div class="home-routine-card__title">Daily Recap</div>
              <div class="home-routine-card__status">
                ${props.dailyRecapEnabled ? "Active • Tonight at 10pm" : "Not enabled"}
              </div>
            </div>
            <div class="home-routine-card__indicator ${props.dailyRecapEnabled ? 'active' : ''}"></div>
          </div>
          <div class="home-routine-card ${props.weeklyPlanEnabled ? 'home-routine-card--active' : ''}">
            <div class="home-routine-card__icon">📅</div>
            <div class="home-routine-card__content">
              <div class="home-routine-card__title">Weekly Planning</div>
              <div class="home-routine-card__status">
                ${props.weeklyPlanEnabled ? "Active • Sunday 7pm" : "Not enabled"}
              </div>
            </div>
            <div class="home-routine-card__indicator ${props.weeklyPlanEnabled ? 'active' : ''}"></div>
          </div>
          <div class="home-routine-card ${props.followUpsEnabled ? 'home-routine-card--active' : ''}">
            <div class="home-routine-card__icon">🔔</div>
            <div class="home-routine-card__content">
              <div class="home-routine-card__title">Follow-up Reminders</div>
              <div class="home-routine-card__status">
                ${props.followUpsEnabled ? "Active • As needed" : "Not enabled"}
              </div>
            </div>
            <div class="home-routine-card__indicator ${props.followUpsEnabled ? 'active' : ''}"></div>
          </div>
        </div>
        <button class="btn btn--outline home-routines__cta" @click=${props.onNavigateToRoutines}>
          Manage Routines
        </button>
      </section>

      <!-- Suggestions -->
      ${props.suggestions.length > 0
        ? html`
            <section class="home-section">
              <h2 class="home-section__title">Suggestions from Dot</h2>
              <div class="home-suggestions">
                ${props.suggestions.map(
                  (suggestion) => html`
                    <div class="home-suggestion-card">
                      <div class="home-suggestion-card__content">
                        <div class="home-suggestion-card__title">${suggestion.title}</div>
                        <div class="home-suggestion-card__description">${suggestion.description}</div>
                      </div>
                      <button class="btn btn--sm btn--primary">${suggestion.actionLabel}</button>
                    </div>
                  `
                )}
              </div>
            </section>
          `
        : nothing}

      <!-- Recent Activity -->
      <section class="home-section">
        <h2 class="home-section__title">Recent Activity</h2>
        ${props.recentActivity.length > 0
          ? html`
              <div class="home-activity">
                ${props.recentActivity.map(
                  (item) => html`
                    <div class="home-activity-item">
                      <div class="home-activity-item__icon">
                        ${item.type === "connection"
                          ? icons.link
                          : item.type === "routine"
                            ? icons.zap
                            : item.type === "memory"
                              ? icons.brain
                              : icons.messageSquare}
                      </div>
                      <div class="home-activity-item__content">
                        <div class="home-activity-item__title">${item.title}</div>
                        <div class="home-activity-item__description">${item.description}</div>
                      </div>
                      <div class="home-activity-item__time">${formatTimeAgo(item.timestamp)}</div>
                    </div>
                  `
                )}
              </div>
            `
          : html`
              <div class="home-empty-state">
                <div class="home-empty-state__icon">${icons.inbox}</div>
                <div class="home-empty-state__title">No recent activity</div>
                <div class="home-empty-state__description">
                  Connect your social accounts to get started!
                </div>
                <button class="btn btn--primary" @click=${props.onNavigateToConnections}>
                  Connect Accounts
                </button>
              </div>
            `}
      </section>
    </div>
  `;
}
