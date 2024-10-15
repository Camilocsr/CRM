/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      colors: {
        'custom-blue': '#1e40af',
      },
    },
  },
  plugins: [],
};