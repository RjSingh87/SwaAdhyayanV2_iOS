import { View, Text, Keyboard } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SWATheam } from '../../constant/ConstentValue'
import Profile from '../userScreens/Profile'
import Notification from '../Notification'
import Dashboard from '../lmsScreen/Dashboard'
const Tab = createBottomTabNavigator()


const BottomScreenNavigation = ({ navigation, route }) => {

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };

  }, []);

  let tabdisplay = null
  if (isKeyboardVisible == true) {
    tabdisplay = 'none'
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: SWATheam.SwaWhite, display: tabdisplay },
        tabBarInactiveTintColor: SWATheam.SwaGray,
      }}
    >
      <Tab.Screen
        name="home"
        component={Dashboard}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color={color} size={size} />
          ),
          headerShown: false,
        })}

      />
      <Tab.Screen
        name="notification"
        component={Notification}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" color={color} size={size} />
          ),
          headerShown: false,
        })}

      />

      <Tab.Screen
        name="profile"
        component={Profile}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" color={color} size={size} />
          ),
          headerShown: false,
        })}

      />
    </Tab.Navigator>
  )
}

export default BottomScreenNavigation