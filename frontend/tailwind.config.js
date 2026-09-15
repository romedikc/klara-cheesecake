/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        cream: 'var(--cream)',
        beige: 'var(--beige)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        'accent-deep': 'var(--accent-deep)',
        blush: 'var(--blush)',
      },
      fontFamily: {
        serif: 'var(--serif)',
        sans: 'var(--sans)',
      },
      maxWidth: {
        wrap: '1240px',
      },
      keyframes: {
        'ty-pop': {
          from: { transform: 'scale(0)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'ty-pop': 'ty-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
