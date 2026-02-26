import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../types';
import { DiaryContext } from '../context/DiaryContext';
import { ThemeContext } from '../context/ThemeContext';
import { CustomButton } from '../components/CustomButton';

type Props = { route: RouteProp<RootStackParamList, 'Details'> };
type DetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

export const DetailsScreen = ({ route }: Props) => {
  const { recordId } = route.params;
  const navigation = useNavigation<DetailsNavigationProp>();
  const { t } = useTranslation();

  const context = useContext(DiaryContext);
  const themeContext = useContext(ThemeContext);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const [error, setError] = useState('');

  if (!context || !themeContext) return <Text>Loading...</Text>;

  const { records, deleteRecord, editRecord } = context;
  const { isDarkMode } = themeContext;
  const record = records.find(item => item.id === recordId);

  const bgColor = isDarkMode ? '#121212' : '#f5f5f5';
  const cardColor = isDarkMode ? '#1e1e1e' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const placeholderColor = isDarkMode ? '#888888' : '#999999';

  if (!record) {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <Text style={styles.errorText}>{t('not_found')}</Text>
        <CustomButton title={t('go_back')} onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const openEditModal = () => {
    setEditTitle(record.title);
    setEditDesc(record.description);
    setError('');
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() === '' || editDesc.trim() === '') {
      setError(t('error_fill_fields'));
      return;
    }
    editRecord(record.id, editTitle, editDesc, record.date);
    setIsEditModalVisible(false);
  };

  const confirmDelete = () => {
    setIsDeleteModalVisible(false);
    deleteRecord(record.id);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <Text style={[styles.title, { color: textColor }]}>{record.title}</Text>
        <Text style={[styles.date, { color: textColor }]}>
          {new Date(record.date).toLocaleDateString()}
        </Text>
        <View style={styles.divider} />
        <Text style={[styles.description, { color: textColor }]}>{record.description}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton title={t('edit')} color="#007AFF" onPress={openEditModal} style={{ marginBottom: 10 }} />
        <CustomButton title={t('delete')} color="#ff3b30" onPress={() => setIsDeleteModalVisible(true)} />
      </View>

      <Modal visible={isDeleteModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: cardColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>{t('delete_title')}</Text>
            <Text style={[styles.modalText, { color: textColor }]}>{t('delete_confirm')}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setIsDeleteModalVisible(false)} style={styles.modalActionBtn}>
                <Text style={{ color: '#007AFF', fontSize: 16 }}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDelete} style={styles.modalActionBtn}>
                <Text style={{ color: '#ff3b30', fontSize: 16, fontWeight: 'bold' }}>{t('delete')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isEditModalVisible} transparent={true} animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.modalBox, { backgroundColor: cardColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>{t('edit_title')}</Text>

            <TextInput
              style={[styles.input, { color: textColor, borderColor: isDarkMode ? '#555' : '#ddd' }]}
              placeholderTextColor={placeholderColor}
              value={editTitle}
              onChangeText={(text) => { setEditTitle(text); setError(''); }}
            />
            <TextInput
              style={[styles.input, { color: textColor, borderColor: isDarkMode ? '#555' : '#ddd', height: 80 }]}
              multiline={true}
              placeholderTextColor={placeholderColor}
              value={editDesc}
              onChangeText={(text) => { setEditDesc(text); setError(''); }}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)} style={styles.modalActionBtn}>
                <Text style={{ color: '#ff3b30', fontSize: 16 }}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveEdit} style={styles.modalActionBtn}>
                <Text style={{ color: '#007AFF', fontSize: 16, fontWeight: 'bold' }}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { padding: 20, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  date: { fontSize: 14, color: '#888', marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 16 },
  description: { fontSize: 16, lineHeight: 24 },
  buttonContainer: { marginTop: 30 },
  errorText: { fontSize: 16, color: '#ff3b30', textAlign: 'center', marginBottom: 15, fontWeight: '500' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalBox: { width: '85%', padding: 20, borderRadius: 12, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalText: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 6, fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#55555555', paddingTop: 15 },
  modalActionBtn: { padding: 10, minWidth: 80, alignItems: 'center' }
});