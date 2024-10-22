import React, { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign'
import Pdf from 'react-native-pdf';
import { WebView } from 'react-native-webview';
import { SWATheam } from "../../constant/ConstentValue";

const PdfViewer = ({ colorSwa, fileType, setFileType, downloadDoc }) => {
    let splitSrc = ""
    let fileName = ""
    let fileSrc = ""

    if (fileType.from == 'certificate') {
        fileName = 'Certificate'
        fileSrc = "data:application/pdf;base64," + fileType.data
    } else {
        splitSrc = fileType.fileSrc.split('/')
        fileName = splitSrc[splitSrc.length - 1]
        fileSrc = fileType.fileSrc
    }

    return (
        <View style={[styles.selectFieldPopUp, { alignItems: 'center' }]}>

            <View style={{ flex: 1, width: "100%", }}>
              
                <View style={{ flex: 1, }}>

                <View style={{ flexDirection: 'row',}}>
                    <View style={{ padding: 10, width: 50 }}>
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={{ backgroundColor: 'green', borderRadius: 10, padding: 10, width: 100 }} onPress={() => { downloadDoc(fileSrc, 'doc') }}>
                            <Text style={{ color: '#fff', textAlign: 'center' }}>Download</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ padding: 10, width: 50, justifyContent: 'center', alignItems: 'center' }} onPress={() => setFileType(false)}>
                        <AntDesign name={"close"} size={25} color={'#fff'} />
                    </TouchableOpacity>

                </View>

                    {fileType.type == 'pdf' &&
                        < Pdf
                            trustAllCerts={false}
                            source={{ uri: fileSrc }}
                            enableDoubleTapZoom={true}
                            // enablePaging={true}
                            style={styles.pdf}
                                
                            />
                    }

                    {fileType.type == 'doc' &&
                        <WebView source={{ uri: fileSrc }} style={{ flex: 1, }} />
                    }

                </View>

            </View>


            {/* <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', backgroundColor: colorSwa, position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 99, paddingVertical: 5, paddingStart: 5 }}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => setFileType(false)}>
                        <AntDesign name={'arrowleft'} size={30} color={SWATheam.SwaWhite} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '700', color: SWATheam.SwaWhite, textAlign: 'center', fontSize: 16 }}>{fileName}</Text>
                </View>
                <View style={{ flex: 1 }}></View>
            </View>

            {fileType.type == 'pdf' &&
                < Pdf
                    trustAllCerts={false}
                    source={{ uri: fileSrc }}
                    enableDoubleTapZoom={true}
                    // enablePaging={true}
                    style={styles.pdf} />
            }

            {fileType.type == 'doc' &&
                <WebView source={{ uri: fileSrc }} style={{ flex: 1, marginTop: 45 }} />
            } */}

        </View>
    )
}

const styles = StyleSheet.create({
    headerText: {
        fontSize: 20,
        marginBottom: 5,
        fontWeight: 'bold',
        color: '#000',
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'center'
    },

    flexContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },

    BtextClr: {
        color: '#000'
    },

    thClr: {
        color: '#654b25'
    },

    colorSwa: {
        color: '#0c8781'
    },

    WtextClr: {
        color: '#fff'
    },

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

