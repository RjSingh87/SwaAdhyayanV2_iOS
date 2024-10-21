import { StyleSheet, Text, View, StatusBar } from 'react-native'
import React, {useEffect} from 'react'
import SwaHeader from './SwaHeader'
import { WebView } from 'react-native-webview';
import Orientation from 'react-native-orientation-locker';


const GameViewer = ({navigation, route}) => {

    useEffect(() => {
        StatusBar.setHidden(true);
        Orientation.lockToLandscape();
      }, [])


  return (
    <View style={{flex:1}}>
    {/* <SwaHeader title={route.params.title.replace('<br>','')} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon}/> */}
      <WebView
        source = {{uri:route.params.url}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={{flex:1}}
      />
    </View>
  )
}

export default GameViewer

const styles = StyleSheet.create({})