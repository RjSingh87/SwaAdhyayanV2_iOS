import { StatusBar, StyleSheet } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { GlobleData } from './Store'
import { SWATheam } from './constant/ConstentValue'
import UserScreenNavigation from './screens/navigationRoot/UserScreenNavigation'
import LmsScreenNavigations from './screens/navigationRoot/LmsScreenNavigations'
import Loader from './screens/common/Loader'

const MainRoot = () => {
  const [state, setState] = useState(true)
  const { userData } = useContext(GlobleData)
  useEffect(() => {
    setTimeout(() => {
      setState(false)
    }, 2000)
  }, [])

  console.log(userData.isLogin, 'check is login ')
  return (
    <>
      {state ?
        <Loader /> :
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
      }
    </>

  )
}

export default MainRoot
const styles = StyleSheet.create({})