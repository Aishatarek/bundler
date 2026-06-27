import type { ProductsData, StepProduct } from '../types/product'
import type { BundleState } from './bundleState'

export const SENSE_HUB_ID = 'sense-hub'

function hasSensorsSelected(state: BundleState): boolean {
  return state.sensors.some(
    (sensor) => sensor.id !== SENSE_HUB_ID && sensor.quantity > 0,
  )
}

export function syncSenseHubWithSensors(state: BundleState): BundleState {
  const sensorsSelected = hasSensorsSelected(state)

  return {
    ...state,
    sensors: state.sensors.map((sensor) => {
      if (sensor.id !== SENSE_HUB_ID) return sensor

      if (sensorsSelected) {
        return { ...sensor, quantity: Math.max(sensor.quantity, 1) }
      }

      return { ...sensor, quantity: 0 }
    }),
  }
}

export function getEffectiveSensors(
  _data: ProductsData,
  state: BundleState,
): StepProduct[] {
  const sensorsSelected = hasSensorsSelected(state)

  return state.sensors.flatMap((sensor) => {
    if (sensor.id !== SENSE_HUB_ID) return [sensor]

    if (!sensorsSelected) return []

    return [
      {
        ...sensor,
        quantity: Math.max(sensor.quantity, 1),
        quantityLocked: true,
      },
    ]
  })
}

export function isSensorQuantityLocked(
  data: ProductsData,
  state: BundleState,
  sensorId: string,
): boolean {
  if (sensorId === SENSE_HUB_ID) return true

  return (
    getEffectiveSensors(data, state).find((sensor) => sensor.id === sensorId)
      ?.quantityLocked ?? false
  )
}
