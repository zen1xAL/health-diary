import React, { useEffect, useState, useCallback } from 'react';
import { View, LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useTranslation } from 'react-i18next';

import { DiaryProvider } from './src/context/DiaryContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { setupNotifications } from './src/services/notifications';

import './src/i18n'; 

LogBox.ignoreLogs([
  '`expo-notifications` functionality is not fully supported',
  'expo-notifications: Android Push notifications',
]);

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('expo-notifications')) return;
  originalConsoleError(...args);
};

console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('expo-notifications')) return;
  originalConsoleWarn(...args);
};

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { i18n } = useTranslation();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const savedLang = await AsyncStorage.getItem('@app_language');
        if (savedLang) await i18n.changeLanguage(savedLang);

        const savedTime = await AsyncStorage.getItem('@app_reminder_time');
        let h = 20, m = 0;
        if (savedTime) {
          const parsed = JSON.parse(savedTime);
          h = parsed.hour;
          m = parsed.minute;
        }
        await setupNotifications(h, m);

        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        console.error(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  },[]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) await SplashScreen.hideAsync();
  }, [appIsReady]);

  if (!appIsReady) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider>
        <DiaryProvider>
          <AppNavigator />
        </DiaryProvider>
      </ThemeProvider>
    </View>
  );
}