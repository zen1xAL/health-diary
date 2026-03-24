import * as SQLite from 'expo-sqlite';

export interface NewsItem {
  id: string;
  title: string;
  body: string;
}

const db = SQLite.openDatabaseSync('healthNews.db');

export const initDB = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS news (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL
      );
    `);
  } catch (error) {
    console.error(error);
  }
};

export const cacheNewsInDB = (newsArray: NewsItem[]) => {
  try {
    db.execSync('DELETE FROM news;');
    const statement = db.prepareSync('INSERT INTO news (id, title, body) VALUES (?, ?, ?)');
    for (const news of newsArray) {
      statement.executeSync([news.id, news.title, news.body]);
    }
  } catch (error) {
    console.error(error);
  }
};

export const getCachedNews = (): NewsItem[] => {
  try {
    const allRows = db.getAllSync('SELECT * FROM news;');
    return allRows as NewsItem[];
  } catch (error) {
    console.error(error);
    return[];
  }
};