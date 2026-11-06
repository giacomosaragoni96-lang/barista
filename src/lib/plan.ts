import { pricing } from '../config/pricing'

export interface Plan {
  status: 'free' | 'trial' | 'pro'
  /** ISO, scadenza della prova */
  until?: string
}

/** Chiavi i18n delle funzioni Pro. */
export const PRO_FEATURES = ['pantry', 'canMake', 'scale'] as const
export type ProFeature = (typeof PRO_FEATURES)[number]

export type PlanStatus = 'free' | 'trial' | 'trial-expired' | 'pro'

export function planStatus(plan: Plan, now: Date = new Date()): PlanStatus {
  if (plan.status === 'pro') return 'pro'
  if (plan.status === 'trial') {
    const end = plan.until ? Date.parse(plan.until) : NaN
    return Number.isFinite(end) && end > now.getTime() ? 'trial' : 'trial-expired'
  }
  return 'free'
}

export function isPro(plan: Plan, now: Date = new Date()): boolean {
  const s = planStatus(plan, now)
  return s === 'pro' || s === 'trial'
}

export function startTrial(now: Date = new Date()): Plan {
  const until = new Date(now.getTime() + pricing.trialDays * 86_400_000)
  return { status: 'trial', until: until.toISOString() }
}
