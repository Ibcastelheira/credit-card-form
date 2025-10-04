<template>
  <main class="min-h-screen p-6 sm:p-10">
    <div class="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
      <section class="order-2 md:order-1">
        <CreditCardForm @update-preview="onUpdatePreview" @submit-form="onSubmit" />
      </section>
      <section class="order-1 md:order-2">
        <CreditCardPreview
          :brand="preview.brand"
          :number="preview.number"
          :name="preview.name"
          :expiry="preview.expiry"
          :cvv="preview.cvv"
          :focused="preview.focused"
        />
      </section>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import CreditCardForm, { PreviewState } from './components/CreditCardForm.vue'
import CreditCardPreview from './components/CreditCardPreview.vue'

const preview = reactive<PreviewState>({
  brand: 'unknown',
  number: '',
  name: '',
  expiry: '',
  cvv: '',
  cpf: '',
  focused: null,
})

function onUpdatePreview(next: PreviewState) {
  Object.assign(preview, next)
}

function onSubmit(payload: Record<string, string>) {
  alert('Enviado!\\n' + JSON.stringify(payload, null, 2))
}
</script>
