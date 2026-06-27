import type { SummarySection } from '../../types/product'
import { StepLabel } from '../ui'
import { CheckoutSidebar } from './CheckoutSidebar'
import { OrderSummary } from './OrderSummary'

interface ReviewContentProps {
  summaryTitle: string
  summarySubtitle: string
  summarySections: SummarySection[]
  guaranteeTitle: string
  guaranteeDescription: string
  monthlyAsLowAs: number
  originalTotal: number
  finalTotal: number
  savings: number
  isSaved: boolean
  onItemQuantityChange: (sectionId: string, itemId: string, qty: number) => void
  onCheckout: () => void
  onSave: () => void
}

function ReviewContent({
  summaryTitle,
  summarySubtitle,
  summarySections,
  guaranteeTitle,
  guaranteeDescription,
  monthlyAsLowAs,
  originalTotal,
  finalTotal,
  savings,
  isSaved,
  onItemQuantityChange,
  onCheckout,
  onSave,
}: ReviewContentProps) {
  return (
    <>
      <OrderSummary
        title={summaryTitle}
        subtitle={summarySubtitle}
        sections={summarySections}
        onItemQuantityChange={onItemQuantityChange}
      />
      <CheckoutSidebar
        guaranteeTitle={guaranteeTitle}
        guaranteeDescription={guaranteeDescription}
        monthlyAsLowAs={monthlyAsLowAs}
        originalTotal={originalTotal}
        finalTotal={finalTotal}
        savings={savings}
        onCheckout={onCheckout}
        onSave={onSave}
        isSaved={isSaved}
      />
    </>
  )
}

interface CheckoutReviewProps {
  summaryTitle: string
  summarySubtitle: string
  summarySections: SummarySection[]
  guaranteeTitle: string
  guaranteeDescription: string
  monthlyAsLowAs: number
  originalTotal: number
  finalTotal: number
  savings: number
  isSaved: boolean
  onItemQuantityChange: (sectionId: string, itemId: string, qty: number) => void
  onCheckout: () => void
  onSave: () => void
}

export function CheckoutReview({
  summaryTitle,
  summarySubtitle,
  summarySections,
  guaranteeTitle,
  guaranteeDescription,
  monthlyAsLowAs,
  originalTotal,
  finalTotal,
  savings,
  isSaved,
  onItemQuantityChange,
  onCheckout,
  onSave,
}: CheckoutReviewProps) {
  const reviewProps = {
    summaryTitle,
    summarySubtitle,
    summarySections,
    guaranteeTitle,
    guaranteeDescription,
    monthlyAsLowAs,
    originalTotal,
    finalTotal,
    savings,
    isSaved,
    onItemQuantityChange,
    onCheckout,
    onSave,
  }

  return (
    <>
      <aside className="sticky top-header hidden w-[399px] shrink-0 flex-col gap-xs self-start rounded-card bg-step-bg pt-step min-[1197px]:flex">
        <div className="flex h-3 w-full items-center">
          <StepLabel>Review</StepLabel>
        </div>
        <div className="flex flex-col gap-sm px-5 pb-2xl pt-5">
          <ReviewContent {...reviewProps} />
        </div>
      </aside>

      <section className="hidden flex-col gap-xs rounded-card bg-step-bg pt-step min-[777px]:max-[1196px]:flex">
        <div className="flex w-full flex-col gap-2.5 px-5 pb-2xl pt-5 min-[777px]:max-[900px]:px-4">
          <div className="flex w-full flex-row items-start gap-[52px] min-[777px]:max-[900px]:gap-6">
            <ReviewContent {...reviewProps} />
          </div>
        </div>
      </section>

      <section className="hidden w-full flex-col gap-xs bg-step-bg pt-step max-[776px]:flex">
        <div className="flex h-[10px] w-full items-center">
          <StepLabel collapsed>Review</StepLabel>
        </div>
        <div className="flex flex-col gap-2.5 px-5 pb-2xl pt-5">
          <ReviewContent {...reviewProps} />
        </div>
      </section>
    </>
  )
}
