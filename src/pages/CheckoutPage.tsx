import productsData from '../data/products.json'
import type { ProductsData } from '../types/product'
import { CheckoutReview } from '../components/checkout/CheckoutReview'
import { CheckoutSteps } from '../components/checkout/CheckoutSteps'
import { useBundleState } from '../hooks/useBundleState'
import { useCheckoutSteps } from '../hooks/useCheckoutSteps'

const data = productsData as ProductsData

export default function CheckoutPage() {
  const bundle = useBundleState(data)
  const { expandedStep, toggleStep, expandStep, goToNextStep } =
    useCheckoutSteps(1)

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <main className="mx-auto w-full max-w-[1440px] px-[105px] py-header max-[1196px]:px-6 max-[1196px]:py-header max-[776px]:flex max-[776px]:flex-col max-[776px]:gap-5 max-[776px]:px-0 max-[776px]:py-0 max-[776px]:pt-2xl">
        <h1 className="hidden w-full px-4 text-center font-bold text-[26px] leading-[110%] tracking-[-0.064px] text-ink max-[776px]:block max-[390px]:mx-auto max-[390px]:max-w-[390px] max-[390px]:text-2xl">
          Let&apos;s get started!
        </h1>

        <div className="mx-auto flex w-full max-w-none flex-row items-start gap-xl max-[1196px]:max-w-[1213px] max-[1196px]:flex-col max-[1196px]:gap-lg max-[776px]:w-full max-[776px]:gap-0 max-[390px]:max-w-[390px]">
          <CheckoutSteps
            data={data}
            expandedStep={expandedStep}
            stepSelectedCounts={bundle.stepSelectedCounts}
            bundle={bundle}
            onToggleStep={toggleStep}
            onExpandStep={expandStep}
            onGoToNextStep={(stepId) => goToNextStep(stepId, data.steps.length)}
          />

          <CheckoutReview
            summaryTitle={data.summary.title}
            summarySubtitle={data.summary.subtitle}
            summarySections={bundle.summarySections}
            guaranteeTitle={data.summary.guarantee.title}
            guaranteeDescription={data.summary.guarantee.description}
            monthlyAsLowAs={bundle.orderTotals.monthlyAsLowAs}
            originalTotal={bundle.orderTotals.originalTotal}
            finalTotal={bundle.orderTotals.finalTotal}
            savings={bundle.orderTotals.savings}
            isSaved={bundle.isSaved}
            onItemQuantityChange={bundle.handleSummaryQuantityChange}
            onCheckout={bundle.handleCheckout}
            onSave={bundle.handleSaveSystem}
          />
        </div>
      </main>
    </div>
  )
}
