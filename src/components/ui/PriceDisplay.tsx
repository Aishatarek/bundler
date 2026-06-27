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
            ? 'flex-col items-end justify-center max-[776px]:gap-0'
            : 'items-start gap-2.5'
        }`}
      >
        {originalPrice != null && (
          <span
            className={`line-through ${
              isSummary
                ? 'font-medium text-sm leading-4 tracking-[0.005em] text-[#6F7882] max-[776px]:text-xs max-[776px]:leading-4'
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
              ? 'font-semibold text-sm leading-4 text-[#4E2FD2] max-[776px]:text-xs max-[776px]:leading-4'
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
    <div className="flex flex-col items-end justify-center max-[776px]:gap-0">
      {originalPrice != null && (
        <span className="font-medium text-sm leading-4 tracking-[0.005em] text-[#6F7882] line-through max-[776px]:text-xs max-[776px]:leading-4">
          ${originalPrice.toFixed(2)}
          {priceSuffix}
        </span>
      )}
      {salePrice != null && (
        <span className="font-semibold text-sm leading-4 tracking-[0.005em] text-[#4E2FD2] max-[776px]:text-xs max-[776px]:leading-4">
          ${salePrice.toFixed(2)}
          {priceSuffix}
        </span>
      )}
    </div>
  )
}
