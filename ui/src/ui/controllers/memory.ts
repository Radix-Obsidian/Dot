import type { GatewayBrowserClient } from "../gateway";
import type { MemoryStatusData, MemorySearchResultItem } from "../views/memory";

export type MemoryState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  memoryLoading: boolean;
  memoryStatus: MemoryStatusData | null;
  memoryError: string | null;
  memorySearchQuery: string;
  memorySearchResults: MemorySearchResultItem[];
  memorySearching: boolean;
  memorySyncing: boolean;
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export async function loadMemoryStatus(state: MemoryState, agentId = "default"): Promise<void> {
  if (!state.client || !state.connected) return;
  if (state.memoryLoading) return;
  state.memoryLoading = true;
  state.memoryError = null;
  try {
    const res = (await state.client.request("memory.status", { agentId })) as
      | MemoryStatusData
      | undefined;
    if (res) state.memoryStatus = res;
  } catch (err) {
    state.memoryError = getErrorMessage(err);
  } finally {
    state.memoryLoading = false;
  }
}

export async function searchMemory(state: MemoryState, agentId = "default"): Promise<void> {
  if (!state.client || !state.connected) return;
  const query = state.memorySearchQuery.trim();
  if (!query) return;
  if (state.memorySearching) return;
  state.memorySearching = true;
  state.memoryError = null;
  try {
    const res = (await state.client.request("memory.search", { agentId, query })) as
      | { results: MemorySearchResultItem[]; error?: string }
      | undefined;
    if (res) {
      state.memorySearchResults = res.results ?? [];
      if (res.error) state.memoryError = res.error;
    }
  } catch (err) {
    state.memoryError = getErrorMessage(err);
  } finally {
    state.memorySearching = false;
  }
}

export async function syncMemoryIndex(state: MemoryState, agentId = "default"): Promise<void> {
  if (!state.client || !state.connected) return;
  if (state.memorySyncing) return;
  state.memorySyncing = true;
  state.memoryError = null;
  try {
    await state.client.request("memory.sync", { agentId });
    await loadMemoryStatus(state, agentId);
  } catch (err) {
    state.memoryError = getErrorMessage(err);
  } finally {
    state.memorySyncing = false;
  }
}

export function updateMemorySearchQuery(state: MemoryState, query: string): void {
  state.memorySearchQuery = query;
}
