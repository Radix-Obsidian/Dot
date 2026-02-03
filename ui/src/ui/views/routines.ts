import { html, nothing } from "lit";
import { icons } from "../icons";
import { lensSpinner } from "../components/lens-spinner";

export type RoutinesProps = {
  connected: boolean;
  loading: boolean;
  // Routine states
  routines: RoutineConfig[];
  // Last run info
  lastRuns: RoutineRunInfo[];
  // Handlers
  onRoutineToggle: (id: string, enabled: boolean) => void;
  onRoutineEdit: (id: string) => void;
  onRoutineRunNow: (id: string) => void;
};

export type RoutineConfig = {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  schedule: string;
  nextRun?: string;
  category: "recap" | "planning" | "followup" | "social";
};

export type RoutineRunInfo = {
  routineId: string;
  status: "success" | "failed" | "running";
  timestamp: number;
  summary?: string;
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

export function renderRoutines(props: RoutinesProps) {
  const flagshipRoutines = props.routines.filter(
    (r) => r.category === "recap" || r.category === "planning" || r.category === "followup"
  );
  const socialRoutines = props.routines.filter((r) => r.category === "social");

  return html`
    <div class="routines">
      <!-- Hero Section -->
      <section class="routines-hero">
        <div class="routines-hero__content">
          <h1 class="routines-hero__title">Routines</h1>
          <p class="routines-hero__subtitle">
            Automations that work while you sleep. Dot handles the routine stuff so you can focus on creating.
          </p>
        </div>
      </section>

      ${props.loading
        ? html`
            <div class="routines-loading">
              <div class="loading-text">
                ${lensSpinner(24)}
                <span>Loading your routines...</span>
              </div>
            </div>
          `
        : html`
            <!-- Flagship Routines -->
            <section class="routines-section">
              <h2 class="routines-section__title">
                <span class="routines-section__icon">⭐</span>
                Core Routines
              </h2>
              <p class="routines-section__description">
                These are Dot's flagship automations — the 70% that happens automatically.
              </p>
              <div class="routines-grid">
                ${renderRoutineCard({
                  id: "daily-recap",
                  name: "Daily Recap",
                  description: "Every night, Dot summarizes your day: messages received, content performance, follow-ups needed, and tomorrow's priorities.",
                  icon: "🌙",
                  enabled: flagshipRoutines.find((r) => r.id === "daily-recap")?.enabled ?? false,
                  schedule: "Every night at 10:00 PM",
                  nextRun: "Tonight",
                  category: "recap",
                }, props, props.lastRuns.find((r) => r.routineId === "daily-recap"))}

                ${renderRoutineCard({
                  id: "weekly-planning",
                  name: "Weekly Planning",
                  description: "Every Sunday, Dot reviews your week and helps plan the next one: content calendar, engagement goals, and key follow-ups.",
                  icon: "📅",
                  enabled: flagshipRoutines.find((r) => r.id === "weekly-planning")?.enabled ?? false,
                  schedule: "Every Sunday at 7:00 PM",
                  nextRun: "This Sunday",
                  category: "planning",
                }, props, props.lastRuns.find((r) => r.routineId === "weekly-planning"))}

                ${renderRoutineCard({
                  id: "follow-up-reminders",
                  name: "Follow-up Reminders",
                  description: "Dot tracks conversations that need follow-up and reminds you at the right time. Never ghost a collab opportunity again.",
                  icon: "🔔",
                  enabled: flagshipRoutines.find((r) => r.id === "follow-up-reminders")?.enabled ?? false,
                  schedule: "As needed throughout the day",
                  nextRun: "Active",
                  category: "followup",
                }, props, props.lastRuns.find((r) => r.routineId === "follow-up-reminders"))}
              </div>
            </section>

            <!-- Social Routines -->
            <section class="routines-section">
              <h2 class="routines-section__title">
                <span class="routines-section__icon">📱</span>
                Social Automations
              </h2>
              <p class="routines-section__description">
                Let Dot help you stay on top of your social presence.
              </p>
              <div class="routines-grid">
                ${renderRoutineCard({
                  id: "notification-digest",
                  name: "Notification Digest",
                  description: "Instead of constant pings, get a smart summary of social notifications grouped by priority and platform.",
                  icon: "📬",
                  enabled: socialRoutines.find((r) => r.id === "notification-digest")?.enabled ?? false,
                  schedule: "3x daily (morning, afternoon, evening)",
                  nextRun: "Next digest at 6 PM",
                  category: "social",
                }, props, props.lastRuns.find((r) => r.routineId === "notification-digest"))}

                ${renderRoutineCard({
                  id: "reply-recommendations",
                  name: "Reply Recommendations",
                  description: "Dot analyzes incoming messages and suggests replies in your voice. Review and send with one tap.",
                  icon: "💬",
                  enabled: socialRoutines.find((r) => r.id === "reply-recommendations")?.enabled ?? false,
                  schedule: "Real-time as messages arrive",
                  nextRun: "Always active",
                  category: "social",
                }, props, props.lastRuns.find((r) => r.routineId === "reply-recommendations"))}

                ${renderRoutineCard({
                  id: "engagement-insights",
                  name: "Engagement Insights",
                  description: "Weekly analysis of what content performed best, when your audience is most active, and growth trends.",
                  icon: "📊",
                  enabled: socialRoutines.find((r) => r.id === "engagement-insights")?.enabled ?? false,
                  schedule: "Every Monday morning",
                  nextRun: "This Monday",
                  category: "social",
                }, props, props.lastRuns.find((r) => r.routineId === "engagement-insights"))}
              </div>
            </section>

            <!-- Autonomy Explainer -->
            <section class="routines-autonomy">
              <div class="routines-autonomy__card">
                <div class="routines-autonomy__header">
                  <span class="routines-autonomy__icon">🤖</span>
                  <h3 class="routines-autonomy__title">How Dot's Autonomy Works</h3>
                </div>
                <div class="routines-autonomy__content">
                  <div class="routines-autonomy__item">
                    <div class="routines-autonomy__label">70% Autonomous</div>
                    <div class="routines-autonomy__description">
                      Dot handles recaps, reminders, and recommendations automatically. You wake up to organized info, not chaos.
                    </div>
                  </div>
                  <div class="routines-autonomy__item">
                    <div class="routines-autonomy__label">30% You Decide</div>
                    <div class="routines-autonomy__description">
                      Dot never posts, sends, or commits on your behalf without your approval. You stay in control of final actions.
                    </div>
                  </div>
                </div>
              </div>
            </section>
          `}
    </div>
  `;
}

function renderRoutineCard(
  routine: RoutineConfig,
  props: RoutinesProps,
  lastRun?: RoutineRunInfo
) {
  return html`
    <div class="routine-card ${routine.enabled ? 'routine-card--enabled' : ''}">
      <div class="routine-card__header">
        <div class="routine-card__icon">${routine.icon}</div>
        <div class="routine-card__toggle">
          <label class="toggle">
            <input
              type="checkbox"
              .checked=${routine.enabled}
              @change=${(e: Event) => {
                const target = e.target as HTMLInputElement;
                props.onRoutineToggle(routine.id, target.checked);
              }}
            />
            <span class="toggle__slider"></span>
          </label>
        </div>
      </div>
      <div class="routine-card__content">
        <h3 class="routine-card__title">${routine.name}</h3>
        <p class="routine-card__description">${routine.description}</p>
      </div>
      <div class="routine-card__schedule">
        <span class="routine-card__schedule-icon">${icons.loader}</span>
        <span class="routine-card__schedule-text">${routine.schedule}</span>
      </div>
      ${routine.enabled && routine.nextRun
        ? html`
            <div class="routine-card__next-run">
              Next: ${routine.nextRun}
            </div>
          `
        : nothing}
      ${lastRun
        ? html`
            <div class="routine-card__last-run routine-card__last-run--${lastRun.status}">
              <span class="routine-card__last-run-status">
                ${lastRun.status === "success"
                  ? "✓"
                  : lastRun.status === "failed"
                    ? "✗"
                    : "⟳"}
              </span>
              <span class="routine-card__last-run-time">
                ${lastRun.status === "running" ? "Running now..." : `Last run ${formatTimeAgo(lastRun.timestamp)}`}
              </span>
            </div>
          `
        : nothing}
      <div class="routine-card__actions">
        <button
          class="btn btn--sm btn--outline"
          @click=${() => props.onRoutineEdit(routine.id)}
        >
          Configure
        </button>
        ${routine.enabled
          ? html`
              <button
                class="btn btn--sm btn--primary"
                @click=${() => props.onRoutineRunNow(routine.id)}
              >
                Run Now
              </button>
            `
          : nothing}
      </div>
    </div>
  `;
}
