// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#2B2B2B",
        surface: "#343434",
        "surface-hover": "#3D3D3D",
        foreground: "#DBDBDB",
        muted: "#9A9A9A",
        accent: {
          DEFAULT: "#4A90E2",
          hover: "#5C9CE6",
          muted: "#2E4A66",
        },
        success: "#4CAF50",
        warning: "#E2A04A",
        danger: "#E25C5C",
        border: "#3F3F3F",
      },
      fontFamily: {
        sans: ["Inter", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
        sm: "8px",
        lg: "16px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;