import type { CameraProduct } from '../../../types/product'
import { ColorSwatches } from './ColorSwatches'
import { ProductActions } from './ProductActions'
import { ProductInfo } from './ProductInfo'

interface DesktopContentProps {
  product: CameraProduct
  selectedColorId: string
  onQuantityChange: (quantity: number) => void
  onColorChange: (colorId: string) => void
}

function DesktopCompactContent({
  product,
  onQuantityChange,
}: Pick<DesktopContentProps, 'product' | 'onQuantityChange'>) {
  return (
    <div
      style={{ height: 110 }}
      className="hidden w-[205px] shrink-0 flex-col items-start gap-2.5 min-[1197px]:flex"
    >
      <div
        style={{ height: 72 }}
        className="flex w-full flex-col items-start gap-2"
      >
        <ProductInfo product={product} variant="desktop" />
      </div>
      <ProductActions
        product={product}
        onQuantityChange={onQuantityChange}
        layout="desktop-compact"
      />
    </div>
  )
}

function DesktopDefaultContent({
  product,
  selectedColorId,
  onQuantityChange,
  onColorChange,
}: DesktopContentProps) {
  return (
    <div className="hidden min-w-0 flex-1 flex-col items-start gap-2.5 self-stretch min-[1197px]:flex">
      <ProductInfo product={product} variant="desktop" />
      <ColorSwatches
        colors={product.colors}
        selectedColorId={selectedColorId}
        onColorChange={onColorChange}
      />
      <ProductActions
        product={product}
        onQuantityChange={onQuantityChange}
        layout="desktop"
      />
    </div>
  )
}

export function DesktopContent({
  product,
  selectedColorId,
  onQuantityChange,
  onColorChange,
}: DesktopContentProps) {
  const isCompact = product.cardLayout === 'compact'

  if (isCompact) {
    return (
      <DesktopCompactContent
        product={product}
        onQuantityChange={onQuantityChange}
      />
    )
  }

  return (
    <DesktopDefaultContent
      product={product}
      selectedColorId={selectedColorId}
      onQuantityChange={onQuantityChange}
      onColorChange={onColorChange}
    />
  )
}
