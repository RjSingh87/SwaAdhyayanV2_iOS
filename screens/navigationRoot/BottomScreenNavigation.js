import { View, Text, Keyboard } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SWATheam } from '../../constant/ConstentValue'
import { GlobleData } from '../../Store'
import Profile from '../userScreens/Profile'
import Notification from '../Notification'
import Dashboard from '../lmsScreen/Dashboard'
import { fetchNotificationList } from '../redux/slices/NotificationList'
import { useDispatch, useSelector } from 'react-redux'
import Search from '../common/Search'
const Tab = createBottomTabNavigator()


const BottomScreenNavigation = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const { userData } = useContext(GlobleData)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const notificationList = useSelector(state => state.NotisList)

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

  useEffect(() => {
    const payload = {
      "classID": userData.data.classID,
      "sectionID": userData.data.sectionID,
      "userRefID": userData.data.userRefID,
      "schoolID": userData.data.schoolID,
      "userTypeID": userData.data.userTypeID
    }
    dispatch(fetchNotificationList(payload));
  }, [])

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
      {userData?.data?.userTypeID == 5 || userData?.data?.userTypeID == 6 ?
        <Tab.Screen
          name="notification"
          component={Notification}
          options={({ route }) => ({
            tabBarBadge: notificationList.data.length == 0 ? null : notificationList.data.length,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="notifications-outline" color={color} size={size} />
            ),
            headerShown: false,
          })}

        /> : null
      }

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