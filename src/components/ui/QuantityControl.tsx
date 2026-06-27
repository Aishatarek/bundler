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
  const isMinusActive = !isSummary && value > 1

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
          className={`relative isolate flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] ${
            isMinusActive
              ? 'border-2 border-[#F0F4F7] bg-[#F0F4F7]'
              : 'border-2 border-[#E6EBF0] bg-white'
          }`}
        >
          <MinusIcon
            className={`h-2 w-2 ${isMinusActive ? '[&_path]:fill-[#525963]' : '[&_path]:fill-[#CED6DE]'}`}
            aria-hidden
          />
        </button>
        <span className="min-w-0 flex-1 text-center font-medium tabular-nums text-base leading-5 text-[#0B0D10]">
          {value}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={disabled}
          onClick={() => !disabled && onChange(value + 1)}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] bg-[#F0F4F7]"
        >
          <PlusIcon className="h-2 w-2 [&_path]:fill-[#525963]" aria-hidden />
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
        className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] ${
          isSummary
            ? disabled
              ? 'border border-[#CED6DE] bg-[#F1F1F2]'
              : 'bg-white'
            : isMinusActive
              ? 'border-2 border-[#F0F4F7] bg-[#F0F4F7]'
              : 'border-2 border-[#E6EBF0] bg-white'
        }`}
      >
        <MinusIcon
          className={`h-2 w-2 ${
            disabled && isSummary
              ? '[&_path]:fill-[#575757]'
              : isMinusActive || (isSummary && canDecrease)
                ? '[&_path]:fill-[#575757]'
                : '[&_path]:fill-[#CED6DE]'
          }`}
          aria-hidden
        />
      </button>
      <span
        className={`min-w-0 flex-1 text-center font-medium tabular-nums text-[#0B0D10] ${
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
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] ${
          isSummary
            ? disabled
              ? 'border border-[#CED6DE] bg-[#F1F1F2]'
              : 'bg-white'
            : 'bg-[#F0F4F7]'
        }`}
      >
        <PlusIcon
          className={`h-2 w-2 ${isSummary && disabled ? '[&_path]:fill-[#575757]' : ''}`}
          aria-hidden
        />
      </button>
    </div>
  )
}
