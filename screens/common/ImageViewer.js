import React, { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign'
const ImageViewer = ({ fileType, setFileType, downloadDoc, type }) => {
    console.log(JSON.stringify(type), 'type')
    return (
        <View style={[styles.selectFieldPopUp, { alignItems: 'center' }]}>
            <View style={{ flex: 1, width: "100%", }}>

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ padding: 10, width: 50 }}>
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {type != "sharing" ?
                            <TouchableOpacity style={{ backgroundColor: 'green', borderRadius: 10, padding: 10, width: 100 }} onPress={() => { downloadDoc(fileType.fileSrc, 'img') }}>
                                <Text style={{ color: '#fff', textAlign: 'center' }}>Download</Text>
                            </TouchableOpacity> : null
                        }
                    </View>
                    <TouchableOpacity style={{ padding: 10, width: 50, justifyContent: 'center', alignItems: 'center' }} onPress={() => setFileType(false)}>
                        <AntDesign name={"close"} size={25} color={'#fff'} />
                    </TouchableOpacity>

                </View>
                {/* <TouchableOpacity style={{position: 'absolute', top: 5, right: 5}} onPress={() => setFileType(false)}>
                        <AntDesign name={"close"} size={25} color={'#fff'} />
                    </TouchableOpacity> */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: '80%', height: '80%', resizeMode: 'center' }} source={{ uri: fileType.fileSrc }} />
                </View>

            </View>
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
        justifyContent: 'center'
    }

});

export default ImageViewer

