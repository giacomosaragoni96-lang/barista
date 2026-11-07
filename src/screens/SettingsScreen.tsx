import { useState } from 'react'
import { Button } from '../components/Button'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { Segmented, UnitToggle } from '../components/UnitToggle'
import { useT } from '../i18n'
import { repo } from '../lib/storage'
import { useSettings } from '../state/store'
import type { Lang } from '../data/types'

const APP_VERSION = '1.0.0'
const LANGS: Lang[] = ['en', 'it']

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="mb-3 text-[18px] font-semibold">{label}</div>
      {hint && <div className="-mt-2 mb-3 text-[14.5px] text-muted">{hint}</div>}
      {children}
    </div>
  )
}

export default function SettingsScreen() {
  const t = useT()
  const settings = useSettings()
  const [confirm, setConfirm] = useState(false)

  return (
    <div className="flex flex-col gap-3 px-4 pb-8 pt-6">
      <h1 className="font-display m-0 mb-1 px-1 text-[32px]">{t.settings.title}</h1>

      <Row label={t.settings.language}>
        <Segmented<Lang> label={t.settings.language} value={settings.lang} onChange={settings.setLang}
          options={LANGS.map((l) => ({ value: l, label: t.settings.languages[l] }))} />
      </Row>

      <Row label={t.settings.units} hint={t.settings.unitsHint}>
        <UnitToggle value={settings.units} onChange={settings.setUnits} />
      </Row>

      <Button variant="danger" size="lg" block onClick={() => setConfirm(true)}>{t.settings.reset}</Button>

      <div className="mt-4 px-1 text-center text-[14.5px] text-muted">
        <p className="m-0">{t.settings.version} {APP_VERSION}</p>
        <p className="mb-0 mt-1">{t.settings.responsibly}</p>
      </div>

      <ConfirmSheet open={confirm} message={t.settings.resetConfirm} confirmLabel={t.settings.reset} danger
        onConfirm={() => { void repo.clearAll().then(() => location.reload()) }} onClose={() => setConfirm(false)} />
    </div>
  )
}
