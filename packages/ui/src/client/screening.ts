import type { ApiResult, ScreeningRun, ScreeningStrategy } from '@aster/core'
import type { AsterClient } from '../client'

/**
 * Defensive loader for the V5 screening IPC surface.
 *
 * `AsterClient.screening` is wired by the Lead at integration (preload +
 * renderer client). Everything here degrades to `null` / `[]` when the
 * channel (or one of its methods) is missing, so the Discover UI never
 * crashes before wiring — mirroring the alerts loader contract.
 */

export interface ScreeningRunRequest {
  strategy: ScreeningStrategy
  universe?: string[]
  market?: string
  filters?: Record<string, unknown>
  limit: number
}

export interface ScreeningChannel {
  run: (input: ScreeningRunRequest) => Promise<ApiResult<ScreeningRun>>
  listRuns: () => Promise<ApiResult<ScreeningRun[]>>
  getRun: (input: { runId: string }) => Promise<ApiResult<ScreeningRun | undefined>>
}

function channel(client: AsterClient): Partial<ScreeningChannel> {
  // Structural extension point: the Lead adds `screening` to AsterClient.
  const screening = (client as { screening?: Partial<ScreeningChannel> }).screening
  return screening ?? {}
}

/** Run one screening task; null when the channel is absent or fails. */
export async function runScreening(client: AsterClient, request: ScreeningRunRequest): Promise<ScreeningRun | null> {
  const run = channel(client).run
  if (typeof run !== 'function') return null
  try {
    const result = await run(request)
    return result.ok ? result.data : null
  } catch {
    return null
  }
}

/** Hydrate the previous-runs history; [] when the channel is absent or fails. */
export async function listScreeningRuns(client: AsterClient): Promise<ScreeningRun[]> {
  const listRuns = channel(client).listRuns
  if (typeof listRuns !== 'function') return []
  try {
    const result = await listRuns()
    return result.ok ? (result.data ?? []) : []
  } catch {
    return []
  }
}

/** Re-open one run by id; null when the channel is absent or fails. */
export async function getScreeningRun(client: AsterClient, runId: string): Promise<ScreeningRun | null> {
  const getRun = channel(client).getRun
  if (typeof getRun !== 'function') return null
  try {
    const result = await getRun({ runId })
    return result.ok ? (result.data ?? null) : null
  } catch {
    return null
  }
}
