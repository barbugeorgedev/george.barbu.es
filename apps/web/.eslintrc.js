export default {
  extends: ["next", "next/core-web-vitals"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
  parserOptions: {
    babelOptions: {
      presets: ["next/babel"],
    },
  },
};
