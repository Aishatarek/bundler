import type { ReactNode } from 'react'

interface StepLabelProps {
  children: ReactNode
  collapsed?: boolean
}

export function StepLabel({ children, collapsed = false }: StepLabelProps) {
  return (
    <p
      className={`w-full px-step font-medium uppercase tracking-[1.6px] text-gray-label ${
        collapsed
          ? 'text-[10px] leading-[10px]'
          : 'text-xs leading-[12px]'
      }`}
    >
      {children}
    </p>
  )
}
