import type { CameraProduct } from '../../../types/product'
import { PriceDisplay, QuantityControl } from '../../ui'

interface ProductActionsProps {
  product: CameraProduct
  onQuantityChange: (quantity: number) => void
  layout: 'desktop' | 'desktop-compact' | 'tablet'
}

export function ProductActions({
  product,
  onQuantityChange,
  layout,
}: ProductActionsProps) {
  if (layout === 'desktop-compact') {
    return (
      <div className="flex w-full flex-row items-end gap-[46px] flex-wrap">
        <QuantityControl
          value={product.quantity}
          onChange={onQuantityChange}
          compact
        />
        <PriceDisplay
          originalPrice={product.originalPrice}
          salePrice={product.salePrice}
          variant="card"
          compact
        />
      </div>
    )
  }

  if (layout === 'tablet') {
    return (
      <div className="flex items-center justify-between gap-2.5">
        <QuantityControl
          value={product.quantity}
          onChange={onQuantityChange}
        />
        <PriceDisplay
          originalPrice={product.originalPrice}
          salePrice={product.salePrice}
          variant="card"
        />
      </div>
    )
  }

  return (
    <div className="mt-auto flex w-full flex-row items-end gap-2.5">
      <QuantityControl
        value={product.quantity}
        onChange={onQuantityChange}
      />
      <PriceDisplay
        originalPrice={product.originalPrice}
        salePrice={product.salePrice}
        variant="card"
      />
    </div>
  )
}
