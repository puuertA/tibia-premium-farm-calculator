/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "panel": "#1b1d24",
        "panel-2": "#222430",
        "border": "#2d2f3a",
        "text": "#e5e7eb",
        "muted": "#9ca3af",
        "accent": "#22c55e",
        "warning": "#f97316",
        "danger": "#ef4444"
      },
      boxShadow: {
        "card": "0 10px 30px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};
