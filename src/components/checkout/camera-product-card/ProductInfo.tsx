import type { CameraProduct } from '../../../types/product'

interface ProductInfoProps {
  product: CameraProduct
  variant: 'desktop' | 'tablet'
  titleClass?: string
  descClass?: string
}

export function ProductInfo({
  product,
  variant,
  titleClass = '',
  descClass = '',
}: ProductInfoProps) {
  if (variant === 'desktop') {
    return (
      <div className="flex w-full flex-col items-start gap-2">
        <h3 className="flex w-full items-center font-semibold text-base leading-4 tracking-[0.6px] text-ink">
          {product.name}
        </h3>
        <p className="w-full font-medium text-xs leading-[130%] tracking-[0.8px] text-ink/75">
          {product.description}  <span className="text-link underline"> Learn More</span>
        </p>
      </div>
    )
  }

  return (
    <>
      <h3
        className={`font-semibold tracking-[0.6px] text-ink ${titleClass}`}
      >
        {product.name}
      </h3>
      <p
        className={`font-medium tracking-[0.6px] text-ink/75 ${descClass}`}
      >
        {product.description}{' '}
        <span className="text-link underline">Learn More</span>
      </p>
    </>
  )
}
