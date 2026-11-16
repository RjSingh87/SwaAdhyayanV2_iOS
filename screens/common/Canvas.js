import React, { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions, Button, TextInput } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign'
import Signature from "react-native-signature-canvas";
import SignatureScreen from "react-native-signature-canvas";
import { useRef } from "react";
import { useState } from "react";

const Canvas = ({ imgPath, imgDataUri, setShowCanvas, colorSwa }) => {

    const ref = useRef();
    const [signature, setSign] = useState(null);
    const [postMessage, setPostMessage] = useState('')

    const handleOK = (signature) => {
        setSign(signature);
    };

    const handleClear = () => {
        ref.current.clearSignature();
    };

    const handleConfirm = () => {
        ref.current.readSignature();
        setShowCanvas(false)
    };

    const imgWidth = '100%'
    const imgHeight = '100%'

    const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

    return (

        <View style={[styles.selectFieldPopUp, { alignItems: 'center' }]}>
            <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5, zIndex: 9 }} onPress={() => setShowCanvas(false)}>
                <AntDesign name={"close"} size={25} color={'#000'} />
            </TouchableOpacity>
            <View style={[styles.preview, { borderBottomWidth: 1, borderColor: 'grey' }]}>
                {signature ?
                    <Image
                        resizeMode="contain"
                        style={{ width: 300, height: '100%' }}
                        source={{ uri: signature }}
                    />
                    : <Text>Preview</Text>
                }
            </View>
            <View style={{ flex: 1, width: 370 }}>
                <View style={{ height: '10%', backgroundColor: '#fff' }}></View>
                <SignatureScreen
                    onOK={handleOK}
                    // onClear={handleClear}
                    ref={ref}
                    dataURL={imgDataUri}
                    descriptionText="Check"
                    clearText="Clear"
                    confirmText="Save"
                    bgSrc={imgPath}
                    bgWidth={imgWidth}
                    bgHeight={imgHeight}
                    penColor={'#dc3545'}
                    webStyle={style}
                    style={{ borderWidth: .7, borderColor: 'grey' }}
                />
                <View style={{ height: '50.9%', marginTop: 5 }}>
                    <Text style={{ color: '#000' }}>Comment</Text>
                    <TextInput onChangeText={setPostMessage} value={postMessage} style={[styles.input, { color: 'grey', borderRadius: 5, height: 90, borderWidth: .7, textAlignVertical: 'top', borderColor: 'grey', marginTop: 5 }]}
                        multiline={true}
                        numberOfLines={4}
                        maxLength={250}
                        placeholder='Type Comment...' />
                </View>
                <View style={{ flexDirection: 'row', position: 'absolute', bottom: 10, width: '100%', justifyContent: 'space-around', borderTopWidth: 1, paddingTop: 10, borderColor: 'grey' }}>
                    {/* <TouchableOpacity style={{ backgroundColor: colorSwa, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleClear}><Text style={{ color: '#fff' }}>Clear</Text></TouchableOpacity> */}
                    <TouchableOpacity style={{ backgroundColor: colorSwa, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleConfirm}><Text style={{ color: '#fff' }}>Save</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    );
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
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    },

    preview: {
        width: '100%',
        height: 200,
        backgroundColor: "#F8F8F8",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        display: 'none',
    }
})

export default Canvas

