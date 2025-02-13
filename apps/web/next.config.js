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
    "expo-modules-core", // Add this to transpile expo-modules-core
    "expo-sharing", // Add this if needed based on the error trace
    "ui",
    "nativewind",
    "react-native-css-interop",
  ],
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",
      "@expo/vector-icons": false,
      "@dotenv": path.resolve(__dirname, "./env.ts"),
      "@templates": path.resolve(__dirname, "templates"),
      "@styles": path.resolve(__dirname, "styles"),
      "@env": path.resolve(__dirname, "./emptyEnv.ts"), // For ignoring react-native environment variables
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
