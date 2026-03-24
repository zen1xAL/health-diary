import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next'; 

import { ThemeContext } from '../context/ThemeContext';

export const SettingsScreen = () => {
  const themeContext = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  if (!themeContext) return <Text>Loading...</Text>;
  const { isDarkMode, toggleTheme } = themeContext;

  const backgroundColor = isDarkMode ? '#121212' : '#f5f5f5';
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const cardColor = isDarkMode ? '#1e1e1e' : '#ffffff';

  const changeLanguage = async (lang: 'ru' | 'en') => {
    await i18n.changeLanguage(lang);
   
    try {
      await AsyncStorage.setItem('@app_language', lang);
    } catch (error) {
      console.error('Ошибка сохранения языка:', error);
    }
  };

  const currentLang = i18n.language.substring(0, 2);

  return (
    <View style={[styles.container, { backgroundColor }]}>

      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <View style={styles.settingRow}>
          <Text style={[styles.text, { color: textColor }]}>{t('dark_theme')}</Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <Text style={[styles.text, { color: textColor }]}>{t('language')}</Text>

          <View style={styles.langToggle}>

            <TouchableOpacity
              style={[styles.langButton, currentLang === 'ru' && styles.langButtonActive]}
              onPress={() => changeLanguage('ru')}
            >
              <Text style={[
                styles.langText,
                currentLang === 'ru' ? styles.langTextActive : { color: textColor }
              ]}>RU</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langButton, currentLang === 'en' && styles.langButtonActive]}
              onPress={() => changeLanguage('en')}
            >
              <Text style={[
                styles.langText,
                currentLang === 'en' ? styles.langTextActive : { color: textColor }
              ]}>EN</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#33333333',
    marginVertical: 10,
  },
  text: { fontSize: 18, fontWeight: '500' },

  langToggle: {
    flexDirection: 'row',
    backgroundColor: '#88888833', 
    borderRadius: 8,
    padding: 4,
  },
  langButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  langButtonActive: {
    backgroundColor: '#007AFF', 
  },
  langText: {
    fontSize: 16,
    fontWeight: '600',
  },
  langTextActive: {
    color: '#ffffff',
  }
});