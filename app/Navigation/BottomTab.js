import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {appColors} from '../Utiles/appColors';
import {fonts} from '../Utiles/appFont';
import {Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FilesUploads from '../screens/FilesUploads';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import WebViewScreen from '../screens/WebViewScreen';
import {AddressStack, WebViewStack} from './Stack';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  const navigation = useNavigation();

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
        name="fileUpload"
        component={FilesUploads}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 11,
                fontFamily: fonts.IM,
                paddingBottom: 10,
                color: focused ? appColors.pink : appColors.black, // Dynamic color
              }}>
              Upload files
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <MaterialIcons
              name={'upload'}
              color={focused ? appColors.pink : appColors.black}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Address Section"
        component={AddressStack}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 11,
                fontFamily: fonts.IM,
                paddingBottom: 10,
                color: focused ? appColors.pink : appColors.black, // Dynamic color
              }}>
              Add Address
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <MaterialIcons
              name={'add-location-alt'}
              color={focused ? appColors.pink : appColors.black}
              size={25}
            />
          ),
        }}
      />
      <Tab.Screen
        name="webview"
        component={WebViewStack}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 11,
                fontFamily: fonts.IM,
                paddingBottom: 10,
                color: focused ? appColors.pink : appColors.black, // Dynamic color
              }}>
              WebView
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <MaterialDesignIcons
              name={'web'}
              color={focused ? appColors.pink : appColors.black}
              size={25}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
