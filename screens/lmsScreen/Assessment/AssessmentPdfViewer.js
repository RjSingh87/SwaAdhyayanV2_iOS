import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar } from 'react-native'
import React from 'react'
import Pdf from 'react-native-pdf'
import Share from 'react-native-share'
import { SWATheam } from '../../../constant/ConstentValue';


const AssessmentPdfViewer = ({ navigation, route }) => {
    const statusBarHeight = StatusBar.currentHeight
    const pdfData = route.params.data
    const source = { uri: "data:application/pdf;base64," + pdfData };
    const share = async () => {
        try {
            const shareOption = {
                url: 'data:application/pdf;base64,' + pdfData,
                filename: 'invoice'
            }
            await Share.open(shareOption)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: statusBarHeight, }}>

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
    )
}

export default AssessmentPdfViewer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        // alignItems: 'center',
        marginTop: 24,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
})