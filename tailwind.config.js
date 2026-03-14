import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#19160F',
          2: '#3D3A32',
          3: '#7A7569',
        },
        paper: {
          DEFAULT: '#FAFAF7',
          alt: '#F2F0EB',
        },
        accent: {
          DEFAULT: '#B85C2A',
          hover: '#C96830',
          2: '#E8C27A',
          bg: '#FDF4E7',
        },
        surface: '#FFFFFF',
        border: {
          DEFAULT: '#E4E0D8',
          dark: '#C8C3B8',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Lora', 'Georgia', 'serif'],
        mono: ['"DM Mono"', '"Courier New"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        wider: '0.08em',
        widest: '0.18em',
      },
      boxShadow: {
        card: '0 4px 20px rgba(25,22,15,0.10)',
        'card-lg': '0 12px 48px rgba(25,22,15,0.14)',
        'card-sm': '0 1px 4px rgba(25,22,15,0.08)',
      },
      borderRadius: {
        card: '8px',
      },
      maxWidth: {
        content: '1120px',
        narrow: '760px',
        post: '1060px',
        'post-hero': '780px',
        cover: '900px',
      },
      animation: {
        'fade-up': 'fadeUp 0.55s cubic-bezier(0.4, 0, 0.2, 1) both',
        'fade-in': 'fadeIn 0.35s ease both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontFamily: theme('fontFamily.body').join(', '),
            color: theme('colors.ink.2'),
            lineHeight: '1.82',
            fontSize: '1.0625rem',
            maxWidth: 'none',
            'h2, h3': {
              fontFamily: theme('fontFamily.display').join(', '),
              color: theme('colors.ink.DEFAULT'),
              letterSpacing: '-0.01em',
            },
            h2: { fontSize: '1.6875rem', fontWeight: '700', marginTop: '3rem', marginBottom: '1.125rem' },
            h3: { fontSize: '1.25rem', fontWeight: '700', marginTop: '2.25rem', marginBottom: '0.75rem' },
            a: { color: theme('colors.accent.DEFAULT'), textDecorationColor: 'rgba(184,92,42,0.35)', textUnderlineOffset: '3px' },
            'a:hover': { textDecorationColor: theme('colors.accent.DEFAULT') },
            blockquote: {
              borderLeftColor: theme('colors.accent.DEFAULT'),
              borderLeftWidth: '3px',
              backgroundColor: theme('colors.accent.bg'),
              borderRadius: '0 8px 8px 0',
              fontStyle: 'italic',
              color: theme('colors.ink.DEFAULT'),
              paddingTop: '1.5rem',
              paddingBottom: '1.5rem',
              paddingLeft: '2rem',
              paddingRight: '2rem',
            },
            'ul > li::marker': { color: theme('colors.accent.DEFAULT') },
            strong: { color: theme('colors.ink.DEFAULT'), fontWeight: '700' },
            code: {
              fontFamily: theme('fontFamily.mono').join(', '),
              fontSize: '0.84375rem',
              backgroundColor: theme('colors.paper.alt'),
              padding: '0.125rem 0.4375rem',
              borderRadius: '3px',
              border: `1px solid ${theme('colors.border.DEFAULT')}`,
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            hr: { borderColor: theme('colors.border.DEFAULT') },
          },
        },
        dark: {
          css: {
            color: '#C4BFB4',
            'h2, h3, h4, strong': { color: '#F0EDE6' },
            blockquote: { backgroundColor: '#2A2218', color: '#F0EDE6' },
            code: { backgroundColor: '#1D1B17', borderColor: '#2E2B24' },
            hr: { borderColor: '#2E2B24' },
          },
        },
      }),
    },
  },
  plugins: [
    typography,
  ],
}
