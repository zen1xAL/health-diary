import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  ru: {
    translation: {
      home_title: "Дневник здоровья",
      settings: "Настройки",
      details: "Подробности",
      add_record: "Добавить",
      input_title: "Что делали?",
      input_desc: "Детали",
      my_records: "Мои записи:",
      dark_theme: "Темная тема",
      language: "Язык (Language)",
      delete: "Удалить",
      cancel: "Отмена",
      delete_confirm: "Вы уверены?",
      delete_title: "Удаление",
      not_found: "Не найдено",
      go_back: "Назад",
      edit: "Редактировать",
      save: "Сохранить",
      edit_title: "Редактирование",
      pick_date: "Дата",
      empty_list: "Список пуст.",
      error_fill_fields: "Заполните поля",
      news: "Новости",
      offline_warning: "Оффлайн режим",
      search: "Поиск...",
      sort_date: "По дате",
      sort_title: "По имени",
      category_all: "Все",
      category_cardio: "Кардио",
      category_strength: "Силовая",
      pick_image: "Фото",
      reminder_time: "Время напоминаний"
    }
  },
  en: {
    translation: {
      home_title: "Health Diary",
      settings: "Settings",
      details: "Details",
      add_record: "Add",
      input_title: "Activity",
      input_desc: "Details",
      my_records: "My Records:",
      dark_theme: "Dark Theme",
      language: "Язык (Language)",
      delete: "Delete",
      cancel: "Cancel",
      delete_confirm: "Are you sure?",
      delete_title: "Delete",
      not_found: "Not found",
      go_back: "Back",
      edit: "Edit",
      save: "Save",
      edit_title: "Edit",
      pick_date: "Date",
      empty_list: "List is empty.",
      error_fill_fields: "Fill all fields",
      news: "News",
      offline_warning: "Offline mode",
      search: "Search...",
      sort_date: "By Date",
      sort_title: "By Name",
      category_all: "All",
      category_cardio: "Cardio",
      category_strength: "Strength",
      pick_image: "Photo",
      reminder_time: "Reminder Time"
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