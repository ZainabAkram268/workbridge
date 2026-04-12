/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: "#0d9488",
        "teal-light": "#ccfbf1",
        "teal-dark": "#0f766e",
      },
    },
  },
  plugins: [],
};