import type { ReactNode } from 'react'
import ArrowIcon from '../../assets/icons/arrow.svg?react'
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
        className={`flex w-[80px] shrink-0 items-center justify-center gap-2.5 py-1 ${compact ? 'h-[28px]' : 'h-[35px]'}`}
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
        <span className="flex min-w-[6px] items-end font-medium text-base leading-5 text-[#0B0D10]">
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
          className={`h-2 w-2 ${isMinusActive || (isSummary && canDecrease) ? '[&_path]:fill-[#575757]' : '[&_path]:fill-[#CED6DE]'}`}
          aria-hidden
        />
      </button>
      <span
        className={`font-medium text-[#0B0D10] ${
          isSummary
            ? 'w-2 text-sm font-semibold leading-4'
            : 'w-1.5 text-base leading-5'
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

interface PriceDisplayProps {
  originalPrice?: number | null
  salePrice?: number
  salePriceLabel?: string
  priceSuffix?: string
  variant?: 'card' | 'summary'
  compact?: boolean
}

export function PriceDisplay({
  originalPrice,
  salePrice,
  salePriceLabel,
  priceSuffix = '',
  variant = 'card',
  compact = false,
}: PriceDisplayProps) {
  const isSummary = variant === 'summary'

  if (salePriceLabel) {
    return (
      <div
        className={`flex justify-end ${
          isSummary
            ? 'flex-col items-end justify-center max-[767px]:gap-0'
            : 'items-start gap-2.5'
        }`}
      >
        {originalPrice != null && (
          <span
            className={`line-through ${
              isSummary
                ? 'font-medium text-sm leading-4 tracking-[0.005em] text-[#6F7882] max-[767px]:text-xs max-[767px]:leading-4'
                : 'text-base tracking-[0.6px] text-[#D8392B] line-through'
            }`}
          >
            ${originalPrice.toFixed(2)}
            {priceSuffix}
          </span>
        )}
        <span
          className={`tracking-[0.005em] ${
            isSummary
              ? 'font-semibold text-sm leading-4 text-[#4E2FD2] max-[767px]:text-xs max-[767px]:leading-4'
              : 'text-base leading-4 font-semibold text-[#4E2FD2]'
          }`}
        >
          {salePriceLabel}
        </span>
      </div>
    )
  }

  if (!isSummary) {
    if (compact) {
      return (
        <div className="flex h-[28px] w-[79px] shrink-0 flex-col items-end justify-center">
          {salePrice != null && (
            <span className="w-full text-right font-normal text-base leading-4 tracking-[0.6px] text-[#575757]">
              ${salePrice.toFixed(2)}
              {priceSuffix}
            </span>
          )}
        </div>
      )
    }

    return (
      <div className="flex min-h-[35px] flex-1 flex-col items-end justify-center gap-[3px]">
        {originalPrice != null && (
          <span className="w-full text-right font-normal text-base leading-4 tracking-[0.6px] text-[#D8392B] line-through">
            ${originalPrice.toFixed(2)}
            {priceSuffix}
          </span>
        )}
        {salePrice != null && (
          <span className="w-full text-right font-normal text-base leading-4 tracking-[0.6px] text-[#575757]">
            ${salePrice.toFixed(2)}
            {priceSuffix}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end justify-center max-[767px]:gap-0">
      {originalPrice != null && (
        <span className="font-medium text-sm leading-4 tracking-[0.005em] text-[#6F7882] line-through max-[767px]:text-xs max-[767px]:leading-4">
          ${originalPrice.toFixed(2)}
          {priceSuffix}
        </span>
      )}
      {salePrice != null && (
        <span className="font-semibold text-sm leading-4 tracking-[0.005em] text-[#4E2FD2] max-[767px]:text-xs max-[767px]:leading-4">
          ${salePrice.toFixed(2)}
          {priceSuffix}
        </span>
      )}
    </div>
  )
}

export function LearnMoreLink() {
  return (
    <button type="button" className="text-[#4E2FD2] underline">
      Learn More
    </button>
  )
}

interface StepLabelProps {
  children: ReactNode
  collapsed?: boolean
}

export function StepLabel({ children, collapsed = false }: StepLabelProps) {
  return (
    <p
      className={`w-full px-[15px] font-medium uppercase tracking-[1.6px] text-[#484848] ${
        collapsed
          ? 'text-[10px] leading-[10px]'
          : 'text-xs leading-[12px]'
      }`}
    >
      {children}
    </p>
  )
}

export function ChevronUp({ className = '' }: { className?: string }) {
  return (
    <ArrowIcon
      className={`h-3 w-3 shrink-0 rotate-180 ${className}`}
      aria-hidden
    />
  )
}

export function ChevronDown({ className = '' }: { className?: string }) {
  return (
    <ArrowIcon className={`h-3 w-3 shrink-0 ${className}`} aria-hidden />
  )
}
