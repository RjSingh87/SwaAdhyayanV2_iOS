import React, { useContext, useRef, useState } from "react";
import { View, StyleSheet, Platform, Alert } from "react-native";
import { GlobleData } from "../../../Store";
import SwaHeader from "../../common/SwaHeader";
import WebView from "react-native-webview";
import RNBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import FileViewer from 'react-native-file-viewer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AssessGenerateQuesView({ navigation, route }) {
  const webview = useRef(null);
  const insets = useSafeAreaInsets();

  const [pdfBase64, setPdfBase64] = useState(null);
  const { userData } = useContext(GlobleData)
  const assessmentQuestion = route.params.data
  const noOfAssQuestions = route.params.sendData.questionNo
  const assName = route.params.sendData.examName
  const selectedData = route.params.sendData


  function onClickLeftIcon() {
    navigation.goBack()
  }
  function onClickRightIcon() {
    setIsInstruction(true)
  }


  const movePdfToCache = async (originalPath) => {
    const cachePath = `${RNBlobUtil.fs.dirs.CacheDir}/assessment.pdf`;

    await RNBlobUtil.fs.cp(originalPath, cachePath);
    return cachePath;
  };

  const openPdf = async (path) => {
    try {
      const exists = await RNBlobUtil.fs.exists(path);
      if (!exists) {
        Alert.alert('Error', 'PDF file not found');
        return;
      }
      const cachePath = await movePdfToCache(path);
      await Share.open({
        url: `file://${cachePath}`,
        type: 'application/pdf',
        failOnCancel: false,
        showAppsToView: true,
      });

    } catch (e) {
      console.log('PDF OPEN ERROR', e);
      Alert.alert('Error', 'Unable to open PDF');
    }
  };

  return (
    <>
      <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: userData.data.colors.mainTheme, marginBottom: insets.bottom }}>
        <SwaHeader title={"Assessment Generator"} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
        {/* assessment View Reactjs start */}
        <WebView
          ref={webview}
          source={{
            uri: 'https://swaadhyayan.com/school/public/assessmentGenerator/'
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          // mixedContentMode="always"
          // userAgent="Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome Mobile Safari/537.36"
          onError={(e) => console.log("WEBVIEW ERROR", e.nativeEvent)}
          onHttpError={(e) => console.log("HTTP ERROR", e.nativeEvent)}
          onMessage={(event) => {
            let msg;

            try {
              msg = JSON.parse(event.nativeEvent.data);
            } catch (e) {
              console.log("RAW MESSAGE:", event.nativeEvent.data);
              return;
            }
            if (msg.type === "PDF_DATA") {
              const base64 = msg.payload;
              const fileName = `swa-assessment-${Date.now()}.pdf`;
              // const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
              const filePath = `${RNBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

              RNBlobUtil.fs
                .writeFile(filePath, base64, 'base64')
                .then(() => {
                  openPdf(filePath);
                })
                .catch(e => console.log("WRITE ERROR", e));
            }
            else if (msg === "done" || msg === "NAVIGATE") {
              navigation.goBack();
            }
          }}

          startInLoadingState={true}
          onLoadStart={() => console.log("LOAD START")}
          onLoad={() => console.log("LOADED")}
          injectedJavaScript={`
            setTimeout(function() {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage("TEST_FROM_WEB");
              }
            }, 3000);
            true;
          `}
          onLoadEnd={() => {
            console.log("LOAD END")
            if (webview.current) {
              const data = {
                assessmentQuestion,
                noOfAssQuestions,
                assName,
                selectedData,
                userData,
              };

              setTimeout(() => {
                webview.current.postMessage(JSON.stringify(data));
              }, 1000); // 1 sec enough
            }
          }}
        />
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  garyContainer: {
    flex: 1,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
})