import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { WebView } from 'react-native-webview';

const UrlView = ({ fileType, colorSwa, setFileType }) => {
    const videoUrl = fileType.data.youTubeUrl
    return (
        <View style={[styles.selectFieldPopUp, { justifyContent: 'center' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colorSwa, position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 99, paddingVertical: 10, paddingStart: 5 }}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => setFileType(false)}>
                        <AntDesign name={'arrowleft'} size={25} color={'#fff'} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: '#fff', textAlign: 'center' }}>{videoUrl}</Text>
                </View>
                <View style={{ flex: 1 }}></View>
            </View>
            <WebView source={{ uri: videoUrl }} style={{ flex: 1, marginTop: 45 }} />
        </View>

    )
}

export default UrlView

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
    }

});