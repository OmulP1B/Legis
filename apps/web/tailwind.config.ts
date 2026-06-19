import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1440px' },
    },
    extend: {
      colors: {
        /* ── Unitar blue-sky palette ── */
        primary: {
          50:  'var(--blue-sky-100)',
          100: 'var(--blue-sky-100)',
          150: 'var(--blue-sky-150)',
          200: 'var(--blue-sky-200)',
          300: 'var(--blue-sky-300)',
          400: 'var(--blue-sky-400)',
          500: 'var(--blue-sky-500)',
          600: 'var(--blue-sky-600)',
          700: 'var(--blue-sky-700)',
          800: 'var(--blue-sky-800)',
          900: 'var(--blue-sky-900)',
          950: 'var(--blue-sky-900)',
          DEFAULT: 'var(--blue-sky-600)',
          foreground: 'var(--white)',
        },
        /* ── Neutral grays ── */
        gray: {
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          250: 'var(--gray-250)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
          800: 'var(--gray-800)',
          900: 'var(--gray-900)',
        },
        /* ── Semantic / Alias ── */
        border:     'var(--color-border-base-default)',
        input:      'var(--color-border-base-default)',
        ring:       'var(--blue-sky-500)',
        background: 'var(--color-background-base-default)',
        foreground: 'var(--color-text-base-default)',
        card: {
          DEFAULT:    'var(--white)',
          foreground: 'var(--color-text-base-default)',
        },
        muted: {
          DEFAULT:    'var(--gray-100)',
          foreground: 'var(--gray-600)',
        },
        accent: {
          DEFAULT:    'var(--blue-sky-600)',
          foreground: 'var(--white)',
          light:      'var(--blue-sky-100)',
        },
        /* ── Status ── */
        success: { DEFAULT: 'var(--green-600)', light: 'var(--green-100)' },
        warning: { DEFAULT: 'var(--apricot-600)', light: 'var(--apricot-100)' },
        danger:  { DEFAULT: 'var(--red-600)', light: 'var(--red-100)' },
        info:    { DEFAULT: 'var(--blue-sky-600)', light: 'var(--blue-sky-100)' },
      },
      fontFamily: {
        sans: ['var(--font-onest)', 'Onest', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card:       'var(--shadow-100)',
        'card-hover':'var(--shadow-300)',
        modal:      'var(--shadow-400)',
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
      animation: {
        'fade-in':  'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.2s ease-out',
        'shimmer':  'shimmer 1.5s infinite',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
