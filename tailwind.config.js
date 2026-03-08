/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ipl: {
          blue: '#1a365d',
          gold: '#d69e2e',
          purple: '#553c9a',
        }
      }
    },
  },
  plugins: [],
}
