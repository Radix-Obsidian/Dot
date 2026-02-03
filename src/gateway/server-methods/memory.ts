import type { GatewayRequestHandlers } from "./types.js";
import { loadConfig } from "../../config/config.js";
import { getMemorySearchManager } from "../../memory/index.js";
import { ErrorCodes, errorShape } from "../protocol/index.js";
import { formatForLog } from "../ws-log.js";

export type MemoryStatusResult = {
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
  sources?: Array<"memory" | "sessions">;
  extraPaths?: string[];
  sourceCounts?: Array<{ source: "memory" | "sessions"; files: number; chunks: number }>;
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
  source: "memory" | "sessions";
};

export type MemorySearchApiResult = {
  results: MemorySearchResultItem[];
  provider?: string;
  model?: string;
  fallback?: { from: string; reason?: string };
  error?: string;
};

export const memoryHandlers: GatewayRequestHandlers = {
  "memory.status": async ({ respond, context, params }) => {
    const agentId = typeof params?.agentId === "string" ? params.agentId : "default";
    try {
      const cfg = loadConfig();
      const { manager, error } = await getMemorySearchManager({
        cfg,
        agentId,
      });
      if (!manager) {
        respond(true, { enabled: false, agentId, error } satisfies MemoryStatusResult, undefined);
        return;
      }
      const status = manager.status();
      respond(
        true,
        {
          enabled: true,
          agentId,
          ...status,
        } satisfies MemoryStatusResult,
        undefined,
      );
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
    }
  },

  "memory.search": async ({ respond, context, params }) => {
    const agentId = typeof params?.agentId === "string" ? params.agentId : "default";
    const query = typeof params?.query === "string" ? params.query : "";
    const maxResults = typeof params?.maxResults === "number" ? params.maxResults : undefined;
    const minScore = typeof params?.minScore === "number" ? params.minScore : undefined;

    if (!query.trim()) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "query is required"));
      return;
    }

    try {
      const cfg = loadConfig();
      const { manager, error } = await getMemorySearchManager({
        cfg,
        agentId,
      });
      if (!manager) {
        respond(true, { results: [], error } satisfies MemorySearchApiResult, undefined);
        return;
      }
      const results = await manager.search(query, { maxResults, minScore });
      const status = manager.status();
      respond(
        true,
        {
          results,
          provider: status.provider,
          model: status.model,
          fallback: status.fallback,
        } satisfies MemorySearchApiResult,
        undefined,
      );
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
    }
  },

  "memory.sync": async ({ respond, context, params }) => {
    const agentId = typeof params?.agentId === "string" ? params.agentId : "default";
    try {
      const cfg = loadConfig();
      const { manager, error } = await getMemorySearchManager({
        cfg,
        agentId,
      });
      if (!manager) {
        respond(true, { synced: false, error }, undefined);
        return;
      }
      await manager.sync({ reason: "manual" });
      respond(true, { synced: true }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
    }
  },
};
