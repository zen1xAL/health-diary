import { useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { initDB, cacheNewsInDB, getCachedNews, NewsItem } from '../services/database';

export const useNewsViewModel = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const loadFromCache = useCallback(() => {
    const cachedData = getCachedNews();
    setNews(cachedData);
  },[]);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    const netState = await NetInfo.fetch();
    const isOnline = netState.isConnected ?? false;
    setIsConnected(isOnline);

    if (isOnline) {
      try {
        const response = await fetch(
          'https://newsapi.org/v2/everything?q=здоровье&language=ru&sortBy=publishedAt&apiKey=699679d613684c5b8bd582606844ee8c',
          {
            headers: {
              'User-Agent': 'HealthDiary Mobile App',
            }
          }
        );
        
        const data = await response.json();
        
        if (data.status === 'ok' && data.articles && data.articles.length > 0) {
          
          const fetchedNews: NewsItem[] = data.articles
            .filter((item: any) => item.title && item.title !== '[Removed]')
            .map((item: any, index: number) => ({
              id: item.url || index.toString(),
              title: item.title,
              body: item.description || 'Подробное описание отсутствует.', 
            }));

          setNews(fetchedNews);
          cacheNewsInDB(fetchedNews);
          
        } else {
          throw new Error('NewsAPI вернул пустой массив :(');
        }

      } catch (error) {
        console.error('Ошибка загрузки сети, поднимаем кэш:', error);
        loadFromCache();
      }
    } else {
      loadFromCache();
    }
    
    setIsLoading(false);
  }, [loadFromCache]);

  useEffect(() => {
    initDB();
    fetchNews();
  }, [fetchNews]);

  return {
    news,
    isLoading,
    isConnected,
    refreshNews: fetchNews,
  };
};