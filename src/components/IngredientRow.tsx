import { useT } from '../i18n'

interface Props {
  amount: string
  name: string
  note?: string
  optional?: boolean
  state: 'normal' | 'missing' | 'substituted'
  /** nome originale, se sostituito */
  replacedName?: string
  /** dispensa attiva: true = ce l'hai, false = manca */
  pantryDot?: boolean
  onMissing: () => void
  onUndo: () => void
}

export function IngredientRow({ amount, name, note, optional, state, replacedName, pantryDot, onMissing, onUndo }: Props) {
  const t = useT()
  const flagged = state !== 'normal'
  return (
    <li
      className={`flex items-center gap-3 border-b border-line px-1 py-3 last:border-b-0 transition-colors duration-150 ${state === 'substituted' ? 'bg-amber/10' : state === 'missing' ? 'bg-miss/10' : ''}`}
      style={flagged ? { borderRadius: 14 } : undefined}
    >
      <span className="dose min-w-[78px] shrink-0 whitespace-nowrap pl-1">{amount}</span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-[18px] font-medium leading-snug">
          {pantryDot !== undefined && (
            <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${pantryDot ? 'bg-have' : 'bg-miss'}`} />
          )}
          <span className="min-w-0">{name}{optional && <span className="ml-1.5 text-[15px] font-normal text-muted">({t.drink.optional})</span>}</span>
        </span>
        {state === 'substituted' && replacedName && <span className="block text-[14.5px] text-amber">{t.drink.replacing(replacedName)}</span>}
        {state === 'missing' && <span className="block text-[14.5px] text-miss">{t.drink.markedMissing}</span>}
        {note && state === 'normal' && <span className="block text-[14.5px] text-muted">{note}</span>}
      </span>
      {flagged ? (
        <button type="button" onClick={onUndo} className="btn btn-ghost !min-h-[44px] shrink-0 !px-3 !text-[14.5px]">
          {state === 'missing' ? t.missing.haveIt : t.drink.undo}
        </button>
      ) : (
        <button type="button" onClick={onMissing} className="btn btn-ghost !min-h-[44px] shrink-0 !px-3 !text-[14.5px] !text-muted">
          {t.missing.dontHave}
        </button>
      )}
    </li>
  )
}
