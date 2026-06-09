import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { WebView } from 'react-native-webview';
import Share from 'react-native-share';

const PdfViewer = ({ fileType, setFileType, downloadDoc }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [showWebView, setShowWebView] = useState(true);

    const sharePDf = async () => {
        try {
            const shareOption = {
                url: fileType?.fileSrc,
                filename: 'certificate'
            };

            await Share.open(shareOption);

        } catch (error) {
            console.log("Share Error :", error);
        }
    };

    const closePdf = () => {

        setShowWebView(false);

        setTimeout(() => {
            setFileType({
                data: null,
                type: '',
                fileSrc: null,
                status: false,
            });
        }, 100);
    };

    let fileName = "";
    let fileSrc = "";

    try {

        if (fileType?.from === 'certificate') {

            fileName = 'Certificate';

            fileSrc =
                "data:application/pdf;base64," + fileType?.data;

        } else {

            const splitSrc = fileType?.fileSrc?.split('/') || [];

            fileName = splitSrc[splitSrc.length - 1] || 'document.pdf';

            // Homework PDF URL
            fileSrc = fileType?.fileSrc;
        }

    } catch (err) {
        console.log("PDF Source Error :", err);
    }

    console.log("PDF SOURCE => ", fileSrc);

    return (
        <View style={[styles.selectFieldPopUp, { alignItems: 'center' }]}>

            <View style={{ flex: 1, width: '100%' }}>

                {/* Header */}
                <View style={{ flexDirection: 'row' }}>

                    <View style={{ width: 50 }} />

                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <TouchableOpacity
                            style={styles.downloadBtn}
                            onPress={() => {

                                if (
                                    fileType?.from === 'certificate' ||
                                    fileType?.from === 'base64'
                                ) {

                                    sharePDf();

                                } else {

                                    downloadDoc(fileSrc, 'doc');
                                }
                            }}
                        >
                            <Text style={{ color: '#fff', textAlign: 'center' }}>
                                Download
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={closePdf}
                    >
                        <AntDesign
                            name="close"
                            size={25}
                            color="#fff"
                        />
                    </TouchableOpacity>

                </View>

                {/* Loader */}
                {isLoading && (
                    <View style={styles.loaderContainer}>
                        <Text style={{ color: '#fff' }}>
                            Loading PDF...
                        </Text>
                    </View>
                )}

                {/* PDF */}
                {
                    showWebView &&
                    fileType?.type === 'pdf' &&
                    fileSrc &&
                    (
                        <WebView
                            originWhitelist={['*']}
                            source={{ uri: fileSrc }}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            startInLoadingState={true}
                            onLoadStart={() => setIsLoading(true)}
                            onLoadEnd={() => setIsLoading(false)}
                            onError={(e) => {
                                console.log(
                                    "PDF WebView Error =>",
                                    e.nativeEvent
                                );
                                setIsLoading(false);
                            }}
                            style={{ flex: 1 }}
                        />
                    )
                }

                {/* DOC */}
                {
                    showWebView &&
                    fileType?.type === 'doc' &&
                    fileSrc &&
                    (
                        <WebView
                            source={{ uri: fileSrc }}
                            onLoadEnd={() => setIsLoading(false)}
                            onError={(e) => {
                                console.log(
                                    "DOC WebView Error =>",
                                    e.nativeEvent
                                );
                                setIsLoading(false);
                            }}
                            style={{ flex: 1 }}
                        />
                    )
                }

            </View>

        </View>
    );
};

const styles = StyleSheet.create({

    selectFieldPopUp: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        flex: 1,
    },

    downloadBtn: {
        backgroundColor: 'green',
        borderRadius: 10,
        padding: 10,
        width: 100,
    },

    closeBtn: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },

    loaderContainer: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        zIndex: 999,
        alignItems: 'center',
    },

});

export default PdfViewer;