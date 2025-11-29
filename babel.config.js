module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel"],
    ignore: [
      "**/scripts/**/*.js",
      "apps/web/scripts/**",
    ],
  };
};
