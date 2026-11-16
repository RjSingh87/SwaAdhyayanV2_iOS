import { StatusBar, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { GlobleData } from './Store'
import { SWATheam } from './constant/ConstentValue'
import UserScreenNavigation from './screens/navigationRoot/UserScreenNavigation'
import LmsScreenNavigations from './screens/navigationRoot/LmsScreenNavigations'

const MainRoot = () => {
  const { userData } = useContext(GlobleData)

  if (!userData?.isAuthLoaded) {
    return null;
  }

  return (
    <NavigationContainer independent={true}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={userData.isLogin ? userData?.data?.colors?.mainTheme : SWATheam.SwaBlue}
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
      {!userData.isLogin ?
        <UserScreenNavigation /> :
        <LmsScreenNavigations />
      }
    </NavigationContainer>
  )
}

export default MainRoot
const styles = StyleSheet.create({})
