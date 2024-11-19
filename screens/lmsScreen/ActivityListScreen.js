import { StyleSheet, Text, View, StatusBar, Platform } from 'react-native'
import React, { useContext, useState, useRef, useEffect } from 'react'
import SwaHeader from '../common/SwaHeader'
import { useDispatch, useSelector } from 'react-redux';
import SubIconActivityList from '../common/SubIconActivityList'
import { GlobleData } from '../../Store'
import Services from '../../Services';
import { apiRoot } from '../../constant/ConstentValue';
import BottomDrawerList from '../common/BottomDrawerList';
import Orientation from 'react-native-orientation-locker';
import Loader from '../common/Loader';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


const ActivityListScreen = ({ navigation, route }) => {
  const { userData } = useContext(GlobleData)
  let moduleActivityList = useSelector(state => state.ActivityToolList)
  let funBagActivityList = useSelector(state => state.FunBagActToolList)
  const [listItem, setListItem] = useState({ list: null, status: false, type: '' })
  const [chapterID, setChapterID] = useState()
  const bookId = useRef(route?.params?.item?.bookID).current
  if (route.params.isFun) {
    moduleActivityList = {}
  } else {
    funBagActivityList = {}
  }

  useEffect(() => {
    const goBack = navigation.addListener('focus', () => {
      Orientation.lockToPortrait();
      StatusBar.setHidden(false);
    });
    return goBack
  }, [navigation])


  function onClickLeftIcon() {
    navigation.goBack()
  }
  function onClickRightIcon() {
    setIsInstruction(true)
  }
  async function getModuleActivityData(item, actUrl) {
    setChapterID(item.chapterID)
    const payload = {
      "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? route.params.sendData.classID : userData.data.classID,
      "subjectID": item.subjectID,
      "subTypeID": route.params.sendData.subTypeID,
      "chapterID": item.chapterID ? item.chapterID : ''
    }

    if (actUrl != "") {
      const cheerio = require('react-native-cheerio');
      const response = await fetch(actUrl + '/app')

      const htmlString = await response.text()
      // console.log(htmlString, 'htmlString')
      const $ = cheerio.load(htmlString);
      const liListIframe = $("iframe");
      const liListEmbed = $("embed");
      const liListSource = $("source");

      const liList = liListIframe[0] ?? liListSource[0] ?? liListEmbed[0] ?? null;
      let srcPath = '';

      if (liList) {
        const urlArray = liList.attribs.src.split('#');
        if (liList.attribs.src.includes('SPDF')) {
          srcPath = `${urlArray[1]}`
        } else {
          srcPath = `${urlArray[0]}`
        }
        if (srcPath.endsWith('mp4') || srcPath.endsWith('ogg')) {
          // This Video of elearning
          navigation.navigate('videoView', { url: srcPath, data: item })
        } else if ((bookId == 3 || bookId == 7)) {
          // This PDF of learning without downloadable
          navigation.navigate('pdfView', { url: srcPath, title: item.activityName })
        } else if (srcPath.endsWith('pdf')) {
          navigation.navigate('pdfView', { url: srcPath, title: item.activityName })
        } else {
          // GlossaryMoralSummaryLbdView//
          navigation.navigate('activityView', { url: actUrl, title: item.activityName })
        }
      } else if (actUrl.includes('otherActivity')) {
        navigation.navigate('activityView', { url: actUrl, title: item.activityName })
      } else {
        // GlossaryMoralSummaryLbdView//
        navigation.navigate('activityView', { url: actUrl, title: item.activityName })
      }
    } else {
      Services.post(apiRoot.getLearningRightToolsList, payload)
        .then((res) => {
          if (res.status == "success") {
            listName = ''
            if (route.params.sendData.subTypeID == 1) {
              listName = item.chapterNameLang2
            } else {
              listName = item.chapterName
            }
            setListItem((prev) => {
              return { ...prev, list: res.data.mainData, status: true, type: 'act', imgUrl: res.data.imgUrl, listName: (route.params.sendData.subTypeID == 1 ? "पाठ " : "Chapter ") + item.chapterNo + ': ' + listName, actUrl: actUrl }
            })
          } else if (res.status == "error") {
            alert(res.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
  function closeModule() {
    setListItem((prev) => {
      return { ...prev, status: false }
    })
  }
  function getSelectedItem(item, type) {
    let classID = (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? route.params.sendData.classID : userData.data.classID
    let subjectID = ''
    if (classID > 5 && route.params.sendData.bookID == 27) {
      subjectID = 7
    } else if (classID > 5 && route.params.sendData.bookID == 30) {
      subjectID = 8
    } else if (classID > 5 && route.params.sendData.bookID == 33) {
      subjectID = 9
    } else {
      subjectID = route.params.sendData.subjectID
    }

    const payload = {
      "classID": classID,
      "subjectID": subjectID,
      "subTypeID": route.params.sendData.subTypeID,
      "subPartID": item.subPartID,
      "chapterID": chapterID
    }
    Services.post(apiRoot.getFilePathAccToLearningType, payload)
      .then((res) => {
        if (res.status == "success") {
          setListItem((prev) => {
            return { ...prev, status: false }
          })
          if (res.data.length > 1) {
            sendData = {
              screenName: route.params.sendData.subjectID == 1 ? item.subPartNameLang2 : item.subPartName.replace('<br>', ''),
              subTypeID: route.params.sendData.subTypeID,
              classID: (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? route.params.sendData.classID : userData.data.classID,
              subjectID: route.params.sendData.subjectID
            }
            navigation.navigate('chapterItem', { data: res.data, sendData: sendData, navigation })
          } else if (res.data[0]?.uploadFileName?.split('.').pop() === "pdf") {
            navigation.navigate('pdfView', res.data[0])
          } else if (res.data[0]?.uploadFileName?.split('.').pop() === "mp4") {
            navigation.navigate('videoView', res.data[0])
          } else if (res.data[0].activityUrl != null || res.data[0].activityUrl != undefined) {
            navigation.navigate('activityView', { url: res.data[0].activityUrl, title: res.data[0].activityName })
          }
        } else if (res.status == "error") {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {

      })
  }


  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['left', 'top', 'right']} style={{ flex: 1, backgroundColor: userData?.data?.colors?.mainTheme }}>
        <View style={{ flex: 1, marginTop: Platform.OS == "ios" ? 0 : 24 }}>
          <SwaHeader title={route.params.sendData.screenName.replace('\r\n', '')} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
          <>
            {moduleActivityList.loading ?
              <Loader /> :
              <>
                {moduleActivityList?.data?.mainData?.length ?
                  <SubIconActivityList selectedModuleItem={route.params.item} toolItems={moduleActivityList.data} getModuleActivityData={getModuleActivityData} navigation={navigation} /> :
                  null
                }
              </>
            }
          </>
          <>
            {funBagActivityList.loading ?
              <Loader /> :
              <>
                {funBagActivityList?.data?.length &&
                  <SubIconActivityList selectedModuleItem={route.params.sendData} toolItems={funBagActivityList.data} getModuleActivityData={getModuleActivityData} navigation={navigation} />
                }
              </>
            }
          </>
          {listItem.status &&
            <BottomDrawerList closeModule={closeModule} listItem={listItem} getSelectedItem={getSelectedItem} languageID={route.params.sendData.subTypeID} />
          }
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default ActivityListScreen
const styles = StyleSheet.create({})