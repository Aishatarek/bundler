import { useState } from 'react'

export function useCheckoutSteps(initialStep = 1) {
  const [expandedStep, setExpandedStep] = useState(initialStep)

  const toggleStep = (stepId: number) => {
    setExpandedStep((current) => (current === stepId ? 0 : stepId))
  }

  const expandStep = (stepId: number) => {
    setExpandedStep(stepId)
  }

  const goToNextStep = (currentStepId: number, totalSteps: number) => {
    const nextStepId = currentStepId + 1
    if (nextStepId <= totalSteps) {
      setExpandedStep(nextStepId)
    }
  }

  return {
    expandedStep,
    toggleStep,
    expandStep,
    goToNextStep,
  }
}
