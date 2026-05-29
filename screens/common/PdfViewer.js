import { StyleSheet, View, Dimensions } from 'react-native';
import React, { useContext, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { SafeAreaProvider, useSafeAreaInsets, } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { GlobleData } from '../../Store';
import { assetsPath } from '../../constant/ConstentValue';
import SwaHeader from './SwaHeader';
import Loader from './Loader';
const PdfViewer = ({ navigation, route }) => {
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

  let testPath = '';
  let titleName = '';

  // -------- PDF PATH --------

  if (route?.params?.url != undefined) {
    if (route?.params?.urlLink == 'bookPDF') {
      titleName = route?.params?.title;

      testPath = assetsPath + route?.params?.url;
    } else {
      testPath = route?.params?.url;

      titleName = route?.params?.title;
    }
  } else if (pdfPath != undefined) {
    testPath = assetsPath + pdfPath;

    titleName = moduleActivityList?.data?.mainData[0]?.chapterName;
  } else if (route?.params?.url == undefined && pdfPath == undefined) {
    testPath =
      assetsPath +
      route?.params?.filePath +
      '/' +
      route?.params?.uploadFileName;

    titleName = route?.params?.chapterName;
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
