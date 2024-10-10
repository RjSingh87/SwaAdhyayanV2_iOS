import { Platform, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import SwaHeader from './SwaHeader'
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobleData } from '../../Store';

const ActivityView = ({ navigation, route }) => {
  const { userData } = useContext(GlobleData)

  const instets = useSafeAreaInsets()

  function onClickLeftIcon() {
    navigation.goBack()
  }
  function onClickRightIcon() {
    setIsInstruction(true)
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['left', 'right', 'top']} style={{ flex: 1, backgroundColor: userData?.data?.colors?.mainTheme, marginTop: Platform.OS == "ios" ? 0 : 24 }}>
        <SwaHeader title={route?.params?.title.replace('<br>', '')} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
        <WebView
          source={{ uri: route.params.url }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default ActivityView

const styles = StyleSheet.create({})