import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SWATheam } from './constant/ConstentValue';
import MainRoot from './MainRoot';
import Store from './Store';
import { Provider } from 'react-redux';
import ReduxStore from './screens/redux/ReduxStore';
import { SafeAreaProvider } from 'react-native-safe-area-context';





const App = () => {
  return (
    <SafeAreaProvider>
      <Store>
        <Provider store={ReduxStore}>
          <MainRoot />
        </Provider>
      </Store>
    </SafeAreaProvider>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SWATheam.SwaBlue
  }
})