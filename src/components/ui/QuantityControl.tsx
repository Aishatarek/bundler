import MinusIcon from '../../assets/icons/minus.svg?react'
import PlusIcon from '../../assets/icons/plus.svg?react'

interface QuantityControlProps {
  value: number
  onChange: (value: number) => void
  min?: number
  disabled?: boolean
  variant?: 'card' | 'summary'
  compact?: boolean
}

export function QuantityControl({
  value,
  onChange,
  min = 0,
  disabled = false,
  variant = 'card',
  compact = false,
}: QuantityControlProps) {
  const isSummary = variant === 'summary'
  const canDecrease = !disabled && value > min
  const isMinusActive = !isSummary && canDecrease

  if (!isSummary) {
    return (
      <div
        className={`flex w-[80px] shrink-0 items-center justify-between py-1 ${compact ? 'h-[28px]' : 'h-[35px]'}`}
      >
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={!canDecrease}
          onClick={() => canDecrease && onChange(value - 1)}
          className={`relative isolate flex h-5 w-5 shrink-0 items-center justify-center rounded-sm ${
            isMinusActive
              ? 'border-2 border-gray-surface bg-gray-surface'
              : 'border-2 border-gray-border bg-white'
          }`}
        >
          <MinusIcon
            className={`h-2 w-2 ${isMinusActive ? '[&_path]:fill-gray-icon' : '[&_path]:fill-gray-divider'}`}
            aria-hidden
          />
        </button>
        <span className="min-w-0 flex-1 text-center font-medium tabular-nums text-base leading-5 text-obsidian">
          {value}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={disabled}
          onClick={() => !disabled && onChange(value + 1)}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-gray-surface"
        >
          <PlusIcon className="h-2 w-2 [&_path]:fill-gray-icon" aria-hidden />
        </button>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center ${isSummary ? 'h-7 w-[72px] justify-between py-1' : 'h-7 w-20 gap-2.5'}`}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={!canDecrease}
        onClick={() => canDecrease && onChange(value - 1)}
        className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-sm ${
          isSummary
            ? disabled
              ? 'border border-gray-divider bg-gray-disabled'
              : 'bg-white'
            : isMinusActive
              ? 'border-2 border-gray-surface bg-gray-surface'
              : 'border-2 border-gray-border bg-white'
        }`}
      >
        <MinusIcon
          className={`h-2 w-2 ${
            disabled && isSummary
              ? '[&_path]:fill-price'
              : isMinusActive || (isSummary && canDecrease)
                ? '[&_path]:fill-price'
                : '[&_path]:fill-gray-divider'
          }`}
          aria-hidden
        />
      </button>
      <span
        className={`min-w-0 flex-1 text-center font-medium tabular-nums text-obsidian ${
          isSummary ? 'text-sm font-semibold leading-4' : 'text-base leading-5'
        }`}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled}
        onClick={() => !disabled && onChange(value + 1)}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm ${
          isSummary
            ? disabled
              ? 'border border-gray-divider bg-gray-disabled'
              : 'bg-white'
            : 'bg-gray-surface'
        }`}
      >
        <PlusIcon
          className={`h-2 w-2 ${isSummary && disabled ? '[&_path]:fill-price' : ''}`}
          aria-hidden
        />
      </button>
    </div>
  )
}
