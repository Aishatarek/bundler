import type { CameraProduct } from '../../../types/product'

export function getDisplayImage(
  product: CameraProduct,
  imageColorId?: string | null,
): string {
  const defaultColorId =
    product.colors.find((c) => c.selected)?.id ?? product.colors[0]?.id
  const activeColor = imageColorId
    ? product.colors.find((c) => c.id === imageColorId)
    : null

  if (!activeColor || imageColorId === defaultColorId) {
    return product.image
  }
  return activeColor.image
}

export function getImageTranslateClass(imageTranslateX: number): string {
  if (imageTranslateX === 0) return ''
  if (imageTranslateX === -15) return '-translate-x-step'
  if (imageTranslateX === -20) return '-translate-x-[20px]'
  return `translate-x-[${imageTranslateX}px]`
}

export function getTypographyClasses(product: CameraProduct) {
  const titleClass =
    product.titleSize === 'md'
      ? 'text-base leading-4 max-[776px]:text-sm max-[776px]:leading-4'
      : 'text-lg leading-[18px] max-[1196px]:text-base max-[1196px]:leading-4 max-[776px]:text-sm max-[776px]:leading-4'
  const descClass =
    product.descriptionSize === 'sm'
      ? 'text-xs leading-[130%]'
      : 'text-sm leading-[130%] max-[1196px]:text-xs max-[1196px]:leading-[130%] max-[776px]:text-[11px] max-[776px]:leading-[130%]'

  return { titleClass, descClass }
}

export function getCardBorderClasses(isSelected: boolean) {
  const desktopGap = isSelected
    ? 'min-[1197px]:gap-selected'
    : 'min-[1197px]:gap-lg'
  const desktopBorder = isSelected
    ? 'min-[1197px]:border-wyze-purple/70'
    : 'min-[1197px]:border-transparent'
  const tabletBorder = isSelected
    ? 'max-[1196px]:gap-selected max-[1196px]:border-wyze-purple/70'
    : 'max-[1196px]:gap-lg max-[1196px]:border-transparent'

  return { desktopGap, desktopBorder, tabletBorder }
}
