import { useMemo, useState } from 'react'
import productsData from '../data/products.json'
import type { CameraProduct, ProductsData, SummarySection } from '../types/product'
import { CameraProductCard } from '../components/checkout/CameraProductCard'
import { CheckoutSidebar } from '../components/checkout/CheckoutSidebar'
import { OrderSummary } from '../components/checkout/OrderSummary'
import {
  CollapsedStep,
  ExpandedStepHeader,
} from '../components/checkout/StepSection'
import { Button } from '../components/checkout/Button'
import { StepLabel } from '../components/checkout/CheckoutUI'

const data = productsData as ProductsData

function getInitialColors(cameras: CameraProduct[]) {
  return Object.fromEntries(
    cameras.map((camera) => [
      camera.id,
      camera.colors.find((c) => c.selected)?.id ?? camera.colors[0]?.id ?? '',
    ]),
  )
}

function ReviewContent({
  summarySections,
  onItemQuantityChange,
}: {
  summarySections: SummarySection[]
  onItemQuantityChange: (sectionId: string, itemId: string, qty: number) => void
}) {
  return (
    <>
      <OrderSummary
        title={data.summary.title}
        subtitle={data.summary.subtitle}
        sections={summarySections}
        onItemQuantityChange={onItemQuantityChange}
      />
      <CheckoutSidebar
        guaranteeTitle={data.summary.guarantee.title}
        guaranteeDescription={data.summary.guarantee.description}
        monthlyAsLowAs={data.summary.monthlyAsLowAs}
        originalTotal={data.summary.originalTotal}
        finalTotal={data.summary.finalTotal}
        savings={data.summary.savings}
      />
    </>
  )
}

export default function CheckoutPage() {
  const [expandedStep, setExpandedStep] = useState(1)
  const [cameras, setCameras] = useState<CameraProduct[]>(() => {
    const cameraSection = data.summary.sections.find((s) => s.id === 'cameras')
    const defaultQty = new Map(
      cameraSection?.items.map((item) => [
        item.id.replace(/^summary-/, ''),
        item.quantity ?? 0,
      ]) ?? [],
    )
    return data.cameras.map((camera) => ({
      ...camera,
      quantity: defaultQty.get(camera.id) ?? 0,
    }))
  })
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>(
    () => getInitialColors(data.cameras),
  )
  const [imageColors, setImageColors] = useState<Record<string, string>>({})

  const selectedCameraCount = useMemo(
    () => cameras.filter((c) => c.quantity > 0).length,
    [cameras],
  )

  const summarySections = useMemo((): SummarySection[] => {
    const cameraSection = data.summary.sections.find((s) => s.id === 'cameras')
    const selectedCameras =
      cameraSection?.items.map((item) => {
        const cameraId = item.id.replace(/^summary-/, '')
        const liveCamera = cameras.find((c) => c.id === cameraId)
        return liveCamera
          ? { ...item, quantity: liveCamera.quantity }
          : item
      }) ?? []

    return data.summary.sections.map((section) =>
      section.id === 'cameras'
        ? {
            ...section,
            items: selectedCameras.filter(
              (item) => item.quantity != null && item.quantity > 0,
            ),
          }
        : section,
    )
  }, [cameras])

  const updateCameraQuantity = (id: string, quantity: number) => {
    setCameras((prev) =>
      prev.map((camera) =>
        camera.id === id ? { ...camera, quantity: Math.max(0, quantity) } : camera,
      ),
    )
  }

  const handleSummaryQuantityChange = (
    sectionId: string,
    itemId: string,
    qty: number,
  ) => {
    if (sectionId === 'cameras') {
      const cameraId = itemId.replace(/^summary-/, '')
      updateCameraQuantity(cameraId, qty)
    }
  }

  const cameraStep = data.steps[0]
  const collapsedSteps = data.steps.slice(1)

  const stepSelectedCounts: Record<number, number> = {
    1: selectedCameraCount,
    2: summarySections.find((s) => s.id === 'plan')?.items.length ?? 0,
    3:
      summarySections
        .find((s) => s.id === 'sensors')
        ?.items.filter((item) => (item.quantity ?? 0) > 0).length ?? 0,
    4: summarySections.find((s) => s.id === 'accessories')?.items.length ?? 0,
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#1F1F1F]">
      <main className="mx-auto w-full max-w-[1440px] px-[105px] py-[49px] max-[1196px]:px-6 max-[1196px]:py-[49px] max-[767px]:flex max-[767px]:flex-col max-[767px]:items-center max-[767px]:gap-5 max-[767px]:px-0 max-[767px]:py-0 max-[767px]:pt-[31px]">
        <h1 className="hidden w-full max-w-[348px] text-center font-bold text-[31.875px] leading-[110%] tracking-[-0.064px] text-[#1F1F1F] max-[767px]:block">
          Let&apos;s get started!
        </h1>

        <div className="mx-auto flex w-full max-w-none flex-row items-start gap-[29px] max-[1196px]:max-w-[1213px] max-[1196px]:flex-col max-[1196px]:gap-[13px] max-[767px]:max-w-[390px] max-[767px]:gap-0">
          {/* Left column — configuration steps */}
          <div className="flex min-w-0 flex-1 flex-col gap-[13px] min-[1197px]:gap-y-0 max-[767px]:w-full max-[767px]:gap-0">
            {/* Step 1 — Cameras (expanded) */}
            <section className="flex flex-col gap-[5px] rounded-[10px] bg-[#EDF4FF] pt-[15px] max-[767px]:hidden">
              <StepLabel>{cameraStep.stepLabel}</StepLabel>
              <div className="flex flex-col items-center gap-[15px] border-t-[0.5px] border-[#1F1F1F] px-[15px] py-5">
                <ExpandedStepHeader
                  step={cameraStep}
                  selectedCount={selectedCameraCount}
                  onToggle={() => setExpandedStep(expandedStep === 1 ? 0 : 1)}
                />

                {expandedStep === 1 && (
                  <>
                    <div className="grid w-full grid-cols-2 gap-[15px] max-[1196px]:flex max-[1196px]:gap-[15px] min-[1197px]:[&>*:last-child:nth-child(odd)]:col-span-2 min-[1197px]:[&>*:last-child:nth-child(odd)]:mx-auto">
                      {cameras.map((camera) => (
                        <CameraProductCard
                          key={camera.id}
                          product={camera}
                          selectedColorId={selectedColors[camera.id]}
                          imageColorId={imageColors[camera.id]}
                          onQuantityChange={(qty) =>
                            updateCameraQuantity(camera.id, qty)
                          }
                          onColorChange={(colorId) => {
                            setSelectedColors((prev) => ({
                              ...prev,
                              [camera.id]: colorId,
                            }))
                            setImageColors((prev) => ({
                              ...prev,
                              [camera.id]: colorId,
                            }))
                          }}
                        />
                      ))}
                    </div>

                    {cameraStep.nextButton && (
                      <Button className="w-auto">
                        {cameraStep.nextButton}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </section>

            {/* Steps 2–4 (collapsed) — desktop & tablet */}
            {collapsedSteps.map((step) => (
              <div key={step.id} className="max-[767px]:hidden">
                <CollapsedStep
                  step={step}
                  onToggle={() => setExpandedStep(step.id)}
                />
              </div>
            ))}

            {/* Mobile — all steps collapsed */}
            <div className="hidden flex-col max-[767px]:flex">
              {data.steps.map((step, index) => (
                <CollapsedStep
                  key={step.id}
                  step={step}
                  selectedCount={stepSelectedCounts[step.id]}
                  isFirst={index === 0}
                  onToggle={() => setExpandedStep(step.id)}
                />
              ))}
            </div>
          </div>

          {/* Desktop — sticky review sidebar */}
          <aside className="sticky top-[49px] hidden w-[399px] shrink-0 flex-col gap-[5px] self-start rounded-[10px] bg-[#EDF4FF] pt-[15px] min-[1197px]:flex">
            <div className="flex h-3 w-full items-center">
              <StepLabel>Review</StepLabel>
            </div>
            <div className="flex flex-col gap-[10px] px-5 pb-[31px] pt-5">
              <ReviewContent
                summarySections={summarySections}
                onItemQuantityChange={handleSummaryQuantityChange}
              />
            </div>
          </aside>

          {/* Tablet — order summary two-column layout */}
          <section className="hidden flex-col gap-[5px] rounded-[10px] bg-[#EDF4FF] pt-[15px] min-[768px]:max-[1196px]:flex">
            <div className="flex w-full flex-col gap-2.5 px-5 pb-[31px] pt-5 min-[768px]:max-[900px]:px-4">
              <div className="flex w-full flex-row items-start gap-[52px] min-[768px]:max-[900px]:gap-6">
                <ReviewContent
                  summarySections={summarySections}
                  onItemQuantityChange={handleSummaryQuantityChange}
                />
              </div>
            </div>
          </section>

          {/* Mobile — review section below steps */}
          <section className="hidden w-full flex-col gap-[5px] bg-[#EDF4FF] pt-[15px] max-[767px]:flex">
            <div className="flex h-[10px] w-full items-center">
              <StepLabel collapsed>Review</StepLabel>
            </div>
            <div className="flex flex-col gap-2.5 px-5 pb-[31px] pt-5">
              <ReviewContent
                summarySections={summarySections}
                onItemQuantityChange={handleSummaryQuantityChange}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
