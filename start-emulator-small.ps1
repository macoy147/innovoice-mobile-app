# Start Android Emulator at 50% size
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\platform-tools"

Write-Host "Starting emulator at 50% size..." -ForegroundColor Green

# Start emulator with scale parameter (0.5 = 50% size)
Start-Process "$env:ANDROID_HOME\emulator\emulator.exe" -ArgumentList "-avd", "Pixel_5", "-scale", "0.5"

Write-Host "Emulator starting... Wait for it to boot, then run: npm run android" -ForegroundColor Yellow
