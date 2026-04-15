# Mobile Application Development - Midterm Documentation
## SSG InnoVoice Mobile App Development Timeline

**Project:** SSG InnoVoice - Student Suggestion & Incident Reporting System  
**Platform:** React Native (Expo SDK 54)  
**Duration:** 20 Days

---

## Day 1: Project Planning & Environment Setup
**Date:** _[Add your date]_

**What We Did:**
We planned thoroughly on what app we will make and decided to create SSG InnoVoice, a student suggestion and incident reporting system for CTU Daanbantayan Campus. We set up our development environment by installing Node.js and Expo CLI, then initialized the React Native project.

**Photo Description:** Screenshot of initial project setup, terminal showing `expo init` command, or folder structure in VS Code

---

## Day 2: Backend API Integration Setup
**Date:** _[Add your date]_

**What We Did:**
We created the API service layer using axios to connect our mobile app to the existing Express.js backend. We configured interceptors for error handling and successfully tested the connection to the server.

**Photo Description:** Code showing ApiService class implementation or API configuration file

---

## Day 3: Navigation Structure Implementation
**Date:** _[Add your date]_

**What We Did:**
We implemented expo-router for file-based navigation and created a tab-based layout with three main screens: Home, Track, and Settings. The navigation structure is now complete with appropriate icons for each tab.

**Photo Description:** Screenshot of tab navigation bar or `app/(tabs)` folder structure

---

## Day 4: Design System & Styling Foundation
**Date:** _[Add your date]_

**What We Did:**
We created a design system with shared style constants for colors, typography, and spacing that match our web app branding. We set up reusable style utilities to maintain consistency throughout the app.

**Photo Description:** Code showing `src/styles/colors.js` or visual comparison of color scheme

---

## Day 5: Submission Form UI - Part 1
**Date:** _[Add your date]_

**What We Did:**
We started building the submission form with input fields for name, email, and year level. We also implemented dropdown selectors for categories and academic programs.

**Photo Description:** Screenshot of submission form showing input fields (top section)

---

## Day 6: Submission Form UI - Part 2
**Date:** _[Add your date]_

**What We Did:**
We completed the submission form by adding a text area with a 500-character limit and an image picker button. The form now looks clean and professional with proper spacing.

**Photo Description:** Screenshot of complete submission form with text area and image picker button

---

## Day 7: Image Upload Functionality
**Date:** _[Add your date]_

**What We Did:**
We integrated expo-image-picker to allow users to take photos or select from their gallery. We added image preview, compression, and optimization features.

**Photo Description:** Screenshot showing image picker in action or selected image preview

---

## Day 8: Form Submission Logic
**Date:** _[Add your date]_

**What We Did:**
We connected the form to the backend API with comprehensive validation and added loading indicators. We implemented success and error handling, and successfully tested our first submission.

**Photo Description:** Code showing submission handler or screenshot of loading indicator

---

## Day 9: Tracking Feature - UI Implementation
**Date:** _[Add your date]_

**What We Did:**
We built the tracking screen with an input field for tracking codes and designed status display cards. We also implemented a timeline view to show submission progress history.

**Photo Description:** Screenshot of tracking screen with input field and search button

---

## Day 10: Tracking Feature - API Integration
**Date:** _[Add your date]_

**What We Did:**
We connected the tracking screen to the API and added color coding for different statuses. We implemented error handling for invalid tracking codes and tested successfully.

**Photo Description:** Screenshot showing successful tracking result with status information

---

## Day 11: Offline Draft Management - Part 1
**Date:** _[Add your date]_

**What We Did:**
We implemented offline draft management using AsyncStorage to save incomplete submissions locally. We created a draft service with auto-save functionality and built a draft list UI.

**Photo Description:** Code showing `draftService.js` or screenshot of draft list

---

## Day 12: Offline Draft Management - Part 2
**Date:** _[Add your date]_

**What We Did:**
We completed draft management by adding edit and delete functions, plus automatic submission when back online. We tested the offline-to-online sync successfully.

**Photo Description:** Screenshot of draft being loaded into form or draft management UI

---

## Day 13: Network Connectivity Handling
**Date:** _[Add your date]_

**What We Did:**
We integrated network monitoring using @react-native-community/netinfo and created a NetworkContext. We added offline indicators and network speed estimation to handle connectivity changes gracefully.

**Photo Description:** Screenshot showing offline indicator or network status banner

---

## Day 14: Internationalization (i18n) Setup
**Date:** _[Add your date]_

**What We Did:**
We implemented multi-language support using i18n-js with translations for English, Tagalog, and Bisaya. We created a LanguageContext and added language switching functionality.

**Photo Description:** Code showing locale JSON files or language selection UI

---

## Day 15: Settings Screen Implementation
**Date:** _[Add your date]_

**What We Did:**
We built the settings screen with language preference selector, appearance options, and an about section. Settings are persisted using AsyncStorage.

**Photo Description:** Screenshot of settings screen with various options

---

## Day 16: Toast Notification System
**Date:** _[Add your date]_

**What We Did:**
We created a custom toast notification system with success, error, and info variants. We integrated toasts throughout the app for better user feedback.

**Photo Description:** Screenshot showing toast notification appearing on screen

---

## Day 17: Onboarding Experience
**Date:** _[Add your date]_

**What We Did:**
We created swipeable onboarding slides for first-time users explaining the main +--features. We added completion tracking and a skip button.

**Photo Description:** Screenshot of onboarding slides or welcome screen

---

## Day 18: App Loading & Splash Screen
**Date:** _[Add your date]_

**What We Did:**
We configured a custom splash screen and implemented font loading for Poppins. We created a network loading screen with smooth transitions.

**Photo Description:** Screenshot of splash screen or loading animation

---

## Day 19: Testing & Bug Fixes
**Date:** _[Add your date]_

**What We Did:**
We tested the app thoroughly on Android and iOS, fixing bugs and improving error messages. We optimized performance and tested on physical devices.

**Photo Description:** Screenshot of app running on emulator or physical device

---

## Day 20: Final Polish & Documentation
**Date:** _[Add your date]_

**What We Did:**
We refined the UI/UX based on testing feedback and updated the documentation. We configured EAS build settings and prepared the app for deployment.

**Photo Description:** Screenshot of final app home screen or complete feature showcase

---

## Technical Stack Summary

- **Framework:** React Native 0.81 with Expo SDK 54
- **Navigation:** expo-router (file-based routing)
- **State Management:** React Context API
- **Storage:** AsyncStorage
- **Networking:** Axios with custom interceptors
- **Internationalization:** i18n-js (3 languages)
- **Image Handling:** expo-image-picker
- **Network Detection:** @react-native-community/netinfo

## Key Features Implemented

✅ Student suggestion submission with image upload  
✅ Real-time tracking with status updates  
✅ Offline draft management  
✅ Multi-language support (EN, TL, CEB)  
✅ Network connectivity handling  
✅ Toast notifications  
✅ Onboarding experience  
✅ Settings and preferences

---

**Student Name:** _[Your Name]_  
**Course & Section:** _[Your Course]_  
**Instructor:** _[Instructor Name]_  
**Submission Date:** _[Date]_
