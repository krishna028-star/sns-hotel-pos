# SNS Hotels POS — Mobile App Builder (Windows PowerShell)

$APP_NAME = "SNS Hotels POS"
$APP_ID = "com.snshotels.pos"
$WEB_DIR = "out"

Write-Host "--- SNS POS: Starting Mobile Build ---" -ForegroundColor Cyan

# 1. Install Dependencies
Write-Host "Installing npm dependencies..."
npm install

# 2. Build Next.js
Write-Host "Building Next.js for production..."
npm run build

# 3. Export static (ensure 'out' folder exists)
# Note: Next.js 'output: export' or 'output: standalone' required in next.config.ts
if (!(Test-Path "out")) {
    Write-Host "Creating 'out' directory..."
    New-Item -ItemType Directory -Path "out" -Force | Out-Null
    Copy-Item -Path "public\*" -Destination "out" -Recurse -Force
}

# 4. Capacitor Sync
Write-Host "Syncing Capacitor..."
npx cap sync android

# 5. Open in Android Studio
Write-Host "Build complete!" -ForegroundColor Green
Write-Host "Opening Android Studio to generate APK..."
npx cap open android

Write-Host "---------------------------------------"
Write-Host "Next Step: In Android Studio, go to:"
Write-Host "Build -> Build Bundle(s) / APK(s) -> Build APK"
