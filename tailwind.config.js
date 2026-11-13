/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stridex: {
          primary: 'var(--color-primary, #72C98A)',
          primaryHover: 'var(--color-primary-hover, #59B976)',
          secondary: 'var(--color-secondary, #BDECCB)',
          accent: 'var(--color-accent, #DDF3E2)',
          bg: 'var(--color-background, #F2FAF4)',
          surface: 'var(--color-surface, #FFFFFF)',
          text: 'var(--color-text, #26352D)',
          muted: 'var(--color-muted, #718078)',
          border: 'var(--color-border, #DCEBE0)',
          success: 'var(--color-success, #35A866)',
          warning: 'var(--color-warning, #F2B84B)',
          error: 'var(--color-error, #E45D5D)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
