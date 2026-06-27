import ArrowIcon from '../../assets/icons/arrow.svg?react'

export function ChevronUp({ className = '' }: { className?: string }) {
  return (
    <ArrowIcon
      className={`h-3 w-3 shrink-0 rotate-180 ${className}`}
      aria-hidden
    />
  )
}

export function ChevronDown({ className = '' }: { className?: string }) {
  return (
    <ArrowIcon className={`h-3 w-3 shrink-0 ${className}`} aria-hidden />
  )
}
