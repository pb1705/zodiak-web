import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'trust': '#63B3ED',
        'trust-light': '#7DD3FC',
        'growth': '#48BB78',
        'growth-light': '#34D399',
        'premium': '#818CF8',
        'energy': '#F59E0B',
      },
    },
  },
  plugins: [],
};
export default config;
