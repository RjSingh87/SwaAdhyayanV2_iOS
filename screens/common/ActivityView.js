import { StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import SwaHeader from './SwaHeader'
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobleData } from '../../Store';
import ActivityTracker from '../../ActivityTracker';


const ActivityView = ({ navigation, route }) => {
  // console.log(JSON.stringify(route), "Of ActivityView???")


  const { mainIconID, subIconID, subTypeID, classID, subjectID, activityID, bookID, chapterID, subjectSubID, subPartID, } = route?.params?.data || {}; // for user activity tracking

  const insets = useSafeAreaInsets();
  const { userData } = useContext(GlobleData)

  function onClickLeftIcon() {
    navigation.goBack()
  }
  function onClickRightIcon() {
    setIsInstruction(true)
  }

  return (
    <SafeAreaProvider style={{ flex: 1, paddingTop: insets.top, backgroundColor: userData.data.colors.mainTheme, marginBottom: insets.bottom }}>
      <ActivityTracker
        payload={{
          mainIconID: mainIconID,
          subIconID: subIconID,
          activityID: activityID,
          childIconID: null,
          classID: classID,
          subjectID: subjectID,
          bookID: bookID,
          chapterID: chapterID,
          subTypeID: subTypeID,
          subPartID: subjectSubID,
        }}
      />
      <SwaHeader title={route?.params?.title.replace('<br>', '')} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
      <WebView
        source={{ uri: route?.params?.url }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        style={{ flex: 1 }}
      />
    </SafeAreaProvider>
  )
}

export default ActivityView
const styles = StyleSheet.create({})