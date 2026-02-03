import type { GatewayBrowserClient } from "../gateway";
import type { OnboardingStep } from "../views/onboarding";

export type OnboardingState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  onboardingStep: OnboardingStep;
  onboardingChannelConnected: boolean;
  onboardingChannelType: "telegram" | "whatsapp" | null;
  onboardingAllowlistConfigured: boolean;
  onboardingMemoryEnabled: boolean;
  onboardingLoading: boolean;
  onboardingError: string | null;
  onboarding: boolean;
  setTab: (tab: string) => void;
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export function setOnboardingStep(state: OnboardingState, step: OnboardingStep): void {
  state.onboardingStep = step;
}

export async function connectTelegramChannel(state: OnboardingState): Promise<void> {
  if (!state.client || !state.connected) return;
  state.onboardingLoading = true;
  state.onboardingError = null;
  try {
    // Check if Telegram is already configured
    const status = (await state.client.request("channels.status", {})) as {
      channels?: Array<{ kind: string; connected?: boolean }>;
    };
    const telegram = status?.channels?.find((c) => c.kind === "telegram");
    if (telegram?.connected) {
      state.onboardingChannelType = "telegram";
      state.onboardingChannelConnected = true;
    } else {
      // Redirect to channels tab for Telegram setup
      state.onboardingChannelType = "telegram";
      state.onboardingError =
        "Please configure Telegram in the Channels tab, then return to complete onboarding.";
    }
  } catch (err) {
    state.onboardingError = getErrorMessage(err);
  } finally {
    state.onboardingLoading = false;
  }
}

export async function connectWhatsAppChannel(state: OnboardingState): Promise<void> {
  if (!state.client || !state.connected) return;
  state.onboardingLoading = true;
  state.onboardingError = null;
  try {
    // Check if WhatsApp is already configured
    const status = (await state.client.request("channels.status", {})) as {
      channels?: Array<{ kind: string; connected?: boolean }>;
    };
    const whatsapp = status?.channels?.find((c) => c.kind === "whatsapp");
    if (whatsapp?.connected) {
      state.onboardingChannelType = "whatsapp";
      state.onboardingChannelConnected = true;
    } else {
      // Redirect to channels tab for WhatsApp setup
      state.onboardingChannelType = "whatsapp";
      state.onboardingError =
        "Please configure WhatsApp in the Channels tab, then return to complete onboarding.";
    }
  } catch (err) {
    state.onboardingError = getErrorMessage(err);
  } finally {
    state.onboardingLoading = false;
  }
}

export function configureAllowlist(state: OnboardingState): void {
  // Redirect to config tab for allowlist setup
  state.setTab("config");
}

export async function enableMemory(state: OnboardingState): Promise<void> {
  if (!state.client || !state.connected) return;
  state.onboardingLoading = true;
  state.onboardingError = null;
  try {
    // Check current memory status
    const memoryStatus = (await state.client.request("memory.status", { agentId: "default" })) as {
      enabled?: boolean;
    };
    if (memoryStatus?.enabled) {
      state.onboardingMemoryEnabled = true;
      state.onboardingStep = "complete";
      return;
    }

    // Enable memory search in config
    await state.client.request("config.patch", {
      path: ["agents", "defaults", "memorySearch", "enabled"],
      value: true,
    });

    // Re-check status
    const newStatus = (await state.client.request("memory.status", { agentId: "default" })) as {
      enabled?: boolean;
    };
    state.onboardingMemoryEnabled = newStatus?.enabled ?? false;

    if (state.onboardingMemoryEnabled) {
      state.onboardingStep = "complete";
    }
  } catch (err) {
    state.onboardingError = getErrorMessage(err);
  } finally {
    state.onboardingLoading = false;
  }
}

export function completeOnboarding(state: OnboardingState): void {
  state.onboarding = false;
  state.setTab("chat");
}

export function skipOnboarding(state: OnboardingState): void {
  state.onboarding = false;
  state.setTab("chat");
}

export async function checkOnboardingStatus(state: OnboardingState): Promise<void> {
  if (!state.client || !state.connected) return;
  try {
    // Check channel status
    const channelsStatus = (await state.client.request("channels.status", {})) as {
      channels?: Array<{ kind: string; connected?: boolean }>;
    };
    const telegram = channelsStatus?.channels?.find((c) => c.kind === "telegram");
    const whatsapp = channelsStatus?.channels?.find((c) => c.kind === "whatsapp");

    if (telegram?.connected) {
      state.onboardingChannelType = "telegram";
      state.onboardingChannelConnected = true;
    } else if (whatsapp?.connected) {
      state.onboardingChannelType = "whatsapp";
      state.onboardingChannelConnected = true;
    }

    // Check memory status
    const memoryStatus = (await state.client.request("memory.status", { agentId: "default" })) as {
      enabled?: boolean;
    };
    state.onboardingMemoryEnabled = memoryStatus?.enabled ?? false;
  } catch {
    // Ignore errors during status check
  }
}
