import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

import { NetworkProvider } from '../src/contexts/NetworkContext';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import { AppProvider } from '../src/contexts/AppContext';
import { ToastProvider } from '../src/contexts/ToastContext';
import { ErrorBoundary as CustomErrorBoundary } from '../src/components/common/ErrorBoundary';
import { NetworkLoadingScreen } from '../src/components/common/NetworkLoadingScreen';
import { OnboardingScreen } from '../src/components/onboarding/OnboardingScreen';
import storageService from '../src/services/storage';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [appReady, setAppReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && !appReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, appReady]);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const completed = await storageService.isOnboardingCompleted();
    setShowOnboarding(!completed);
    setOnboardingChecked(true);
  };

  const handleOnboardingComplete = async () => {
    await storageService.setOnboardingCompleted();
    setShowOnboarding(false);
  };

  if (!loaded || !onboardingChecked) {
    return null;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <CustomErrorBoundary>
      <NetworkProvider>
        <LanguageProvider>
          <AppProvider>
            <ToastProvider>
              {!appReady ? (
                <NetworkLoadingScreen onLoadComplete={() => setAppReady(true)} />
              ) : (
                <RootLayoutNav />
              )}
            </ToastProvider>
          </AppProvider>
        </LanguageProvider>
      </NetworkProvider>
    </CustomErrorBoundary>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
