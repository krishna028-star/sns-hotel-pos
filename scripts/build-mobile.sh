#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
#  SNS Hotels POS — Mobile App Builder (Capacitor)
#  Usage: ./scripts/build-mobile.sh [android|ios|both]
# ═══════════════════════════════════════════════════════════════════════════════
set -euo pipefail

PLATFORM="${1:-both}"
APP_ID="com.snshotels.pos"
APP_NAME="SNS Hotels POS"
BUILD_DIR="$(pwd)"
DIST_DIR="$BUILD_DIR/out"

# Colours
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()    { echo -e "${GREEN}[SNS POS]${NC} $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}   $1"; }
fail()    { echo -e "${RED}[ERROR]${NC}  $1"; exit 1; }

# ── 0. Prerequisite checks ────────────────────────────────────────────────────
info "Checking prerequisites..."
command -v node  >/dev/null 2>&1 || fail "Node.js is not installed"
command -v npm   >/dev/null 2>&1 || fail "npm is not installed"
command -v npx   >/dev/null 2>&1 || fail "npx is not installed"

NODE_VER=$(node -v | sed 's/v//' | cut -d. -f1)
[ "$NODE_VER" -ge 18 ] || fail "Node.js 18+ required (found v$NODE_VER)"

if [[ "$PLATFORM" == "android" || "$PLATFORM" == "both" ]]; then
  command -v java >/dev/null 2>&1 || fail "Java (JDK 17+) required for Android build"
  [ -n "${ANDROID_HOME:-}" ] || warn "ANDROID_HOME not set — Android builds may fail"
fi
if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "both" ]]; then
  [[ "$(uname)" == "Darwin" ]] || fail "iOS builds require macOS with Xcode"
  command -v xcodebuild >/dev/null 2>&1 || fail "Xcode is not installed"
fi

info "Prerequisites OK ✔"

# ── 1. Install dependencies ───────────────────────────────────────────────────
info "Installing npm dependencies..."
npm ci --prefer-offline

# ── 2. Install Capacitor if not present ──────────────────────────────────────
info "Ensuring Capacitor is installed..."
npm install --save @capacitor/core @capacitor/cli @capacitor/app @capacitor/haptics \
  @capacitor/keyboard @capacitor/status-bar @capacitor/splash-screen \
  @capacitor/push-notifications @capacitor/network 2>/dev/null || true

if [[ "$PLATFORM" == "android" || "$PLATFORM" == "both" ]]; then
  npm install --save @capacitor/android 2>/dev/null || true
fi
if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "both" ]]; then
  npm install --save @capacitor/ios 2>/dev/null || true
fi

# ── 3. Build the Next.js web app ─────────────────────────────────────────────
info "Building Next.js production bundle..."
npm run build

# ── 4. Initialize Capacitor (if not already done) ────────────────────────────
if [ ! -f "capacitor.config.ts" ]; then
  info "Initializing Capacitor..."
  npx cap init "$APP_NAME" "$APP_ID" --web-dir=out
fi

# ── 5. Export static build for Capacitor ─────────────────────────────────────
info "Exporting static site for Capacitor..."
mkdir -p "$DIST_DIR"
if [ -d ".next" ]; then
  # Copy Next.js static export if available
  cp -r .next/static "$DIST_DIR/_next/" 2>/dev/null || true
  cp -r public/* "$DIST_DIR/" 2>/dev/null || true
fi

# ── 6. Add platforms ─────────────────────────────────────────────────────────
if [[ "$PLATFORM" == "android" || "$PLATFORM" == "both" ]]; then
  if [ ! -d "android" ]; then
    info "Adding Android platform..."
    npx cap add android
  fi
fi
if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "both" ]]; then
  if [ ! -d "ios" ]; then
    info "Adding iOS platform..."
    npx cap add ios
  fi
fi

# ── 7. Copy + Sync ────────────────────────────────────────────────────────────
info "Syncing Capacitor..."
npx cap copy
npx cap sync

# ── 8. Generate icons & splash screens ───────────────────────────────────────
if command -v npx >/dev/null 2>&1; then
  info "Generating icons and splash screens..."
  npm install --save-dev @capacitor/assets 2>/dev/null || true
  if [ -f "play-store-assets/icon.png" ]; then
    npx @capacitor/assets generate \
      --iconBackgroundColor '#2E5AFF' \
      --iconBackgroundColorDark '#0F172A' \
      --splashBackgroundColor '#0F172A' \
      --splashBackgroundColorDark '#0F172A' \
      2>/dev/null || warn "Icon generation failed — ensure play-store-assets/icon.png exists (1024x1024)"
  else
    warn "play-store-assets/icon.png not found — skipping icon generation"
  fi
fi

# ── 9. Android: build signed AAB ─────────────────────────────────────────────
if [[ "$PLATFORM" == "android" || "$PLATFORM" == "both" ]]; then
  info "Building Android App Bundle (.aab)..."
  if [ -d "android" ]; then
    cd android

    # Use release build if keystore is configured
    if [ -n "${KEYSTORE_FILE:-}" ] && [ -f "../$KEYSTORE_FILE" ]; then
      info "Building signed release AAB..."
      ./gradlew bundleRelease \
        -Pandroid.injected.signing.store.file="../$KEYSTORE_FILE" \
        -Pandroid.injected.signing.store.password="${KEYSTORE_PASSWORD:-}" \
        -Pandroid.injected.signing.key.alias="${KEYSTORE_ALIAS:-sns-pos}" \
        -Pandroid.injected.signing.key.password="${KEY_PASSWORD:-}"
      AAB_PATH="app/build/outputs/bundle/release/app-release.aab"
    else
      warn "KEYSTORE_FILE not set — building unsigned debug AAB"
      ./gradlew bundleDebug
      AAB_PATH="app/build/outputs/bundle/debug/app-debug.aab"
    fi

    cd ..
    if [ -f "android/$AAB_PATH" ]; then
      mkdir -p release
      cp "android/$AAB_PATH" "release/sns-hotels-pos.aab"
      info "✔ Android AAB: release/sns-hotels-pos.aab"
    fi
  fi
fi

# ── 10. iOS: build IPA ───────────────────────────────────────────────────────
if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "both" ]]; then
  info "Opening Xcode for iOS build (manual signing required)..."
  if [ -d "ios" ]; then
    warn "iOS requires manual signing in Xcode. Run: npx cap open ios"
    warn "Then: Product → Archive → Distribute App → App Store Connect"
    npx cap open ios || true
  fi
fi

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════"
info "✔ Mobile build complete!"
echo ""
echo "  Android: release/sns-hotels-pos.aab"
echo "  iOS:     Open Xcode → Product → Archive"
echo ""
echo "  Next steps:"
echo "  1. Upload .aab to Google Play Console"
echo "  2. For iOS: Xcode → Archive → Distribute"
echo "═══════════════════════════════════════════════════════"
