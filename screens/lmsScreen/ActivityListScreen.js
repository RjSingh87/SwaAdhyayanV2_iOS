import { StyleSheet, Text, View, StatusBar, BackHandler, Alert } from 'react-native'
import React, { useContext, useState, useRef, useEffect, } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SwaHeader from '../common/SwaHeader'
import { useDispatch, useSelector } from 'react-redux';
import SubIconActivityList from '../common/SubIconActivityList'
import { GlobleData } from '../../Store'
import Services from '../../Services';
import { apiRoot, assetsPath, SWATheam } from '../../constant/ConstentValue';
import BottomDrawerList from '../common/BottomDrawerList';
import Orientation from 'react-native-orientation-locker';
import Loader from '../common/Loader';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';


const ActivityListScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const searchID = route?.params?.item?.chapter?.chapterID
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
    if (searchID != undefined) {
      const backAction = () => {
        navigation.navigate('home')
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }
  }, []);

  useEffect(() => {
    const goBack = navigation.addListener('focus', () => {
      Orientation.lockToPortrait();
      StatusBar.setHidden(false);
    });
    return goBack
  }, [navigation])

  useEffect(() => {
    if (!moduleActivityList.loading && route?.params?.item?.chapter != undefined) {
      getModuleActivityData(route.params.item)
    }
  }, [])

  function onClickLeftIcon() {
    if (searchID != undefined) {
      navigation.navigate('home')
    } else {
      navigation.goBack()
    }
  }
  function onClickRightIcon() {
    setIsInstruction(true)
  }

  async function getModuleActivityData(item, actUrl) {
    let classId = item?.chapter != undefined ? item.chapter.classID : ((userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? route.params.sendData.classID : userData.data.classID)
    let subjectID = item?.chapter != undefined ? item.chapter.subjectID : item?.subjectID
    let chapterID = item?.chapter != undefined ? item?.chapter?.chapterID : (item?.chapterID ? item?.chapterID : '')
    let subTypeID = route.params.sendData.subTypeID
    let chapterNo = item?.chapter != undefined ? item?.chapter?.chapterNo : item?.chapterNo

    setChapterID(chapterID)
    const payload = {
      "classID": classId,
      "subjectID": subjectID,
      "subTypeID": subTypeID,
      "chapterID": chapterID
    }
    if (actUrl != "" && actUrl != undefined) {
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
          navigation.navigate('videoView', {
            data: { ...item, url: srcPath, },
            mainIconID: route.params?.mainIconID,
            subIconID: route.params?.subIconID,
          });
        } else if ((bookId == 3 || bookId == 7)) {
          // This PDF of learning without downloadable
          navigation.navigate('pdfView', {
            data: {
              ...item,
              url: srcPath,
              title: item.activityName,
            },
            mainIconID: route.params?.mainIconID,
            subIconID: route.params?.subIconID,
          })
        } else if (srcPath.endsWith('pdf')) {
          navigation.navigate('pdfView', {
            data: {
              ...item,
              url: srcPath,
              title: item.activityName,
            },
            mainIconID: route.params?.mainIconID,
            subIconID: route.params?.subIconID,
          })
        } else {
          // GlossaryMoralSummaryLbdView//
          navigation.navigate('activityView', {
            url: actUrl,
            title: item.activityName,

            data: { //for user actvity tracking
              classID: classId,
              subjectID: subjectID,
              activityID: item?.activityID,
              bookID: null,
              chapterID: item?.chapterID,
              subjectSubID: item?.subjectSubID,
              subPartID: null,
              mainIconID: route?.params?.mainIconID,
              subIconID: route?.params?.subIconID,
              subTypeID: subTypeID
            },
          })
        }
      } else if (actUrl.includes('otherActivity')) {

        navigation.navigate('activityView', {
          url: actUrl,
          title: item.activityName,

          data: { //for user actvity tracking
            classID: classId,
            subjectID: subjectID,
            activityID: item?.activityID,
            bookID: null,
            chapterID: item?.chapterID,
            subjectSubID: item?.subjectSubID,
            subPartID: null,
            mainIconID: route?.params?.mainIconID,
            subIconID: route?.params?.subIconID,
            subTypeID: subTypeID
          },
        })
      } else {
        // Glossary, Moral, Summary, LbdView, Lab Activities, Projects, Cyber Security, Computer Quiz, NCO Sample Question, Computational Thinking, Test Papers, //
        navigation.navigate('activityView', {
          url: actUrl,
          title: item.activityName,

          data: { //for user actvity tracking
            classID: classId,
            subjectID: subjectID,
            activityID: item?.activityID,
            bookID: null,
            chapterID: item?.chapterID,
            subjectSubID: item?.subjectSubID,
            subPartID: null,
            mainIconID: route?.params?.mainIconID,
            subIconID: route?.params?.subIconID,
            subTypeID: subTypeID
          },
        })
      }
    } else {

      await Services.post(apiRoot.getLearningRightToolsList, payload)
        .then((res) => {
          if (res.status == "success") {
            listName = ''
            if (subTypeID == 1) {
              if (item?.chapter != undefined) {
                listName = item.chapter.chapterName
              } else (
                listName = item.chapterNameLang2
              )
            } else {
              if (item?.chapter != undefined) {
                listName = item.chapter.chapterName
              } else {
                listName = item.chapterName
              }
            }
            setListItem((prev) => {
              return { ...prev, list: res.data.mainData, status: true, type: 'act', imgUrl: res.data.imgUrl, listName: (subTypeID == 1 ? "पाठ " : "Chapter ") + chapterNo + ': ' + listName, actUrl: actUrl }
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
              subjectID: route.params.sendData.subjectID,
              mainIconID: route.params?.mainIconID,
              subIconID: route.params?.subIconID,
            }
            navigation.navigate('chapterItem', { data: res.data, sendData: sendData, navigation })
          } else if (res.data[0]?.uploadFileName?.split('.').pop() === "pdf") {
            navigation.navigate('pdfView', {
              data: {
                ...res.data[0],
                url: assetsPath + res.data[0]?.filePath + '/' + res.data[0]?.uploadFileName,
                title: res.data[0]?.chapterName,
              },
              mainIconID: route.params?.mainIconID,
              subIconID: route.params?.subIconID,
            })
          } else if (res.data[0]?.uploadFileName?.split('.').pop() === "mp4" || res.data[0]?.referenceLink != null) {
            navigation.navigate('videoView', {
              data: { ...res.data[0], url: res.data[0]?.referenceLink || res.data[0]?.url, },
              mainIconID: route.params?.mainIconID,
              subIconID: route.params?.subIconID,
            });
          } else if (res.data[0].activityUrl != null || res.data[0].activityUrl != undefined) {

            navigation.navigate('activityView', {
              url: res.data[0].activityUrl,
              title: res.data[0].activityName,

              data: { //for user actvity tracking
                classID: res?.data[0]?.classID,
                subjectID: res?.data[0]?.subjectID,
                activityID: res?.data[0]?.activityID,
                bookID: res?.data[0]?.bookID,
                chapterID: res?.data[0]?.chapterID,
                subjectSubID: res?.data[0]?.subjectSubID,
                subPartID: res?.data[0]?.subPartID,
                mainIconID: route?.params?.mainIconID,
                subIconID: route?.params?.subIconID,
                subTypeID: route?.params?.subTypeID
              },
            })
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
    <SafeAreaProvider style={{ paddingTop: insets.top, backgroundColor: userData.data.colors.mainTheme }}>
      <View style={{ flex: 1, backgroundColor: userData.data.colors.liteTheme, marginBottom: insets.bottom }}>
        <SwaHeader title={route.params.sendData.screenName.replace('\r\n', '')} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
        <>
          {/* {moduleActivityList.loading?
          <Loader /> :
          <>
            {moduleActivityList?.data?.mainData?.length ?
              <SubIconActivityList selectedModuleItem={route.params.item} toolItems={moduleActivityList.data} getModuleActivityData={getModuleActivityData} navigation={navigation} searchID={searchID} /> :
              <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={{textAlign:'center', fontWeight:'bold', color:SWATheam.SwaBlack}}>Data not found.</Text>
              </View>
            }
          </>
        } */}

          {moduleActivityList?.data?.mainData?.length ? (
            <SubIconActivityList selectedModuleItem={route.params.item} toolItems={moduleActivityList.data} getModuleActivityData={getModuleActivityData} navigation={navigation} searchID={searchID} />) :
            funBagActivityList?.data?.length ? null : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: SWATheam.SwaBlack }}>
                  Data not found.
                </Text>
              </View>
            )}
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
    </SafeAreaProvider>
  )
}

export default ActivityListScreen
const styles = StyleSheet.create({})