// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#2D3748",
        sage: {
          DEFAULT: "#4A7C59",
          hover: "#3d664a",
          light: "#E8F0EA",
        },
        background: "#F1F5F9",
      },
      fontFamily: {
        thai: ["'IBM Plex Sans Thai'", "sans-serif"],
      },
      boxShadow: {
        'soft-double': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}