import { StyleSheet, Text, View, Dimensions, Platform, } from 'react-native'
import React, { useContext } from 'react'
import { SWATheam, SwaTheam, assetsPath } from '../../constant/ConstentValue'
import Pdf from 'react-native-pdf';
import SwaHeader from './SwaHeader';
import { useSelector } from 'react-redux';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobleData } from '../../Store';


const PdfViewer = ({ navigation, route }) => {
  const { userData } = useContext(GlobleData)
  const moduleActivityList = useSelector(state => state.ActivityToolList)
  let pdfPath = ''
  if (moduleActivityList.data.length) {
    pdfPath = moduleActivityList?.data.mainData[0]?.filePath != undefined ? moduleActivityList?.data?.mainData[0]?.filePath + '/' + moduleActivityList?.data?.mainData[0]?.uploadFileName : undefined
  } else {
    pdfPath = route.params.url
  }
  let testPath = ''
  let titleName = ''
  if (route.params.url != undefined) {
    if (route.params.urlLink == "bookPDF") {
      titleName = route.params.title
      testPath = assetsPath + route.params.url
    } else {
      testPath = route.params.url
      titleName = route.params.title
    }

  } else if (pdfPath != undefined) {
    testPath = assetsPath + pdfPath
    titleName = moduleActivityList.data.mainData[0].chapterName
  } else if (route.params.url == undefined && pdfPath == undefined) {
    testPath = assetsPath + route.params.filePath + '/' + route.params.uploadFileName
    titleName = route.params.chapterName
  }
  function onClickLeftIcon() {
    navigation.goBack()
  }
  function onClickRightIcon() {
    setIsInstruction(true)
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['left', 'top', 'right']} style={{ backgroundColor: userData?.data?.colors?.mainTheme, flex: 1, marginTop: Platform.OS == "ios" ? 0 : 20 }}>
        <SwaHeader title={titleName} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
        <View style={{ padding: 0, flex: 1, backgroundColor: SWATheam.SwaWhite, }}>

          <View style={styles.container}>
            <Pdf
              trustAllCerts={false}
              source={{
                uri: testPath,
                cache: true,
              }}
              onLoadComplete={(numberOfPages, filePath) => {
                // console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                // console.log(`Current page: ${page}`);
              }}
              onError={error => {
                // console.log(error);
              }}
              //   onPressLink={uri => {
              //     console.log(`Link pressed: ${uri}`);
              //   }}
              style={styles.pdf}
            />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default PdfViewer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
})