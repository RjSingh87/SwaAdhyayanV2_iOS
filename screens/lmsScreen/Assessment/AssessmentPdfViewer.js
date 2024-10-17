import { StyleSheet, Text, View, Dimensions, Share, TouchableOpacity, Platform } from 'react-native'
import React, { useContext } from 'react'
import Pdf from 'react-native-pdf'
// import Share from 'react-native-share'
import { SWATheam } from '../../../constant/ConstentValue';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobleData } from '../../../Store';



const AssessmentPdfViewer = ({ navigation, route }) => {
    const { userData } = useContext(GlobleData)
    const pdfData = route.params.data
    const source = { uri: "data:application/pdf;base64," + pdfData };
    const share = async () => {
        const content = {
            url: 'data:application/pdf;base64,' + pdfData,
            message: 'invoice'
        };
        const options = {
            excludedActivityTypes: ['com.apple.UIKit.activity.PostToFacebook'],
            tintColor: '#ff00ff',
            subject: "a subject to share via email"
        };
        try {
            const result = await Share.share(content, options);
            console.log('Share successful:', result);
        } catch (error) {
            console.log('Error while sharing:', error);
        }
        // try {
        //     const shareOption = {
        //         url: 'data:application/pdf;base64,' + pdfData,
        //         filename: 'invoice'
        //     }
        //     await Share.open(shareOption)
        // } catch (error) {
        //     console.log(error)
        // }
    }

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

                    <Pdf
                        trustAllCerts={false}
                        source={source}
                        onLoadComplete={(numberOfPages, filePath) => {
                            // console.log(`Number of pages: ${numberOfPages}`);
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
                    />
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