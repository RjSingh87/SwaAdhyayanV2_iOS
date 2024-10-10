import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useContext } from 'react'
import { GlobleData } from '../Store'
import { SWATheam } from '../constant/ConstentValue'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'


const Notification = () => {
  const { userData } = useContext(GlobleData)
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: userData.data.colors.liteTheme, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require("./assets/Notification.png")} style={{ width: 80, height: 80 }} tintColor={userData.data.colors.hoverTheme} />
        <Text style={{ marginTop: 20, fontSize: 18, fontWeight: '500', textAlign: 'center', color: SWATheam.SwaBlack }}>No notification here.</Text>
        <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack, paddingHorizontal: 20, marginTop: 10 }}>There are not notification to display at this time. Please check back later.</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Notification

const styles = StyleSheet.create({})