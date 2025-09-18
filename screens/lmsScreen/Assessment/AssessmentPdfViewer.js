import { StyleSheet, Text, View, Dimensions, Share, TouchableOpacity, Platform, Button } from 'react-native'
import React, { useContext, useRef } from 'react'
import Pdf from 'react-native-pdf'
// import Share from 'react-native-share'
import { SWATheam } from '../../../constant/ConstentValue';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobleData } from '../../../Store';
import WebView from 'react-native-webview';
import RNPrint from "react-native-print";




const AssessmentPdfViewer = ({ navigation, route }) => {
    const webviewRef = useRef();
    const { userData } = useContext(GlobleData)
    const htmlData = route.params.data
    // const source = { uri: "data:application/pdf;base64," + htmlData };
    // const share = async () => {
    //     const content = {
    //         url: 'data:application/pdf;base64,' + htmlData,
    //         message: 'invoice'
    //     };
    //     const options = {
    //         excludedActivityTypes: ['com.apple.UIKit.activity.PostToFacebook'],
    //         tintColor: '#ff00ff',
    //         subject: "a subject to share via email"
    //     };
    //     try {
    //         const result = await Share.share(content, options);
    //         console.log('Share successful:', result);
    //     } catch (error) {
    //         console.log('Error while sharing:', error);
    //     }
    // }

    const htmlContent = `
  <html>
    <head>
      <meta charset="utf-8" />
    </head>
    <body>
      ${htmlData}
    </body>
  </html>
`;

    const handlePrint = async () => {
        if (htmlData) {
            await RNPrint.print({
                html: `
    <html>
      <head>
        <style>
          @media print {
            body { -webkit-print-color-adjust: exact; }
            div.page { page-break-after: always; }
          }
        </style>
      </head>
      <body>
        <div class="page">${htmlData}</div>
      </body>
    </html>
  `
            })
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['left', 'right', 'top']} style={{ flex: 1, backgroundColor: userData?.data?.colors?.mainTheme }}>
                <View style={styles.container}>
                    <View style={{ padding: 10 }}>
                        <TouchableOpacity
                            onPress={() => share()}
                            style={{ padding: 10, borderRadius: 4, backgroundColor: SWATheam.SwaBlue }}
                        >
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: SWATheam.SwaWhite }}>Download & Share</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }}>
                        <WebView
                            ref={webviewRef}
                            originWhitelist={['*']}
                            source={{ html: htmlData }}
                            style={{ flex: 1 }}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            useWebKit={true}
                            allowsBackForwardNavigationGestures={true}
                            scrollEnabled={true}
                            bounces={false}
                            decelerationRate="normal"
                            contentMode="mobile"
                            setBuiltInZoomControls={true}
                        />

                        <Button title="Share Page" onPress={handlePrint} />

                    </View>

                    {/* <Pdf
                        trustAllCerts={false}
                        source={source}
                        onLoadComplete={(numberOfPages, filePath) => {
                        }}
                        onPageChanged={(page, numberOfPages) => {
                            console.log(`Current page: ${page}`);
                        }}
                        onError={(error) => {
                            console.log(error, 'pdferror');
                        }}
                        onPressLink={(uri) => {
                            console.log(`Link pressed: ${uri}`);
                        }}
                        style={styles.pdf}
                    /> */}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default AssessmentPdfViewer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        // alignItems: 'center',
        marginTop: Platform.OS == "ios" ? 0 : 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
})