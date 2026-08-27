import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native'
import React, { useContext, useEffect } from 'react'
import SubIconActivityList from './SubIconActivityList'
import SwaHeader from './SwaHeader'
import { SWATheam } from '../../constant/ConstentValue'
import { GlobleData } from '../../Store'
import Orientation from 'react-native-orientation-locker';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const ChapterItemList = ({ navigation, route }) => {

  const isTrm = route?.params?.sendData?.type == 'trm' ? true : false

  const insets = useSafeAreaInsets();

  const { userData } = useContext(GlobleData)
  useEffect(() => {
    const goBack = navigation.addListener('focus', () => {
      Orientation.lockToPortrait();
    });
    return goBack
  }, [navigation])


  function onClickLeftIcon() {
    navigation.goBack()
  }
  function onClickRightIcon() {
    setIsInstruction(true)
  }
  async function getModuleActivityData(item) {
    if (item.subPartID == 10003) {
      navigation.navigate('videoView', {
        data: {
          ...item,
          url: item.siteUrl + item.filePath + '/' + item.uploadFileName,
          data: item.chapterName,
          youtubeReferenceLink: item?.referenceLink
        },
        mainIconID: route.params?.sendData?.mainIconID,
        subIconID: route.params?.sendData?.subIconID,

      })
    } else if (item.subPartID == 10001 || isTrm) {
      if (isTrm) {
        navigation.navigate('pdfView', {
          data: {
            url: route.params.data.siteUrl + item.pdfPath,
            title: item.pdfName,
          },
          mainIconID: route.params?.sendData?.mainIconID,
          subIconID: route.params?.sendData?.subIconID,
        });
      } else {
        navigation.navigate('pdfView', item)
      }
    } else {
      navigation.navigate('activityView', {
        url: item.activityUrl,
        title: item.activityName,
        data: {     //for user actvity tracking
          classID: item?.classID,
          subjectID: item?.subjectID,
          activityID: item?.activityID,
          bookID: item?.bookID,
          chapterID: item?.chapterID,
          subjectSubID: item?.subjectSubID,
          subPartID: item?.subPartID,
          mainIconID: route.params?.sendData?.mainIconID,
          subIconID: route.params?.sendData?.subIconID,
          subTypeID: route.params?.sendData?.subTypeID
        },
      })
    }
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: userData.data.colors.mainTheme, marginBottom: insets.bottom }}>
      <SwaHeader title={route?.params?.sendData?.screenName} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
      <ScrollView style={{ flex: 1, backgroundColor: userData.data.colors.liteTheme }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginVertical: 10, paddingHorizontal: 10, }}>
          {(isTrm ? route?.params?.data?.mainData : route?.params?.data)?.map((item, index) => {
            let iconPath = null
            let iconName = ''
            let imgColor = null
            if (item?.subPartID == 10003) {
              iconPath = require('../assets/video.png')
              // iconName = "Video "+ (index+1)
              iconName = item.chapterName
              imgColor = userData.data.colors.mainTheme
            } else if (item.subPartID == 10001 || isTrm) {
              iconPath = require('../assets/pdf.png')
              // iconName = "PDF "+ (index+1)
              iconName = isTrm ? item?.pdfName : item?.chapterName
              imgColor = userData?.data?.colors?.mainTheme
            } else {
              iconPath = { uri: item.imgPath }
              iconName = item.activityName
              imgColor = null
            }
            return (
              <TouchableOpacity style={{ height: 160, marginVertical: 10, width: "40%", justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', elevation: 9, borderRadius: 6, justifyContent: 'space-around', padding: 8 }} key={isTrm ? item?.id : item?.lcContentID}
                onPress={() => {
                  getModuleActivityData(item)
                }}>
                <View style={{ height: 60, width: 60, justifyContent: 'center', alignItems: 'center', }}>
                  <Image source={iconPath} style={{ height: "100%", width: "100%", resizeMode: "contain", tintColor: imgColor }} />
                </View>
                <View style={{ height: 40, alignItems: 'center' }}>
                  <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack, fontWeight: '500' }}>{iconName}</Text>
                </View>

              </TouchableOpacity>
            )
          })}

        </View>
      </ScrollView>
    </View>
  )
}

export default ChapterItemList

const styles = StyleSheet.create({})