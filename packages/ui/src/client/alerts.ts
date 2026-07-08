import type { AlertRule, AlertTriggerEvent, ApiResult } from '@aster/core';
import type { AsterClient } from '../client';

/**
 * Defensive loader for the alert IPC surface.
 *
 * `AsterClient.alerts` still carries the V1 `{ load, save }` shape until the
 * Lead wires the new channels. Everything here degrades to an empty result when
 * a channel (or its methods) is missing, so the UI never crashes before wiring.
 */

/** The new alert channel surface (wired by the Lead at integration). */
export interface AlertsChannel {
  loadRules: () => Promise<ApiResult<AlertRule[]>>;
  saveRules: (rules: AlertRule[]) => Promise<ApiResult<void>>;
  listEvents: () => Promise<ApiResult<AlertTriggerEvent[]>>;
}

export const EMPTY_RULES: readonly AlertRule[] = [];
export const EMPTY_EVENTS: readonly AlertTriggerEvent[] = [];

function channel(client: AsterClient): Partial<AlertsChannel> {
  const alerts = (client as { alerts?: Partial<AlertsChannel> }).alerts;
  return alerts ?? {};
}

/** Load rules; returns [] when the channel is absent or fails. */
export async function loadAlertRules(client: AsterClient): Promise<AlertRule[]> {
  const loadRules = channel(client).loadRules;
  if (typeof loadRules !== 'function') return [...EMPTY_RULES];
  try {
    const result = await loadRules();
    return result.ok ? (result.data ?? [...EMPTY_RULES]) : [...EMPTY_RULES];
  } catch {
    return [...EMPTY_RULES];
  }
}

/** Persist rules; returns false (silently) when the channel is absent/fails. */
export async function saveAlertRules(client: AsterClient, rules: AlertRule[]): Promise<boolean> {
  const saveRules = channel(client).saveRules;
  if (typeof saveRules !== 'function') return false;
  try {
    const result = await saveRules(rules);
    return result.ok;
  } catch {
    return false;
  }
}

/** Load recent trigger events; returns [] when the channel is absent/fails. */
export async function loadAlertEvents(client: AsterClient): Promise<AlertTriggerEvent[]> {
  const listEvents = channel(client).listEvents;
  if (typeof listEvents !== 'function') return [...EMPTY_EVENTS];
  try {
    const result = await listEvents();
    return result.ok ? (result.data ?? [...EMPTY_EVENTS]) : [...EMPTY_EVENTS];
  } catch {
    return [...EMPTY_EVENTS];
  }
}
