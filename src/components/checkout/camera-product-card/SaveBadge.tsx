export function SaveBadge({ savePercent }: { savePercent: number }) {
  return (
    <span className="absolute left-md top-md z-10 flex h-[19px] items-center justify-center rounded-card bg-wyze-purple px-1.5 py-0.5 font-semibold text-xs leading-[15px] text-white max-[1196px]:left-step max-[1196px]:top-md">
      Save {savePercent}%
    </span>
  )
}
