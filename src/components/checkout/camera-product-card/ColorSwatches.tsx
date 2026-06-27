import type { ColorOption } from '../../../types/product'

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
      className={`box-border flex h-[26px] shrink-0 flex-row items-center justify-center rounded-2xs border-hairline ${
        selected
          ? 'border-teal bg-teal-selected px-2xs py-px'
          : 'border-gray-300 bg-white px-xs py-px'
      }`}
    >
      <img
        src={color.image}
        alt=""
        className="h-[22px] w-[22px] shrink-0 rounded-md object-contain"
      />
      <span className="font-medium text-[10px] leading-[10px] tracking-[0.6px] text-ink">
        {color.label}
      </span>
    </button>
  )
}

export function ColorSwatches({
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
          selected={selectedColorId !== '' && selectedColorId === color.id}
          onSelect={() => onColorChange(color.id)}
        />
      ))}
    </div>
  )
}
