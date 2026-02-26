import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityRecord } from '../types';

const STORAGE_KEY = '@diary_records';

interface DiaryContextType {
  records: ActivityRecord[];
  addRecord: (title: string, description: string, date: string) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  editRecord: (id: string, title: string, description: string, date: string) => Promise<void>;
  isLoading: boolean;
}

export const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider = ({ children }: { children: ReactNode }) => {
  const [records, setRecords] = useState<ActivityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  },[]);

  const loadRecords = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue !== null) setRecords(JSON.parse(jsonValue));
    } catch (e) {
      console.error('Ошибка загрузки данных', e);
    } finally {
      setIsLoading(false);
    }
  };

  const addRecord = async (title: string, description: string, date: string) => {
    const newRecord: ActivityRecord = {
      id: Date.now().toString(),
      title,
      description,
      date, 
    };
    const updatedRecords =[newRecord, ...records];
    setRecords(updatedRecords);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
  };

  const deleteRecord = async (id: string) => {
    const updatedRecords = records.filter(record => record.id !== id);
    setRecords(updatedRecords);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
  };

  const editRecord = async (id: string, title: string, description: string, date: string) => {
    const updatedRecords = records.map(record => 
      record.id === id ? { ...record, title, description, date } : record
    );
    setRecords(updatedRecords);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
  };

  return (
    <DiaryContext.Provider value={{ records, addRecord, deleteRecord, editRecord, isLoading }}>
      {children}
    </DiaryContext.Provider>
  );
};