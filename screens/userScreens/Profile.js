import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'


const Profile = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Profile</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Profile

const styles = StyleSheet.create({})