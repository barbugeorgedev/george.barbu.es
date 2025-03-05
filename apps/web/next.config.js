const path = require("path");
const { withExpo } = require("@expo/next-adapter");

module.exports = withExpo({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  transpilePackages: [
    "react-native",
    "react-native-web",
    "ui",
    "nativewind",
    "react-native-css-interop",
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",
      "@expo/vector-icons": false,
      "expo-modules-core": false,
      "expo-intent-launcher": false,
      "@dotenv": path.resolve(__dirname, "./env.ts"),
      "@templates": path.resolve(__dirname, "src/templates"),
      "@components": path.resolve(__dirname, "src/components"),
      "@types": path.resolve(__dirname, "src/types"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@env": path.resolve(__dirname, "./emptyEnv.ts"), // not nice at all, but for now it's working (this will ignore searching for react native variables in when env package is used)
    };

    config.module.rules.push({
      test: /\.(ttf|woff|woff2|eot|otf)$/,
      use: "null-loader",
    });

    config.resolve.extensions = [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ...config.resolve.extensions,
    ];

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
  },
});
