/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      /* ── Fonts ─────────────────────────────────────────────── */
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },

      /* ── Colors (mapped to CSS custom properties) ──────────── */
      colors: {
        border:      'var(--border)',
        input:       'var(--input)',
        ring:        'var(--ring)',
        background:  'var(--background)',
        foreground:  'var(--foreground)',

        primary: {
          DEFAULT:    'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT:    'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT:    'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT:    'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        destructive: {
          DEFAULT:    'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        card: {
          DEFAULT:    'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT:    'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },

        /* Luxury palette */
        gold: {
          50:  'var(--gold-50)',
          100: 'var(--gold-100)',
          200: 'var(--gold-200)',
          300: 'var(--gold-300)',
          400: 'var(--gold-400)',
          500: 'var(--gold-500)',
          600: 'var(--gold-600)',
          700: 'var(--gold-700)',
          800: 'var(--gold-800)',
          900: 'var(--gold-900)',
        },
        charcoal: {
          50:  'var(--charcoal-50)',
          100: 'var(--charcoal-100)',
          200: 'var(--charcoal-200)',
          300: 'var(--charcoal-300)',
          400: 'var(--charcoal-400)',
          500: 'var(--charcoal-500)',
          600: 'var(--charcoal-600)',
          700: 'var(--charcoal-700)',
          800: 'var(--charcoal-800)',
          900: 'var(--charcoal-900)',
        },
        ivory: {
          DEFAULT: 'var(--secondary)',
          50:  'oklch(0.99 0.003 85)',
          100: 'oklch(0.97 0.008 85)',
          200: 'oklch(0.94 0.012 85)',
        },
      },

      /* ── Border Radius ─────────────────────────────────────── */
      borderRadius: {
        lg:   'var(--radius)',
        md:   'calc(var(--radius) - 2px)',
        sm:   'calc(var(--radius) - 4px)',
        xl:   'calc(var(--radius) + 4px)',
        '2xl':'calc(var(--radius) + 8px)',
      },

      /* ── Box Shadows ───────────────────────────────────────── */
      boxShadow: {
        luxury: '0 4px 24px oklch(0.18 0.015 260 / 0.12)',
        gold:   '0 4px 20px oklch(0.72 0.12 75 / 0.30)',
        card:   '0 2px 12px oklch(0.18 0.015 260 / 0.08)',
        'card-hover': '0 8px 32px oklch(0.18 0.015 260 / 0.16)',
      },

      /* ── Keyframes & Animations ────────────────────────────── */
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down':  'accordion-down 0.2s ease-out',
        'accordion-up':    'accordion-up 0.2s ease-out',
        'fade-in':         'fade-in 0.3s ease-out',
        'slide-in-right':  'slide-in-right 0.3s ease-out',
        shimmer:           'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};
