import React, { useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useTranslation } from 'react-i18next';

// Провайдеры
import { DiaryProvider } from './src/context/DiaryContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';

import './src/i18n'; 

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { i18n } = useTranslation();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const savedLang = await AsyncStorage.getItem('@app_language');
        if (savedLang) await i18n.changeLanguage(savedLang);
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