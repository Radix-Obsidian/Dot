import { html, nothing } from "lit";

export type OnboardingStep = "welcome" | "channel" | "allowlist" | "memory" | "complete";

export type OnboardingProps = {
  step: OnboardingStep;
  channelConnected: boolean;
  channelType: "telegram" | "whatsapp" | null;
  allowlistConfigured: boolean;
  memoryEnabled: boolean;
  loading: boolean;
  error: string | null;
  onStepChange: (step: OnboardingStep) => void;
  onConnectTelegram: () => void;
  onConnectWhatsApp: () => void;
  onConfigureAllowlist: () => void;
  onEnableMemory: () => void;
  onComplete: () => void;
  onSkip: () => void;
};

export function renderOnboarding(props: OnboardingProps) {
  return html`
    <div class="onboarding-container" style="max-width: 600px; margin: 0 auto; padding: 24px;">
      ${renderProgress(props)}
      ${props.error
        ? html`<div class="callout danger" style="margin-bottom: 16px;">${props.error}</div>`
        : nothing}
      ${renderStepContent(props)}
    </div>
  `;
}

function renderProgress(props: OnboardingProps) {
  const steps: Array<{ key: OnboardingStep; label: string }> = [
    { key: "welcome", label: "Welcome" },
    { key: "channel", label: "Connect" },
    { key: "allowlist", label: "Allowlist" },
    { key: "memory", label: "Memory" },
    { key: "complete", label: "Done" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === props.step);

  return html`
    <div class="onboarding-progress" style="display: flex; justify-content: space-between; margin-bottom: 32px;">
      ${steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isComplete = index < currentIndex;
        return html`
          <div
            class="progress-step"
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              flex: 1;
              position: relative;
            "
          >
            <div
              style="
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: 600;
                background: ${isComplete
                  ? "var(--success-color, #0a7f5a)"
                  : isActive
                    ? "var(--primary-color, #3b82f6)"
                    : "var(--border-color, #333)"};
                color: ${isComplete || isActive ? "#fff" : "var(--muted-color)"};
              "
            >
              ${isComplete ? "✓" : index + 1}
            </div>
            <div
              style="
                margin-top: 8px;
                font-size: 12px;
                color: ${isActive ? "var(--text-color)" : "var(--muted-color)"};
              "
            >
              ${step.label}
            </div>
          </div>
        `;
      })}
    </div>
  `;
}

function renderStepContent(props: OnboardingProps) {
  switch (props.step) {
    case "welcome":
      return renderWelcome(props);
    case "channel":
      return renderChannel(props);
    case "allowlist":
      return renderAllowlist(props);
    case "memory":
      return renderMemory(props);
    case "complete":
      return renderComplete(props);
    default:
      return nothing;
  }
}

function renderWelcome(props: OnboardingProps) {
  return html`
    <section class="card">
      <div class="card-title" style="font-size: 24px; margin-bottom: 8px;">
        Welcome to Dot
      </div>
      <div class="card-sub" style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Your AI assistant for creators. Manage social, stay organized, create more.
      </div>

      <div style="margin-bottom: 24px; line-height: 1.7;">
        <p style="margin-bottom: 12px;">
          Dot handles the routine stuff so you can focus on creating — daily recaps, follow-up reminders,
          social notifications, and smart reply suggestions.
        </p>
        <p style="margin-bottom: 12px;">
          <strong>What Dot does for you:</strong>
        </p>
        <ul style="margin-left: 20px; margin-bottom: 16px;">
          <li>Daily recaps and weekly planning while you sleep</li>
          <li>Smart notifications from all your social accounts</li>
          <li>Reply suggestions in your voice</li>
        </ul>
      </div>

      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button class="btn" @click=${props.onSkip}>Skip onboarding</button>
        <button class="btn primary" @click=${() => props.onStepChange("channel")}>
          Get started
        </button>
      </div>
    </section>
  `;
}

function renderChannel(props: OnboardingProps) {
  return html`
    <section class="card">
      <div class="card-title">Connect a channel</div>
      <div class="card-sub" style="margin-bottom: 20px;">
        Connect your first messaging app. You can add more social accounts later.
      </div>

      <div style="display: grid; gap: 16px; margin-bottom: 24px;">
        <div
          class="channel-option"
          style="
            border: 1px solid var(--border-color, #333);
            border-radius: 8px;
            padding: 16px;
            cursor: pointer;
            transition: border-color 0.2s;
            ${props.channelType === "telegram" ? "border-color: var(--primary-color, #3b82f6);" : ""}
          "
          @click=${props.onConnectTelegram}
        >
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 24px;">📱</div>
            <div>
              <div style="font-weight: 600;">Telegram</div>
              <div style="font-size: 13px; color: var(--muted-color);">
                Reliable and fast. Recommended for getting started.
              </div>
            </div>
            ${props.channelType === "telegram" && props.channelConnected
              ? html`<span class="chip chip-ok" style="margin-left: auto;">Connected</span>`
              : nothing}
          </div>
        </div>

        <div
          class="channel-option"
          style="
            border: 1px solid var(--border-color, #333);
            border-radius: 8px;
            padding: 16px;
            cursor: pointer;
            transition: border-color 0.2s;
            ${props.channelType === "whatsapp" ? "border-color: var(--primary-color, #3b82f6);" : ""}
          "
          @click=${props.onConnectWhatsApp}
        >
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 24px;">💬</div>
            <div>
              <div style="font-weight: 600;">WhatsApp</div>
              <div style="font-size: 13px; color: var(--muted-color);">
                Beta. May require periodic re-linking.
              </div>
            </div>
            ${props.channelType === "whatsapp" && props.channelConnected
              ? html`<span class="chip chip-ok" style="margin-left: auto;">Connected</span>`
              : nothing}
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button class="btn" @click=${() => props.onStepChange("welcome")}>Back</button>
        <button
          class="btn primary"
          ?disabled=${!props.channelConnected}
          @click=${() => props.onStepChange("allowlist")}
        >
          Continue
        </button>
      </div>
    </section>
  `;
}

function renderAllowlist(props: OnboardingProps) {
  return html`
    <section class="card">
      <div class="card-title">Set up allowlist</div>
      <div class="card-sub" style="margin-bottom: 20px;">
        Control who Dot responds to. By default, only you can send messages.
      </div>

      <div style="margin-bottom: 24px; line-height: 1.7;">
        <p style="margin-bottom: 12px;">
          The allowlist ensures only trusted people can access your memory assistant.
          You can always adjust this later in Settings.
        </p>
        <div
          style="
            background: var(--card-bg-color, #1a1a1a);
            border: 1px solid var(--border-color, #333);
            border-radius: 8px;
            padding: 16px;
          "
        >
          <div style="font-weight: 600; margin-bottom: 8px;">Default security:</div>
          <ul style="margin-left: 20px; font-size: 14px;">
            <li>Only your account is allowed</li>
            <li>Mention gating enabled (must @mention to trigger)</li>
            <li>No group access by default</li>
          </ul>
        </div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button class="btn" @click=${() => props.onStepChange("channel")}>Back</button>
        <button class="btn" @click=${props.onConfigureAllowlist}>
          Configure allowlist
        </button>
        <button class="btn primary" @click=${() => props.onStepChange("memory")}>
          Use defaults
        </button>
      </div>
    </section>
  `;
}

function renderMemory(props: OnboardingProps) {
  return html`
    <section class="card">
      <div class="card-title">Enable memory</div>
      <div class="card-sub" style="margin-bottom: 20px;">
        Dot remembers important details so you don't have to repeat yourself.
      </div>

      <div style="margin-bottom: 24px; line-height: 1.7;">
        <div
          style="
            background: var(--card-bg-color, #1a1a1a);
            border: 1px solid var(--border-color, #333);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
          "
        >
          <div style="font-weight: 600; margin-bottom: 12px;">How memory works:</div>
          <ul style="margin-left: 20px; font-size: 14px;">
            <li style="margin-bottom: 8px;">
              <strong>Automatic capture:</strong> Important decisions, preferences, and facts are
              extracted and stored automatically.
            </li>
            <li style="margin-bottom: 8px;">
              <strong>Reliable recall:</strong> Ask "What did I decide about X?" and get sourced
              answers from your saved memory.
            </li>
            <li style="margin-bottom: 8px;">
              <strong>Vector search:</strong> Find related notes even when you phrase things
              differently.
            </li>
          </ul>
        </div>

        <div class="chip-row" style="margin-top: 12px;">
          ${props.memoryEnabled
            ? html`<span class="chip chip-ok">Memory enabled</span>`
            : html`<span class="chip chip-warn">Memory not enabled</span>`}
        </div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button class="btn" @click=${() => props.onStepChange("allowlist")}>Back</button>
        ${!props.memoryEnabled
          ? html`
              <button class="btn primary" ?disabled=${props.loading} @click=${props.onEnableMemory}>
                ${props.loading ? "Enabling…" : "Enable memory"}
              </button>
            `
          : html`
              <button class="btn primary" @click=${() => props.onStepChange("complete")}>
                Continue
              </button>
            `}
      </div>
    </section>
  `;
}

function renderComplete(props: OnboardingProps) {
  return html`
    <section class="card">
      <div style="text-align: center; padding: 20px 0;">
        <div style="font-size: 48px; margin-bottom: 16px;">✨</div>
        <div class="card-title" style="font-size: 24px; margin-bottom: 8px;">
          You're all set!
        </div>
        <div class="card-sub" style="font-size: 16px; margin-bottom: 24px;">
          Dot is ready to help you create more and stress less.
        </div>
      </div>

      <div
        style="
          background: var(--card-bg-color, #1a1a1a);
          border: 1px solid var(--border-color, #333);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
        "
      >
        <div style="font-weight: 600; margin-bottom: 12px;">Quick tips:</div>
        <ul style="margin-left: 20px; font-size: 14px; line-height: 1.8;">
          <li>
            Say <code>"Remember: Alex prefers meetings after 2pm"</code> to store a note.
          </li>
          <li>
            Ask <code>"What did I say about Alex's schedule?"</code> to recall.
          </li>
          <li>
            Use the <strong>Memory</strong> tab in this dashboard to search and manage your memories.
          </li>
        </ul>
      </div>

      <div style="display: flex; gap: 12px; justify-content: center;">
        <button class="btn primary" @click=${props.onComplete}>
          Open dashboard
        </button>
      </div>
    </section>
  `;
}
