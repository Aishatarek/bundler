import type { CameraProduct } from '../../../types/product'
import { ColorSwatches } from './ColorSwatches'
import { ProductActions } from './ProductActions'
import { ProductInfo } from './ProductInfo'

interface TabletContentProps {
  product: CameraProduct
  selectedColorId: string
  titleClass: string
  descClass: string
  onQuantityChange: (quantity: number) => void
  onColorChange: (colorId: string) => void
}

export function TabletContent({
  product,
  selectedColorId,
  titleClass,
  descClass,
  onQuantityChange,
  onColorChange,
}: TabletContentProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2.5 max-[1196px]:w-full max-[1196px]:flex-none min-[1197px]:hidden">
      <div className="flex flex-col gap-2.5">
        <ProductInfo
          product={product}
          variant="tablet"
          titleClass={titleClass}
          descClass={descClass}
        />
        <ColorSwatches
          colors={product.colors}
          selectedColorId={selectedColorId}
          onColorChange={onColorChange}
        />
        <ProductActions
          product={product}
          onQuantityChange={onQuantityChange}
          layout="tablet"
        />
      </div>
    </div>
  )
}
