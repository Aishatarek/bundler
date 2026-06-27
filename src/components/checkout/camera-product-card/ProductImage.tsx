interface ProductImageProps {
  src: string
  alt: string
  imageWidth: number
  imageHeight: number
  imageTranslateClass: string
}

export function ProductImage({
  src,
  alt,
  imageWidth,
  imageHeight,
  imageTranslateClass,
}: ProductImageProps) {
  const imageClassName = `h-full w-full max-w-none scale-[1.4] object-contain ${imageTranslateClass} max-[1196px]:max-h-[146px] max-[1196px]:w-full max-[1196px]:max-w-[202px] max-[1196px]:translate-x-0 max-[1196px]:scale-100`

  return (
    <div
      style={{ width: imageWidth, height: imageHeight }}
      className="relative flex shrink-0 items-center justify-center overflow-hidden max-[1196px]:!h-auto max-[1196px]:!w-full"
    >
      <img src={src} alt={alt} className={imageClassName} />
    </div>
  )
}
