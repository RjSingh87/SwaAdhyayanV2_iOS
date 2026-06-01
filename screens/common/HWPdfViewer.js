import React, { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign';
import { WebView } from 'react-native-webview';
import Share from 'react-native-share'
import { useState } from "react";
import Loader from "./Loader";

const PdfViewer = ({ fileType, setFileType, downloadDoc }) => {

    const [isloading, setIsLoading] = useState(true)

    const sharePDf = async () => {
        try {
            const shareOption = {
                url: 'data:application/pdf;base64,' + fileType.data,
                filename: 'certificate'
            }
            await Share.open(shareOption)
        } catch (error) {
            console.log(error)
        }
    }
    let splitSrc = ""
    let fileName = ""
    let fileSrc = ""

    if (fileType.from == 'certificate') {
        fileName = 'Certificate'
        fileSrc = "data:application/pdf;base64," + fileType.data
    } else {
        splitSrc = fileType.fileSrc.split('/')
        fileName = splitSrc[splitSrc.length - 1]
        fileSrc = "data:application/pdf;base64," + fileType.data
        // fileSrc = fileType.fileSrc
    }

    return (
        <View style={[styles.selectFieldPopUp, { alignItems: 'center' }]}>
            <View style={{ flex: 1, width: "100%" }}>
                <View style={{ flex: 1, }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ padding: 10, width: 50 }}>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={{ backgroundColor: 'green', borderRadius: 10, padding: 10, width: 100 }} onPress={() => {
                                if (fileType.from == 'certificate' || fileType.from == "base64") {
                                    sharePDf()
                                } else {
                                    downloadDoc(fileSrc, 'doc',)
                                }
                            }}>
                                <Text style={{ color: '#fff', textAlign: 'center' }}>Download</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ padding: 10, width: 50, justifyContent: 'center', alignItems: 'center' }} onPress={() => setFileType(false)}>
                            <AntDesign name={"close"} size={25} color={'#fff'} />
                        </TouchableOpacity>
                    </View>

                    {/* {isloading && (
       <Loader/>
      )} */}

                    {fileType.type == 'pdf' &&
                        <WebView
                            originWhitelist={['*']}
                            source={{ uri: fileSrc }}
                            onLoadStart={() => setIsLoading(true)}
                            onLoadEnd={() => setIsLoading(false)}
                            onError={() => setIsLoading(false)}
                            style={{ flex: 1 }} />
                    }
                    {fileType.type == 'doc' &&
                        <WebView source={{ uri: fileSrc }} style={{ flex: 1 }} />
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    selectFieldPopUp: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        flex: 1
    },
    pdf: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }

});

export default PdfViewer

