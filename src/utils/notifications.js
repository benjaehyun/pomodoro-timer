// src/utils/notifications.js
export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }
  
    let permission = Notification.permission;
  
    if (permission !== 'granted') {
      permission = await Notification.requestPermission();
    }
  
    return permission === 'granted';
  };
  
  export const sendNotification = (title, options = {}) => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }
  
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, options);
        }
      });
    }
  };