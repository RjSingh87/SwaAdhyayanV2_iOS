import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { } from 'react'
import { SWATheam } from '../../constant/ConstentValue'


const Loader = () => {
  return (
    <View style={styles.mainContainer}>
      <ActivityIndicator size={"large"} color={SWATheam.SwaWhite} />
      <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center', marginTop: 10 }}>Loading...</Text>
    </View>

  )
}

export default Loader

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.40)',
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    zIndex: 999
  },
  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center'

  },
  animationStyle: {
    width: 150,
    height: 150,
    alignSelf: 'center'
  }
})