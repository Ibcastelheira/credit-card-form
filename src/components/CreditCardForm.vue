<template>
  <form @submit.prevent="handleSubmit" class="rounded-xl bg-white p-6 shadow">
    <h1 class="mb-6 text-xl font-semibold text-slate-800">Pagamento com Cartão</h1>

    <div class="mb-4">
      <label class="label" for="holder">Nome do Titular</label>
      <input
        id="holder"
        v-model="form.name"
        class="input"
        type="text"
        inputmode="text"
        autocomplete="cc-name"
        placeholder="Ex.: JOÃO SILVA"
        @focus="onFocus('name')"
        @blur="onBlur()"
      />
      <p v-if="touched.name && !isValidName" class="error-text">
        Informe nome e sobrenome (mín. 3 caracteres).
      </p>
    </div>

    <div class="mb-4">
      <label class="label" for="cpf">CPF</label>
      <input
        id="cpf"
        v-model="form.cpf"
        class="input"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        placeholder="000.000.000-00"
        @focus="onFocus('cpf')"
        @blur="onBlur()"
      />
      <p v-if="touched.cpf && !isValidCPF" class="error-text">CPF inválido.</p>
    </div>

    <div class="mb-4">
      <div class="flex items-center justify-between">
        <label class="label" for="card">Número do Cartão</label>
        <span class="text-xs text-slate-500">{{ brandLabel }}</span>
      </div>
      <input
        id="card"
        v-model="form.cardNumber"
        class="input"
        type="text"
        inputmode="numeric"
        autocomplete="cc-number"
        :placeholder="brandPlaceholder"
        @focus="onFocus('number')"
        @blur="onBlur()"
      />
      <p v-if="touched.cardNumber && !isValidCardNumber" class="error-text">
        Número do cartão inválido.
      </p>
    </div>

    <div class="mb-6 grid grid-cols-2 gap-4">
      <div>
        <label class="label" for="expiry">Validade (MM/AA)</label>
        <input
          id="expiry"
          v-model="form.expiry"
          class="input"
          type="text"
          inputmode="numeric"
          autocomplete="cc-exp"
          placeholder="MM/AA"
          @focus="onFocus('expiry')"
          @blur="onBlur()"
        />
        <p v-if="touched.expiry && !isValidExpiry" class="error-text">Data inválida ou vencida.</p>
      </div>
      <div>
        <label class="label" for="cvv">CVV</label>
        <input
          id="cvv"
          v-model="form.cvv"
          class="input"
          type="password"
          inputmode="numeric"
          :placeholder="cvvLength === 4 ? '####' : '###'"
          autocomplete="cc-csc"
          @focus="onFocus('cvv')"
          @blur="onBlur()"
        />
        <p v-if="touched.cvv && !isValidCVV" class="error-text">
          CVV deve ter {{ cvvLength }} dígitos.
        </p>
      </div>
    </div>

    <button
      type="submit"
      class="w-full rounded-lg bg-brand-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      :disabled="!canSubmit"
    >
      Pagar com Cartão
    </button>
  </form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { applyPattern, detectBrand, getBrandDetails, type CardBrand } from '../utils/cardBrands'

export type PreviewState = {
  brand: CardBrand
  number: string
  name: string
  expiry: string
  cvv: string
  cpf: string
  focused: 'number' | 'name' | 'expiry' | 'cvv' | 'cpf' | null
}

const emit = defineEmits<{
  (e: 'update-preview', value: PreviewState): void
  (e: 'submit-form', value: Record<string, string>): void
}>()

const form = reactive({
  name: '',
  cpf: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
})

const touched = reactive({
  name: false,
  cpf: false,
  cardNumber: false,
  expiry: false,
  cvv: false,
})

const focused = ref<PreviewState['focused']>(null)

const onlyDigits = (v: string) => (v || '').replace(/\D+/g, '')

function maskCPF(input: string) {
  const d = onlyDigits(input).slice(0, 11)
  const p1 = d.slice(0, 3)
  const p2 = d.slice(3, 6)
  const p3 = d.slice(6, 9)
  const p4 = d.slice(9, 11)
  let out = p1
  if (p2) out += '.' + p2
  if (p3) out += '.' + p3
  if (p4) out += '-' + p4
  return out
}

function maskCardNumber(raw: string, brand: CardBrand) {
  const digits = onlyDigits(raw)
  const { pattern } = getBrandDetails(brand)
  const max = pattern.reduce((sum, size) => sum + size, 0)
  return applyPattern(digits.slice(0, max), pattern)
}

function maskExpiry(input: string) {
  const d = onlyDigits(input).slice(0, 4)
  const mm = d.slice(0, 2)
  const yy = d.slice(2, 4)
  let out = mm
  if (yy) out += '/' + yy
  return out
}

function luhnCheck(digits: string) {
  if (digits.length < 12) return false
  let sum = 0
  let shouldDouble = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i])
    if (shouldDouble) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    shouldDouble = !shouldDouble
  }
  return sum % 10 === 0
}

function cpfIsValid(maskedOrRaw: string) {
  const s = onlyDigits(maskedOrRaw)
  if (s.length !== 11) return false
  if (/^(\d)\1{10}$/.test(s)) return false
  const nums = s.split('').map(Number)
  const calc = (len: number) => {
    let sum = 0
    for (let i = 0; i < len; i++) sum += nums[i] * (len + 1 - i)
    const r = (sum * 10) % 11
    return r === 10 ? 0 : r
  }
  const d1 = calc(9)
  const d2 = calc(10)
  return d1 === nums[9] && d2 === nums[10]
}

const brand = computed<CardBrand>(() => detectBrand(onlyDigits(form.cardNumber)))
const brandDetails = computed(() => getBrandDetails(brand.value))
const brandLabel = computed(() => brandDetails.value.label)
const brandPlaceholder = computed(() => brandDetails.value.placeholder)
const cardDigitsLength = computed(() =>
  brandDetails.value.pattern.reduce((total, size) => total + size, 0)
)
const cvvLength = computed(() => brandDetails.value.cvvLength)

watch(
  () => form.name,
  (v) => {
    touched.name = true
    const cleaned = (v || '').replace(/\s+/g, ' ').toUpperCase().slice(0, 26)
    if (cleaned !== v) form.name = cleaned
    emitPreview()
  }
)

watch(
  () => form.cpf,
  (v) => {
    touched.cpf = true
    const masked = maskCPF(v)
    if (masked !== v) form.cpf = masked
    emitPreview()
  }
)

watch(
  () => form.cardNumber,
  (v) => {
    touched.cardNumber = true
    const masked = maskCardNumber(v, brand.value)
    if (masked !== v) form.cardNumber = masked
    const trimmedCvv = onlyDigits(form.cvv).slice(0, cvvLength.value)
    if (trimmedCvv !== form.cvv) form.cvv = trimmedCvv
    emitPreview()
  }
)

watch(
  () => form.expiry,
  (v) => {
    touched.expiry = true
    const masked = maskExpiry(v)
    if (masked !== v) form.expiry = masked
    emitPreview()
  }
)

watch(
  () => form.cvv,
  (v) => {
    touched.cvv = true
    const digits = onlyDigits(v).slice(0, cvvLength.value)
    if (digits !== v) form.cvv = digits
    emitPreview()
  }
)

const isValidName = computed(() => form.name.trim().length >= 3 && /\s/.test(form.name.trim()))
const rawCardDigits = computed(() => onlyDigits(form.cardNumber))
const isValidCardNumber = computed(() => {
  const d = rawCardDigits.value
  if (d.length !== cardDigitsLength.value) return false
  return luhnCheck(d)
})

const isValidExpiry = computed(() => {
  const [mm, yy] = form.expiry.split('/')
  if (!mm || !yy || mm.length !== 2 || yy.length !== 2) return false
  const m = Number(mm)
  const y = 2000 + Number(yy)
  if (m < 1 || m > 12) return false
  const now = new Date()
  const end = new Date(y, m, 0, 23, 59, 59)
  return end >= new Date(now.getFullYear(), now.getMonth(), 1)
})

const isValidCPF = computed(() => cpfIsValid(form.cpf))
const isValidCVV = computed(() => onlyDigits(form.cvv).length === cvvLength.value)
const canSubmit = computed(
  () =>
    isValidName.value &&
    isValidCPF.value &&
    isValidCardNumber.value &&
    isValidExpiry.value &&
    isValidCVV.value
)

function emitPreview() {
  const state: PreviewState = {
    brand: brand.value,
    number: form.cardNumber,
    name: form.name,
    expiry: form.expiry,
    cvv: form.cvv.replace(/\d/g, '•'),
    cpf: form.cpf,
    focused: focused.value,
  }
  emit('update-preview', state)
}

function onFocus(key: PreviewState['focused']) {
  focused.value = key
  emitPreview()
}
function onBlur() {
  focused.value = null
  emitPreview()
}

function handleSubmit() {
  touched.name = touched.cpf = touched.cardNumber = touched.expiry = touched.cvv = true
  if (!canSubmit.value) return
  emit('submit-form', {
    name: form.name.trim(),
    cpf: onlyDigits(form.cpf),
    brand: brand.value,
    cardNumber: onlyDigits(form.cardNumber),
    expiry: form.expiry,
    cvv: onlyDigits(form.cvv),
  } as unknown as Record<string, string>)
}

emitPreview()
</script>
