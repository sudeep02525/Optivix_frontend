import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0e27",
        foreground: "#e0e0e0",
        "neon-blue": "#00d9ff",
        "neon-purple": "#b026ff",
        "dark-bg": "#0f1419",
        "panel-bg": "rgba(15, 20, 25, 0.8)",
        "glass-bg": "rgba(15, 20, 25, 0.4)",
      },
      boxShadow: {
        "neon-blue": "0 0 20px rgba(0, 217, 255, 0.5)",
        "neon-purple": "0 0 20px rgba(176, 38, 255, 0.5)",
        "glow": "0 0 30px rgba(0, 217, 255, 0.3)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
