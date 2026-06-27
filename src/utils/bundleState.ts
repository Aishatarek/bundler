import type {
  CameraProduct,
  PlanProduct,
  ProductsData,
  StepProduct,
} from '../types/product'
import { isSensorQuantityLocked, SENSE_HUB_ID, syncSenseHubWithSensors } from './senseHub'

export const DEFAULT_VARIANT_KEY = 'default'

export interface BundleState {
  cameraVariants: Record<string, Record<string, number>>
  selectedColors: Record<string, string>
  imageColors: Record<string, string>
  plans: PlanProduct[]
  sensors: StepProduct[]
  accessories: StepProduct[]
}

function getDefaultColorId(camera: CameraProduct): string {
  return camera.colors.find((c) => c.selected)?.id ?? camera.colors[0]?.id ?? DEFAULT_VARIANT_KEY
}

function getVariantKey(camera: CameraProduct): string {
  return camera.colors.length > 0 ? getDefaultColorId(camera) : DEFAULT_VARIANT_KEY
}

function parseCameraSummaryItemId(
  itemId: string,
  cameras: CameraProduct[],
): { cameraId: string; colorId: string } {
  const withoutPrefix = itemId.replace(/^summary-/, '')

  for (const camera of cameras) {
    if (withoutPrefix === camera.id) {
      return { cameraId: camera.id, colorId: DEFAULT_VARIANT_KEY }
    }
    if (withoutPrefix.startsWith(`${camera.id}-`)) {
      return {
        cameraId: camera.id,
        colorId: withoutPrefix.slice(camera.id.length + 1),
      }
    }
  }

  return { cameraId: withoutPrefix, colorId: DEFAULT_VARIANT_KEY }
}

export function getVariantQuantity(
  cameraVariants: Record<string, Record<string, number>>,
  cameraId: string,
  colorId: string,
): number {
  const key = colorId || DEFAULT_VARIANT_KEY
  return cameraVariants[cameraId]?.[key] ?? 0
}

export function getCameraSelectedCount(
  cameras: CameraProduct[],
  cameraVariants: Record<string, Record<string, number>>,
): number {
  return cameras.filter((camera) => {
    const variants = cameraVariants[camera.id]
    return variants != null && Object.values(variants).some((qty) => qty > 0)
  }).length
}

export function hasCamerasSelected(
  cameras: CameraProduct[],
  cameraVariants: Record<string, Record<string, number>>,
): boolean {
  return getCameraSelectedCount(cameras, cameraVariants) > 0
}

export function createDefaultBundleState(data: ProductsData): BundleState {
  const cameraSection = data.summary.sections.find((s) => s.id === 'cameras')
  const defaultCameraQty = new Map(
    cameraSection?.items.map((item) => [
      item.id.replace(/^summary-/, ''),
      item.quantity ?? 0,
    ]) ?? [],
  )

  const cameraVariants: Record<string, Record<string, number>> = {}
  const selectedColors: Record<string, string> = {}
  const imageColors: Record<string, string> = {}

  for (const camera of data.cameras) {
    const qty = defaultCameraQty.get(camera.id) ?? 0

    if (qty > 0) {
      const variantKey = getVariantKey(camera)
      cameraVariants[camera.id] = { [variantKey]: qty }
      if (camera.colors.length > 0) {
        selectedColors[camera.id] = variantKey
        imageColors[camera.id] = variantKey
      }
    } else {
      cameraVariants[camera.id] = {}
      selectedColors[camera.id] = ''
    }
  }

  const sensorSection = data.summary.sections.find((s) => s.id === 'sensors')
  const defaultSensorQty = new Map(
    sensorSection?.items.map((item) => [
      item.id.replace(/^summary-/, ''),
      item.quantity ?? 0,
    ]) ?? [],
  )

  const accessorySection = data.summary.sections.find((s) => s.id === 'accessories')
  const defaultAccessoryQty = new Map(
    accessorySection?.items.map((item) => [
      item.id.replace(/^summary-/, ''),
      item.quantity ?? 0,
    ]) ?? [],
  )

  return syncSenseHubWithSensors({
    cameraVariants,
    selectedColors,
    imageColors,
    plans: data.plans.map((plan) => ({ ...plan })),
    sensors: data.sensors.map((sensor) => ({
      ...sensor,
      quantity: defaultSensorQty.get(sensor.id) ?? sensor.quantity,
    })),
    accessories: data.accessories.map((accessory) => ({
      ...accessory,
      quantity: defaultAccessoryQty.get(accessory.id) ?? accessory.quantity,
    })),
  })
}

export function reconcileColorSelection(
  state: BundleState,
  cameras: CameraProduct[],
): BundleState {
  const selectedColors = { ...state.selectedColors }
  const imageColors = { ...state.imageColors }

  for (const camera of cameras) {
    const variants = state.cameraVariants[camera.id] ?? {}
    const hasQty = Object.values(variants).some((qty) => qty > 0)

    if (!hasQty) {
      if (!imageColors[camera.id]) {
        selectedColors[camera.id] = ''
      }
      continue
    }

    if (camera.colors.length === 0 || selectedColors[camera.id]) continue

    const colorWithQty = Object.entries(variants).find(
      ([key, qty]) => qty > 0 && key !== DEFAULT_VARIANT_KEY,
    )?.[0]
    const colorId = colorWithQty ?? getDefaultColorId(camera)
    selectedColors[camera.id] = colorId
    imageColors[camera.id] = colorId
  }

  return { ...state, selectedColors, imageColors }
}

export function updateCameraVariantQuantity(
  cameraVariants: Record<string, Record<string, number>>,
  cameraId: string,
  colorId: string,
  quantity: number,
): Record<string, Record<string, number>> {
  const key = colorId || DEFAULT_VARIANT_KEY
  const nextQty = Math.max(0, quantity)

  return {
    ...cameraVariants,
    [cameraId]: {
      ...cameraVariants[cameraId],
      [key]: nextQty,
    },
  }
}

export function applyCameraVariantQuantityChange(
  state: BundleState,
  data: ProductsData,
  cameraId: string,
  colorId: string,
  quantity: number,
): BundleState {
  const camera = data.cameras.find((c) => c.id === cameraId)
  const nextQty = Math.max(0, quantity)

  if (nextQty === 0) {
    return {
      ...state,
      cameraVariants: {
        ...state.cameraVariants,
        [cameraId]: {},
      },
      selectedColors: {
        ...state.selectedColors,
        [cameraId]: '',
      },
      imageColors: Object.fromEntries(
        Object.entries(state.imageColors).filter(([id]) => id !== cameraId),
      ),
    }
  }

  let effectiveColorId = colorId
  if (!effectiveColorId && camera && camera.colors.length > 0) {
    effectiveColorId = getDefaultColorId(camera)
  }

  const nextState: BundleState = {
    ...state,
    cameraVariants: updateCameraVariantQuantity(
      state.cameraVariants,
      cameraId,
      effectiveColorId,
      nextQty,
    ),
  }

  if (effectiveColorId && camera && camera.colors.length > 0) {
    return {
      ...nextState,
      selectedColors: {
        ...nextState.selectedColors,
        [cameraId]: effectiveColorId,
      },
      imageColors: {
        ...nextState.imageColors,
        [cameraId]: effectiveColorId,
      },
    }
  }

  return nextState
}

export function applySensorQuantityChange(
  state: BundleState,
  sensorId: string,
  quantity: number,
): BundleState {
  if (sensorId === SENSE_HUB_ID) return state

  return syncSenseHubWithSensors({
    ...state,
    sensors: state.sensors.map((sensor) =>
      sensor.id === sensorId
        ? { ...sensor, quantity: Math.max(0, quantity) }
        : sensor,
    ),
  })
}

export function resolveSummaryQuantityChange(
  sectionId: string,
  itemId: string,
  qty: number,
  state: BundleState,
  data: ProductsData,
): BundleState {
  if (sectionId === 'cameras') {
    const { cameraId, colorId } = parseCameraSummaryItemId(itemId, data.cameras)

    return applyCameraVariantQuantityChange(state, data, cameraId, colorId, qty)
  }

  if (sectionId === 'sensors') {
    const productId = itemId.replace(/^summary-/, '')
    if (isSensorQuantityLocked(data, state, productId)) {
      return state
    }

    return applySensorQuantityChange(state, productId, qty)
  }

  if (sectionId === 'accessories') {
    const productId = itemId.replace(/^summary-/, '')
    return {
      ...state,
      accessories: state.accessories.map((accessory) =>
        accessory.id === productId
          ? { ...accessory, quantity: Math.max(0, qty) }
          : accessory,
      ),
    }
  }

  return state
}

export { BUNDLE_STORAGE_KEY, getSavedBundleSnapshot, loadBundleState, saveBundleState, serializeBundleState } from './persistence'
export { buildSummarySections, calculateOrderTotals, type OrderTotals } from './pricing'
export { getEffectiveSensors, isSensorQuantityLocked, syncSenseHubWithSensors } from './senseHub'
