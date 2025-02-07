module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: false,
        },
      ],
      [
        "module-resolver",
        {
          alias: {
            "@screens": "./src/screens",
            "@templates": "./src/templates",
            "@dotenv": "./env",
          },
          extensions: [".js", ".jsx", ".ts", ".tsx", ".native.tsx"],
        },
      ],
    ],
  };
};
