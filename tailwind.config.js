/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4f46e5",
          600: "#4f46e5",
          700: "#4338ca",
          500: "#6366f1",
        },
        secondary: {
          DEFAULT: "#ec4899",
          500: "#ec4899",
          600: "#db2777",
        },
        accent: {
          DEFAULT: "#06b6d4",
          500: "#06b6d4",
          400: "#22d3ee",
        },

        surface: {
          light: "#ffffff",
          muted: "#f8fafc",
        },
        neutral: {
          900: "#0b1220",
          800: "#111827",
          700: "#374151",
          500: "#6b7280",
          400: "#9ca3af",
        },
        dark: "#0f1724", // app dark background
        light: "#f8fafc", // app light background

        badge: {
          premium: "#f59e0b",
        },
      },
      fontSize: {
        // slightly tuned sizes for headings / UX
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
      },
      borderRadius: {
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        soft: "0 6px 18px rgba(12, 18, 36, 0.06)",
        float: "0 12px 30px rgba(2,6,23,0.12)",
      },
      animation: {
        "fade-in": "fadeIn 0.45s ease-in-out",
        "slide-up": "slideUp 0.28s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
