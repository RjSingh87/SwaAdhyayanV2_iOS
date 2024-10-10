import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import UserScreenNavigation from './screens/navigationRoot/UserScreenNavigation'
import Loader from './screens/common/Loader'
import { GlobleData } from './Store'
import LmsScreenNavigations from './screens/navigationRoot/LmsScreenNavigations'


const mainRoot = () => {
  const [appLaunchLoader, setAppLaunch] = useState(true)
  const { userData } = useContext(GlobleData)


  useEffect(() => {
    setTimeout(() => {
      setAppLaunch(false)
    }, 2000)
  }, [])


  return (
    <>
      {appLaunchLoader ?
        <Loader /> :
        <NavigationContainer independent={true}>
          {!userData.isLogin ?
            <UserScreenNavigation /> :
            <LmsScreenNavigations />
          }
        </NavigationContainer>
      }
    </>
  )
}

export default mainRoot

const styles = StyleSheet.create({})