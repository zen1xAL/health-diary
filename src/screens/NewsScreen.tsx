import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemeContext } from '../context/ThemeContext';
import { useNewsViewModel } from '../viewmodels/useNewsViewModel';

export const NewsScreen = () => {
  const themeContext = useContext(ThemeContext);
  const { t } = useTranslation();
  const { news, isLoading, isConnected, refreshNews } = useNewsViewModel();

  if (!themeContext) return null;
  const { isDarkMode } = themeContext;

  const bgColor = isDarkMode ? '#121212' : '#f5f5f5';
  const cardColor = isDarkMode ? '#1e1e1e' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const warningBg = isDarkMode ? '#ffcc0033' : '#fff3cd';

  if (isLoading && news.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: bgColor }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {!isConnected && (
        <View style={[styles.offlineBanner, { backgroundColor: warningBg }]}>
          <Text style={{ color: isDarkMode ? '#ffd60a' : '#856404', textAlign: 'center' }}>
            {t('offline_warning')}
          </Text>
        </View>
      )}

      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshNews} tintColor="#007AFF" />
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: cardColor }]}>
            <Text style={[styles.title, { color: textColor }]}>{item.title.toUpperCase()}</Text>
            <Text style={[styles.body, { color: textColor }]}>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  offlineBanner: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#e5ad06' },
  card: {
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  body: { fontSize: 14, opacity: 0.8, lineHeight: 20 }
});