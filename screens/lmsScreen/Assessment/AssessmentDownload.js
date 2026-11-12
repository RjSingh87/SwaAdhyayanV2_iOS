import { StyleSheet, Text, View, Alert, Platform, TouchableOpacity } from 'react-native';
import React, { useRef, useContext, useState, useEffect } from 'react';
import WebView from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RNBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import { GlobleData } from '../../../Store';
import SwaHeader from '../../common/SwaHeader';
import Loader from '../../common/Loader';
import { flowRef } from '../flowRef';

const AssessmentDownload = ({ navigation, route }) => {
  const assessmentResponse = route.params?.assessmentResponse;
  const webview = useRef(null);
  const insets = useSafeAreaInsets();
  const { userData } = useContext(GlobleData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      flowRef.fromChild2 = true;
    });
    return unsubscribe;
  }, [navigation]);

  function onClickLeftIcon() {
    flowRef.fromChild2 = true;
    navigation.goBack();
  }

  function onClickRightIcon() {
    // no-op
  }

  const sendDataToWeb = () => {
    if (!assessmentResponse) {
      console.log('sendDataToWeb: assessmentResponse is missing');
      return;
    }

    const payload = {
      assessmentResponse,
    };

    try {
      webview.current?.postMessage(JSON.stringify(payload));
    } catch (e) {
      console.log('RN postMessage error:', e);
    }

    const jsonString = JSON.stringify(payload);
    const jsCode = `
      (function() {
        try {
          var data = ${jsonString};
          var strData = JSON.stringify(data);

          if (window.postMessage) {
            window.postMessage(strData, '*');
          }

          window.dispatchEvent(
            new MessageEvent('message', {
              data: strData
            })
          );

          document.dispatchEvent(
            new MessageEvent('message', {
              data: strData
            })
          );
        } catch (error) {
          console.log('RN DATA ERROR:', error.message);
        }
        true;
      })();
      true;
    `;

    webview.current?.injectJavaScript(jsCode);
  };

  const handleSaveToFiles = async (filePath) => {
    try {
      const formattedUrl = filePath.startsWith('file://') ? filePath : `file://${filePath}`;
      if (Platform.OS === 'ios') {
        await Share.open({
          url: formattedUrl,
          saveToFiles: true,
          type: 'application/pdf',
          failOnCancel: false,
        });
      } else {
        const fileName = filePath.split('/').pop() || `Assessment_${Date.now()}.pdf`;
        const dest = `${RNBlobUtil.fs.dirs.DownloadDir}/${fileName}`;
        await RNBlobUtil.fs.cp(filePath, dest);
        Alert.alert('Success', `File saved to Downloads/${fileName}`);
      }
    } catch (err) {
      console.log('Save to Files error:', err);
    }
  };

  const handleShare = async (filePath, fileName) => {
    try {
      const formattedUrl = filePath.startsWith('file://') ? filePath : `file://${filePath}`;
      await Share.open({
        title: 'Share Assessment PDF',
        url: formattedUrl,
        type: 'application/pdf',
        filename: fileName,
        failOnCancel: false,
      });
    } catch (err) {
      console.log('Share error:', err);
    }
  };

  const promptSaveOrShare = (filePath, fileName) => {
    Alert.alert(
      'Assessment PDF',
      'Choose an action:',
      [
        {
          text: 'Save to Files',
          onPress: () => handleSaveToFiles(filePath),
        },
        {
          text: 'Share',
          onPress: () => handleShare(filePath, fileName),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handlePdfData = async (data) => {
    try {
      setLoading(true);
      const rawBase64 = data?.payload;
      if (!rawBase64) {
        Alert.alert('Error', 'PDF data is empty');
        return;
      }

      const cleanBase64 = rawBase64.includes(',') ? rawBase64.split(',')[1] : rawBase64;
      const originalFileName = data?.fileName || `Assessment_${Date.now()}.pdf`;
      const fileName = originalFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${RNBlobUtil.fs.dirs.DocumentDir}/${fileName}`;

      await RNBlobUtil.fs.writeFile(filePath, cleanBase64, 'base64');

      const exists = await RNBlobUtil.fs.exists(filePath);
      if (!exists) {
        Alert.alert('Error', 'Failed to save PDF file');
        return;
      }

      promptSaveOrShare(filePath, fileName);
    } catch (error) {
      console.log('Error handling PDF data:', error);
      Alert.alert('Error', 'Unable to process PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: userData.data.colors.mainTheme, marginBottom: insets.bottom }}>
      <SwaHeader title={'Assessment Download'} leftIcon={'arrowleft'} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />

      {loading && <Loader />}

      <WebView
        ref={webview}
        style={{ flex: 1 }}
        source={{
          uri: 'https://swaadhyayan.com/school/public/manageAssessment/'
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        originWhitelist={['*']}
        onLoadEnd={() => {
          console.log('WebView Loaded');
          sendDataToWeb();
          setTimeout(() => {
            sendDataToWeb();
          }, 400);
          setTimeout(() => {
            sendDataToWeb();
          }, 1000);
        }}
        onMessage={(event) => {
          const rawMessage = event.nativeEvent.data;
          console.log('Message from Web:', rawMessage);

          if (rawMessage === 'WEB_READY') {
            sendDataToWeb();
            return;
          }

          let msg;
          try {
            msg = JSON.parse(rawMessage);
          } catch (e) {
            return;
          }

          if (msg === 'WEB_READY' || msg?.type === 'WEB_READY') {
            sendDataToWeb();
          } else if (msg?.type === 'PDF_DATA') {
            handlePdfData(msg);
          }
        }}
        onError={(e) => {
          console.log('WebView Error:', e.nativeEvent);
        }}
        onHttpError={(e) => {
          console.log('HTTP Error:', e.nativeEvent);
        }}
      />
    </View>
  );
};

export default AssessmentDownload;

const styles = StyleSheet.create({});
