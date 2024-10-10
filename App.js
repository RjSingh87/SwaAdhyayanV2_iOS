import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import UserScreenNavigation from './screens/navigationRoot/UserScreenNavigation';
import WelcomeScreen from './screens/common/WelcomeScreen';
import { SWATheam } from './constant/ConstentValue';
import MainRoot from './MainRoot';
import Store from './Store';
import { Provider } from 'react-redux';
import ReduxStore from './screens/redux/ReduxStore';





const App = () => {
  return (
    <Store>
      <Provider store={ReduxStore}>
        <MainRoot />
      </Provider>
    </Store>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SWATheam.SwaBlue
  }
})