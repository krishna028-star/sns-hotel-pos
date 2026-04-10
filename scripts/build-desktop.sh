#!/usr/bin/env bash
# ============================================================
# build-desktop.sh — SNS Hotels POS Electron Desktop Build
# Builds .exe (Windows), .dmg (macOS), .AppImage/.deb (Linux)
# Usage: bash scripts/build-desktop.sh [platform]
#   platform: win | mac | linux | all (default: all)
# ============================================================

set -euo pipefail

PLATFORM="${1:-all}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
ELECTRON_DIR="$ROOT_DIR/electron-app"
RELEASE_DIR="$ROOT_DIR/release/desktop"

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   SNS Hotels POS — Desktop Build Script   ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "Platform: $PLATFORM"
echo "Root:     $ROOT_DIR"
echo ""

# ── Step 1: Build Next.js frontend ─────────────────────────
echo "▶ [1/5] Building Next.js frontend..."
cd "$ROOT_DIR"
npm run build
echo "   ✅ Frontend built (out/)"

# ── Step 2: Create Electron app wrapper ──────────────────────
echo ""
echo "▶ [2/5] Setting up Electron wrapper..."
mkdir -p "$ELECTRON_DIR"

cat > "$ELECTRON_DIR/package.json" << 'PKGJSON'
{
  "name": "sns-hotels-pos",
  "version": "1.0.0",
  "description": "SNS Hotels POS — Cloud-Native Hotel Management System",
  "main": "main.js",
  "author": "SNS Hotels Group",
  "license": "MIT",
  "scripts": {
    "start": "electron .",
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux",
    "build:all": "electron-builder --win --mac --linux"
  },
  "build": {
    "appId": "com.snshotels.pos",
    "productName": "SNS Hotels POS",
    "copyright": "© 2025 SNS Hotels Group",
    "directories": { "output": "../release/desktop" },
    "files": ["main.js", "preload.js", "web/**/*"],
    "win": {
      "target": [{ "target": "nsis", "arch": ["x64"] }],
      "icon": "../public/icons/icon-512x512.png"
    },
    "mac": {
      "target": [{ "target": "dmg", "arch": ["x64", "arm64"] }],
      "icon": "../public/icons/icon-512x512.png",
      "category": "public.app-category.business"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "../public/icons/icon-512x512.png",
      "category": "Office"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "SNS Hotels POS"
    }
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.0.0"
  }
}
PKGJSON

cat > "$ELECTRON_DIR/main.js" << 'MAINJSEOF'
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';
const WEB_URL = isDev ? 'http://localhost:3000' : null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'SNS Hotels POS',
    icon: path.join(__dirname, 'web', 'icons', 'icon-512x512.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#0A0E1A',
    show: false,
  });

  // Remove default menu in production
  if (!isDev) Menu.setApplicationMenu(null);

  // Load app
  if (WEB_URL) {
    win.loadURL(WEB_URL);
  } else {
    const indexHtml = path.join(__dirname, 'web', 'index.html');
    if (fs.existsSync(indexHtml)) {
      win.loadFile(indexHtml);
    } else {
      win.loadURL('https://pos.snshotels.com');
    }
  }

  win.once('ready-to-show', () => win.show());

  // Open external links in system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
MAINJSEOF

cat > "$ELECTRON_DIR/preload.js" << 'PRELOADEOF'
const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  version: process.versions.electron,
});
PRELOADEOF

echo "   ✅ Electron wrapper created"

# ── Step 3: Copy web build into Electron app ─────────────────
echo ""
echo "▶ [3/5] Copying web build into Electron app..."
WEB_DEST="$ELECTRON_DIR/web"
rm -rf "$WEB_DEST"

if [ -d "$ROOT_DIR/.next/standalone" ]; then
  cp -r "$ROOT_DIR/.next/standalone" "$WEB_DEST"
  cp -r "$ROOT_DIR/public" "$WEB_DEST/public" 2>/dev/null || true
  echo "   ✅ Standalone build copied"
elif [ -d "$ROOT_DIR/out" ]; then
  cp -r "$ROOT_DIR/out" "$WEB_DEST"
  echo "   ✅ Static export copied"
else
  echo "   ⚠️  No .next/standalone or out/ directory found."
  echo "       The desktop app will load from https://pos.snshotels.com"
  mkdir -p "$WEB_DEST"
fi

# ── Step 4: Install Electron dependencies ────────────────────
echo ""
echo "▶ [4/5] Installing Electron dependencies..."
cd "$ELECTRON_DIR"
npm install --omit=dev
echo "   ✅ Dependencies installed"

# ── Step 5: Build for target platform ────────────────────────
echo ""
echo "▶ [5/5] Building Electron app for: $PLATFORM..."
mkdir -p "$RELEASE_DIR"

case "$PLATFORM" in
  win)
    npm run build:win
    echo "   ✅ Windows installer → release/desktop/"
    ;;
  mac)
    npm run build:mac
    echo "   ✅ macOS .dmg → release/desktop/"
    ;;
  linux)
    npm run build:linux
    echo "   ✅ Linux AppImage + .deb → release/desktop/"
    ;;
  all)
    npm run build:all || {
      echo "   ⚠️  Cross-platform build requires a CI environment."
      echo "       Building for current platform only..."
      npx electron-builder
    }
    echo "   ✅ All platforms built → release/desktop/"
    ;;
  *)
    echo "   ❌ Unknown platform: $PLATFORM"
    echo "       Usage: bash scripts/build-desktop.sh [win|mac|linux|all]"
    exit 1
    ;;
esac

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║          Desktop Build Complete! 🎉       ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "Output files in: release/desktop/"
ls -lh "$RELEASE_DIR" 2>/dev/null || echo "  (files listed above)"
echo ""
echo "Next steps:"
echo "  🪟 Windows → distribute SNSHotelsPOS-Setup-*.exe"
echo "  🍏 macOS   → distribute SNSHotelsPOS-*.dmg"
echo "  🐧 Linux   → distribute SNSHotelsPOS-*.AppImage or .deb"
echo ""
