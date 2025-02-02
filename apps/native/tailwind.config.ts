/** @type {import('tailwindcss').Config} */

const sharedConfig = require("../../tailwind.config.js");

module.exports = {
  ...sharedConfig,

  content: [
    "./index.js",
    "../../packages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
};
