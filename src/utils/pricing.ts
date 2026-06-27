import type {
  CameraProduct,
  ProductsData,
  StepProduct,
  SummaryItem,
  SummarySection,
} from '../types/product'
import type { BundleState } from './bundleState'
import { DEFAULT_VARIANT_KEY, getVariantQuantity } from './bundleState'
import { getEffectiveSensors } from './senseHub'

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
        const name =
          color.id === 'white'
            ? camera.name
            : `${camera.name} - ${color.label}`

        items.push({
          id: `summary-${camera.id}-${color.id}`,
          name,
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
