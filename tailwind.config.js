/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px', // استهداف الهواتف الصغيرة جداً بدقة
      },
      colors: {
        // ربط متغيرات Tailwind بـ CSS Custom Properties للطبقة الدلالية (Semantic Layer)
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-high': 'var(--color-surface-high)',
        'surface-nav': 'var(--color-surface-nav)',
        accent: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
        },
        text: {
          DEFAULT: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
          dim: 'var(--color-text-dim)',
        },
        success: 'var(--color-success)',
        error: 'var(--color-error)',
      },
      borderRadius: {
        'card-lg': 'var(--card-radius)',    // 28px
        'card-sm': 'var(--card-radius-sm)', // 22px
      },
      transitionDuration: {
        'micro': 'var(--dur-micro)', // 150ms للاستجابة اللمسية اللحظية
        'base': 'var(--dur-base)',   // 250ms للتحولات القياسية
      },
      transitionTimingFunction: {
        'spring': 'var(--ease-spring)', // حركة مرنة ميكانيكية متجاوبة
        'enter': 'var(--ease-enter)',
        'exit': 'var(--ease-exit)',
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin': 'spin 0.8s linear infinite',
        'shimmer': 'shimmer 1.8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
};
