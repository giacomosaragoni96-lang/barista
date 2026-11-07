import { useMemo, useState } from 'react'
import type { IngredientCategory } from '../data/types'
import { Button } from '../components/Button'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { SearchBar } from '../components/SearchBar'
import { tap } from '../hooks/haptic'
import { useLang, useT } from '../i18n'
import { ingredientsByCategory } from '../lib/catalog'
import { BASIC_KIT } from '../lib/pantry'
import { normalize } from '../lib/normalize'
import { navigate, paths } from '../router'
import { usePantry } from '../state/store'

const ORDER: IngredientCategory[] = ['spirit', 'liqueur', 'vermouth', 'amaro', 'bitter', 'wine', 'sparkling', 'beer', 'juice', 'syrup', 'soda', 'dairy', 'fresh', 'spice', 'garnish', 'other']

export default function PantryScreen() {
  const t = useT()
  const lang = useLang()
  const { pantry, has, toggle, addMany, clear } = usePantry()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<Set<string>>(new Set())
  const [confirm, setConfirm] = useState<'kit' | 'clear' | null>(null)

  const groups = useMemo(() => {
    const map = ingredientsByCategory()
    const nq = normalize(q.trim())
    return ORDER.map((cat) => {
      const all = (map.get(cat) ?? []).filter((i) => !i.assumed)
      const list = all
        .filter((i) => !nq || normalize(i.name[lang]).includes(nq) || normalize(i.name.en).includes(nq))
        .sort((a, b) => a.name[lang].localeCompare(b.name[lang], lang))
      return { cat, total: all.length, list }
    }).filter((g) => g.list.length)
  }, [q, lang])

  const toggleOpen = (c: string) => setOpen((s) => { const n = new Set(s); if (!n.delete(c)) n.add(c); return n })
  const searching = q.trim().length > 0

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-10 bg-bg px-4 pb-3 pt-5">
        <div className="flex items-baseline justify-between gap-3 px-1">
          <h1 className="font-display m-0 text-[32px]">{t.pantry.title}</h1>
          <span className="text-[16px] font-semibold text-amber" style={{ fontVariantNumeric: 'tabular-nums' }}>{t.pantry.count(pantry.size)}</span>
        </div>
        <p className="mb-3 mt-1 px-1 text-[15.5px] text-muted">{t.pantry.subtitle}</p>
        <SearchBar value={q} onChange={setQ} placeholder={t.pantry.searchPlaceholder} />
      </div>

      <div className="px-4">
        <button
          type="button"
          onClick={() => navigate(paths.canMake)}
          className="card flex min-h-[60px] w-full items-center gap-3 px-4 text-left text-cream active:bg-surface-2"
          style={{ borderColor: 'color-mix(in srgb, var(--color-amber) 50%, var(--color-line))' }}
        >
          <span className="text-amber"><Icon name="sparkles" /></span>
          <span className="flex-1 text-[18px] font-semibold">{t.canMake.title}</span>
          <Icon name="chevron-left" className="rotate-180 text-muted" />
        </button>

        <div className="mt-3 flex flex-wrap gap-3">
          <Button className="min-w-0 flex-1 !px-3" onClick={() => (pantry.size ? setConfirm('kit') : addMany(BASIC_KIT))}>{t.pantry.loadKit}</Button>
          <Button variant="ghost" className="!px-4" disabled={pantry.size === 0} onClick={() => setConfirm('clear')}>{t.pantry.clearAll}</Button>
        </div>

        {groups.length === 0 && <EmptyState title={t.pantry.noResults} />}
        <div className="mt-4 flex flex-col gap-3">
          {groups.map((g) => {
            const isOpen = searching || open.has(g.cat)
            const have = g.list.filter((i) => has(i.id)).length
            return (
              <section key={g.cat} className="card overflow-hidden">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleOpen(g.cat)}
                  className="flex min-h-[56px] w-full items-center gap-3 border-0 bg-transparent px-4 text-left text-cream"
                >
                  <span className="flex-1 text-[18px] font-semibold">{t.category[g.cat]}</span>
                  <span className={`text-[15px] ${have ? 'text-have' : 'text-muted'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>{have}/{g.total}</span>
                  <Icon name="chevron-down" className={`text-muted transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <ul className="m-0 list-none border-t border-line p-0">
                    {g.list.map((i) => {
                      const on = has(i.id)
                      return (
                        <li key={i.id} className="border-b border-line last:border-b-0">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={on}
                            onClick={() => { tap(); toggle(i.id) }}
                            className="flex min-h-[56px] w-full items-center gap-3 border-0 bg-transparent px-4 text-left text-cream active:bg-surface-2"
                          >
                            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-colors duration-150 ${on ? 'border-have bg-have text-[#0E1A0F]' : 'border-line'}`}>
                              {on && <Icon name="check" size={18} strokeWidth={3} />}
                            </span>
                            <span className={`text-[18px] ${on ? 'font-medium' : 'text-muted'}`}>{i.name[lang]}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>
            )
          })}
        </div>
      </div>

      <ConfirmSheet open={confirm === 'kit'} message={t.pantry.loadKitConfirm} confirmLabel={t.pantry.loadKit} onConfirm={() => addMany(BASIC_KIT)} onClose={() => setConfirm(null)} />
      <ConfirmSheet open={confirm === 'clear'} message={t.pantry.clearConfirm} confirmLabel={t.pantry.clearAll} danger onConfirm={clear} onClose={() => setConfirm(null)} />
    </div>
  )
}
