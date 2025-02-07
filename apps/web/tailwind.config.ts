/** @type {import('tailwindcss').Config} */

const sharedConfig = require("../../tailwind.config.js");

module.exports = {
  ...sharedConfig,
  content: [
    "../../packages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: "html",
};
