import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { ActivityRecord } from '../types';
import { ThemeContext } from '../context/ThemeContext';

interface RecordCardProps {
  item: ActivityRecord;
  onPress: () => void;
}

export const RecordCard = ({ item, onPress }: RecordCardProps) => {
  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode || false;

  const cardColor = isDarkMode ? '#1e1e1e' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#333333';

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: cardColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
      ) : null}
      
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, marginBottom: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  thumbnail: { width: 50, height: 50, borderRadius: 8, marginRight: 15, backgroundColor: '#ddd' },
  textContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '600', flex: 1 },
  date: { color: '#888', marginLeft: 10 }
});