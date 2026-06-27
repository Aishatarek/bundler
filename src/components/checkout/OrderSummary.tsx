import type { SummaryItem, SummarySection } from '../../types/product'
import CarbonDeliveryIcon from '../../assets/icons/carbon_delivery.svg?react'
import UnlimitedIcon from '../../assets/icons/unlimited.svg?react'
import { PriceDisplay, QuantityControl } from '../ui'

interface SummaryLineItemProps {
  item: SummaryItem
  onQuantityChange?: (quantity: number) => void
}

function SummaryLineItem({ item, onQuantityChange }: SummaryLineItemProps) {
  const isPlan = item.isPlan
  const isShipping = item.icon === 'delivery'

  if (isPlan) {
    const [firstWord, ...restWords] = item.name.split(' ')
    const secondWord = restWords.join(' ')

    return (
      <div className="flex w-full items-start justify-between">
        <div className="flex items-center gap-[3px]">
          <UnlimitedIcon
            className="h-[23.7px] w-5 shrink-0 max-[776px]:h-[17px] max-[776px]:w-3.5"
            aria-hidden
          />
          <span className="font-bold text-base leading-4 tracking-[-0.002em] max-[776px]:text-sm max-[776px]:leading-[14px]">
            <span className="max-[776px]:hidden">
              <span className="text-black">{firstWord}</span>
              {secondWord && (
                <>
                  {' '}
                  <span className="text-[#4E2FD2]">{secondWord}</span>
                </>
              )}
            </span>
            <span className="hidden text-black max-[776px]:inline">
              {item.name}
            </span>
          </span>
        </div>
        <PriceDisplay
          originalPrice={item.originalPrice}
          salePrice={item.salePrice}
          priceSuffix={item.priceSuffix}
          variant="summary"
        />
      </div>
    )
  }

  return (
    <div className="flex w-full min-w-0 items-center gap-4 min-[777px]:max-[1196px]:gap-3 max-[776px]:items-start">
      <div className="flex min-w-0 flex-1 items-center gap-3 min-[777px]:max-[1196px]:gap-2 max-[776px]:gap-3">
        <div className="flex h-[41px] w-[41px] shrink-0 items-center justify-center overflow-hidden rounded-[5px] bg-white min-[777px]:max-[900px]:h-[36px] min-[777px]:max-[900px]:w-[36px]">
          {isShipping ? (
            <CarbonDeliveryIcon className="h-[29px] w-[29px]" aria-hidden />
          ) : (
            <img
              src={item.image}
              alt=""
              className="h-full w-full object-contain"
            />
          )}
        </div>
        <span className="min-w-0 flex-1 font-medium text-sm leading-4 tracking-[0.005em] text-[#0B0D10] min-[777px]:max-[900px]:text-xs min-[777px]:max-[900px]:leading-4 max-[776px]:text-xs max-[776px]:font-medium max-[776px]:leading-4">
          {item.name}
        </span>
        {item.quantity != null && !isShipping && (
          <QuantityControl
            value={item.quantity}
            onChange={onQuantityChange ?? (() => {})}
            variant="summary"
            disabled={item.quantityLocked}
          />
        )}
      </div>
      <PriceDisplay
        originalPrice={item.originalPrice}
        salePrice={item.salePrice}
        salePriceLabel={item.salePriceLabel}
        priceSuffix={item.priceSuffix}
        variant="summary"
      />
    </div>
  )
}

interface OrderSummaryProps {
  title: string
  subtitle: string
  sections: SummarySection[]
  onItemQuantityChange?: (sectionId: string, itemId: string, qty: number) => void
}

export function OrderSummary({
  title,
  subtitle,
  sections,
  onItemQuantityChange,
}: OrderSummaryProps) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-[10px] min-[1197px]:w-[350px] min-[1197px]:shrink-0 min-[777px]:max-[1196px]:flex-[1.15] max-[776px]:gap-2.5">
      <div className="flex flex-col gap-[5px]">
        <h2 className="font-semibold text-[22px] leading-[22px] tracking-[0.6px] text-[#1F1F1F]">
          {title}
        </h2>
        <p className="font-normal text-sm leading-[130%] tracking-[0.6px] text-[rgba(31,31,31,0.75)] max-[776px]:text-xs max-[776px]:font-medium max-[776px]:leading-[130%]">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-[10px] max-[776px]:gap-2.5">
        {sections.map((section) => (
          <div
            key={section.id}
            className="box-border flex flex-col gap-2 border-t border-[#CED6DE] pt-[15px]"
          >
            {section.label && (
              <p className="font-normal text-xs uppercase leading-4 tracking-[0.03em] text-[#A8B2BD]">
                {section.label}
              </p>
            )}
            <div className="flex flex-col gap-3">
              {section.items.map((item) => (
                <SummaryLineItem
                  key={item.id}
                  item={item}
                  onQuantityChange={
                    onItemQuantityChange && item.quantity != null
                      ? (qty) =>
                          onItemQuantityChange(section.id, item.id, qty)
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
