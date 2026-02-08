import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {appColors} from '../Utiles/appColors';
import {fonts} from '../Utiles/appFont';
import {Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import WalletScreen from '../screens/WalletScreen';
import CardScreen from '../screens/CardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TransactionScreen from '../screens/TransactionScreen';

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
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 11,
                fontFamily: fonts.IM,
                paddingBottom: 6,
                color: focused ? appColors.pink : appColors.black,
              }}>
              HOME
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <MaterialIcons
              name="account-balance-wallet"
              color={focused ? appColors.pink : appColors.black}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cards"
        component={CardScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 11,
                fontFamily: fonts.IM,
                paddingBottom: 6,
                color: focused ? appColors.pink : appColors.black,
              }}>
              MY CARDS
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <MaterialIcons
              name="credit-card"
              color={focused ? appColors.pink : appColors.black}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 11,
                fontFamily: fonts.IM,
                paddingBottom: 6,
                color: focused ? appColors.pink : appColors.black,
              }}>
              HISTORY
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <MaterialIcons
              name="history"
              color={focused ? appColors.pink : appColors.black}
              size={24}
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
                paddingBottom: 6,
                color: focused ? appColors.pink : appColors.black,
              }}>
              PROFILE
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <MaterialIcons
              name="person-outline"
              color={focused ? appColors.pink : appColors.black}
              size={24}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
