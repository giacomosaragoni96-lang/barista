import { useT } from '../i18n'
import { Button } from './Button'
import { Sheet } from './Sheet'

interface Props {
  open: boolean
  message: string
  confirmLabel: string
  danger?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmSheet({ open, message, confirmLabel, danger, onConfirm, onClose }: Props) {
  const t = useT()
  return (
    <Sheet open={open} onClose={onClose} title={message}>
      <div className="flex flex-col gap-3 pt-2">
        <Button variant={danger ? 'danger' : 'primary'} size="lg" block onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</Button>
        <Button variant="ghost" size="lg" block onClick={onClose}>{t.state.cancel}</Button>
      </div>
    </Sheet>
  )
}
