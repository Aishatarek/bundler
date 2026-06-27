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
    <div className="min-h-screen bg-white font-sans text-[#1F1F1F]">
      <main className="mx-auto w-full max-w-[1440px] px-[105px] py-[49px] max-[1196px]:px-6 max-[1196px]:py-[49px] max-[767px]:flex max-[767px]:flex-col max-[767px]:items-center max-[767px]:gap-5 max-[767px]:px-0 max-[767px]:py-0 max-[767px]:pt-[31px]">
        <h1 className="hidden w-full max-w-[348px] text-center font-bold text-[31.875px] leading-[110%] tracking-[-0.064px] text-[#1F1F1F] max-[767px]:block">
          Let&apos;s get started!
        </h1>

        <div className="mx-auto flex w-full max-w-none flex-row items-start gap-[29px] max-[1196px]:max-w-[1213px] max-[1196px]:flex-col max-[1196px]:gap-[13px] max-[767px]:max-w-[390px] max-[767px]:gap-0">
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
