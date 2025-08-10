import messaging from '@react-native-firebase/messaging';

export const checkNotificationPermission = (
  dispatch,
  setTriggerFcmToken = () => {},
) => {
  const checkPermission = async () => {
    await messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled != -1) {
          registerRemoteMessage();
        } else {
          requestUserPermission();
        }
      })
      .catch(error => {
        console.log('error checking permisions ' + error);
      });
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      registerRemoteMessage();
    } else {
      console.log('auth failed');
    }
  }

  const registerRemoteMessage = async () => {
    try {
      const registered = messaging().isDeviceRegisteredForRemoteMessages;

      if (registered) {
        getFCMToken();
      } else {
        await messaging()
          .registerDeviceForRemoteMessages()
          .then(value => {
            if (value) {
              getFCMToken();
            }
          });
      }
    } catch (error) {
      console.log('Error getting FCM token:', error);
    }
  };

  const getFCMToken = async () => {
    try {
      await messaging()
        .getToken()
        .then(token => {
          console.log('fcm token', token);
        })
        .catch(error => {
          console.log(error, 'error');
          // setTriggerFcmToken(pre => pre + 1);
        });
    } catch (error) {
      console.log('Error getting FCM token:', error);
    }
  };

  checkPermission();
};
