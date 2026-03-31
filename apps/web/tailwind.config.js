/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        broker: {
          bg: '#0c0c0c',
          'bg-deep': '#090909',
          panel: '#151515',
          'panel-light': '#1c1c1c',
          border: '#262626',
          'border-light': '#363636',
          accent: '#e8772e',
          'accent-dim': '#c96524',
          'accent-subtle': 'rgba(232, 119, 46, 0.08)',
          danger: '#c0392b',
          muted: '#5c5c5c',
          'muted-light': '#8a8a8a',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
