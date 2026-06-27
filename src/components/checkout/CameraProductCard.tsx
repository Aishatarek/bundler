import type { CameraProduct, ColorOption } from '../../types/product'
import { PriceDisplay, QuantityControl } from '../ui'

interface CameraProductCardProps {
  product: CameraProduct
  selectedColorId: string
  imageColorId?: string | null
  onQuantityChange: (quantity: number) => void
  onColorChange: (colorId: string) => void
}

function ColorSwatch({
  color,
  selected,
  onSelect,
}: {
  color: ColorOption
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`box-border flex h-[26px] shrink-0 flex-row items-center justify-center rounded-[2px] border-[0.5px] ${
        selected
          ? 'border-[#0AA288] bg-[rgba(29,240,187,0.04)] px-[3px] py-px'
          : 'border-[#CCCCCC] bg-white px-[5px] py-px'
      }`}
    >
      <img
        src={color.image}
        alt=""
        className="h-[22px] w-[22px] shrink-0 rounded-[5px] object-contain"
      />
      <span className="font-medium text-[10px] leading-[10px] tracking-[0.6px] text-[#1F1F1F]">
        {color.label}
      </span>
    </button>
  )
}

function ColorSwatches({
  colors,
  selectedColorId,
  onColorChange,
}: {
  colors: ColorOption[]
  selectedColorId: string
  onColorChange: (colorId: string) => void
}) {
  if (colors.length === 0) return null

  return (
    <div className="flex flex-row flex-wrap items-end gap-1.5">
      {colors.map((color) => (
        <ColorSwatch
          key={color.id}
          color={color}
          selected={selectedColorId === color.id}
          onSelect={() => onColorChange(color.id)}
        />
      ))}
    </div>
  )
}

function DesktopAltContent({
  product,
  selectedColorId,
  onQuantityChange,
  onColorChange,
  variant,
}: {
  product: CameraProduct
  selectedColorId: string
  onQuantityChange: (quantity: number) => void
  onColorChange: (colorId: string) => void
  variant: 'standalone' | 'compact'
}) {
  const contentHeight = variant === 'standalone' ? 144 : 110
  const headerHeight = variant === 'standalone' ? undefined : 72

  return (
    <div
      style={{ height: contentHeight }}
      className="hidden w-[205px] shrink-0 flex-col items-start gap-2.5 min-[1197px]:flex"
    >
      <div
        style={headerHeight != null ? { height: headerHeight } : undefined}
        className="flex w-full flex-col items-start gap-2"
      >
        <h3 className="flex w-full items-center font-semibold text-base leading-4 tracking-[0.6px] text-[#1F1F1F]">
          {product.name}
        </h3>
        <p className="w-full font-normal text-xs leading-[130%] tracking-[0.6px] text-[rgba(31,31,31,0.75)]">
          {product.description}{' '}
          <span className="text-[#0000EE] underline">Learn More</span>
        </p>
        {variant === 'standalone' && (
          <ColorSwatches
            colors={product.colors}
            selectedColorId={selectedColorId}
            onColorChange={onColorChange}
          />
        )}
      </div>

      <div className="flex w-full flex-row items-end gap-[46px]">
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
    </div>
  )
}

export function CameraProductCard({
  product,
  selectedColorId,
  imageColorId,
  onQuantityChange,
  onColorChange,
}: CameraProductCardProps) {
  const isSelected = product.quantity > 0
  const isStandalone = product.cardLayout === 'standalone'
  const isCompact = product.cardLayout === 'compact'
  const isAltLayout = isStandalone || isCompact
  const activeColor = imageColorId
    ? product.colors.find((c) => c.id === imageColorId)
    : null
  const displayImage = activeColor?.image ?? product.image
  const imageTranslateX = product.imageTranslateX ?? -15
  const imageTranslateClass =
    imageTranslateX === 0
      ? ''
      : imageTranslateX === -15
        ? 'translate-x-[-15px]'
        : imageTranslateX === -20
          ? 'translate-x-[-20px]'
          : `translate-x-[${imageTranslateX}px]`

  const imageWidth = product.imageWidth ?? 101
  const imageHeight = product.imageHeight ?? 137
  const cardHeight = product.cardHeight ?? 159
  const cardWidth = product.cardWidth

  const titleClass =
    product.titleSize === 'md'
      ? 'text-base leading-4'
      : 'text-lg leading-[18px] max-[1196px]:text-base max-[1196px]:leading-4'
  const descClass =
    product.descriptionSize === 'sm'
      ? 'text-xs leading-[130%]'
      : 'text-sm leading-[130%] max-[1196px]:text-xs max-[1196px]:leading-[130%]'

  const desktopGap =
    isSelected ? 'min-[1197px]:gap-[19px]' : 'min-[1197px]:gap-[13px]'
  const desktopBorder = isSelected
    ? 'min-[1197px]:border-[rgba(78,47,210,0.7)]'
    : 'min-[1197px]:border-transparent'
  const tabletBorder = isSelected
    ? 'max-[1196px]:gap-[19px] max-[1196px]:border-[rgba(78,47,210,0.7)]'
    : 'max-[1196px]:gap-[13px] max-[1196px]:border-transparent'

  const imageClassName = `h-full w-full max-w-none scale-[1.4] object-contain ${imageTranslateClass} max-[1196px]:max-h-[146px] max-[1196px]:w-full max-[1196px]:max-w-[202px] max-[1196px]:translate-x-0 max-[1196px]:scale-100`

  return (
    <article
      style={{
        minHeight: cardHeight,
        ...(cardWidth != null ? { width: cardWidth } : {}),
      }}
      className={`relative box-border flex min-w-0 flex-none flex-row items-center rounded-[10px] border-2 bg-white p-[11px] max-[1196px]:!h-[331.1px] max-[1196px]:!w-auto max-[1196px]:flex-1 max-[1196px]:flex-col max-[1196px]:items-center max-[1196px]:justify-center max-[1196px]:px-[11px] max-[1196px]:py-[14px] max-[767px]:!h-auto max-[767px]:w-full max-[767px]:flex-none ${desktopGap} ${desktopBorder} ${tabletBorder} ${cardWidth != null ? 'min-[1197px]:mx-auto' : ''}`}
    >
      {product.savePercent != null && (
        <span className="absolute left-[11px] top-[11px] z-10 flex h-[19px] items-center justify-center rounded-[10px] bg-[#4E2FD2] px-1.5 py-0.5 font-semibold text-xs leading-[15px] text-white max-[1196px]:left-[15px] max-[1196px]:top-[11px]">
          Save {product.savePercent}%
        </span>
      )}

      <div
        style={{ width: imageWidth, height: imageHeight }}
        className="relative flex shrink-0 items-center justify-center overflow-hidden max-[1196px]:!h-auto max-[1196px]:!w-full"
      >
        <img src={displayImage} alt={product.name} className={imageClassName} />
      </div>

      {/* Desktop / lab layout */}
      {isAltLayout ? (
        <DesktopAltContent
          product={product}
          selectedColorId={selectedColorId}
          onQuantityChange={onQuantityChange}
          onColorChange={onColorChange}
          variant={isStandalone ? 'standalone' : 'compact'}
        />
      ) : (
        <div className="hidden min-w-0 flex-1 flex-col items-start gap-2.5 self-stretch min-[1197px]:flex">
          <div className="flex w-full flex-col items-start gap-2">
            <h3 className="flex w-full items-center font-semibold text-base leading-4 tracking-[0.6px] text-[#1F1F1F]">
              {product.name}
            </h3>
            <p className="w-full font-normal text-xs leading-[130%] tracking-[0.6px] text-[rgba(31,31,31,0.75)]">
              {product.description}{' '}
              <span className="text-[#0000EE] underline">Learn More</span>
            </p>
          </div>

          <ColorSwatches
            colors={product.colors}
            selectedColorId={selectedColorId}
            onColorChange={onColorChange}
          />

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
        </div>
      )}

      {/* Tablet layout — unchanged from original */}
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 max-[1196px]:w-full max-[1196px]:flex-none min-[1197px]:hidden">
        <div className="flex flex-col gap-2.5">
          <h3
            className={`font-semibold tracking-[0.6px] text-[#1F1F1F] ${titleClass}`}
          >
            {product.name}
          </h3>
          <p
            className={`font-medium tracking-[0.6px] text-[rgba(31,31,31,0.75)] ${descClass}`}
          >
            {product.description}{' '}
            <span className="text-[#0000EE] underline">Learn More</span>
          </p>
          <ColorSwatches
            colors={product.colors}
            selectedColorId={selectedColorId}
            onColorChange={onColorChange}
          />
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
        </div>
      </div>
    </article>
  )
}
