import { StyleSheet, View, Dimensions } from 'react-native';
import React, { useContext, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { SafeAreaProvider, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { GlobleData } from '../../Store';
import { assetsPath } from '../../constant/ConstentValue';
import SwaHeader from './SwaHeader';
import Loader from './Loader';
import { ActivityTracker } from '../../ActivityTracker';



const PdfViewer = ({ navigation, route }) => {
  const { classID, subjectID, bookID, activityID, chapterID, subjSubTypeID, subPartID, } = route?.params?.data || {}; // for user activity tracking

  // console.log(route, "Route Time to?")

  const insets = useSafeAreaInsets();
  const { userData } = useContext(GlobleData);
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef(null);
  const moduleActivityList = useSelector(state => state.ActivityToolList);
  let pdfPath = '';
  if (moduleActivityList?.data?.length) {
    pdfPath =
      moduleActivityList?.data?.mainData[0]?.filePath != undefined
        ? moduleActivityList?.data?.mainData[0]?.filePath +
        '/' +
        moduleActivityList?.data?.mainData[0]?.uploadFileName
        : undefined;
  } else {
    pdfPath = route?.params?.url;
  }

  const params = route?.params?.data || {};


  let testPath = '';
  let titleName = '';

  // -------- PDF PATH --------

  if (params.url != undefined) {
    if (params.urlLink == 'bookPDF') {
      titleName = params.title;
      testPath = assetsPath + params.url;
    } else {
      testPath = params.url;
      titleName = params.title;
    }
  } else if (pdfPath != undefined) {
    testPath = assetsPath + pdfPath;
    titleName = moduleActivityList?.data?.mainData[0]?.chapterName;
  } else if (params.url == undefined && pdfPath == undefined) {
    testPath = assetsPath + params.filePath + '/' + params.uploadFileName;
    titleName = params.chapterName;
  }

  function onClickLeftIcon() {
    navigation.goBack();
  }

  const pdfUrl = encodeURIComponent(testPath);

  const googlePdfViewerUrl = `https://docs.google.com/gview?embedded=true&url=${pdfUrl}`;

  // -------- RELOAD FUNCTION --------

  const reloadPdf = () => {
    setIsLoading(true);

    setTimeout(() => {
      webViewRef.current?.reload();
    }, 1000);
  };


  return (
    <SafeAreaProvider
      style={{
        flex: 1,
        paddingTop: insets.top,
        marginBottom: insets.bottom,
        backgroundColor: userData?.data?.colors?.mainTheme,
      }}
    >
      {/* HEADER */}

      {titleName != undefined ? (
        <SwaHeader
          title={titleName}
          leftIcon={'arrowleft'}
          onClickLeftIcon={onClickLeftIcon}
        />
      ) : null}

      {/* LOADER */}

      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}
        >
          <Loader />

          <ActivityTracker
            payload={{
              mainIconID: route?.params?.mainIconID,           //mainIconID, // Swa-Learning
              subIconID: route?.params.subIconID,
              activityID: activityID,
              childIconID: null,
              classID: classID,                                // Class 3
              subjectID: subjectID,                            // English
              bookID: bookID,                                  // Swa-Adhyayan English Book
              chapterID: chapterID,                            // Chapter 1: Everything...
              subTypeID: subjSubTypeID,                        // PDF (e.g. 9)
              subPartID: subPartID,                            // Subjct Part ID
            }}
          />



        </View>
      )}

      {/* WEBVIEW */}

      <WebView
        ref={webViewRef}
        source={{
          uri: googlePdfViewerUrl,
        }}
        style={{
          flex: 1,
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        cacheEnabled={false}
        incognito={true}
        mixedContentMode="always"
        startInLoadingState={true}
        scalesPageToFit={true}
        // LOAD START

        onLoadStart={() => {
          setIsLoading(true);
        }}
        // LOAD FINISH
        onLoadEnd={() => {
          setTimeout(() => {
            setIsLoading(false);
          }, 1200);
        }}
        // ERROR
        onError={syntheticEvent => {
          const { nativeEvent } = syntheticEvent;
          console.log('PDF LOAD ERROR => ', nativeEvent);
          reloadPdf();
        }}
        onHttpError={syntheticEvent => {
          const { nativeEvent } = syntheticEvent;
          console.log('HTTP ERROR => ', nativeEvent);
          reloadPdf();
        }}
      />
    </SafeAreaProvider>
  );
};
export default PdfViewer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
