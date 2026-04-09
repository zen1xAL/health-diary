import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';
import { ActivityRecord } from '../types';
import { firestore } from '../services/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

interface DiaryContextType {
  records: ActivityRecord[];
  addRecord: (title: string, description: string, date: string, category: string, imageUrl: string) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  editRecord: (id: string, title: string, description: string, date: string, category: string, imageUrl: string) => Promise<void>;
  isLoading: boolean;
}

export const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

const db = SQLite.openDatabaseSync('healthDiaryV2.db');

export const DiaryProvider = ({ children }: { children: ReactNode }) => {
  const [records, setRecords] = useState<ActivityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initDB();
    loadRecords();
  },[]);

  const initDB = () => {
    try {
      db.execSync(`
        CREATE TABLE IF NOT EXISTS diary (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          date TEXT NOT NULL,
          category TEXT,
          imageUrl TEXT
        );
      `);
    } catch (error) {
      console.error(error);
    }
  };

  const loadRecords = () => {
    try {
      const allRows = db.getAllSync('SELECT * FROM diary ORDER BY date DESC;');
      setRecords(allRows as ActivityRecord[]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const addRecord = async (title: string, description: string, date: string, category: string, imageUrl: string) => {
    const id = Date.now().toString();
    const newRecord = { id, title, description, date, category, imageUrl };
    try {
      const statement = db.prepareSync('INSERT INTO diary (id, title, description, date, category, imageUrl) VALUES (?, ?, ?, ?, ?, ?)');
      statement.executeSync([id, title, description, date, category, imageUrl]);
      setRecords(prev => [newRecord, ...prev]);
      await setDoc(doc(firestore, 'diary', id), newRecord);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const statement = db.prepareSync('DELETE FROM diary WHERE id = ?');
      statement.executeSync([id]);
      setRecords(prev => prev.filter(record => record.id !== id));
      await deleteDoc(doc(firestore, 'diary', id));
    } catch (e) {
      console.error(e);
    }
  };

  const editRecord = async (id: string, title: string, description: string, date: string, category: string, imageUrl: string) => {
    const updatedRecord = { id, title, description, date, category, imageUrl };
    try {
      const statement = db.prepareSync('UPDATE diary SET title = ?, description = ?, date = ?, category = ?, imageUrl = ? WHERE id = ?');
      statement.executeSync([title, description, date, category, imageUrl, id]);
      setRecords(prev => prev.map(record => record.id === id ? updatedRecord : record));
      await setDoc(doc(firestore, 'diary', id), updatedRecord);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DiaryContext.Provider value={{ records, addRecord, deleteRecord, editRecord, isLoading }}>
      {children}
    </DiaryContext.Provider>
  );
};