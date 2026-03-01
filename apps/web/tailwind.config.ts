import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        foreground: "#0a0a0a",
        muted: "#6b7280",
        border: "#e5e7eb",
        "border-light": "#f3f4f6",
      },
    },
  },
  plugins: [],
};

export default config;
