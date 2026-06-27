import type { ComponentType, SVGProps } from 'react'
import type { StepConfig } from '../../types/product'
import CameraIcon from '../../assets/icons/camera.svg?react'
import PlanIcon from '../../assets/icons/plan.svg?react'
import SensorIcon from '../../assets/icons/sensor.svg?react'
import ExtraIcon from '../../assets/icons/extra.svg?react'
import { ChevronDown, ChevronUp, StepLabel } from './CheckoutUI'

const stepIcons: Record<
  StepConfig['icon'],
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  camera: CameraIcon,
  plan: PlanIcon,
  sensor: SensorIcon,
  extra: ExtraIcon,
}

interface CollapsedStepProps {
  step: StepConfig
  selectedCount?: number
  onToggle: () => void
  isFirst?: boolean
}

export function CollapsedStep({
  step,
  selectedCount,
  onToggle,
  isFirst = false,
}: CollapsedStepProps) {
  const Icon = stepIcons[step.icon]
  const iconClassName =
    step.icon === 'plan'
      ? 'h-[27px] w-[26px] shrink-0 max-[767px]:h-[25px] max-[767px]:w-6'
      : 'h-[26px] w-[26px] shrink-0 max-[767px]:h-5 max-[767px]:w-5'
  const MobileChevron = step.id === 2 || step.id === 4 ? ChevronDown : ChevronUp

  return (
    <section
      className={`flex flex-col items-start gap-[5px] min-[1197px]:mt-[13px] ${isFirst ? '' : 'max-[767px]:pt-[5px]'}`}
    >
      <div className="flex h-[10px] w-full items-center">
        <StepLabel collapsed>{step.stepLabel}</StepLabel>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`box-border flex h-[67px] w-full items-center justify-between gap-[3px] border-y-[0.5px] border-y-[#1F1F1F] px-[15px] py-5 max-[767px]:h-[60px] ${
          step.icon === 'plan' ? 'max-[767px]:h-[65px]' : ''
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 max-[767px]:gap-2">
          <Icon className={iconClassName} aria-hidden />
          <h2 className="font-semibold text-[22px] leading-[22px] text-[#0B0D10] max-[767px]:text-lg max-[767px]:leading-[18px]">
            {step.title}
          </h2>
        </div>
        {selectedCount != null && selectedCount > 0 ? (
          <>
            <span className="hidden shrink-0 items-center gap-1 font-medium text-sm leading-4 text-[#4E2FD2] max-[767px]:flex max-[767px]:gap-1">
              {selectedCount} selected
              <MobileChevron className="[&_path]:fill-[#4E2FD2]" />
            </span>
            <ChevronDown className="max-[767px]:hidden [&_path]:fill-[#4E2FD2]" />
          </>
        ) : (
          <ChevronDown className="[&_path]:fill-[#4E2FD2]" />
        )}
      </button>
    </section>
  )
}

interface ExpandedStepHeaderProps {
  step: StepConfig
  selectedCount?: number
  onToggle: () => void
}

export function ExpandedStepHeader({
  step,
  selectedCount,
  onToggle,
}: ExpandedStepHeaderProps) {
  const Icon = stepIcons[step.icon]

  return (
    <div className="flex w-full items-center justify-between gap-[3px]">
      <div className="flex flex-1 items-center gap-2 max-[1196px]:gap-2">
        <Icon
          className="h-[30px] w-[30px] shrink-0 max-[1196px]:h-[26px] max-[1196px]:w-[26px]"
          aria-hidden
        />
        <h2 className="font-semibold text-[28px] leading-[28px] text-[#0B0D10] max-[1196px]:text-[22px] max-[1196px]:leading-[22px]">
          {step.title}
        </h2>
      </div>
      {selectedCount != null && selectedCount > 0 && (
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-1 font-medium text-sm leading-4 text-[#4E2FD2]"
        >
          {selectedCount} selected
          <ChevronUp />
        </button>
      )}
    </div>
  )
}
