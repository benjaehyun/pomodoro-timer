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
  
  export const sendNotification = async (title, options = {}) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      console.log('Notifications are not supported or permission not granted');
      return;
    }
  
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        options
      });
    } else {
      new Notification(title, options);
    }
  };