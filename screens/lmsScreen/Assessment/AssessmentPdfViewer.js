import { StyleSheet, Text, View, Dimensions, Share, TouchableOpacity, Platform, Button, Alert } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { SWATheam } from '../../../constant/ConstentValue';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobleData } from '../../../Store';
import WebView from 'react-native-webview';
import RNPrint from "react-native-print";
import { ActivityIndicator } from 'react-native-paper';
import SwaHeader from '../../common/SwaHeader';





const AssessmentPdfViewer = ({ navigation, route }) => {
    const webviewRef = useRef();
    const { userData } = useContext(GlobleData)
    const [htmlLoader, setHtmlLoader] = useState(false)
    const htmlData = route.params.data

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
        if (!htmlContent) return
        setTimeout(async () => {
            await RNPrint.print({ html: htmlContent });
        }, 1000)
    };

    function onClickLeftIcon() {
        navigation.goBack()
    }

    const queSet = [
        {
            qHead: "Fill in the blanks",
            opation: ["one", "two", "three", "four"],
            ans: [2]
        },
        {
            qHead: "Match the following questions.",
            opation: ["five", "six", "seven", "eight"],
            ans: [3]
        },
        {
            qHead: "Drag and drop the questions.",
            opation: ["nine", "two", "three", "four"],
            ans: [1]
        },
        {
            qHead: "Jumble the questions.",
            opation: ["ten", "two", "three", "four"],
            ans: [4]
        }
    ]

    const intialQues = 0

    const renderQues = {

    }




    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['left', 'right', 'top']} style={{ flex: 1, backgroundColor: userData?.data?.colors?.mainTheme }}>
                <SwaHeader title={'View Assessment'} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} />
                <View style={styles.container}>

                    <View style={{ flex: 1 }}>
                        <WebView
                            ref={webviewRef}
                            source={{ html: htmlContent }}
                            style={{ flex: 1, }}
                            originWhitelist={['*']}
                            onLoadEnd={() => setHtmlLoader(true)}
                        />

                        {!htmlContent ?
                            <View style={{ position: "absolute", top: 0, bottom: 0, justifyContent: "center", width: "100%" }}><ActivityIndicator size={"large"} color={SWATheam.SwaBlue} /></View> :
                            <TouchableOpacity disabled={!htmlLoader} onPress={handlePrint} style={{ paddingHorizontal: 15, paddingVertical: 10, backgroundColor: userData?.data?.colors?.mainTheme, borderRadius: 8, alignSelf: "center" }}>
                                <Text style={{ color: SWATheam.SwaWhite, fontWeight: "600", fontSize: 15 }}>Print/Save</Text>
                            </TouchableOpacity>
                        }
                    </View>

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
        paddingBottom: 30,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
})