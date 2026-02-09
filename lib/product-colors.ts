export const PRODUCT_COLOR_MAPPINGS = {
  blue: {
    name: 'Blue',
    color: '#1086ff',
    vialIcon: '/vial-blue.svg',
    description: 'Standard'
  },
  green: {
    name: 'Green',
    color: '#47ff7b',
    vialIcon: '/vial-green.svg',
    description: 'Natural'
  },
  red: {
    name: 'Red',
    color: '#e60041',
    vialIcon: '/vial-red.svg',
    description: 'Performance'
  },
  purple: {
    name: 'Purple',
    color: '#6609ff',
    vialIcon: '/vial-purple.svg',
    description: 'Premium'
  },
  orange: {
    name: 'Orange',
    color: '#ff9845',
    vialIcon: '/vial-orange.svg',
    description: 'Energy'
  },
  yellow: {
    name: 'Yellow',
    color: '#fff95e',
    vialIcon: '/vial-yellow.svg',
    description: 'Basic'
  },
  pink: {
    name: 'Pink',
    color: '#ff4dfd',
    vialIcon: '/vial-pink.svg',
    description: 'Special'
  },
  gray: {
    name: 'Gray',
    color: '#818181',
    vialIcon: '/vial-grey.svg',
    description: 'Neutral'
  },
  grey: {
    name: 'Grey',
    color: '#818181',
    vialIcon: '/vial-grey.svg',
    description: 'Neutral'
  }
} as const

export function getVialIconByColor(color: string | null): string {
  if (!color) return PRODUCT_COLOR_MAPPINGS.gray.vialIcon
  
  const normalizedColor = color.toLowerCase()
  const mapping = Object.values(PRODUCT_COLOR_MAPPINGS).find(
    m => m.color.toLowerCase() === normalizedColor || m.name.toLowerCase() === normalizedColor
  )
  
  return mapping?.vialIcon || PRODUCT_COLOR_MAPPINGS.gray.vialIcon
}
