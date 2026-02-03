import { html, nothing } from "lit";
import { icons } from "../icons";

export type ProfileProps = {
  connected: boolean;
  // User info
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  // Preferences
  preferences: UserPreferences;
  // Stats
  stats: UserStats;
  // Handlers
  onPreferenceChange: (key: keyof UserPreferences, value: unknown) => void;
  onNavigateToAdvanced: () => void;
  onSignOut: () => void;
  onExportData: () => void;
};

export type UserPreferences = {
  // Tone & Voice
  creatorTone: "friendly" | "professional" | "casual" | "bold" | "custom";
  customToneDescription?: string;
  // Autonomy
  autonomyLevel: number; // 0-100, default 70
  // Notifications
  dailyRecapTime: string; // "22:00"
  weeklyPlanDay: "sunday" | "monday" | "saturday";
  weeklyPlanTime: string; // "19:00"
  notificationDigest: boolean;
  // Privacy
  saveMemories: boolean;
  shareAnalytics: boolean;
};

export type UserStats = {
  messagesHandled: number;
  recapsSent: number;
  followUpsTracked: number;
  timeSaved: string; // "12h this week"
  memberSince: string;
};

const TONE_OPTIONS = [
  { value: "friendly", label: "Friendly", description: "Warm, approachable, uses emojis occasionally" },
  { value: "professional", label: "Professional", description: "Clear, polished, business-appropriate" },
  { value: "casual", label: "Casual", description: "Relaxed, conversational, like texting a friend" },
  { value: "bold", label: "Bold", description: "Confident, direct, makes an impact" },
  { value: "custom", label: "Custom", description: "Define your own voice" },
];

export function renderProfile(props: ProfileProps) {
  return html`
    <div class="profile">
      <!-- Header -->
      <section class="profile-header">
        <div class="profile-header__avatar">
          ${props.userAvatar
            ? html`<img src="${props.userAvatar}" alt="${props.userName}" />`
            : html`<span class="profile-header__avatar-placeholder">${icons.user}</span>`}
        </div>
        <div class="profile-header__info">
          <h1 class="profile-header__name">${props.userName}</h1>
          ${props.userEmail
            ? html`<p class="profile-header__email">${props.userEmail}</p>`
            : nothing}
          <p class="profile-header__member">Member since ${props.stats.memberSince}</p>
        </div>
      </section>

      <!-- Stats -->
      <section class="profile-section">
        <h2 class="profile-section__title">Your Impact</h2>
        <div class="profile-stats">
          <div class="profile-stat">
            <span class="profile-stat__value">${props.stats.messagesHandled}</span>
            <span class="profile-stat__label">Messages Handled</span>
          </div>
          <div class="profile-stat">
            <span class="profile-stat__value">${props.stats.recapsSent}</span>
            <span class="profile-stat__label">Recaps Sent</span>
          </div>
          <div class="profile-stat">
            <span class="profile-stat__value">${props.stats.followUpsTracked}</span>
            <span class="profile-stat__label">Follow-ups Tracked</span>
          </div>
          <div class="profile-stat profile-stat--highlight">
            <span class="profile-stat__value">${props.stats.timeSaved}</span>
            <span class="profile-stat__label">Time Saved</span>
          </div>
        </div>
      </section>

      <!-- Voice & Tone -->
      <section class="profile-section">
        <h2 class="profile-section__title">Your Voice</h2>
        <p class="profile-section__description">
          How should Dot sound when suggesting replies on your behalf?
        </p>
        <div class="profile-tone-options">
          ${TONE_OPTIONS.map(
            (option) => html`
              <label class="profile-tone-option ${props.preferences.creatorTone === option.value ? 'profile-tone-option--selected' : ''}">
                <input
                  type="radio"
                  name="tone"
                  value="${option.value}"
                  .checked=${props.preferences.creatorTone === option.value}
                  @change=${() => props.onPreferenceChange("creatorTone", option.value)}
                />
                <div class="profile-tone-option__content">
                  <span class="profile-tone-option__label">${option.label}</span>
                  <span class="profile-tone-option__description">${option.description}</span>
                </div>
              </label>
            `
          )}
        </div>
        ${props.preferences.creatorTone === "custom"
          ? html`
              <div class="profile-custom-tone">
                <label class="field">
                  <span>Describe your voice</span>
                  <textarea
                    placeholder="e.g., 'I'm enthusiastic but not over the top. I use 'haha' instead of 'lol'. I always thank people for their support.'"
                    .value=${props.preferences.customToneDescription ?? ""}
                    @input=${(e: Event) => {
                      const target = e.target as HTMLTextAreaElement;
                      props.onPreferenceChange("customToneDescription", target.value);
                    }}
                  ></textarea>
                </label>
              </div>
            `
          : nothing}
      </section>

      <!-- Autonomy Level -->
      <section class="profile-section">
        <h2 class="profile-section__title">Autonomy Level</h2>
        <p class="profile-section__description">
          How proactive should Dot be? Higher = more automation, Lower = more control.
        </p>
        <div class="profile-autonomy">
          <div class="profile-autonomy__slider">
            <input
              type="range"
              min="0"
              max="100"
              .value=${String(props.preferences.autonomyLevel)}
              @input=${(e: Event) => {
                const target = e.target as HTMLInputElement;
                props.onPreferenceChange("autonomyLevel", parseInt(target.value, 10));
              }}
            />
            <div class="profile-autonomy__labels">
              <span>Ask me first</span>
              <span class="profile-autonomy__value">${props.preferences.autonomyLevel}%</span>
              <span>Be proactive</span>
            </div>
          </div>
          <div class="profile-autonomy__explainer">
            ${props.preferences.autonomyLevel < 30
              ? "Dot will ask before taking most actions. You're in full control."
              : props.preferences.autonomyLevel < 70
                ? "Balanced mode. Dot handles routine tasks but checks with you on important decisions."
                : "Dot handles most things automatically. You'll get summaries and can override when needed."}
          </div>
        </div>
      </section>

      <!-- Routine Timing -->
      <section class="profile-section">
        <h2 class="profile-section__title">Routine Timing</h2>
        <div class="profile-timing">
          <label class="field">
            <span>Daily Recap Time</span>
            <input
              type="time"
              .value=${props.preferences.dailyRecapTime}
              @change=${(e: Event) => {
                const target = e.target as HTMLInputElement;
                props.onPreferenceChange("dailyRecapTime", target.value);
              }}
            />
          </label>
          <label class="field">
            <span>Weekly Planning Day</span>
            <select
              .value=${props.preferences.weeklyPlanDay}
              @change=${(e: Event) => {
                const target = e.target as HTMLSelectElement;
                props.onPreferenceChange("weeklyPlanDay", target.value);
              }}
            >
              <option value="sunday">Sunday</option>
              <option value="monday">Monday</option>
              <option value="saturday">Saturday</option>
            </select>
          </label>
          <label class="field">
            <span>Weekly Planning Time</span>
            <input
              type="time"
              .value=${props.preferences.weeklyPlanTime}
              @change=${(e: Event) => {
                const target = e.target as HTMLInputElement;
                props.onPreferenceChange("weeklyPlanTime", target.value);
              }}
            />
          </label>
        </div>
      </section>

      <!-- Privacy -->
      <section class="profile-section">
        <h2 class="profile-section__title">Privacy & Data</h2>
        <div class="profile-toggles">
          <label class="profile-toggle">
            <div class="profile-toggle__content">
              <span class="profile-toggle__label">Save Memories</span>
              <span class="profile-toggle__description">
                Let Dot remember important details from your conversations
              </span>
            </div>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${props.preferences.saveMemories}
                @change=${(e: Event) => {
                  const target = e.target as HTMLInputElement;
                  props.onPreferenceChange("saveMemories", target.checked);
                }}
              />
              <span class="toggle__slider"></span>
            </label>
          </label>
          <label class="profile-toggle">
            <div class="profile-toggle__content">
              <span class="profile-toggle__label">Share Analytics</span>
              <span class="profile-toggle__description">
                Help improve Dot by sharing anonymous usage data
              </span>
            </div>
            <label class="toggle">
              <input
                type="checkbox"
                .checked=${props.preferences.shareAnalytics}
                @change=${(e: Event) => {
                  const target = e.target as HTMLInputElement;
                  props.onPreferenceChange("shareAnalytics", target.checked);
                }}
              />
              <span class="toggle__slider"></span>
            </label>
          </label>
        </div>
        <button class="btn btn--outline profile-export" @click=${props.onExportData}>
          Export My Data
        </button>
      </section>

      <!-- Advanced Settings -->
      <section class="profile-section profile-section--advanced">
        <button class="profile-advanced-link" @click=${props.onNavigateToAdvanced}>
          <div class="profile-advanced-link__content">
            <span class="profile-advanced-link__icon">${icons.settings}</span>
            <div class="profile-advanced-link__text">
              <span class="profile-advanced-link__label">Advanced Settings</span>
              <span class="profile-advanced-link__description">
                Gateway configuration, diagnostics, and developer tools
              </span>
            </div>
          </div>
          <span class="profile-advanced-link__arrow">→</span>
        </button>
      </section>

      <!-- Sign Out -->
      <section class="profile-section">
        <button class="btn btn--danger-outline profile-signout" @click=${props.onSignOut}>
          Sign Out
        </button>
      </section>
    </div>
  `;
}
