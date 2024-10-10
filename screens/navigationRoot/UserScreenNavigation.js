import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import WelcomeScreen from '../common/WelcomeScreen'
import SplashScreen from '../common/SplashScreen'
import LoginScreen from '../userScreens/LoginScreen'
import { GlobleData } from '../../Store'


const Stack = createStackNavigator()

const UserScreenNavigation = () => {
  const { userData } = useContext(GlobleData)
  // console.log(userData, "Logout..Log???type")
  return (
    <Stack.Navigator>
      {userData.type != "logout" ?
        <>
          <Stack.Screen name="welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </> :
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      }
    </Stack.Navigator>
  )
}

export default UserScreenNavigation

const styles = StyleSheet.create({})