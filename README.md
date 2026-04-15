# InnoVoice Mobile App

> Your Voice, Our Action - Official mobile app for CTU Daanbantayan Campus incident reporting system

[![Expo](https://img.shields.io/badge/Expo-SDK%2055-000020.svg?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.83-61DAFB.svg?style=flat&logo=react)](https://reactnative.dev)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Overview

InnoVoice is a mobile application that enables students of CTU Daanbantayan Campus to report campus incidents, submit suggestions, and track their submissions in real-time. The app provides a secure, user-friendly interface with multi-language support and offline capabilities.

### Key Features

- 📝 **Quick Reporting** - Submit incident reports in seconds
- 📸 **Photo Evidence** - Attach photos to support your reports
- 🔍 **Real-Time Tracking** - Track submission status with unique codes
- 🔒 **Anonymous Option** - Submit anonymously or with your details
- 🌐 **Multi-Language** - Available in English, Tagalog, and Bisaya
- 📱 **Offline Drafts** - Save drafts when offline and submit later
- 🔐 **Secure & Private** - Industry-standard security measures

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Integration](#api-integration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** 9.x or higher (or **yarn** 1.22.x)
- **Git** for version control
- **Expo CLI** (will be installed globally)
- **iOS Simulator** (Mac only) or **Android Emulator**
- **Expo Go** app on your physical device (optional)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ctu-daanbantayan/innovoice-mobile.git
   cd innovoice-mobile/mobile-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```bash
   API_BASE_URL=https://api.innovoice.ctu.edu.ph
   MAX_PHOTO_SIZE_MB=2
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Run on your device:**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS Simulator
   - Or press `a` for Android Emulator

## Development

### Available Scripts

```bash
# Start Expo development server
npm start

# Start with cache cleared
npm start -- --clear

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Follow the project structure
   - Write clean, documented code
   - Add tests for new features

3. **Test your changes:**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create pull request:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **Conventional Commits** for commit messages

## Building

### Development Build

For testing on physical devices:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS
eas build --profile development --platform ios

# Build for Android
eas build --profile development --platform android
```

### Production Build

For app store submission:

```bash
# Build for iOS App Store
eas build --profile production --platform ios

# Build for Google Play Store
eas build --profile production --platform android

# Build for both platforms
eas build --profile production --platform all
```

See [EAS_BUILD_GUIDE.md](./EAS_BUILD_GUIDE.md) for detailed build instructions.

## Testing

### Manual Testing

Follow the comprehensive testing checklist:
- See [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)

### Automated Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Accessibility Testing

- **iOS**: Enable VoiceOver in Settings > Accessibility
- **Android**: Enable TalkBack in Settings > Accessibility
- See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for detailed testing guide

## Deployment

### App Store Submission (iOS)

1. **Prepare assets:**
   - See [STORE_ASSETS.md](./STORE_ASSETS.md)

2. **Build production version:**
   ```bash
   eas build --profile production --platform ios
   ```

3. **Submit to App Store:**
   ```bash
   eas submit --platform ios
   ```

4. **Monitor in App Store Connect:**
   - https://appstoreconnect.apple.com

### Play Store Submission (Android)

1. **Prepare assets:**
   - See [STORE_ASSETS.md](./STORE_ASSETS.md)

2. **Build production version:**
   ```bash
   eas build --profile production --platform android
   ```

3. **Submit to Play Store:**
   ```bash
   eas submit --platform android
   ```

4. **Monitor in Play Console:**
   - https://play.google.com/console

See [EAS_BUILD_GUIDE.md](./EAS_BUILD_GUIDE.md) for detailed deployment instructions.

## Project Structure

```
mobile-app/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.jsx             # Home/Submission screen
│   │   ├── track.jsx             # Tracking screen
│   │   └── settings.jsx          # Settings screen
│   ├── _layout.jsx               # Root layout
│   └── +not-found.jsx            # 404 screen
│
├── src/
│   ├── components/               # Reusable components
│   │   ├── common/               # Shared UI components
│   │   ├── submission/           # Submission-specific
│   │   ├── tracking/             # Tracking-specific
│   │   └── drafts/               # Draft management
│   │
│   ├── contexts/                 # React Context providers
│   │   ├── AppContext.jsx        # Global app state
│   │   ├── NetworkContext.jsx    # Network status
│   │   └── LanguageContext.jsx   # i18n state
│   │
│   ├── services/                 # Business logic
│   │   ├── api.js                # API client
│   │   ├── storage.js            # AsyncStorage wrapper
│   │   ├── imageService.js       # Image handling
│   │   └── draftService.js       # Draft management
│   │
│   ├── utils/                    # Utilities
│   │   ├── validation.js         # Input validation
│   │   ├── constants.js          # App constants
│   │   └── haptics.js            # Haptic feedback
│   │
│   ├── config/                   # Configuration
│   │   ├── api.config.js         # API endpoints
│   │   └── app.config.js         # App settings
│   │
│   ├── locales/                  # Translations
│   │   ├── en.json               # English
│   │   ├── tl.json               # Tagalog
│   │   └── ceb.json              # Bisaya/Cebuano
│   │
│   └── styles/                   # Shared styles
│       ├── colors.js             # Color palette
│       ├── typography.js         # Text styles
│       └── spacing.js            # Layout spacing
│
├── assets/                       # Static assets
│   ├── images/                   # Images and logos
│   ├── fonts/                    # Custom fonts
│   └── icons/                    # App icons
│
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

## Configuration

### Environment Variables

Create a `.env` file in the `mobile-app/` directory:

```bash
# API Configuration
API_BASE_URL=https://api.innovoice.ctu.edu.ph

# App Configuration
MAX_PHOTO_SIZE_MB=2
ENVIRONMENT=production
```

### App Configuration

Edit `app.json` for app-level configuration:

```json
{
  "expo": {
    "name": "InnoVoice",
    "slug": "innovoice-mobile",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "ph.edu.ctu.innovoice"
    },
    "android": {
      "package": "ph.edu.ctu.innovoice"
    }
  }
}
```

### API Configuration

Edit `src/config/api.config.js`:

```javascript
export const API_CONFIG = {
  baseURL: process.env.API_BASE_URL || 'https://api.innovoice.ctu.edu.ph',
  timeout: 30000,
  maxPhotoSize: 2 * 1024 * 1024, // 2MB
};
```

## API Integration

### Backend API

The mobile app connects to the existing InnoVoice backend API:

**Base URL:** `https://api.innovoice.ctu.edu.ph`

### Endpoints Used

#### Create Submission
```
POST /api/suggestions
Content-Type: application/json

{
  "category": "academic",
  "title": "Report title",
  "content": "Report content",
  "isAnonymous": true,
  "submitter": { ... },
  "imageData": "base64..."
}
```

#### Track Submission
```
GET /api/suggestions/track/:trackingCode

Response:
{
  "success": true,
  "data": {
    "trackingCode": "VISI-12345-6789",
    "category": "academic",
    "title": "Report title",
    "status": "submitted",
    "priority": "medium",
    ...
  }
}
```

### API Service

The API service is located in `src/services/api.js`:

```javascript
import { apiService } from './services/api';

// Create submission
const response = await apiService.createSubmission(formData);

// Track submission
const response = await apiService.trackSubmission(trackingCode);
```

See [API_INTEGRATION.md](./API_INTEGRATION.md) for detailed API documentation.

## Troubleshooting

### Common Issues

#### 1. Metro Bundler Issues
```bash
# Clear cache and restart
npm start -- --clear
```

#### 2. iOS Simulator Not Opening
```bash
# Reset simulator
xcrun simctl erase all

# Restart Expo
npm start
```

#### 3. Android Emulator Issues
```bash
# Check emulator is running
adb devices

# Restart ADB
adb kill-server
adb start-server
```

#### 4. Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

#### 5. Environment Variables Not Loading
```bash
# Verify .env file exists
cat .env

# Restart Expo with cache cleared
npm start -- --clear
```

### Getting Help

- **Documentation**: Check the docs in this repository
- **Issues**: Open an issue on GitHub
- **Email**: ssg@ctu.edu.ph
- **Expo Forums**: https://forums.expo.dev

## Contributing

We welcome contributions from the CTU community!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Write tests**
5. **Submit a pull request**

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation
- Be respectful and collaborative

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## Security

### Reporting Security Issues

If you discover a security vulnerability, please email:
- **Security Team**: security@ctu.edu.ph

Do not open public issues for security vulnerabilities.

### Security Measures

- HTTPS-only communication
- Input validation and sanitization
- Secure local storage
- Permission handling
- No sensitive data in logs

See [SECURITY_REVIEW.md](./SECURITY_REVIEW.md) for detailed security information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **CTU Daanbantayan Campus** - For supporting this project
- **Supreme Student Government** - For initiating and managing the project
- **Students** - For providing feedback and suggestions
- **Expo Team** - For the amazing development platform

## Contact

**Supreme Student Government**
- **Email**: ssg@ctu.edu.ph
- **Website**: https://innovoice.ctu.edu.ph
- **Facebook**: [CTU Daanbantayan SSG]
- **Address**: CTU Daanbantayan Campus, Daanbantayan, Cebu, Philippines

## Related Documentation

- [Testing Checklist](./TESTING_CHECKLIST.md)
- [Accessibility Guide](./ACCESSIBILITY.md)
- [Security Review](./SECURITY_REVIEW.md)
- [Assets Guide](./ASSETS_GUIDE.md)
- [Store Assets](./STORE_ASSETS.md)
- [EAS Build Guide](./EAS_BUILD_GUIDE.md)
- [API Integration](./API_INTEGRATION.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

---

**Made with ❤️ by CTU Daanbantayan Campus SSG**
