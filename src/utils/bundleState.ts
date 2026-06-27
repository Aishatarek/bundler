import type {
  CameraProduct,
  PlanProduct,
  ProductsData,
  StepProduct,
  SummaryItem,
  SummarySection,
} from '../types/product'

export const BUNDLE_STORAGE_KEY = 'smarthome-bundle-config'

const DEFAULT_VARIANT_KEY = 'default'
const SENSE_HUB_ID = 'sense-hub'

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

export function syncSenseHubWithCameras(
  data: ProductsData,
  state: BundleState,
): BundleState {
  const camerasSelected = hasCamerasSelected(data.cameras, state.cameraVariants)

  return {
    ...state,
    sensors: state.sensors.map((sensor) => {
      if (sensor.id !== SENSE_HUB_ID) return sensor

      if (camerasSelected) {
        return { ...sensor, quantity: Math.max(sensor.quantity, 1) }
      }

      return { ...sensor, quantity: 0 }
    }),
  }
}

export function getEffectiveSensors(
  data: ProductsData,
  state: BundleState,
): StepProduct[] {
  const camerasSelected = hasCamerasSelected(data.cameras, state.cameraVariants)

  return state.sensors.map((sensor) => {
    if (sensor.id !== SENSE_HUB_ID) return sensor

    if (camerasSelected) {
      return {
        ...sensor,
        quantity: Math.max(sensor.quantity, 1),
        quantityLocked: true,
      }
    }

    return {
      ...sensor,
      quantityLocked: false,
    }
  })
}

export function isSensorQuantityLocked(
  data: ProductsData,
  state: BundleState,
  sensorId: string,
): boolean {
  return (
    getEffectiveSensors(data, state).find((sensor) => sensor.id === sensorId)
      ?.quantityLocked ?? false
  )
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
  for (const camera of data.cameras) {
    const variantKey = getVariantKey(camera)
    const qty = defaultCameraQty.get(camera.id) ?? 0
    cameraVariants[camera.id] = { [variantKey]: qty }
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

  return syncSenseHubWithCameras(data, {
    cameraVariants,
    selectedColors: Object.fromEntries(
      data.cameras.map((camera) => [camera.id, getDefaultColorId(camera)]),
    ),
    imageColors: {},
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

export function loadBundleState(data: ProductsData): BundleState {
  try {
    const stored = localStorage.getItem(BUNDLE_STORAGE_KEY)
    if (!stored) {
      return createDefaultBundleState(data)
    }

    const parsed = JSON.parse(stored) as BundleState
    return syncSenseHubWithCameras(data, {
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
    })
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

function buildCameraSummaryItems(
  cameras: CameraProduct[],
  cameraVariants: Record<string, Record<string, number>>,
): SummaryItem[] {
  const items: SummaryItem[] = []

  for (const camera of cameras) {
    if (camera.colors.length === 0) {
      const qty = getVariantQuantity(cameraVariants, camera.id, DEFAULT_VARIANT_KEY)
      if (qty > 0) {
        items.push({
          id: `summary-${camera.id}`,
          name: camera.name,
          image: camera.image,
          quantity: qty,
          originalPrice:
            camera.originalPrice != null
              ? camera.originalPrice * qty
              : camera.salePrice * qty,
          salePrice: camera.salePrice * qty,
        })
      }
      continue
    }

    for (const color of camera.colors) {
      const qty = getVariantQuantity(cameraVariants, camera.id, color.id)
      if (qty > 0) {
        items.push({
          id: `summary-${camera.id}-${color.id}`,
          name: `${camera.name} - ${color.label}`,
          image: color.image,
          quantity: qty,
          originalPrice:
            camera.originalPrice != null
              ? camera.originalPrice * qty
              : camera.salePrice * qty,
          salePrice: camera.salePrice * qty,
        })
      }
    }
  }

  return items
}

function buildStepProductSummaryItems(products: StepProduct[]): SummaryItem[] {
  return products
    .filter((product) => product.quantity > 0)
    .map((product) => {
      const unitOriginal = product.originalPrice ?? product.salePrice ?? 0
      const unitSale = product.salePrice ?? 0

      return {
        id: `summary-${product.id}`,
        name: product.name,
        image: product.image,
        quantity: product.quantity,
        originalPrice: product.originalPrice != null ? unitOriginal * product.quantity : undefined,
        salePrice: product.salePriceLabel ? undefined : unitSale * product.quantity,
        salePriceLabel: product.salePriceLabel,
        quantityLocked: product.quantityLocked,
      }
    })
}

export function buildSummarySections(
  data: ProductsData,
  state: BundleState,
): SummarySection[] {
  const selectedPlan = state.plans.find((plan) => plan.selected)

  const sections = data.summary.sections.map((section) => {
    if (section.id === 'cameras') {
      return {
        ...section,
        items: buildCameraSummaryItems(data.cameras, state.cameraVariants),
      }
    }

    if (section.id === 'sensors') {
      return {
        ...section,
        items: buildStepProductSummaryItems(getEffectiveSensors(data, state)),
      }
    }

    if (section.id === 'accessories') {
      return {
        ...section,
        items: buildStepProductSummaryItems(state.accessories),
      }
    }

    if (section.id === 'plan') {
      return {
        ...section,
        items: selectedPlan
          ? [
              {
                id: `summary-${selectedPlan.id}`,
                name: selectedPlan.name,
                quantity: null,
                isPlan: true,
                originalPrice: selectedPlan.originalPrice ?? undefined,
                salePrice: selectedPlan.salePrice,
                priceSuffix: selectedPlan.priceSuffix,
              },
            ]
          : [],
      }
    }

    return section
  })

  return sections.filter(
    (section) => section.id === 'shipping' || section.items.length > 0,
  )
}

export interface OrderTotals {
  originalTotal: number
  finalTotal: number
  savings: number
  monthlyAsLowAs: number
}

export function calculateOrderTotals(
  data: ProductsData,
  state: BundleState,
): OrderTotals {
  let originalTotal = 0
  let finalTotal = 0

  for (const camera of data.cameras) {
    const variantKeys =
      camera.colors.length > 0
        ? camera.colors.map((color) => color.id)
        : [DEFAULT_VARIANT_KEY]

    for (const variantKey of variantKeys) {
      const qty = getVariantQuantity(state.cameraVariants, camera.id, variantKey)
      if (qty <= 0) continue

      const unitOriginal = camera.originalPrice ?? camera.salePrice
      originalTotal += unitOriginal * qty
      finalTotal += camera.salePrice * qty
    }
  }

  for (const sensor of getEffectiveSensors(data, state)) {
    if (sensor.quantity <= 0) continue

    if (sensor.salePriceLabel === 'FREE') {
      originalTotal += (sensor.originalPrice ?? 0) * sensor.quantity
      continue
    }

    const unitOriginal = sensor.originalPrice ?? sensor.salePrice ?? 0
    const unitSale = sensor.salePrice ?? 0
    originalTotal += unitOriginal * sensor.quantity
    finalTotal += unitSale * sensor.quantity
  }

  for (const accessory of state.accessories) {
    if (accessory.quantity <= 0) continue

    const unitOriginal = accessory.originalPrice ?? accessory.salePrice ?? 0
    const unitSale = accessory.salePrice ?? 0
    originalTotal += unitOriginal * accessory.quantity
    finalTotal += unitSale * accessory.quantity
  }

  const selectedPlan = state.plans.find((plan) => plan.selected)
  if (selectedPlan) {
    originalTotal += selectedPlan.originalPrice ?? selectedPlan.salePrice ?? 0
    finalTotal += selectedPlan.salePrice ?? 0
  }

  const shippingSection = data.summary.sections.find((s) => s.id === 'shipping')
  const shippingItem = shippingSection?.items[0]
  if (shippingItem?.originalPrice != null) {
    originalTotal += shippingItem.originalPrice
  }

  const savings = Math.max(0, originalTotal - finalTotal)
  const monthlyAsLowAs = finalTotal > 0 ? finalTotal / 9.78 : 0

  return { originalTotal, finalTotal, savings, monthlyAsLowAs }
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
  return syncSenseHubWithCameras(data, {
    ...state,
    cameraVariants: updateCameraVariantQuantity(
      state.cameraVariants,
      cameraId,
      colorId,
      quantity,
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

    return {
      ...state,
      sensors: state.sensors.map((sensor) =>
        sensor.id === productId
          ? { ...sensor, quantity: Math.max(0, qty) }
          : sensor,
      ),
    }
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
