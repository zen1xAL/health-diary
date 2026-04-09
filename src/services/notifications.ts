import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const setupNotifications = async (hour: number = 20, minute: number = 0) => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Нет разрешения на уведомления');
      return;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Health Diary',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Health Diary 💊',
        body: 'Не забудьте записать свою активность сегодня!',
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hour,
        minute: minute,
      },
    });

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log('--- НОВЫЙ СТАТУС ---');
    console.log('Запланировано:', scheduled.length);
    console.log(`Каждый день в ${hour}:${minute}`);

  } catch (error) {
    console.log('Ошибка уведомлений:', error);
  }
};