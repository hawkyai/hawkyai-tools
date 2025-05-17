import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-source-sans)", "Source Sans 3", "sans-serif"],
        raleway: ["var(--font-raleway)", "Raleway", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          yellow: "rgb(var(--instagram-yellow))",
          pink: "rgb(var(--instagram-pink))",
          purple: "rgb(var(--instagram-purple))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom color scales
        purple: {
          1: "rgb(var(--purple-1) / <alpha-value>)",
          2: "rgb(var(--purple-2) / <alpha-value>)",
          3: "rgb(var(--purple-3) / <alpha-value>)",
          4: "rgb(var(--purple-4) / <alpha-value>)",
          5: "rgb(var(--purple-5) / <alpha-value>)",
          6: "rgb(var(--purple-6) / <alpha-value>)",
          7: "rgb(var(--purple-7) / <alpha-value>)",
          8: "rgb(var(--purple-8) / <alpha-value>)",
          9: "rgb(var(--purple-9) / <alpha-value>)",
          10: "rgb(var(--purple-10) / <alpha-value>)",
          11: "rgb(var(--purple-11) / <alpha-value>)",
          12: "rgb(var(--purple-12) / <alpha-value>)",
          500: "rgb(var(--instagram-purple))", // Using Instagram purple
        },
        green: {
          1: "rgb(var(--green-1) / <alpha-value>)",
          2: "rgb(var(--green-2) / <alpha-value>)",
          3: "rgb(var(--green-3) / <alpha-value>)",
          4: "rgb(var(--green-4) / <alpha-value>)",
          5: "rgb(var(--green-5) / <alpha-value>)",
          6: "rgb(var(--green-6) / <alpha-value>)",
          7: "rgb(var(--green-7) / <alpha-value>)",
          8: "rgb(var(--green-8) / <alpha-value>)",
          9: "rgb(var(--green-9) / <alpha-value>)",
          10: "rgb(var(--green-10) / <alpha-value>)",
          11: "rgb(var(--green-11) / <alpha-value>)",
          12: "rgb(var(--green-12) / <alpha-value>)",
          500: "#53855A", // Brighter green color
        },
        blue: {
          1: "rgb(var(--blue-1) / <alpha-value>)",
          2: "rgb(var(--blue-2) / <alpha-value>)",
          3: "rgb(var(--blue-3) / <alpha-value>)",
          4: "rgb(var(--blue-4) / <alpha-value>)",
          5: "rgb(var(--blue-5) / <alpha-value>)",
          6: "rgb(var(--blue-6) / <alpha-value>)",
          7: "rgb(var(--blue-7) / <alpha-value>)",
          8: "rgb(var(--blue-8) / <alpha-value>)",
          9: "rgb(var(--blue-9) / <alpha-value>)",
          10: "rgb(var(--blue-10) / <alpha-value>)",
          11: "rgb(var(--blue-11) / <alpha-value>)",
          12: "rgb(var(--blue-12) / <alpha-value>)",
          500: "#3D63DD", // Main accent color
        },
        gray: {
          1: "rgb(var(--gray-1) / <alpha-value>)",
          2: "rgb(var(--gray-2) / <alpha-value>)",
          3: "rgb(var(--gray-3) / <alpha-value>)",
          4: "rgb(var(--gray-4) / <alpha-value>)",
          5: "rgb(var(--gray-5) / <alpha-value>)",
          6: "rgb(var(--gray-6) / <alpha-value>)",
          7: "rgb(var(--gray-7) / <alpha-value>)",
          8: "rgb(var(--gray-8) / <alpha-value>)",
          9: "rgb(var(--gray-9) / <alpha-value>)",
          10: "rgb(var(--gray-10) / <alpha-value>)",
          11: "rgb(var(--gray-11) / <alpha-value>)",
          12: "rgb(var(--gray-12) / <alpha-value>)",
          500: "#8B8D98", // Main gray color
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
