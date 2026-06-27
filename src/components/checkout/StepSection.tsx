import type { ComponentType, ReactNode, SVGProps } from 'react'
import type { StepConfig } from '../../types/product'
import CameraIcon from '../../assets/icons/camera.svg?react'
import PlanIcon from '../../assets/icons/plan.svg?react'
import SensorIcon from '../../assets/icons/sensor.svg?react'
import ExtraIcon from '../../assets/icons/extra.svg?react'
import { ChevronDown, ChevronUp, StepLabel } from '../ui'

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
      ? 'h-[30px] w-[30px] min-[1196px]:h-[26px] min-[1196px]:w-[26px] shrink-0 max-[776px]:h-[25px] max-[776px]:w-6'
      : 'h-[30px] w-[30px] min-[1196px]:h-[26px] min-[1196px]:w-[26px] shrink-0 max-[776px]:h-5 max-[776px]:w-5'
  return (
    <section
      className={`flex flex-col items-start gap-xs min-[1197px]:mt-lg ${isFirst ? '' : 'max-[776px]:pt-xs'}`}
    >
      <div className="flex h-[10px] w-full items-center">
        <StepLabel collapsed>{step.stepLabel}</StepLabel>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`box-border flex h-[67px] w-full items-center justify-between gap-2xs border-y-hairline border-y-ink px-step py-5 max-[776px]:h-[60px] ${
          step.icon === 'plan' ? 'max-[776px]:h-[65px]' : ''
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 max-[776px]:gap-2">
          <Icon className={iconClassName} aria-hidden />
          <h2 className="font-semibold text-[28px] leading-[28px] text-obsidian max-[776px]:text-base max-[776px]:leading-4 min-[1196px]:text-[22px] min-[1196px]:leading-[22px]">
            {step.title}
          </h2>
        </div>
        <span className="flex shrink-0 items-center gap-1 font-medium text-sm leading-4 text-wyze-purple">
          {selectedCount != null && selectedCount > 0 && (
            <>{selectedCount} selected</>
          )}
          <ChevronDown className="[&_path]:fill-wyze-purple" />
        </span>
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
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-2xs"
    >
      <div className="flex flex-1 items-start gap-2 max-[1196px]:gap-2">
        <Icon
          className="h-[30px] w-[30px] shrink-0 min-[1196px]:h-[26px] min-[1196px]:w-[26px]"
          aria-hidden
        />
        <h2 className="font-semibold text-[28px] leading-[28px] text-obsidian min-[1196px]:text-[22px] min-[1196px]:leading-[22px] max-[776px]:text-base max-[776px]:leading-4">
          {step.title}
        </h2>
      </div>
      <span className="flex shrink-0 items-center gap-1 font-medium text-sm leading-4 text-wyze-purple">
        {selectedCount != null && selectedCount > 0 && (
          <>{selectedCount} selected</>
        )}
        <ChevronUp />
      </span>
    </button>
  )
}

interface ExpandedStepProps {
  step: StepConfig
  selectedCount?: number
  onToggle: () => void
  children?: ReactNode
}

export function ExpandedStep({
  step,
  selectedCount,
  onToggle,
  children,
}: ExpandedStepProps) {
  return (
    <section className="flex flex-col gap-xs rounded-card bg-step-bg pt-step">
      <StepLabel>{step.stepLabel}</StepLabel>
      <div className="flex flex-col items-center gap-step border-t-hairline border-ink px-step py-5">
        <ExpandedStepHeader
          step={step}
          selectedCount={selectedCount}
          onToggle={onToggle}
        />
        {children}
      </div>
    </section>
  )
}
