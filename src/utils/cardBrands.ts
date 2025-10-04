export type Pattern = number[]

export type CardBrand =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'diners'
  | 'discover'
  | 'enroute'
  | 'jcb'
  | 'voyager'
  | 'hipercard'
  | 'aura'
  | 'unknown'

export type BrandTheme = {
  front: [string, string, string]
  accent: string
  stripe?: [string, string]
  accentFocus?: string
}

type BrandDetection = {
  name: Exclude<CardBrand, 'unknown'>
  label: string
  pattern: Pattern
  cvvLength: number
  prefixes?: string[]
  match?: (digits: string) => boolean
  theme?: BrandTheme
}

const definitions: BrandDetection[] = [
  {
    name: 'amex',
    label: 'American Express',
    pattern: [4, 6, 5],
    cvvLength: 4,
    prefixes: ['34', '37'],
    theme: {
      front: [
        'var(--color-theme-amex-front-1)',
        'var(--color-theme-amex-front-2)',
        'var(--color-theme-amex-front-3)',
      ],
      accent: 'var(--color-theme-amex-accent)',
      stripe: ['var(--color-theme-amex-stripe-1)', 'var(--color-theme-amex-stripe-2)'],
      accentFocus: 'var(--color-theme-amex-focus)',
    },
  },
  {
    name: 'diners',
    label: 'Diners Club',
    pattern: [4, 6, 4],
    cvvLength: 3,
    prefixes: ['300', '301', '302', '303', '304', '305', '3095', '36', '38', '39'],
    theme: {
      front: [
        'var(--color-theme-diners-front-1)',
        'var(--color-theme-diners-front-2)',
        'var(--color-theme-diners-front-3)',
      ],
      accent: 'var(--color-theme-diners-accent)',
      stripe: ['var(--color-theme-diners-stripe-1)', 'var(--color-theme-diners-stripe-2)'],
      accentFocus: 'var(--color-theme-diners-focus)',
    },
  },
  {
    name: 'enroute',
    label: 'EnRoute',
    pattern: [4, 7, 4],
    cvvLength: 3,
    prefixes: ['2014', '2149'],
    theme: {
      front: [
        'var(--color-theme-enroute-front-1)',
        'var(--color-theme-enroute-front-2)',
        'var(--color-theme-enroute-front-3)',
      ],
      accent: 'var(--color-theme-enroute-accent)',
      stripe: ['var(--color-theme-enroute-stripe-1)', 'var(--color-theme-enroute-stripe-2)'],
      accentFocus: 'var(--color-theme-enroute-focus)',
    },
  },
  {
    name: 'hipercard',
    label: 'HiperCard',
    pattern: [4, 4, 4, 4],
    cvvLength: 3,
    prefixes: ['606282', '637095', '637568', '6062'],
    theme: {
      front: [
        'var(--color-theme-hipercard-front-1)',
        'var(--color-theme-hipercard-front-2)',
        'var(--color-theme-hipercard-front-3)',
      ],
      accent: 'var(--color-theme-hipercard-accent)',
      stripe: ['var(--color-theme-hipercard-stripe-1)', 'var(--color-theme-hipercard-stripe-2)'],
      accentFocus: 'var(--color-theme-hipercard-focus)',
    },
  },
  {
    name: 'discover',
    label: 'Discover',
    pattern: [4, 4, 4, 4],
    cvvLength: 4,
    prefixes: ['6011', '65', '644', '645', '646', '647', '648', '649', '622'],
    theme: {
      front: [
        'var(--color-theme-discover-front-1)',
        'var(--color-theme-discover-front-2)',
        'var(--color-theme-discover-front-3)',
      ],
      accent: 'var(--color-theme-discover-accent)',
      stripe: ['var(--color-theme-discover-stripe-1)', 'var(--color-theme-discover-stripe-2)'],
      accentFocus: 'var(--color-theme-discover-focus)',
    },
  },
  {
    name: 'jcb',
    label: 'JCB',
    pattern: [4, 4, 4, 4],
    cvvLength: 3,
    prefixes: ['3528', '3529', '353', '354', '355', '356', '357', '358'],
    theme: {
      front: [
        'var(--color-theme-jcb-front-1)',
        'var(--color-theme-jcb-front-2)',
        'var(--color-theme-jcb-front-3)',
      ],
      accent: 'var(--color-theme-jcb-accent)',
      stripe: ['var(--color-theme-jcb-stripe-1)', 'var(--color-theme-jcb-stripe-2)'],
      accentFocus: 'var(--color-theme-jcb-focus)',
    },
  },
  {
    name: 'voyager',
    label: 'Voyager',
    pattern: [5, 4, 5, 1],
    cvvLength: 3,
    prefixes: ['8699'],
    theme: {
      front: [
        'var(--color-theme-voyager-front-1)',
        'var(--color-theme-voyager-front-2)',
        'var(--color-theme-voyager-front-3)',
      ],
      accent: 'var(--color-theme-voyager-accent)',
      stripe: ['var(--color-theme-voyager-stripe-1)', 'var(--color-theme-voyager-stripe-2)'],
      accentFocus: 'var(--color-theme-voyager-focus)',
    },
  },
  {
    name: 'aura',
    label: 'Aura',
    pattern: [4, 4, 4, 4],
    cvvLength: 3,
    prefixes: ['5078', '508', '509', '5041'],
    theme: {
      front: [
        'var(--color-theme-aura-front-1)',
        'var(--color-theme-aura-front-2)',
        'var(--color-theme-aura-front-3)',
      ],
      accent: 'var(--color-theme-aura-accent)',
      stripe: ['var(--color-theme-aura-stripe-1)', 'var(--color-theme-aura-stripe-2)'],
      accentFocus: 'var(--color-theme-aura-focus)',
    },
  },
  {
    name: 'mastercard',
    label: 'Mastercard',
    pattern: [4, 4, 4, 4],
    cvvLength: 3,
    match: (digits) => matchesMastercard(digits),
    theme: {
      front: [
        'var(--color-theme-mastercard-front-1)',
        'var(--color-theme-mastercard-front-2)',
        'var(--color-theme-mastercard-front-3)',
      ],
      accent: 'var(--color-theme-mastercard-accent)',
      stripe: ['var(--color-theme-mastercard-stripe-1)', 'var(--color-theme-mastercard-stripe-2)'],
      accentFocus: 'var(--color-theme-mastercard-focus)',
    },
  },
  {
    name: 'visa',
    label: 'Visa',
    pattern: [4, 4, 4, 4],
    cvvLength: 3,
    prefixes: ['4'],
    theme: {
      front: [
        'var(--color-theme-visa-front-1)',
        'var(--color-theme-visa-front-2)',
        'var(--color-theme-visa-front-3)',
      ],
      accent: 'var(--color-theme-visa-accent)',
      stripe: ['var(--color-theme-visa-stripe-1)', 'var(--color-theme-visa-stripe-2)'],
      accentFocus: 'var(--color-theme-visa-focus)',
    },
  },
]

export type BrandDetails = {
  name: CardBrand
  label: string
  pattern: Pattern
  cvvLength: number
  placeholder: string
  theme: BrandTheme
}

const defaultTheme: BrandTheme = {
  front: [
    'var(--color-card-front-start)',
    'var(--color-card-front-mid)',
    'var(--color-card-front-end)',
  ],
  accent: 'var(--color-card-accent)',
  stripe: ['var(--color-card-stripe-strong)', 'var(--color-card-stripe-soft)'],
  accentFocus: 'var(--color-card-accent-focus)',
}

const defaultDetails: BrandDetails = {
  name: 'unknown',
  label: 'Cartão',
  pattern: [4, 4, 4, 4],
  cvvLength: 3,
  placeholder: patternToPlaceholder([4, 4, 4, 4]),
  theme: defaultTheme,
}

const detailsMap: Record<CardBrand, BrandDetails> = definitions.reduce(
  (acc, definition) => {
    acc[definition.name] = buildDetails(definition)
    return acc
  },
  { unknown: defaultDetails } as Record<CardBrand, BrandDetails>
)

export function detectBrand(digits: string): CardBrand {
  if (!digits) return 'unknown'
  for (const definition of definitions) {
    if (definition.match) {
      if (definition.match(digits)) return definition.name
      continue
    }
    if (!definition.prefixes) continue
    if (matchByPrefixes(digits, definition.prefixes)) return definition.name
  }
  return 'unknown'
}

export function getBrandDetails(brand: CardBrand): BrandDetails {
  return detailsMap[brand] ?? defaultDetails
}

export function applyPattern(digits: string, pattern: Pattern) {
  const parts: string[] = []
  let idx = 0
  for (const size of pattern) {
    const chunk = digits.slice(idx, idx + size)
    if (!chunk) break
    parts.push(chunk)
    idx += size
  }
  return parts.join(' ')
}

export function patternToPlaceholder(pattern: Pattern) {
  return pattern.map((size) => '#'.repeat(size)).join(' ')
}

function buildDetails(definition: BrandDetection): BrandDetails {
  return {
    name: definition.name,
    label: definition.label,
    pattern: definition.pattern,
    cvvLength: definition.cvvLength,
    placeholder: patternToPlaceholder(definition.pattern),
    theme: definition.theme ?? defaultTheme,
  }
}

function matchByPrefixes(digits: string, prefixes: string[]) {
  if (!digits) return false
  return prefixes.some((prefix) => {
    if (digits.length >= prefix.length) return digits.startsWith(prefix)
    const minPartial = Math.min(2, prefix.length)
    if (digits.length < minPartial) return false
    return prefix.startsWith(digits)
  })
}

function matchesMastercard(digits: string) {
  if (!digits) return false
  if (matchByPrefixes(digits, ['51', '52', '53', '54', '55'])) return true

  const partial = digits.slice(0, 4)
  if (!partial) return false
  if (partial.length < 4) {
    return ['2221', '2720'].some((edge) => edge.startsWith(partial))
  }
  const prefixValue = Number(partial)
  return prefixValue >= 2221 && prefixValue <= 2720
}
