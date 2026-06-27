import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'outline' | 'primary' | 'text'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
}

const variantStyles: Record<ButtonVariant, string> = {
  outline:
    'box-border flex h-[39px]  shrink-0 flex-none items-center justify-center gap-2.5 rounded-lg border border-wyze-purple px-6 py-[5px] font-semibold text-lg leading-6 text-wyze-purple',
  primary:
    'box-border flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded bg-wyze-purple px-4 py-[13px] font-[family-name:var(--font-button)] text-[17px] font-bold leading-[22px] text-white',
  text: 'font-[family-name:var(--font-sans)] text-sm font-normal italic leading-[17px] tracking-[-0.016px] text-gray-label underline',
}

export function Button({
  children,
  variant = 'outline',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`cursor-pointer ${variantStyles[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
