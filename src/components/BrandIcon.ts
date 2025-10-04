import { defineComponent, h } from 'vue'
import { getBrandDetails, type CardBrand } from '../utils/cardBrands'

const fallbackStyles: Record<CardBrand, { bg: string; text: string }> = {
  visa: { bg: 'var(--color-payment-visa)', text: 'var(--color-payment-visa-accent)' },
  mastercard: {
    bg: 'var(--color-payment-mastercard-bg)',
    text: 'var(--color-card-foreground)',
  },
  amex: {
    bg: 'var(--color-theme-amex-front-1)',
    text: 'var(--color-theme-amex-accent)',
  },
  diners: { bg: 'var(--color-payment-diners)', text: 'var(--color-card-foreground)' },
  discover: { bg: 'var(--color-payment-discover)', text: 'var(--color-card-foreground)' },
  enroute: { bg: 'var(--color-payment-enroute)', text: 'var(--color-card-foreground)' },
  jcb: { bg: 'var(--color-payment-jcb)', text: 'var(--color-card-foreground)' },
  voyager: { bg: 'var(--color-payment-voyager)', text: 'var(--color-card-foreground)' },
  hipercard: { bg: 'var(--color-payment-hipercard)', text: 'var(--color-card-foreground)' },
  aura: { bg: 'var(--color-payment-aura)', text: 'var(--color-card-foreground)' },
  unknown: { bg: 'var(--color-payment-fallback)', text: 'var(--color-card-foreground)' },
}

export default defineComponent({
  name: 'BrandIcon',
  props: {
    brand: {
      type: String as () => CardBrand,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const common = {
        width: 48,
        height: 28,
        viewBox: '0 0 48 28',
        fill: 'none',
      }

      if (props.brand === 'visa') {
        return h('svg', { ...common }, [
          h('rect', {
            x: 0,
            y: 0,
            width: 48,
            height: 28,
            rx: 4,
            fill: 'var(--color-payment-visa)',
          }),
          h(
            'text',
            {
              x: 24,
              y: 18,
              fill: 'var(--color-payment-visa-accent)',
              'text-anchor': 'middle',
              'font-size': 14,
              'font-weight': '700',
            },
            'VISA'
          ),
        ])
      }

      if (props.brand === 'mastercard') {
        return h('svg', { ...common }, [
          h('rect', {
            x: 0,
            y: 0,
            width: 48,
            height: 28,
            rx: 4,
            fill: 'var(--color-payment-mastercard-bg)',
          }),
          h('circle', {
            cx: 20,
            cy: 14,
            r: 8,
            fill: 'var(--color-payment-mastercard-red)',
            opacity: 0.9,
          }),
          h('circle', {
            cx: 28,
            cy: 14,
            r: 8,
            fill: 'var(--color-payment-mastercard-orange)',
            opacity: 0.9,
          }),
        ])
      }

      if (props.brand === 'amex') {
        return h('svg', { ...common }, [
          h('rect', {
            x: 0,
            y: 0,
            width: 48,
            height: 28,
            rx: 4,
            fill: 'var(--color-theme-amex-front-1)',
          }),
          h(
            'text',
            {
              x: 24,
              y: 18,
              fill: 'var(--color-theme-amex-accent)',
              'text-anchor': 'middle',
              'font-size': 12,
              'font-weight': '700',
            },
            'AMEX'
          ),
        ])
      }
      const details = getBrandDetails(props.brand)
      const theme = details.theme
      const style = fallbackStyles[props.brand] ?? {
        bg: theme.front[0],
        text: 'var(--color-card-foreground)',
      }
      const label = details.label.split(' ')[0]?.toUpperCase() ?? 'CARD'

      return h('svg', { ...common }, [
        h('rect', { x: 0, y: 0, width: 48, height: 28, rx: 4, fill: style.bg }),
        h(
          'text',
          {
            x: 24,
            y: 18,
            fill: style.text,
            'text-anchor': 'middle',
            'font-size': 10,
            'font-weight': '600',
          },
          label.length > 8 ? label.slice(0, 8) : label
        ),
      ])
    }
  },
})
