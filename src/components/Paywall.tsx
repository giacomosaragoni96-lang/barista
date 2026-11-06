import { PRO_ENABLED } from '../config/features'
import { useLang, useT } from '../i18n'
import { currencyForLang, formatPrice, prices, pricing } from '../config/pricing'
import { planStatus } from '../lib/plan'
import { usePlan } from '../state/store'
import { Button } from './Button'
import { Icon, type IconName } from './Icon'
import { ProBadge } from './ProBadge'
import { Sheet } from './Sheet'

const FEATURES: { key: 'pantry' | 'canMake' | 'scale'; icon: IconName }[] = [
  { key: 'pantry', icon: 'bottle' },
  { key: 'canMake', icon: 'sparkles' },
  { key: 'scale', icon: 'plus' },
]

/** Contenuto del paywall: usabile inline o dentro uno Sheet. */
export function Paywall({ onDone }: { onDone?: () => void }) {
  const t = useT()
  const lang = useLang()
  const { plan, startTrial } = usePlan()
  const price = prices[currencyForLang(lang)]
  const expired = planStatus(plan) === 'trial-expired'
  if (!PRO_ENABLED) return null
  return (
    <div className="px-5 pb-6 pt-4">
      <div className="flex items-center gap-2"><ProBadge /><span className="text-[15px] text-muted">{t.pro.locked}</span></div>
      <h2 className="font-display m-0 mt-2 text-[30px] leading-tight">{t.pro.title}</h2>
      <p className="mb-5 mt-2 text-muted">{t.pro.pitch}</p>
      <ul className="m-0 flex list-none flex-col gap-4 p-0">
        {FEATURES.map((f) => (
          <li key={f.key} className="flex gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2 text-gold"><Icon name={f.icon} /></span>
            <span>
              <span className="block text-[18px] font-semibold">{t.pro.featureList[f.key].title}</span>
              <span className="block text-[15px] text-muted">{t.pro.featureList[f.key].desc}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="card p-3">
          <div className="text-[14px] text-muted">{t.pro.monthly}</div>
          <div className="font-display text-[24px]" style={{ fontVariantNumeric: 'tabular-nums' }}>{formatPrice(price.monthly, lang)}</div>
          <div className="text-[13.5px] text-muted">{t.pro.perMonth} · {t.pro.perVenue}</div>
        </div>
        <div className="card p-3" style={{ borderColor: 'var(--color-amber)' }}>
          <div className="text-[14px] text-amber">{t.pro.yearly} · {t.pro.bestValue}</div>
          <div className="font-display text-[24px]" style={{ fontVariantNumeric: 'tabular-nums' }}>{formatPrice(price.yearly, lang)}</div>
          <div className="text-[13.5px] text-muted">{t.pro.perYear} · {t.pro.perVenue}</div>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3">
        {expired && <p className="m-0 text-center text-miss">{t.pro.trialEnded}</p>}
        <Button variant="primary" size="lg" block onClick={() => { startTrial(); onDone?.() }}>
          {t.pro.trial(pricing.trialDays)}
        </Button>
        <Button size="lg" block disabled>{t.pro.subscribeSoon}</Button>
        <p className="m-0 text-center text-[13.5px] text-muted">{t.pro.placeholderNote}</p>
      </div>
    </div>
  )
}

export function PaywallSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!PRO_ENABLED) return null
  return (
    <Sheet open={open} onClose={onClose}>
      <div className="-mx-5 -mb-5"><Paywall onDone={onClose} /></div>
    </Sheet>
  )
}
