import type { ProductsData } from '../../types/product'
import { getVariantQuantity } from '../../utils/bundleState'
import type { useBundleState } from '../../hooks/useBundleState'
import { Button } from '../ui'
import { CameraProductCard } from './CameraProductCard'
import { PlanProductCard, StepProductCard } from './StepProductCard'
import {
  CollapsedStep,
  ExpandedStep,
} from './StepSection'

type BundleActions = ReturnType<typeof useBundleState>

interface CheckoutStepsProps {
  data: ProductsData
  expandedStep: number
  stepSelectedCounts: Record<number, number>
  bundle: BundleActions
  onToggleStep: (stepId: number) => void
  onExpandStep: (stepId: number) => void
  onGoToNextStep: (stepId: number) => void
}

export function CheckoutSteps({
  data,
  expandedStep,
  stepSelectedCounts,
  bundle,
  onToggleStep,
  onExpandStep,
  onGoToNextStep,
}: CheckoutStepsProps) {
  const {
    bundleState,
    selectedColors,
    imageColors,
    plans,
    accessories,
    effectiveSensors,
    updateCameraVariantQty,
    updateCameraColor,
    selectPlan,
    updateSensorQuantity,
    updateAccessoryQuantity,
  } = bundle

  const { cameraVariants } = bundleState

  return (
    <div className="flex min-w-0 w-full flex-1 flex-col gap-[13px] min-[1197px]:gap-y-0 max-[767px]:w-full max-[767px]:gap-0">
      {data.steps.map((step, index) =>
        expandedStep === step.id ? (
          <ExpandedStep
            key={step.id}
            step={step}
            selectedCount={stepSelectedCounts[step.id]}
            onToggle={() => onToggleStep(step.id)}
          >
            {step.id === 1 && (
              <div className="grid w-full grid-cols-2 gap-[15px] max-[1196px]:flex max-[1196px]:gap-[15px] max-[767px]:flex-col min-[1197px]:[&>*:last-child:nth-child(odd)]:col-span-2 min-[1197px]:[&>*:last-child:nth-child(odd)]:mx-auto">
                {data.cameras.map((camera) => {
                  const selectedColorId = selectedColors[camera.id] ?? ''
                  const variantQty = getVariantQuantity(
                    cameraVariants,
                    camera.id,
                    selectedColorId,
                  )
                  const hasAnyVariantQty = Object.values(
                    cameraVariants[camera.id] ?? {},
                  ).some((qty) => qty > 0)

                  return (
                    <CameraProductCard
                      key={camera.id}
                      product={{
                        ...camera,
                        quantity: variantQty,
                        selected: hasAnyVariantQty,
                      }}
                      selectedColorId={selectedColorId}
                      imageColorId={imageColors[camera.id]}
                      onQuantityChange={(qty) =>
                        updateCameraVariantQty(camera.id, selectedColorId, qty)
                      }
                      onColorChange={(colorId) =>
                        updateCameraColor(camera.id, colorId)
                      }
                    />
                  )
                })}
              </div>
            )}

            {step.id === 2 && (
              <div className="flex w-full flex-col gap-[15px]">
                {plans.map((plan) => (
                  <PlanProductCard
                    key={plan.id}
                    product={plan}
                    selected={plan.selected ?? false}
                    onSelect={() => selectPlan(plan.id)}
                  />
                ))}
              </div>
            )}

            {step.id === 3 && (
              <div className="flex w-full flex-col gap-[15px]">
                {effectiveSensors.map((sensor) => (
                  <StepProductCard
                    key={sensor.id}
                    product={sensor}
                    onQuantityChange={(qty) =>
                      updateSensorQuantity(sensor.id, qty)
                    }
                  />
                ))}
              </div>
            )}

            {step.id === 4 && (
              <div className="flex w-full flex-col gap-[15px]">
                {accessories.map((accessory) => (
                  <StepProductCard
                    key={accessory.id}
                    product={accessory}
                    onQuantityChange={(qty) =>
                      updateAccessoryQuantity(accessory.id, qty)
                    }
                  />
                ))}
              </div>
            )}

            {step.nextButton && (
              <Button
                className="w-auto"
                onClick={() => onGoToNextStep(step.id)}
              >
                {step.nextButton}
              </Button>
            )}
          </ExpandedStep>
        ) : (
          <CollapsedStep
            key={step.id}
            step={step}
            selectedCount={stepSelectedCounts[step.id]}
            isFirst={index === 0}
            onToggle={() => onExpandStep(step.id)}
          />
        ),
      )}
    </div>
  )
}
