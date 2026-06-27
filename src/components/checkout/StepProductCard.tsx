import PlanIcon from '../../assets/icons/plan.svg?react'
import type { PlanProduct, StepProduct } from '../../types/product'
import { PriceDisplay, QuantityControl } from '../ui'

interface StepProductCardProps {
  product: StepProduct
  onQuantityChange: (quantity: number) => void
}

export function StepProductCard({
  product,
  onQuantityChange,
}: StepProductCardProps) {
  const isSelected = product.quantity > 0

  return (
    <div
      className={`flex w-full items-center gap-[15px] rounded-[7px] border px-[15px] py-4 ${
        isSelected
          ? 'border-[#4E2FD2] bg-[rgba(78,47,210,0.04)]'
          : 'border-[#E6EBF0] bg-white'
      }`}
    >
      <img
        src={product.image}
        alt=""
        className="h-[72px] w-[72px] shrink-0 object-contain"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="font-semibold text-base leading-5 text-[#0B0D10]">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm leading-4 text-[#575757]">
            {product.description}
          </p>
        )}
        <PriceDisplay
          originalPrice={product.originalPrice}
          salePrice={product.salePrice}
          salePriceLabel={product.salePriceLabel}
          priceSuffix={product.priceSuffix}
        />
      </div>
      {product.quantityLocked ? (
        <span className="shrink-0 font-medium text-base leading-5 text-[#0B0D10]">
          {product.quantity}
        </span>
      ) : (
        <QuantityControl
          value={product.quantity}
          onChange={onQuantityChange}
          min={0}
        />
      )}
    </div>
  )
}

interface PlanProductCardProps {
  product: PlanProduct
  selected: boolean
  onSelect: () => void
}

export function PlanProductCard({
  product,
  selected,
  onSelect,
}: PlanProductCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-[15px] rounded-[7px] border px-[15px] py-4 text-left ${
        selected
          ? 'border-[#4E2FD2] bg-[rgba(78,47,210,0.04)]'
          : 'border-[#E6EBF0] bg-white'
      }`}
    >
      <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center">
        <PlanIcon className="h-[48px] w-[48px]" aria-hidden />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="font-semibold text-base leading-5 text-[#0B0D10]">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm leading-4 text-[#575757]">
            {product.description}
          </p>
        )}
        <PriceDisplay
          originalPrice={product.originalPrice}
          salePrice={product.salePrice}
          salePriceLabel={product.salePriceLabel}
          priceSuffix={product.priceSuffix}
        />
      </div>
    </button>
  )
}
