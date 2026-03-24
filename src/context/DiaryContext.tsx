import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';
import { ActivityRecord } from '../types';

interface DiaryContextType {
  records: ActivityRecord[];
  addRecord: (title: string, description: string, date: string) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  editRecord: (id: string, title: string, description: string, date: string) => Promise<void>;
  isLoading: boolean;
}

export const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

const db = SQLite.openDatabaseSync('healthDiary.db');

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
          date TEXT NOT NULL
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

  const addRecord = async (title: string, description: string, date: string) => {
    const id = Date.now().toString();
    try {
      const statement = db.prepareSync('INSERT INTO diary (id, title, description, date) VALUES (?, ?, ?, ?)');
      statement.executeSync([id, title, description, date]);
      
      const newRecord = { id, title, description, date };
      setRecords(prev => [newRecord, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const statement = db.prepareSync('DELETE FROM diary WHERE id = ?');
      statement.executeSync([id]);
      
      setRecords(prev => prev.filter(record => record.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const editRecord = async (id: string, title: string, description: string, date: string) => {
    try {
      const statement = db.prepareSync('UPDATE diary SET title = ?, description = ?, date = ? WHERE id = ?');
      statement.executeSync([title, description, date, id]);
      
      setRecords(prev => prev.map(record => 
        record.id === id ? { ...record, title, description, date } : record
      ));
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