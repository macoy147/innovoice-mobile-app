# Android Emulator Startup Script for InnoVoice
Write-Host "=== InnoVoice Mobile App Launcher ===" -ForegroundColor Cyan

# Set Android SDK environment variables
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\tools\bin"

Write-Host "Checking for running emulators..." -ForegroundColor Yellow

# Check if emulator is already running
$devices = & "$env:ANDROID_HOME\platform-tools\adb.exe" devices
$emulatorRunning = $devices | Select-String "emulator.*device"

if ($emulatorRunning) {
    Write-Host "✓ Emulator is already running!" -ForegroundColor Green
} else {
    Write-Host "Starting Android emulator (Pixel_5)..." -ForegroundColor Yellow
    Write-Host "This may take 30-60 seconds. An emulator window will appear." -ForegroundColor Gray
    
    # Start emulator in background
    Start-Process "$env:ANDROID_HOME\emulator\emulator.exe" -ArgumentList "-avd", "Pixel_5" -WindowStyle Normal
    
    Write-Host "Waiting for emulator to boot..." -ForegroundColor Yellow
    
    # Wait for emulator to be detected
    $timeout = 120
    $elapsed = 0
    $interval = 5
    
    while ($elapsed -lt $timeout) {
        Start-Sleep -Seconds $interval
        $elapsed += $interval
        
        $devices = & "$env:ANDROID_HOME\platform-tools\adb.exe" devices
        $emulatorDetected = $devices | Select-String "emulator.*device"
        
        if ($emulatorDetected) {
            Write-Host "✓ Emulator is online!" -ForegroundColor Green
            Write-Host "Waiting for system to fully boot..." -ForegroundColor Yellow
            Start-Sleep -Seconds 10
            break
        }
        
        Write-Host "Still waiting... ($elapsed seconds)" -ForegroundColor Gray
    }
    
    if ($elapsed -ge $timeout) {
        Write-Host "✗ Timeout waiting for emulator. Please check if the emulator window opened." -ForegroundColor Red
        Write-Host "You can manually start the emulator from Android Studio and then run: npm run android" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "Starting Expo and deploying app to emulator..." -ForegroundColor Green
Write-Host ""

# Run the app
npm run android
