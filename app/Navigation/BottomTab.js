import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStack from './Stack';
import ProfileScreen from '../screens/ProfileScreen';
import Chat from '../screens/Chat';
import Kitties from '../screens/Kitties';
import EventsScreen from '../screens/EventsScreen';
import {appColors} from '../Utiles/appColors';
import {fonts} from '../Utiles/appFont';
import {Fontisto} from '@react-native-vector-icons/fontisto';
import {FontAwesome} from '@react-native-vector-icons/fontawesome';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {Text, Vibration} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidStyle,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  const navigation = useNavigation();

  //foreground background and quit state handling
  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        navigation.navigate('reviewList');
      }
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          switch (remoteMessage.data['route']) {
            case undefined:
              navigation.navigate('reviewList');
              break;
          }
        }
      });
  }, []);

  useEffect(() => {
    notifee.onForegroundEvent(async ({type, detail}) => {
      if (type === EventType.PRESS) {
        // Wrap in try-catch to handle errors gracefully
        try {
          await navigation.navigate('reviewList');
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    });
  }, []);

  useEffect(() => {
    notifee.onBackgroundEvent(async ({type, detail}) => {
      if (type === EventType.PRESS) {
        // Wrap in try-catch to handle errors gracefully
        try {
          // await navigation.navigate('notification');
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    });
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'ios' || 'android') {
        await messaging().requestPermission();
      }
    };
    requestPermission();
  }, []);

  // background
  useEffect(() => {
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async remoteMessage => {
        console.log('float test');
        const {notification, messageId} = remoteMessage;
        if (!messageId) {
          console.error('Missing message ID');
          return;
        }
        displayFloatingNotification(notification, messageId);
      },
    );
    return unsubscribe;
  }, []);

  // foreGround Message handler
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const {notification, messageId} = remoteMessage;
      if (!messageId) {
        console.error('Missing message ID');
        return;
      }

      displayFloatingNotification(notification, messageId);
      console.log('its work in foreground');
      Vibration.vibrate(60);
    });
    return unsubscribe;
  }, []);

  async function displayFloatingNotification(notification, messageId) {
    if (notification.displayed) return; // Prevents duplication
    notification.displayed = true;
    // Create a channel with high importance
    await notifee.createChannel({
      id: 'high-priority',
      name: 'High Priority Notifications',
      importance: AndroidImportance.HIGH, // Set importance to high for heads-up display
      visibility: AndroidVisibility.PUBLIC, // Make notification content visible on lock screen
    });

    // Display a notification with the created channel
    await notifee.displayNotification({
      title: notification.title,
      body: notification.body,
      android: {
        channelId: 'high-priority',
        importance: AndroidImportance.HIGH, // Ensures heads-up on supported devices
        pressAction: {
          id: 'messageId',
        },
        style: notification?.android?.imageUrl && {
          type: AndroidStyle.BIGPICTURE,
          picture: notification?.android?.imageUrl
            ? notification?.android?.imageUrl
            : '',
        },
      },
    });
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        // tabBarLabel: true,
        tabBarActiveBackgroundColor: appColors.background,
        tabBarInactiveBackgroundColor: appColors.background,
        tabBarActiveTintColor: appColors.background,
        tabBarInactiveTintColor: appColors.pink,
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 11,
                fontFamily: fonts.IM,
                paddingBottom: 10,
                color: focused ? appColors.pink : appColors.black, // Dynamic color
              }}>
              Merchant
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <Fontisto
              name={'shopping-store'}
              color={focused ? appColors.pink : appColors.black}
              size={18}
            />
          ),
        }}
      />
      <Tab.Screen
        name="EventsScreen"
        component={EventsScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 11,
                fontFamily: fonts.IM,
                paddingBottom: 10,
                color: focused ? appColors.pink : appColors.black, // Dynamic color
              }}>
              Events
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <FontAwesome
              name={'calendar-check-o'}
              color={focused ? appColors.pink : appColors.black}
              size={18}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Kitties"
        component={Kitties}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 11,
                fontFamily: fonts.IM,
                paddingBottom: 10,
                color: focused ? appColors.pink : appColors.black, // Dynamic color
              }}>
              Kitties
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <MaterialIcons
              name={'pets'}
              color={focused ? appColors.pink : appColors.black}
              size={25}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 11,
                fontFamily: fonts.IM,
                paddingBottom: 10,
                color: focused ? appColors.pink : appColors.black, // Dynamic color
              }}>
              Chat
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <Fontisto
              name={'hipchat'}
              color={focused ? appColors.pink : appColors.black}
              size={21}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 11,
                fontFamily: fonts.IM,
                paddingBottom: 10,
                color: focused ? appColors.pink : appColors.black, // Dynamic color
              }}>
              Profile
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <FontAwesome
              name={'user-o'}
              color={focused ? appColors.pink : appColors.black}
              size={21}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
