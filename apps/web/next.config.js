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
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native$": "react-native-web",
      "@expo/vector-icons": false,
      "@templates": path.resolve(__dirname, "templates"),
      "@styles": path.resolve(__dirname, "styles"),
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
});
