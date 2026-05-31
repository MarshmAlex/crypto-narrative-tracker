/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eefbf4",
          100: "#d7f5e4",
          200: "#b2eacc",
          300: "#7dd8ac",
          400: "#45be87",
          500: "#22a36d",
          600: "#168459",
          700: "#136849",
          800: "#12533b",
          900: "#104531",
        },
        surface: {
          900: "#0a0e17",
          800: "#0f1623",
          700: "#141d2e",
          600: "#1a2540",
          500: "#243050",
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(34,163,109,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,163,109,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-size": "40px 40px",
      },
    },
  },
  plugins: [],
};
