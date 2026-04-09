import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';

import { ThemeContext } from '../context/ThemeContext';
import { setupNotifications } from '../services/notifications';

export const SettingsScreen = () => {
  const themeContext = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  const [reminderDate, setReminderDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('@app_reminder_time').then(val => {
      const d = new Date();
      if (val) {
        const parsed = JSON.parse(val);
        d.setHours(parsed.hour, parsed.minute);
      } else {
        d.setHours(20, 0);
      }
      setReminderDate(d);
    });
  },[]);

  if (!themeContext) return null;
  const { isDarkMode, toggleTheme } = themeContext;

  const backgroundColor = isDarkMode ? '#121212' : '#f5f5f5';
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const cardColor = isDarkMode ? '#1e1e1e' : '#ffffff';

  const changeLanguage = async (lang: 'ru' | 'en') => {
    await i18n.changeLanguage(lang);
    try {
      await AsyncStorage.setItem('@app_language', lang);
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeTime = async (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setReminderDate(selectedDate);
      const h = selectedDate.getHours();
      const m = selectedDate.getMinutes();
      await AsyncStorage.setItem('@app_reminder_time', JSON.stringify({ hour: h, minute: m }));
      await setupNotifications(h, m);
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
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
            <TouchableOpacity style={[styles.langButton, currentLang === 'ru' && styles.langButtonActive]} onPress={() => changeLanguage('ru')}>
              <Text style={[styles.langText, currentLang === 'ru' ? styles.langTextActive : { color: textColor }]}>RU</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.langButton, currentLang === 'en' && styles.langButtonActive]} onPress={() => changeLanguage('en')}>
              <Text style={[styles.langText, currentLang === 'en' ? styles.langTextActive : { color: textColor }]}>EN</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <Text style={[styles.text, { color: textColor }]}>{t('reminder_time')}</Text>
          <TouchableOpacity 
            onPress={() => setShowTimePicker(true)} 
            style={[styles.timeButton, isSaved && { backgroundColor: '#28a745' }]}
          >
            <Text style={styles.timeText}>
              {isSaved ? '✓' : reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={reminderDate}
            mode="time"
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeTime}
          />
        )}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  divider: { height: 1, backgroundColor: '#33333333', marginVertical: 10 },
  text: { fontSize: 18, fontWeight: '500' },
  langToggle: { flexDirection: 'row', backgroundColor: '#88888833', borderRadius: 8, padding: 4 },
  langButton: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 6 },
  langButtonActive: { backgroundColor: '#007AFF' },
  langText: { fontSize: 16, fontWeight: '600' },
  langTextActive: { color: '#ffffff' },
  timeButton: { backgroundColor: '#007AFF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, minWidth: 80, alignItems: 'center' },
  timeText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});