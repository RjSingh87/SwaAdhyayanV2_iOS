import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useContext } from 'react'
import { SWATheam } from '../../constant/ConstentValue'


const Loader = () => {

  return (
    <View style={styles.mainContainer}>
      <View style={{ padding: 15, backgroundColor: SWATheam.SwaWhite, borderRadius: 4, width: '95%', flexDirection: 'row' }}>
        <ActivityIndicator size={"large"} color={SWATheam.SwaBlue} />
        <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center', marginTop: 10, marginHorizontal: 10 }}>Loading...</Text>
      </View>
    </View>

  )
}

export default Loader

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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