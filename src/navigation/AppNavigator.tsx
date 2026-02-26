import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ThemeContext } from '../context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const themeContext = useContext(ThemeContext);
  const { t } = useTranslation(); 
  
  if (!themeContext) return null;
  const { isDarkMode } = themeContext;

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: t('home_title') }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: t('details') }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings') }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};