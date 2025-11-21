/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Courtsapp brand colors - exact official palette
        brand: {
          primary: "#e1f700", // Bright yellow-lime
          secondary: "#0a4728", // Dark forest green
          accent: "#10B981", // Emerald green
          dark: "#1F2937", // Dark gray
          light: "#FFFFFF", // Pure white
        },
      },
    },
  },
  plugins: [],
}
