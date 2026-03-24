import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../types';
import { DiaryContext } from '../context/DiaryContext';
import { ThemeContext } from '../context/ThemeContext';
import { CustomButton } from '../components/CustomButton';
import { RecordCard } from '../components/RecordCard';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Home'> };

export const HomeScreen = ({ navigation }: Props) => {
  const diaryContext = useContext(DiaryContext);
  const themeContext = useContext(ThemeContext);
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const[date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [error, setError] = useState('');

  if (!diaryContext || !themeContext) return <Text>Loading...</Text>;
  const { records, addRecord } = diaryContext;
  const { isDarkMode } = themeContext;

  const handleAdd = () => {
    if (title.trim() === '' || description.trim() === '') {
      setError(t('error_fill_fields'));
      return;
    }
    addRecord(title, description, date.toISOString());
    setTitle('');
    setDescription('');
    setDate(new Date());
    setError('');
  };

  const bgColor = isDarkMode ? '#121212' : '#f5f5f5';
  const cardColor = isDarkMode ? '#1e1e1e' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const placeholderColor = isDarkMode ? '#888888' : '#999999';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.form, { backgroundColor: cardColor }]}>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: isDarkMode ? '#333' : '#ddd' }]}
          placeholder={t('input_title')} placeholderTextColor={placeholderColor}
          value={title}
          onChangeText={(text) => { setTitle(text); setError(''); }}
        />
        <TextInput
          style={[styles.input, { color: textColor, borderColor: isDarkMode ? '#333' : '#ddd' }]}
          placeholder={t('input_desc')} placeholderTextColor={placeholderColor}
          value={description}
          onChangeText={(text) => { setDescription(text); setError(''); }}
        />

        <View style={styles.dateRow}>
          <Text style={{ color: textColor }}>{date.toLocaleDateString()}</Text>
          <CustomButton
            title={t('pick_date')}
            onPress={() => setShowDatePicker(true)}
            color="#555"
            style={{ paddingVertical: 8, paddingHorizontal: 12 }}
          />
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <CustomButton title={t('add_record')} onPress={handleAdd} color="#28a745" />
      </View>

      <Text style={[styles.headerTitle, { color: textColor }]}>{t('my_records')}</Text>

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecordCard item={item} onPress={() => navigation.navigate('Details', { recordId: item.id })} />
        )}
        ListEmptyComponent={
          <Text style={{ color: textColor, textAlign: 'center', marginTop: 20, fontStyle: 'italic', opacity: 0.7 }}>
            {t('empty_list')}
          </Text>
        }
      />
      
      <View style={styles.bottomButtons}>
        <CustomButton
          title={t('news')}
          onPress={() => navigation.navigate('News')}
          color="#007AFF"
          style={{ flex: 1, marginRight: 8 }}
        />
        <CustomButton
          title={t('settings')}
          onPress={() => navigation.navigate('Settings')}
          color="#6c757d"
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  form: { marginBottom: 20, padding: 16, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 6 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  errorText: { color: '#ff3b30', marginBottom: 10, textAlign: 'center', fontWeight: '500' },
  bottomButtons: { flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' }
});