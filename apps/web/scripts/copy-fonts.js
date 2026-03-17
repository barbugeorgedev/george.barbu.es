/**
 * Copy fonts from packages/assets/fonts to public/fonts.
 * Uses fs.copyFileSync so we do not call utimes(), avoiding EPERM on
 * WSL/Docker bind mounts and similar filesystems.
 */
const fs = require("fs");
const path = require("path");

const scriptDir = __dirname;
const webRoot = path.resolve(scriptDir, "..");
const srcDir = path.resolve(webRoot, "../../packages/assets/fonts");
const destDir = path.resolve(webRoot, "public/fonts");

if (!fs.existsSync(srcDir)) {
  console.warn("copy-fonts: source not found, skipping:", srcDir);
  process.exit(0);
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true });
  }
  copyRecursive(srcDir, destDir);
  console.log("copy-fonts: copied fonts to public/fonts");
} catch (err) {
  console.error("copy-fonts error:", err.message);
  process.exit(1);
}
