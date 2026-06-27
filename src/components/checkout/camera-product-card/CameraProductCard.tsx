import type { CameraProduct } from '../../../types/product'
import { DesktopContent } from './DesktopContent'
import { ProductImage } from './ProductImage'
import { SaveBadge } from './SaveBadge'
import { TabletContent } from './TabletContent'
import {
  getCardBorderClasses,
  getDisplayImage,
  getImageTranslateClass,
  getTypographyClasses,
} from './utils'

interface CameraProductCardProps {
  product: CameraProduct
  selectedColorId: string
  imageColorId?: string | null
  onQuantityChange: (quantity: number) => void
  onColorChange: (colorId: string) => void
}

export function CameraProductCard({
  product,
  selectedColorId,
  imageColorId,
  onQuantityChange,
  onColorChange,
}: CameraProductCardProps) {
  const isSelected = product.quantity > 0
  const displayImage = getDisplayImage(product, imageColorId)
  const imageTranslateX = product.imageTranslateX ?? -15
  const imageTranslateClass = getImageTranslateClass(imageTranslateX)
  const imageWidth = product.imageWidth ?? 101
  const imageHeight = product.imageHeight ?? 137
  const cardHeight = product.cardHeight ?? 159
  const cardWidth = product.cardWidth
  const { titleClass, descClass } = getTypographyClasses(product)
  const { desktopGap, desktopBorder, tabletBorder } =
    getCardBorderClasses(isSelected)

  const canToggleViaCard = product.quantity <= 1

  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!canToggleViaCard) return
    if ((event.target as HTMLElement).closest('button')) return
    onQuantityChange(product.quantity === 0 ? 1 : 0)
  }

  return (
    <article
      style={{
        minHeight: cardHeight,
        ...(cardWidth != null ? { width: cardWidth } : {}),
      }}
      onClick={handleCardClick}
      className={`relative box-border flex flex-wrap max-[1196px]:flex-nowrap min-w-0 flex-none flex-row items-center rounded-card border-2 bg-white p-md max-[1196px]:h-[331.1px]! max-[1196px]:w-auto! max-[1196px]:flex-1 max-[1196px]:flex-col max-[1196px]:items-center max-[1196px]:justify-center max-[1196px]:px-md max-[1196px]:py-[14px] max-[776px]:!h-auto max-[776px]:w-full max-[776px]:flex-none max-[776px]:max-w-none ${desktopGap} ${desktopBorder} ${tabletBorder} ${canToggleViaCard ? 'cursor-pointer' : ''} ${cardWidth != null ? 'min-[1197px]:mx-auto' : ''}`}
    >
      {product.savePercent != null && (
        <SaveBadge savePercent={product.savePercent} />
      )}

      <ProductImage
        src={displayImage}
        alt={product.name}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        imageTranslateClass={imageTranslateClass}
      />

      <DesktopContent
        product={product}
        selectedColorId={selectedColorId}
        onQuantityChange={onQuantityChange}
        onColorChange={onColorChange}
      />

      <TabletContent
        product={product}
        selectedColorId={selectedColorId}
        titleClass={titleClass}
        descClass={descClass}
        onQuantityChange={onQuantityChange}
        onColorChange={onColorChange}
      />
    </article>
  )
}
