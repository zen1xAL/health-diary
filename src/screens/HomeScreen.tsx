import React, { useContext, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ScrollView, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import Fuse from 'fuse.js';
import * as ImagePicker from 'expo-image-picker';

import { RootStackParamList } from '../types';
import { DiaryContext } from '../context/DiaryContext';
import { ThemeContext } from '../context/ThemeContext';
import { CustomButton } from '../components/CustomButton';
import { RecordCard } from '../components/RecordCard';
import { uploadImageAsync } from '../services/firebase';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Home'> };

export const HomeScreen = ({ navigation }: Props) => {
  const diaryContext = useContext(DiaryContext);
  const themeContext = useContext(ThemeContext);
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('category_cardio');
  const [imageUri, setImageUri] = useState('');
  const[showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');

  const[searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('category_all');
  const [sortOrder, setSortOrder] = useState<'date' | 'title'>('date');

  if (!diaryContext || !themeContext) return null;
  const { records, addRecord } = diaryContext;
  const { isDarkMode } = themeContext;

  const bgColor = isDarkMode ? '#121212' : '#f5f5f5';
  const cardColor = isDarkMode ? '#1e1e1e' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const placeholderColor = isDarkMode ? '#888888' : '#999999';

  const processedRecords = useMemo(() => {
    let result = records;

    if (filterCategory !== 'category_all') {
      result = result.filter(r => r.category === filterCategory);
    }

    if (searchQuery.trim() !== '') {
      const fuse = new Fuse(result, {
        keys: ['title', 'description', 'category'],
        threshold: 0.4,
      });
      result = fuse.search(searchQuery).map(res => res.item);
    }

    result = [...result].sort((a, b) => {
      if (sortOrder === 'title') {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return result;
  }, [records, searchQuery, filterCategory, sortOrder]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect:[4, 3],
      quality: 0.5,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleAdd = async () => {
    if (title.trim() === '' || description.trim() === '') {
      setError(t('error_fill_fields'));
      return;
    }
    let remoteUrl = '';
    if (imageUri) {
      try {
        remoteUrl = await uploadImageAsync(imageUri);
      } catch (e) {
        console.error(e);
      }
    }
    await addRecord(title, description, date.toISOString(), category, remoteUrl);
    setTitle('');
    setDescription('');
    setDate(new Date());
    setImageUri('');
    setError('');
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      
      <TextInput
        style={[styles.input, { color: textColor, borderColor: isDarkMode ? '#333' : '#ddd', marginBottom: 10 }]}
        placeholder={t('search')}
        placeholderTextColor={placeholderColor}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.controlsRow}>
        <CustomButton title={t(`sort_${sortOrder}`)} onPress={() => setSortOrder(prev => prev === 'date' ? 'title' : 'date')} color="#555" style={styles.controlBtn} />
        <CustomButton title={t(filterCategory)} onPress={() => setFilterCategory(prev => prev === 'category_all' ? 'category_cardio' : prev === 'category_cardio' ? 'category_strength' : 'category_all')} color="#555" style={styles.controlBtn} />
      </View>

      <View style={[styles.form, { backgroundColor: cardColor }]}>
        <TextInput style={[styles.input, { color: textColor, borderColor: isDarkMode ? '#333' : '#ddd' }]} placeholder={t('input_title')} placeholderTextColor={placeholderColor} value={title} onChangeText={(text) => { setTitle(text); setError(''); }} />
        <TextInput style={[styles.input, { color: textColor, borderColor: isDarkMode ? '#333' : '#ddd' }]} placeholder={t('input_desc')} placeholderTextColor={placeholderColor} value={description} onChangeText={(text) => { setDescription(text); setError(''); }} />
        
        <View style={styles.row}>
          <CustomButton title={t(category)} onPress={() => setCategory(prev => prev === 'category_cardio' ? 'category_strength' : 'category_cardio')} color="#888" style={{ flex: 1, marginRight: 5 }} />
          <CustomButton title={t('pick_image')} onPress={pickImage} color="#888" style={{ flex: 1, marginLeft: 5 }} />
        </View>

        {imageUri !== '' && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

        <View style={styles.dateRow}>
          <Text style={{ color: textColor }}>{date.toLocaleDateString()}</Text>
          <CustomButton title={t('pick_date')} onPress={() => setShowDatePicker(true)} color="#555" />
        </View>

        {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={(e, selectedDate) => { setShowDatePicker(false); if (selectedDate) setDate(selectedDate); }} />}
        {error !== '' && <Text style={styles.errorText}>{error}</Text>}
        <CustomButton title={t('add_record')} onPress={handleAdd} color="#28a745" />
      </View>

      <FlatList
        data={processedRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecordCard item={item} onPress={() => navigation.navigate('Details', { recordId: item.id })} />}
        ListEmptyComponent={<Text style={{ color: textColor, textAlign: 'center', marginTop: 20, fontStyle: 'italic', opacity: 0.7 }}>{t('empty_list')}</Text>}
      />
      
      <View style={styles.bottomButtons}>
        <CustomButton title={t('news')} onPress={() => navigation.navigate('News')} color="#007AFF" style={{ flex: 1, marginRight: 8 }} />
        <CustomButton title={t('settings')} onPress={() => navigation.navigate('Settings')} color="#6c757d" style={{ flex: 1, marginLeft: 8 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  form: { marginBottom: 10, padding: 16, borderRadius: 8, elevation: 3 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 6 },
  row: { flexDirection: 'row', marginBottom: 10 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  controlBtn: { paddingVertical: 6, flex: 1, marginHorizontal: 2 },
  errorText: { color: '#ff3b30', marginBottom: 10, textAlign: 'center' },
  bottomButtons: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' },
  previewImage: { width: '100%', height: 100, borderRadius: 8, marginBottom: 10, resizeMode: 'cover' }
});