import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { GameProvider } from '@/hooks/useGame';
import mobileAds, { AdsConsent } from 'react-native-google-mobile-ads';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // 1. Initialize AdMob (Only on Native platforms)
    if (Platform.OS !== 'web') {
      mobileAds()
        .initialize()
        .then(adapterStatuses => {
          console.log('AdMob SDK Initialized');
        });

      // 2. Request Tracking Consent (iOS Compliance)
      AdsConsent.requestInfoUpdate().then(() => {
        AdsConsent.loadAndShowConsentFormIfRequired();
      });
    }
  }, []);

  return (
    <GameProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GameProvider>
  );
}
