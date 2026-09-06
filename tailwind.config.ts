import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#f0f4fc",
          100: "#dbe4f8",
          200: "#bccdf2",
          300: "#8faeeb",
          400: "#5a88e0",
          500: "#1e40af", // Official Philippine deep blue
          600: "#1d4ed8",
          700: "#1e3a8a",
          800: "#172554",
          900: "#0f172a",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b", // Philippine sun gold
          600: "#d97706",
          700: "#b45309",
        },
      },
    },
  },
  plugins: [],
};
export default config;
