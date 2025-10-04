<template>
  <div class="sticky top-6">
    <div class="card-wrapper">
      <div :class="['card-3d', isBack ? 'card-3d--flipped' : '']" :style="cardStyles">
        <article class="card-face card-face--front">
          <div class="flex items-start justify-between">
            <div class="rounded bg-white/10 px-2 py-1 text-xs uppercase tracking-widest">
              {{ brandLabel }}
            </div>
            <BrandIcon :brand="brand" />
          </div>

          <div class="mt-6 space-y-2">
            <div
              :class="[
                'card-field px-2 py-1.5 text-lg tracking-widest',
                isFocused('number') ? 'card-field--focus' : '',
              ]"
            >
              <span>{{ displayNumber }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div
                :class="[
                  'col-span-2 card-field px-2 py-1.5 text-sm',
                  isFocused('name') ? 'card-field--focus' : '',
                ]"
              >
                <div class="card-label">Titular</div>
                <div class="truncate">{{ name || 'NOME DO TITULAR' }}</div>
              </div>
              <div
                :class="[
                  'card-field px-2 py-1.5 text-sm',
                  isFocused('expiry') ? 'card-field--focus' : '',
                ]"
              >
                <div class="card-label">Validade</div>
                <div>{{ expiry || expiryPlaceholder }}</div>
              </div>
            </div>
          </div>
        </article>

        <article class="card-face card-face--back">
          <div class="card-back">
            <div class="card-back__stripe" />
            <div class="card-back__cvv-label">Código de segurança</div>
            <div :class="['card-back__cvv', isFocused('cvv') ? 'card-back__cvv--focused' : '']">
              <span>{{ cvvDisplay }}</span>
            </div>
            <div class="card-back__brand">
              <BrandIcon :brand="brand" />
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { getBrandDetails, type CardBrand } from '../utils/cardBrands'
import BrandIcon from './BrandIcon'

const props = defineProps<{
  brand: CardBrand
  number: string
  name: string
  expiry: string
  cvv: string
  focused: 'number' | 'name' | 'expiry' | 'cvv' | 'cpf' | null
}>()

const brandDetails = computed(() => getBrandDetails(props.brand))
const brandLabel = computed(() => brandDetails.value.label)
const expiryPlaceholder = computed(() => 'MM/AA')
const isBack = computed(() => props.focused === 'cvv')
const cvvDisplay = computed(() => {
  if (props.cvv?.trim()) return props.cvv
  const length = brandDetails.value.cvvLength
  return '•'.repeat(length)
})
function hexToRgba(hex: string, alpha: number) {
  let normalized = hex.trim()
  if (normalized.startsWith('#')) normalized = normalized.slice(1)
  if (normalized.length === 3) {
    normalized = normalized
      .split('')
      .map((char) => char + char)
      .join('')
  }
  const bigint = parseInt(normalized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const cardStyles = computed<Record<string, string> | undefined>(() => {
  const details = brandDetails.value
  if (details.name === 'unknown') return undefined
  const theme = details.theme
  const accent = theme.accent
  const accentFocus =
    theme.accentFocus ?? (accent.startsWith('#') ? hexToRgba(accent, 0.55) : accent)
  const stripeStrong = theme.stripe?.[0] ?? theme.front[0]
  const stripeSoft = theme.stripe?.[1] ?? theme.front[1]
  const style: Record<string, string> = {
    '--color-card-front-start': theme.front[0],
    '--color-card-front-mid': theme.front[1],
    '--color-card-front-end': theme.front[2],
    '--color-card-accent': accent,
    '--color-card-accent-focus': accentFocus,
    '--color-card-stripe-strong': stripeStrong,
    '--color-card-stripe-soft': stripeSoft,
  }
  if (theme.foreground) style['--color-card-foreground'] = theme.foreground
  if (theme.label) style['--color-card-label'] = theme.label
  return style
})

const displayNumber = computed(() => {
  if (props.number?.trim()) return props.number
  return brandDetails.value.placeholder
})

function isFocused(key: 'number' | 'name' | 'expiry' | 'cvv') {
  return props.focused === key
}
</script>

<style scoped>
.card-wrapper {
  position: relative;
  perspective: 1200px;
}

.card-3d {
  position: relative;
  width: 100%;
  max-width: 24rem;
  height: 14rem;
  margin-left: auto;
  margin-right: auto;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}

.card-3d--flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  padding: 1.25rem;
  background: linear-gradient(
    135deg,
    var(--color-card-front-start),
    var(--color-card-front-mid),
    var(--color-card-front-end)
  );
  color: var(--color-card-foreground);
  box-shadow:
    var(--color-card-shadow) 0px 0.0625em 0.0625em,
    var(--color-card-shadow) 0px 0.125em 0.5em,
    var(--color-card-shadow) 0px 0px 0px 1px inset;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-face--back {
  transform: rotateY(180deg);
  padding: 1.5rem 1.25rem;
  align-items: stretch;
}

.card-field {
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.08);
  background: color-mix(in srgb, var(--color-card-foreground) 8%, transparent);
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s ease;
}

.card-field--focus {
  background: rgba(255, 255, 255, 0.16);
  background: color-mix(in srgb, var(--color-card-foreground) 16%, transparent);
  box-shadow: 0 0 0 2px var(--color-card-accent);
  transform: translateY(-1px);
}

.card-label {
  font-size: 0.625rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-card-label);
}

.card-back {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
}

.card-back__stripe {
  height: 2.5rem;
  border-radius: 0.5rem;
  background: linear-gradient(
    180deg,
    var(--color-card-stripe-strong),
    var(--color-card-stripe-soft)
  );
}

.card-back__cvv-label {
  font-size: 0.625rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-card-label);
}

.card-back__cvv {
  background: var(--color-card-cvv-surface);
  color: var(--color-card-cvv-text);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-align: right;
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
}

.card-back__cvv--focused {
  box-shadow: 0 0 0 3px var(--color-card-accent-focus);
  transform: translateY(-2px);
}

.card-back__brand {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 640px) {
  .card-3d {
    height: 12rem;
  }

  .card-face {
    padding: 1rem;
  }
}
</style>
