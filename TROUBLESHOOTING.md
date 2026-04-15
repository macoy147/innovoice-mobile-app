# InnoVoice Mobile App - Troubleshooting Guide

## Overview

This guide helps you diagnose and fix common issues with the InnoVoice mobile app.

---

## Table of Contents

1. [Development Issues](#development-issues)
2. [Build Issues](#build-issues)
3. [Runtime Issues](#runtime-issues)
4. [Network Issues](#network-issues)
5. [Platform-Specific Issues](#platform-specific-issues)
6. [Performance Issues](#performance-issues)

---

## Development Issues

### Issue: Metro Bundler Won't Start

**Symptoms:**
- `npm start` fails
- Port already in use error
- Metro bundler crashes

**Solutions:**

1. **Clear Metro cache:**
   ```bash
   npm start -- --clear
   ```

2. **Kill existing Metro process:**
   ```bash
   # Find process on port 8081
   lsof -i :8081
   
   # Kill the process
   kill -9 <PID>
   ```

3. **Reset everything:**
   ```bash
   rm -rf node_modules
   npm install
   npm start -- --clear
   ```

### Issue: Dependencies Won't Install

**Symptoms:**
- `npm install` fails
- Peer dependency conflicts
- Version mismatch errors

**Solutions:**

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Use legacy peer deps:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Check Node version:**
   ```bash
   node --version  # Should be 18.x or higher
   npm --version   # Should be 9.x or higher
   ```

### Issue: Environment Variables Not Loading

**Symptoms:**
- API calls fail
- Undefined environment variables
- Wrong API endpoint

**Solutions:**

1. **Verify .env file exists:**
   ```bash
   cat .env
   ```

2. **Restart with cache cleared:**
   ```bash
   npm start -- --clear
   ```

3. **Check app.json extra config:**
   ```json
   {
     "expo": {
       "extra": {
         "API_BASE_URL": "https://api.innovoice.ctu.edu.ph"
       }
     }
   }
   ```

---

## Build Issues

### Issue: EAS Build Fails

**Symptoms:**
- Build fails in EAS dashboard
- Timeout errors
- Dependency errors

**Solutions:**

1. **Check build logs:**
   ```bash
   eas build:list
   eas build:view <build-id>
   ```

2. **Clear cache and rebuild:**
   ```bash
   eas build --profile production --platform all --clear-cache
   ```

3. **Verify eas.json configuration:**
   ```bash
   cat eas.json
   ```

### Issue: iOS Code Signing Fails

**Symptoms:**
- "No valid code signing identity" error
- Provisioning profile errors
- Certificate expired

**Solutions:**

1. **Reset credentials:**
   ```bash
   eas credentials
   # Select iOS > Production > Remove all
   ```

2. **Generate new credentials:**
   ```bash
   eas build --profile production --platform ios
   # EAS will create new certificates
   ```

3. **Check Apple Developer account:**
   - Verify account is active
   - Check certificate expiration
   - Verify bundle identifier

### Issue: Android Keystore Issues

**Symptoms:**
- "Keystore not found" error
- Invalid keystore password
- Key alias not found

**Solutions:**

1. **Generate new keystore:**
   ```bash
   eas credentials
   # Select Android > Production > Create new keystore
   ```

2. **Verify keystore path:**
   ```bash
   ls -la android-keystore.jks
   ```

3. **Check credentials.json:**
   ```json
   {
     "android": {
       "keystore": {
         "keystorePath": "./android-keystore.jks",
         "keystorePassword": "your-password",
         "keyAlias": "your-alias",
         "keyPassword": "your-key-password"
       }
     }
   }
   ```

---

## Runtime Issues

### Issue: App Crashes on Launch

**Symptoms:**
- App opens then immediately closes
- White screen of death
- Error boundary triggered

**Solutions:**

1. **Check error logs:**
   ```bash
   # iOS
   npx react-native log-ios
   
   # Android
   npx react-native log-android
   ```

2. **Clear app data:**
   - iOS: Delete app and reinstall
   - Android: Settings > Apps > InnoVoice > Clear Data

3. **Check for JavaScript errors:**
   - Open Chrome DevTools
   - Check console for errors
   - Fix syntax/runtime errors

### Issue: Form Submission Fails

**Symptoms:**
- Submit button doesn't work
- Error message appears
- Network request fails

**Solutions:**

1. **Check network connection:**
   ```javascript
   // In app, check network status
   console.log('Network:', isConnected);
   ```

2. **Verify API endpoint:**
   ```javascript
   // Check API_BASE_URL
   console.log('API URL:', API_CONFIG.baseURL);
   ```

3. **Check form validation:**
   ```javascript
   // Log validation errors
   console.log('Validation errors:', errors);
   ```

4. **Test API directly:**
   ```bash
   curl -X POST https://api.innovoice.ctu.edu.ph/api/suggestions \
     -H "Content-Type: application/json" \
     -d '{"category":"academic","title":"Test","content":"Test content","isAnonymous":true}'
   ```

### Issue: Photo Upload Fails

**Symptoms:**
- Camera doesn't open
- Gallery doesn't open
- Image too large error
- Upload fails

**Solutions:**

1. **Check permissions:**
   - iOS: Settings > InnoVoice > Camera/Photos
   - Android: Settings > Apps > InnoVoice > Permissions

2. **Verify image size:**
   ```javascript
   // Check file size
   const fileInfo = await FileSystem.getInfoAsync(uri);
   console.log('File size:', fileInfo.size);
   ```

3. **Test image compression:**
   ```javascript
   // Reduce quality
   const result = await ImagePicker.launchCameraAsync({
     quality: 0.5, // Lower quality
   });
   ```

4. **Check image format:**
   - Only JPEG and PNG supported
   - Convert other formats

### Issue: Tracking Code Not Found

**Symptoms:**
- "Submission not found" error
- Invalid tracking code
- Empty results

**Solutions:**

1. **Verify tracking code format:**
   ```javascript
   // Should match: VISI-XXXXX-XXXX
   const regex = /^VISI-\d{5}-\d{4}$/;
   console.log('Valid:', regex.test(trackingCode));
   ```

2. **Check API response:**
   ```bash
   curl https://api.innovoice.ctu.edu.ph/api/suggestions/track/VISI-12345-6789
   ```

3. **Verify submission exists:**
   - Check web app
   - Verify database entry
   - Check backend logs

---

## Network Issues

### Issue: API Requests Timeout

**Symptoms:**
- Requests take too long
- Timeout error after 30 seconds
- No response from server

**Solutions:**

1. **Increase timeout:**
   ```javascript
   // src/config/api.config.js
   export const API_CONFIG = {
     timeout: 60000, // 60 seconds
   };
   ```

2. **Check server status:**
   ```bash
   curl -I https://api.innovoice.ctu.edu.ph
   ```

3. **Test network speed:**
   - Use speed test app
   - Try different network
   - Check WiFi signal

### Issue: CORS Errors (Web Only)

**Symptoms:**
- "CORS policy blocked" error
- Preflight request fails
- 403 Forbidden

**Solutions:**

1. **Backend must allow CORS:**
   ```javascript
   // Backend should have:
   app.use(cors({
     origin: ['https://innovoice.ctu.edu.ph'],
     credentials: true,
   }));
   ```

2. **Use proxy in development:**
   ```javascript
   // package.json
   {
     "proxy": "https://api.innovoice.ctu.edu.ph"
   }
   ```

### Issue: SSL Certificate Errors

**Symptoms:**
- "SSL certificate invalid" error
- "Unable to verify certificate"
- HTTPS connection fails

**Solutions:**

1. **Verify certificate:**
   ```bash
   openssl s_client -connect api.innovoice.ctu.edu.ph:443
   ```

2. **Update certificate:**
   - Contact backend team
   - Renew SSL certificate
   - Use Let's Encrypt

3. **Temporary workaround (development only):**
   ```javascript
   // DO NOT USE IN PRODUCTION
   axios.defaults.httpsAgent = new https.Agent({
     rejectUnauthorized: false
   });
   ```

---

## Platform-Specific Issues

### iOS Issues

#### Issue: Simulator Not Opening

**Solutions:**

1. **Reset simulator:**
   ```bash
   xcrun simctl erase all
   ```

2. **Restart Xcode:**
   ```bash
   killall Simulator
   open -a Simulator
   ```

3. **Check Xcode installation:**
   ```bash
   xcode-select --print-path
   ```

#### Issue: VoiceOver Not Working

**Solutions:**

1. **Enable VoiceOver:**
   - Settings > Accessibility > VoiceOver

2. **Check accessibility labels:**
   ```javascript
   <Button accessibilityLabel="Submit report" />
   ```

3. **Test with Accessibility Inspector:**
   - Xcode > Open Developer Tool > Accessibility Inspector

### Android Issues

#### Issue: Emulator Won't Start

**Solutions:**

1. **Check emulator status:**
   ```bash
   emulator -list-avds
   ```

2. **Start emulator manually:**
   ```bash
   emulator -avd Pixel_5_API_31
   ```

3. **Create new emulator:**
   - Android Studio > AVD Manager > Create Virtual Device

#### Issue: TalkBack Not Working

**Solutions:**

1. **Enable TalkBack:**
   - Settings > Accessibility > TalkBack

2. **Check accessibility properties:**
   ```javascript
   <Button accessible={true} accessibilityLabel="Submit report" />
   ```

3. **Test with Accessibility Scanner:**
   - Install from Play Store
   - Scan app screens

---

## Performance Issues

### Issue: App Launches Slowly

**Symptoms:**
- Takes > 3 seconds to launch
- Splash screen shows too long
- Slow initial render

**Solutions:**

1. **Optimize bundle size:**
   ```bash
   npx react-native-bundle-visualizer
   ```

2. **Enable Hermes (if not already):**
   ```json
   // app.json
   {
     "expo": {
       "jsEngine": "hermes"
     }
   }
   ```

3. **Lazy load components:**
   ```javascript
   const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
   ```

### Issue: Slow Form Submission

**Symptoms:**
- Takes > 5 seconds without photo
- Takes > 15 seconds with photo
- UI freezes during submission

**Solutions:**

1. **Optimize image compression:**
   ```javascript
   const result = await ImagePicker.launchCameraAsync({
     quality: 0.7, // Lower quality
     maxWidth: 1920,
     maxHeight: 1920,
   });
   ```

2. **Show loading indicator:**
   ```javascript
   <Button loading={isSubmitting} />
   ```

3. **Implement request timeout:**
   ```javascript
   const controller = new AbortController();
   setTimeout(() => controller.abort(), 30000);
   
   await fetch(url, { signal: controller.signal });
   ```

### Issue: High Memory Usage

**Symptoms:**
- App crashes on low-end devices
- Memory warnings in logs
- Slow performance

**Solutions:**

1. **Profile memory usage:**
   - Xcode > Instruments > Allocations
   - Android Studio > Profiler > Memory

2. **Fix memory leaks:**
   ```javascript
   useEffect(() => {
     const subscription = someObservable.subscribe();
     return () => subscription.unsubscribe(); // Cleanup
   }, []);
   ```

3. **Optimize images:**
   - Use smaller images
   - Implement image caching
   - Clear image cache periodically

---

## Getting Help

### Before Asking for Help

1. **Check this troubleshooting guide**
2. **Search existing issues on GitHub**
3. **Check Expo documentation**
4. **Try basic debugging steps**

### How to Report Issues

When reporting an issue, include:

1. **Environment:**
   - OS version (iOS/Android)
   - Device model
   - App version
   - Expo SDK version

2. **Steps to reproduce:**
   - What you did
   - What you expected
   - What actually happened

3. **Error messages:**
   - Full error text
   - Stack trace
   - Console logs

4. **Screenshots/videos:**
   - Visual evidence
   - Screen recordings

### Contact

- **GitHub Issues**: https://github.com/ctu-daanbantayan/innovoice-mobile/issues
- **Email**: ssg@ctu.edu.ph
- **Expo Forums**: https://forums.expo.dev

---

## Debugging Tools

### React Native Debugger

```bash
# Install
brew install --cask react-native-debugger

# Open
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

### Flipper

```bash
# Install
brew install --cask flipper

# Open and connect to app
```

### Chrome DevTools

1. Shake device or press Cmd+D (iOS) / Cmd+M (Android)
2. Select "Debug JS Remotely"
3. Open Chrome DevTools (F12)

### Expo DevTools

```bash
# Start with DevTools
npm start

# Open in browser
# Press 'd' in terminal
```

---

## Common Error Messages

### "Unable to resolve module"

**Cause:** Missing dependency or incorrect import path

**Solution:**
```bash
npm install <missing-package>
# or
npm start -- --clear
```

### "Network request failed"

**Cause:** No internet connection or API unreachable

**Solution:**
- Check internet connection
- Verify API endpoint
- Check firewall settings

### "Invariant Violation"

**Cause:** React Native internal error

**Solution:**
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

### "Maximum call stack size exceeded"

**Cause:** Infinite loop or circular dependency

**Solution:**
- Check for infinite loops
- Review component lifecycle
- Check for circular imports

---

## Prevention Tips

1. **Keep dependencies updated:**
   ```bash
   npm outdated
   npm update
   ```

2. **Test on multiple devices:**
   - Different OS versions
   - Different screen sizes
   - Different network conditions

3. **Monitor error logs:**
   - Set up error tracking (Sentry, Bugsnag)
   - Review logs regularly
   - Fix issues proactively

4. **Follow best practices:**
   - Use TypeScript for type safety
   - Write tests
   - Code reviews
   - Documentation

---

## Additional Resources

- [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting)
- [Expo Troubleshooting](https://docs.expo.dev/troubleshooting/overview/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)
- [Expo Forums](https://forums.expo.dev/)
