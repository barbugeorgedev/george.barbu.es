const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

// Find the workspace root, this can be replaced with find-yarn-workspace-root
const workspaceRoot = path.resolve(__dirname, "../..");
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo, including src folders
config.watchFolders = [workspaceRoot, path.resolve(workspaceRoot, "packages")];

// 2. Let Metro know where to resolve packages, and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
  path.resolve(workspaceRoot, "packages"),
];

// 3. Force Metro to resolve (sub)dependencies only from the nodeModulesPaths
config.resolver.disableHierarchicalLookup = true;

// 4. Configure Metro to resolve files within 'src' directories inside each package
config.resolver.extraNodeModules = {
  // Assuming each package in the monorepo has a 'src' folder and needs resolution support
  libs: path.resolve(workspaceRoot, "packages/libs/src"),
  ui: path.resolve(workspaceRoot, "packages/ui/src"),
  env: path.resolve(workspaceRoot, "packages/env/src"),
  types: path.resolve(workspaceRoot, "packages/types/src"),
};

// Apply nativewind plugin
module.exports = withNativeWind(config, {
  input: "./src/styles/global.css", // Path for NativeWind styles
});
