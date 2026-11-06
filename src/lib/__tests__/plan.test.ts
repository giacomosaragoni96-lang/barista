import { describe, expect, it, vi } from 'vitest'
import { isPro, planStatus, type Plan } from '../plan'

const now = new Date('2026-11-06T12:00:00Z')
const future = '2026-11-20T00:00:00Z'
const past = '2026-10-01T00:00:00Z'
const plans: Record<string, Plan> = {
  free: { status: 'free' },
  trialActive: { status: 'trial', until: future },
  trialExpired: { status: 'trial', until: past },
  pro: { status: 'pro' },
}

describe('piano con PRO_ENABLED=false (app gratuita)', () => {
  it('tutto sbloccato per qualunque piano salvato', () => {
    for (const p of Object.values(plans)) {
      expect(isPro(p, now)).toBe(true)
      expect(planStatus(p, now)).toBe('pro')
    }
  })
})

describe('piano con PRO_ENABLED=true (comportamento Pro)', () => {
  it('free=false, prova attiva=true, scaduta=false, pro=true', async () => {
    vi.resetModules()
    vi.doMock('../../config/features', () => ({ PRO_ENABLED: true }))
    const m = await import('../plan')
    expect(m.isPro(plans.free, now)).toBe(false)
    expect(m.isPro(plans.trialActive, now)).toBe(true)
    expect(m.isPro(plans.trialExpired, now)).toBe(false)
    expect(m.isPro(plans.pro, now)).toBe(true)
    expect(m.planStatus(plans.trialExpired, now)).toBe('trial-expired')
    vi.doUnmock('../../config/features')
  })
})
