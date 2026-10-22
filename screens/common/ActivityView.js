import {
  StyleSheet,
  BackHandler,
  Alert,
  Platform,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import React, { useContext, useRef, useEffect, useState } from 'react';
import SwaHeader from './SwaHeader';
import { WebView } from 'react-native-webview';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { GlobleData } from '../../Store';
import ActivityTracker from '../../ActivityTracker';
import RNBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';

const ActivityView = ({ navigation, route }) => {
  const {
    mainIconID,
    subIconID,
    subTypeID,
    classID,
    subjectID,
    activityID,
    bookID,
    chapterID,
    subjectSubID,
    subPartID,
  } = route?.params?.data || {}; // for user activity tracking

  const insets = useSafeAreaInsets();
  const { userData } = useContext(GlobleData);
  const webViewRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState('');

  // Track if user explicitly clicked the blue Download button
  const userClickedDownloadRef = useRef(false);
  const userClickedDownloadTimeoutRef = useRef(null);

  const stopAudioAndMedia = () => {
    if (webViewRef.current) {
      try {
        const stopScript = `
          (function() {
            try {
              var audios = document.querySelectorAll('audio');
              for (var i = 0; i < audios.length; i++) {
                audios[i].pause();
                audios[i].currentTime = 0;
                audios[i].src = '';
              }
              var videos = document.querySelectorAll('video');
              for (var i = 0; i < videos.length; i++) {
                videos[i].pause();
                videos[i].currentTime = 0;
                videos[i].src = '';
              }
              var iframes = document.querySelectorAll('iframe');
              for (var j = 0; j < iframes.length; j++) {
                try {
                  iframes[j].contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
                  iframes[j].src = 'about:blank';
                } catch(e) {}
              }
              window.location.href = 'about:blank';
            } catch(e) {}
          })();
          true;
        `;
        webViewRef.current.injectJavaScript(stopScript);
      } catch (err) { }
    }
  };

  useEffect(() => {
    const unsubscribeBeforeRemove = navigation.addListener('beforeRemove', () => {
      stopAudioAndMedia();
      setIsClosing(true);
    });

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      stopAudioAndMedia();
      setIsClosing(true);
      navigation.goBack();
      return true;
    });

    return () => {
      stopAudioAndMedia();
      unsubscribeBeforeRemove();
      backHandler.remove();
      if (userClickedDownloadTimeoutRef.current) {
        clearTimeout(userClickedDownloadTimeoutRef.current);
      }
    };
  }, [navigation]);

  function onClickLeftIcon() {
    stopAudioAndMedia();
    setIsClosing(true);
    navigation.goBack();
  }

  function onClickRightIcon() {
    setIsInstruction(true);
  }

  // -------- DOWNLOAD & SHARE LOGIC --------

  const getCleanFileName = fileUrl => {
    let base = route?.params?.title || '';
    if (!base) {
      const parts = (fileUrl || '').split('/');
      base = parts[parts.length - 1] || 'document';
    }
    base = base.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_');
    if (!base.toLowerCase().endsWith('.pdf')) {
      base += '.pdf';
    }
    return base;
  };

  const downloadFileLocally = async fileUrl => {
    if (!fileUrl) {
      Alert.alert('Error', 'File URL not found.');
      return null;
    }

    const { fs } = RNBlobUtil;
    const fileName = getCleanFileName(fileUrl);
    const localPath = `${fs.dirs.DocumentDir}/${fileName}`;

    try {
      setProcessingMsg('Downloading file...');
      setIsProcessing(true);

      const exists = await fs.exists(localPath);
      if (exists) {
        setIsProcessing(false);
        return localPath;
      }

      const res = await RNBlobUtil.config({
        fileCache: true,
        path: localPath,
      }).fetch('GET', fileUrl);

      setIsProcessing(false);
      return res.path();
    } catch (err) {
      setIsProcessing(false);
      console.log('Error downloading file:', err);
      Alert.alert('Error', 'Failed to download file. Please check your connection.');
      return null;
    }
  };

  const handleSaveToFiles = async fileUrl => {
    try {
      const localPath = await downloadFileLocally(fileUrl);
      if (!localPath) return;

      const formattedUrl = localPath.startsWith('file://')
        ? localPath
        : `file://${localPath}`;

      if (Platform.OS === 'ios') {
        await Share.open({
          url: formattedUrl,
          saveToFiles: true,
          type: 'application/pdf',
          failOnCancel: false,
        });
      } else {
        const { fs } = RNBlobUtil;
        const fileName = getCleanFileName(fileUrl);
        const dest = `${fs.dirs.DownloadDir}/${fileName}`;
        await fs.cp(localPath, dest);
        Alert.alert('Success', `File saved to Downloads/${fileName}`);
      }
    } catch (err) {
      console.log('Save to Files error:', err);
    }
  };

  const handleShare = async fileUrl => {
    try {
      const localPath = await downloadFileLocally(fileUrl);
      if (!localPath) return;

      const formattedUrl = localPath.startsWith('file://')
        ? localPath
        : `file://${localPath}`;
      const fileName = getCleanFileName(fileUrl);

      await Share.open({
        title: route?.params?.title || 'Share File',
        url: formattedUrl,
        type: 'application/pdf',
        filename: fileName,
        failOnCancel: false,
      });
    } catch (err) {
      console.log('Share error:', err);
    }
  };

  const promptSaveOrShare = targetUrl => {
    const fileUrl = targetUrl || route?.params?.url;
    Alert.alert(
      route?.params?.title || 'Download Options',
      'Choose an action:',
      [
        {
          text: 'Save to Files',
          onPress: () => handleSaveToFiles(fileUrl),
        },
        {
          text: 'Share',
          onPress: () => handleShare(fileUrl),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const markDownloadClicked = () => {
    userClickedDownloadRef.current = true;
    if (userClickedDownloadTimeoutRef.current) {
      clearTimeout(userClickedDownloadTimeoutRef.current);
    }
    userClickedDownloadTimeoutRef.current = setTimeout(() => {
      userClickedDownloadRef.current = false;
    }, 3000);
  };

  // Intercept ONLY clicks on download buttons inside the WebView DOM
  const injectedDownloadInterceptor = `
    (function() {
      var originalWindowOpen = window.open;
      window.open = function(url) {
        if (url && window.__swaUserClickedDownload) {
          window.__swaUserClickedDownload = false;
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'USER_CLICKED_DOWNLOAD', url: url }));
          return null;
        }
        return originalWindowOpen.apply(this, arguments);
      };

      function attachDownloadInterceptor() {
        var elements = document.querySelectorAll('a, button, div, span, input[type="button"]');
        for (var i = 0; i < elements.length; i++) {
          var el = elements[i];
          var text = (el.innerText || el.textContent || el.value || '').trim().toLowerCase();
          var isDownloadBtn = text === 'download' || text === '↓ download' || text.indexOf('download') !== -1;

          if (isDownloadBtn && !el.__swaDownloadHooked) {
            // Only attach to leaf/clickable elements, avoid attaching to large containers
            if (el.children.length <= 2) {
              el.__swaDownloadHooked = true;
              el.addEventListener('click', function(e) {
                window.__swaUserClickedDownload = true;
                setTimeout(function() {
                  window.__swaUserClickedDownload = false;
                }, 3000);

                var href = el.getAttribute('href') || el.getAttribute('data-url') || el.getAttribute('data-href') || '';
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'USER_CLICKED_DOWNLOAD',
                  url: href
                }));
              }, true);
            }
          }
        }
      }

      attachDownloadInterceptor();
      setInterval(attachDownloadInterceptor, 600);
    })();
    true;
  `;

  const handleWebViewMessage = event => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'USER_CLICKED_DOWNLOAD') {
        markDownloadClicked();

        // If the clicked element had a direct file link (e.g. href="something.pdf")
        if (data.url && data.url !== '#' && !data.url.startsWith('javascript:')) {
          let fullUrl = data.url;
          if (fullUrl.startsWith('/')) {
            fullUrl = 'https://swaadhyayan.com' + fullUrl;
          } else if (!fullUrl.startsWith('http')) {
            const base = route?.params?.url
              ? route.params.url.substring(0, route.params.url.lastIndexOf('/') + 1)
              : 'https://swaadhyayan.com/';
            fullUrl = base + fullUrl;
          }
          userClickedDownloadRef.current = false;
          promptSaveOrShare(fullUrl);
        }
      }
    } catch (err) { }
  };

  const handleShouldStartLoadWithRequest = request => {
    const reqUrl = request.url;
    const initialUrl = route?.params?.url;

    if (
      !reqUrl ||
      reqUrl === 'about:blank' ||
      reqUrl === initialUrl ||
      reqUrl.startsWith('blob:')
    ) {
      return true;
    }

    // ONLY intercept and show Save/Share if user explicitly clicked the blue Download button!
    if (userClickedDownloadRef.current) {
      userClickedDownloadRef.current = false;
      promptSaveOrShare(reqUrl);
      return false; // Prevent opening raw full view in webview!
    }

    // Otherwise, allow all other page navigations, audio files, redirects, scripts completely
    return true;
  };

  return (
    <SafeAreaProvider
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: userData.data.colors.mainTheme,
        marginBottom: insets.bottom,
      }}
    >
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
      <SwaHeader
        title={route?.params?.title.replace('<br>', '')}
        leftIcon={'arrowleft'}
        onClickLeftIcon={onClickLeftIcon}
        onClickRightIcon={onClickRightIcon}
      />
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingBox}>
            <ActivityIndicator
              size="large"
              color={userData?.data?.colors?.mainTheme || '#0d6efd'}
            />
            <Text style={styles.processingText}>
              {processingMsg || 'Processing...'}
            </Text>
          </View>
        </View>
      )}
      {!isClosing && (
        <WebView
          ref={webViewRef}
          source={{ uri: route?.params?.url }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          injectedJavaScript={injectedDownloadInterceptor}
          onMessage={handleWebViewMessage}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          style={{ flex: 1 }}
        />
      )}
    </SafeAreaProvider>
  );
};

export default ActivityView;

const styles = StyleSheet.create({
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  processingBox: {
    paddingVertical: 20,
    paddingHorizontal: 26,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  processingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#222222',
    fontWeight: '600',
  },
});
