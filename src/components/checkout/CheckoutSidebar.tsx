import offerBadge from '../../assets/images/offer-badge.png'
import { Button } from '../ui'

interface CheckoutSidebarProps {
  guaranteeTitle: string
  guaranteeDescription: string
  monthlyAsLowAs: number
  originalTotal: number
  finalTotal: number
  savings: number
  onCheckout?: () => void
  onSave?: () => void
  isSaved?: boolean
}

export function CheckoutSidebar({
  guaranteeTitle,
  guaranteeDescription,
  monthlyAsLowAs,
  originalTotal,
  finalTotal,
  savings,
  onCheckout,
  onSave,
  isSaved = false,
}: CheckoutSidebarProps) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-2 min-[1197px]:w-[350px] min-[1197px]:shrink-0 min-[768px]:max-[1196px]:flex-1 max-[767px]:gap-1">
      {/* Desktop sidebar & mobile — compact badge + pricing row */}
      <div className="hidden min-[1197px]:flex min-[1197px]:items-center min-[1197px]:justify-between min-[1197px]:gap-2 max-[767px]:flex max-[767px]:items-center max-[767px]:justify-between max-[767px]:gap-2">
        <img
          src={offerBadge}
          alt="100% Wyze satisfaction guarantee"
          className="h-[78px] w-[78px] shrink-0 object-contain"
        />
        <div className="flex flex-col items-end justify-center gap-2">
          <span className="inline-flex h-[18px] items-center justify-center rounded-[3px] bg-[#4E2FD2] px-2 py-[5px] font-medium text-xs leading-[15px] tracking-[-0.05em] text-white">
            as low as ${monthlyAsLowAs.toFixed(2)}/mo
          </span>
          <div className="flex items-baseline justify-end gap-2">
            <span className="font-medium text-lg leading-5 tracking-[0.0025em] text-[#6F7882] line-through">
              ${originalTotal.toFixed(2)}
            </span>
            <span className="font-bold text-2xl leading-8 tracking-[-0.00125em] text-[#4E2FD2]">
              ${finalTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Tablet — guarantee + pricing */}
      <div className="hidden min-[768px]:max-[1196px]:flex min-[768px]:max-[1196px]:flex-col min-[768px]:max-[1196px]:gap-4">
        <div className="flex items-center gap-[25px] min-[768px]:max-[900px]:gap-4">
          <img
            src={offerBadge}
            alt="100% Wyze satisfaction guarantee"
            className="h-[131px] w-[131px] shrink-0 object-contain min-[768px]:max-[900px]:h-[100px] min-[768px]:max-[900px]:w-[100px]"
          />
          <div className="min-w-0 text-lg leading-[110%] tracking-[0.6px] text-[#1F1F1F] min-[768px]:max-[900px]:text-base">
            <span className="mb-6 block font-semibold min-[768px]:max-[900px]:mb-3">
              {guaranteeTitle}
            </span>
            {guaranteeDescription.split('\n').map((line) => (
              <span key={line} className="block font-normal">
                {line}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex h-[27px] shrink-0 items-center justify-center rounded-[3px] bg-[#4E2FD2] px-2 py-2 font-medium text-base leading-[19px] tracking-[-0.05em] text-white min-[768px]:max-[900px]:text-sm">
            as low as ${monthlyAsLowAs.toFixed(2)}/mo
          </span>
          <div className="flex shrink-0 items-baseline justify-end gap-2">
            <span className="font-medium text-[22px] leading-5 tracking-[0.0025em] text-[#6F7882] line-through min-[768px]:max-[900px]:text-lg">
              ${originalTotal.toFixed(2)}
            </span>
            <span className="font-bold text-[28px] leading-8 tracking-[-0.00125em] text-[#4E2FD2] min-[768px]:max-[900px]:text-2xl">
              ${finalTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 pt-2.5 max-[1196px]:pt-2.5 min-[1197px]:pt-[10px] max-[767px]:pt-2.5">
        <p className="text-center font-semibold text-xs leading-3 tracking-[-0.056px] text-[#0AA288]">
          Congrats! You&apos;re saving ${savings.toFixed(2)} on your security
          bundle!
        </p>
        <Button variant="primary" onClick={onCheckout}>
          Checkout
        </Button>
        <Button
          variant="text"
          className="w-full text-center max-[767px]:text-xs max-[767px]:leading-[14.4px]"
          onClick={onSave}
          disabled={isSaved}
        >
          {isSaved ? 'Saved' : 'Save my system for later'}
        </Button>
      </div>
    </div>
  )
}
