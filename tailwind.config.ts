/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  presets: [require("nativewind/preset")], // Enable Tailwind for React Native
  content: [
    "./apps/web/**/*.{js,jsx,ts,tsx}", // Web app (Gatsby, Next.js)
    "./apps/native/**/*.{js,jsx,ts,tsx}", // React Native app
    "./packages/**/*.{js,jsx,ts,tsx}", // Shared UI components
  ],
  theme: {
    screens: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      pdf: "816px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    colors: {
      ...colors,
      primary: {
        dark: "#571926",
        light: "#7F2437",
      },
      secondary: "#232323",
      gray: "#313638",
      white: "#FFF",
    },
    extend: {
      fontFamily: {
        sans: ["Roboto", "Helvetica", "Arial", "sans-serif"],
        norwester: ["Norwester", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        montserratLight: ["MontserratLight", "sans-serif"],
        montserratSemiBold: ["MontserratSemiBold", "sans-serif"],
        lato: ["Lato", "sans-serif"],
        latoBlack: ["LatoBlack", "sans-serif"],
        latoThin: ["LatoThin", "sans-serif"],
      },
      screens: {
        print: { raw: "print" },
        lg: { raw: "print, (min-width: 1024px)" },
      },
      // Move print-related configurations here
      typography: {
        orphans: 3,
        widows: 3,
      },
    },
  },
  variants: {
    extend: {
      margin: ["responsive", "hover", "first"],
      orphans: ["responsive"],
      widows: ["responsive"],
      boxDecorationBreak: ["responsive"],
      breakBefore: ["responsive"],
      breakAfter: ["responsive"],
      breakInside: ["responsive"],
    },
  },
  plugins: [require("tailwindcss-break")],
};
