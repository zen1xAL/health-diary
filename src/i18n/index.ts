import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  ru: {
    translation: {
      home_title: "Дневник здоровья",
      settings: "Настройки",
      details: "Подробности",
      add_record: "Добавить запись",
      input_title: "Что делали? (Например: Бег)",
      input_desc: "Детали (Дистанция, пульс)",
      my_records: "Мои записи:",
      dark_theme: "Темная тема",
      language: "Язык (Language)",
      delete: "Удалить запись",
      cancel: "Отмена",
      delete_confirm: "Вы уверены, что хотите удалить эту запись?",
      delete_title: "Удаление записи",
      not_found: "Запись не найдена или была удалена.",
      go_back: "Вернуться назад",
      edit: "Редактировать",
      save: "Сохранить",
      edit_title: "Редактирование",
      pick_date: "Изменить дату",
      empty_list: "Список пуст. Добавьте свою первую запись!",
      error_fill_fields: "Пожалуйста, заполните все поля",
      news: "Новости здоровья",
      offline_warning: "Нет подключения к сети. Показаны сохраненные новости."
    }
  },
  en: {
    translation: {
      home_title: "Health Diary",
      settings: "Settings",
      details: "Details",
      add_record: "Add Record",
      input_title: "Activity (e.g., Running)",
      input_desc: "Details (Distance, HR)",
      my_records: "My Records:",
      dark_theme: "Dark Theme",
      language: "Язык (Language)",
      delete: "Delete Record",
      cancel: "Cancel",
      delete_confirm: "Are you sure you want to delete this record?",
      delete_title: "Delete Record",
      not_found: "Record not found or deleted.",
      go_back: "Go Back",
      edit: "Edit",
      save: "Save",
      edit_title: "Edit Record",
      pick_date: "Change Date",
      empty_list: "The list is empty. Add your first record!",
      error_fill_fields: "Please fill in all fields",
      news: "Health News",
      offline_warning: "No network connection. Showing cached news."
    }
  }
};

const systemLang = Localization.getLocales()[0].languageCode; 
const defaultLang = systemLang === 'ru' ? 'ru' : 'en';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources,               
    lng: defaultLang,        
    fallbackLng: 'en',       
    interpolation: {
      escapeValue: false     
    }
  });

export default i18n;