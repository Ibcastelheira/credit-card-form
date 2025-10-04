# Formulário de Cartão • Vue 3 + TypeScript + Tailwind

Projeto focado em formulários. Inclui máscaras dinâmicas (CPF, número do cartão, validade), validação em tempo real, uso de watchers e computed properties, e preview do cartão conforme digitação.

## Stack

- Vue 3 (Composition API + `<script setup>`)
- TypeScript
- Vite
- Tailwind CSS
- ESLint (`eslint-plugin-vue`, @vue config TS/Prettier)
- Prettier

## Como rodar

1. Instale as dependências:
   - `npm install`
2. Ambiente de desenvolvimento:
   - `npm run dev`
3. Build de produção:
   - `npm run build` e depois `npm run preview`

## Destaques

- Máscaras dinâmicas:
  - CPF: `000.000.000-00`
  - Cartão: padrão por bandeira (Visa/Mastercard 4-4-4-4, Amex 4-6-5)
  - Validade: `MM/AA`
- Validação em tempo real:
  - CPF (algoritmo oficial)
  - Cartão (Luhn + comprimento por bandeira)
  - Validade (mês/ano e não vencido)
  - CVV (3 ou 4 dígitos conforme a bandeira)
- Watchers e Computed:
  - Watchers aplicam máscaras conforme o usuário digita
  - Computeds calculam validade de campos, marca do cartão, estados do botão
- UX e Preview do cartão:
  - Preview ao lado com destaque do campo focado
  - Mostra marca detectada (Visa/Mastercard/Amex)

## Estrutura

- `src/components/CreditCardForm.vue`: formulário com máscaras, validação, watchers e emits
- `src/components/CreditCardPreview.vue`: cartão estilizado com dados dinâmicos
- `src/components/BrandIcon`: icone da bandeira do cartão
- `src/App.vue`: integra formulário e preview

## Observações

- Não há dependências extras para máscara/validação — tudo implementado em TypeScript.
- Pronto para evoluir com integrações de gateway (ex.: tokenização) em uma rota/API separada.
