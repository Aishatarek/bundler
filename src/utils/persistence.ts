import type { ProductsData } from '../types/product'
import {
  createDefaultBundleState,
  reconcileColorSelection,
  type BundleState,
} from './bundleState'
import { syncSenseHubWithSensors } from './senseHub'

export const BUNDLE_STORAGE_KEY = 'smarthome-bundle-config'

export function loadBundleState(data: ProductsData): BundleState {
  try {
    const stored = localStorage.getItem(BUNDLE_STORAGE_KEY)
    if (!stored) {
      return createDefaultBundleState(data)
    }

    const parsed = JSON.parse(stored) as BundleState
    return reconcileColorSelection(
      syncSenseHubWithSensors({
        ...createDefaultBundleState(data),
        ...parsed,
        plans: data.plans.map((plan) => {
          const storedPlan = parsed.plans?.find((p) => p.id === plan.id)
          return storedPlan ? { ...plan, selected: storedPlan.selected } : { ...plan }
        }),
        sensors: data.sensors.map((sensor) => {
          const storedSensor = parsed.sensors?.find((s) => s.id === sensor.id)
          return storedSensor
            ? { ...sensor, quantity: storedSensor.quantity }
            : { ...sensor }
        }),
        accessories: data.accessories.map((accessory) => {
          const storedAccessory = parsed.accessories?.find((a) => a.id === accessory.id)
          return storedAccessory
            ? { ...accessory, quantity: storedAccessory.quantity }
            : { ...accessory }
        }),
      }),
      data.cameras,
    )
  } catch {
    return createDefaultBundleState(data)
  }
}

export function serializeBundleState(state: BundleState): string {
  return JSON.stringify({
    cameraVariants: state.cameraVariants,
    selectedColors: state.selectedColors,
    imageColors: state.imageColors,
    plans: state.plans.map(({ id, selected }) => ({ id, selected })),
    sensors: state.sensors.map(({ id, quantity }) => ({ id, quantity })),
    accessories: state.accessories.map(({ id, quantity }) => ({ id, quantity })),
  })
}

export function saveBundleState(state: BundleState): void {
  localStorage.setItem(BUNDLE_STORAGE_KEY, serializeBundleState(state))
}

export function getSavedBundleSnapshot(): string | null {
  return localStorage.getItem(BUNDLE_STORAGE_KEY)
}
