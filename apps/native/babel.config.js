module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@screens": "./src/screens",
            "@templates": "./src/templates",
          },
          extensions: [".js", ".jsx", ".ts", ".tsx", ".native.tsx"],
        },
      ],
    ],
  };
};
