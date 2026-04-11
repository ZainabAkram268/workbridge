/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        teal: { DEFAULT:"#5ecfb8", dark:"#2a9d8f", light:"#d6f5ef" },
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
    }
  },
  plugins: [],
};
