export interface ColorOption {
  id: string
  label: string
  /** Small product photo shown beside the color label */
  image: string
  selected?: boolean
}

export interface CameraProduct {
  id: string
  name: string
  description: string
  image: string
  savePercent?: number
  originalPrice: number | null
  salePrice: number
  quantity: number
  selected?: boolean
  titleSize?: 'md' | 'lg'
  descriptionSize?: 'sm' | 'md'
  /** Desktop image horizontal offset in px */
  imageTranslateX?: number
  /** Figma image container width in px */
  imageWidth?: number
  /** Figma image container height in px */
  imageHeight?: number
  /** Figma card height in px */
  cardHeight?: number
  /** Optional fixed card width (e.g. centered last row item) */
  cardWidth?: number
  /** Standalone centered card — colors in header, compact footer */
  cardLayout?: 'default' | 'standalone' | 'compact'
  colors: ColorOption[]
}

export interface StepConfig {
  id: number
  stepLabel: string
  title: string
  icon: 'camera' | 'plan' | 'sensor' | 'extra'
  nextButton?: string
}

export interface StepProduct {
  id: string
  name: string
  description?: string
  image: string
  originalPrice?: number | null
  salePrice?: number
  salePriceLabel?: string
  priceSuffix?: string
  quantity: number
  selected?: boolean
  quantityLocked?: boolean
  isPlan?: boolean
}

export interface PlanProduct {
  id: string
  name: string
  description?: string
  image?: string
  originalPrice?: number | null
  salePrice?: number
  salePriceLabel?: string
  priceSuffix?: string
  selected?: boolean
  isPlan?: boolean
}

export interface SummaryItem {
  id: string
  name: string
  image?: string
  icon?: string
  quantity: number | null
  originalPrice?: number
  salePrice?: number
  salePriceLabel?: string
  priceSuffix?: string
  isPlan?: boolean
  quantityLocked?: boolean
}

export interface SummarySection {
  id: string
  label: string | null
  items: SummaryItem[]
}

export interface ProductsData {
  steps: StepConfig[]
  cameras: CameraProduct[]
  plans: PlanProduct[]
  sensors: StepProduct[]
  accessories: StepProduct[]
  summary: {
    title: string
    subtitle: string
    guarantee: {
      title: string
      description: string
    }
    monthlyAsLowAs: number
    originalTotal: number
    finalTotal: number
    savings: number
    sections: SummarySection[]
  }
}
