import { useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import type { ProductsData } from '../types/product'
import {
  applyCameraVariantQuantityChange,
  buildSummarySections,
  calculateOrderTotals,
  getCameraSelectedCount,
  getEffectiveSensors,
  getSavedBundleSnapshot,
  isSensorQuantityLocked,
  loadBundleState,
  resolveSummaryQuantityChange,
  saveBundleState,
  serializeBundleState,
  type BundleState,
} from '../utils/bundleState'

function getInitialPageState(data: ProductsData): {
  bundleState: BundleState
  savedSnapshot: string | null
} {
  const bundleState = loadBundleState(data)
  const savedSnapshot = getSavedBundleSnapshot()

  return {
    bundleState,
    savedSnapshot:
      savedSnapshot != null &&
      serializeBundleState(bundleState) === savedSnapshot
        ? savedSnapshot
        : null,
  }
}

export function useBundleState(data: ProductsData) {
  const [{ bundleState, savedSnapshot }, setPageState] = useState(() =>
    getInitialPageState(data),
  )

  const setBundleState = (
    updater: BundleState | ((prev: BundleState) => BundleState),
  ) => {
    setPageState((prev) => ({
      ...prev,
      bundleState:
        typeof updater === 'function' ? updater(prev.bundleState) : updater,
    }))
  }

  const { cameraVariants, selectedColors, imageColors, plans, accessories } =
    bundleState

  const selectedCameraCount = useMemo(
    () => getCameraSelectedCount(data.cameras, cameraVariants),
    [data.cameras, cameraVariants],
  )

  const selectedPlanCount = useMemo(
    () => plans.filter((plan) => plan.selected).length,
    [plans],
  )

  const effectiveSensors = useMemo(
    () => getEffectiveSensors(data, bundleState),
    [data, bundleState],
  )

  const selectedSensorCount = useMemo(
    () => effectiveSensors.filter((sensor) => sensor.quantity > 0).length,
    [effectiveSensors],
  )

  const selectedAccessoryCount = useMemo(
    () => accessories.filter((accessory) => accessory.quantity > 0).length,
    [accessories],
  )

  const summarySections = useMemo(
    () => buildSummarySections(data, bundleState),
    [data, bundleState],
  )

  const orderTotals = useMemo(
    () => calculateOrderTotals(data, bundleState),
    [data, bundleState],
  )

  const isSaved = useMemo(() => {
    if (savedSnapshot == null) return false
    return serializeBundleState(bundleState) === savedSnapshot
  }, [bundleState, savedSnapshot])

  const stepSelectedCounts: Record<number, number> = {
    1: selectedCameraCount,
    2: selectedPlanCount,
    3: selectedSensorCount,
    4: selectedAccessoryCount,
  }

  const updateCameraVariantQty = (
    cameraId: string,
    colorId: string,
    quantity: number,
  ) => {
    setBundleState((prev) =>
      applyCameraVariantQuantityChange(prev, data, cameraId, colorId, quantity),
    )
  }

  const updateCameraColor = (cameraId: string, colorId: string) => {
    setBundleState((prev) => ({
      ...prev,
      selectedColors: {
        ...prev.selectedColors,
        [cameraId]: colorId,
      },
      imageColors: {
        ...prev.imageColors,
        [cameraId]: colorId,
      },
    }))
  }

  const handleSummaryQuantityChange = (
    sectionId: string,
    itemId: string,
    qty: number,
  ) => {
    setBundleState((prev) =>
      resolveSummaryQuantityChange(sectionId, itemId, qty, prev, data),
    )
  }

  const updateSensorQuantity = (id: string, quantity: number) => {
    setBundleState((prev) => {
      if (isSensorQuantityLocked(data, prev, id)) {
        return prev
      }

      return {
        ...prev,
        sensors: prev.sensors.map((sensor) =>
          sensor.id === id
            ? { ...sensor, quantity: Math.max(0, quantity) }
            : sensor,
        ),
      }
    })
  }

  const updateAccessoryQuantity = (id: string, quantity: number) => {
    setBundleState((prev) => ({
      ...prev,
      accessories: prev.accessories.map((accessory) =>
        accessory.id === id
          ? { ...accessory, quantity: Math.max(0, quantity) }
          : accessory,
      ),
    }))
  }

  const selectPlan = (id: string) => {
    setBundleState((prev) => ({
      ...prev,
      plans: prev.plans.map((plan) => ({ ...plan, selected: plan.id === id })),
    }))
  }

  const handleSaveSystem = () => {
    if (isSaved) return

    saveBundleState(bundleState)
    setPageState((prev) => ({
      ...prev,
      savedSnapshot: serializeBundleState(bundleState),
    }))
  }

  const handleCheckout = () => {
    Swal.fire({
      title: 'Checkout',
      text: 'Your order is ready to be processed.',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#4e2fd2',
    })
  }

  return {
    bundleState,
    selectedColors,
    imageColors,
    plans,
    accessories,
    effectiveSensors,
    summarySections,
    orderTotals,
    isSaved,
    stepSelectedCounts,
    updateCameraVariantQty,
    updateCameraColor,
    handleSummaryQuantityChange,
    updateSensorQuantity,
    updateAccessoryQuantity,
    selectPlan,
    handleSaveSystem,
    handleCheckout,
  }
}
