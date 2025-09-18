import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Image, Button } from "react-native"
import { useEffect, useState, useContext } from "react"
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import ImageViewer from "../../../common/ImageViewer"
import { apiRoot, SWATheam } from "../../../../constant/ConstentValue"
import { GlobleData } from "../../../../Store"
import Services from "../../../../Services"
import Loader from "../../../common/Loader"


const CheckedHomeWork = () => {
    const { userData } = useContext(GlobleData)
    const [loading, setLoading] = useState(false)
    const [checkedHomeWork, setCheckedHomeWork] = useState({ data: null, status: false })
    const [fileType, setFileType] = useState({ data: null, type: '', fileSrc: null, status: false })

    useEffect(() => {
        getCheckedHomeWork()
    }, [])

    const getCheckedHomeWork = () => {
        setLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "userRefID": userData.data.userRefID,
            "userTypeID": userData.data.userTypeID,
            "classID": userData.data.classID,
            "sectionID": userData.data.sectionID
        }
        Services.post(apiRoot.getCheckedHomeworkStudent, payload)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    const data = res.data
                    setCheckedHomeWork((prev) => {
                        return { ...prev, data: data, status: true }
                    })
                } else {
                    setLoading(false)
                    // alert(res.message)
                    setCheckedHomeWork({ data: null, status: false })
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const viewFile = (item, type) => {
        if (item != null) {
            if (type == 1) {
                const fType = item.submittedBy.uploadedFile.split('.')
                const itemLowerCase = fType[fType.length - 1].toLowerCase()
                setFileType((prev) => {
                    return { ...prev, data: item, type: itemLowerCase, fileSrc: item.submittedBy.uploadedFile, status: true }
                })
            }
            else if (type == 2) {
                const fType = item.checkedBy.checkedFile.split('.')
                const itemLowerCase = fType[fType.length - 1].toLowerCase()
                setFileType((prev) => {
                    return { ...prev, data: item, type: itemLowerCase, fileSrc: item.checkedBy.checkedFile, status: true }
                })
            }
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {loading ?
                <Loader /> :
                <View style={{ padding: 10, flex: 1 }}>
                    <ScrollView>
                        {
                            checkedHomeWork.status ?
                                <View>
                                    {
                                        checkedHomeWork.data.map((item, index) => {
                                            const fileName = item.uploadFileName
                                            return (
                                                <View style={{ borderWidth: .7, borderColor: 'grey', marginBottom: 5, borderRadius: 5, padding: 5, backgroundColor: SwaTheam.SwaWhite }} key={index}>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 120, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Class </Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, }}>
                                                            <Text style={{ color: '#000', fontSize: 14 }}>{item.submittedBy.className}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 120, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Subject </Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, }}>
                                                            <Text style={{ color: '#000', fontSize: 14 }}>{item.subjectName}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 120, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Description</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, }}>
                                                            <Text style={{ color: '#000', fontSize: 14 }}>{item.homeworkDesc}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 120, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Checked By</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, }}>
                                                            <Text style={{ color: '#000', fontSize: 14 }}>{item.checkedBy.fullName}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 120, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Assign Date</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: '#000', fontSize: 14 }}>{item.startDate}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 120, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Submission Date</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: '#000', fontSize: 14 }}>{item.submittedBy.submissionDate}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 120, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Status</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: '#000', fontSize: 14 }}>Checked</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5, borderTopWidth: .7, borderColor: 'grey', marginTop: 5 }}>
                                                        <TouchableOpacity style={{ backgroundColor: colorSwa, borderRadius: 5, paddingHorizontal: 5, marginRight: 5 }} onPress={() => viewFile(item, 1)}>
                                                            <Text style={{ color: '#fff', padding: 5 }}>Atached File</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ backgroundColor: colorSwa, borderRadius: 5, paddingHorizontal: 5, marginRight: 5 }} onPress={() => viewFile(item, 2)}>
                                                            <Text style={{ color: '#fff', padding: 5 }}>Checked File</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                                :
                                <View style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 5, backgroundColor: SWATheam.SwaWhite }}>
                                    <Text style={{ color: 'red', fontSize: 14, textAlign: 'center', padding: 5 }}>Homework not available</Text>
                                </View>
                        }
                    </ScrollView>
                </View>
            }
            {fileType.status &&
                <ImageViewer fileType={fileType} setFileType={setFileType} />
            }

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
    },

    description: {
        height: 100,
        borderWidth: 1,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        padding: 8,
        marginBottom: 7,
        textAlignVertical: 'top'
    },

    urlInput: {
        height: 100,
        borderWidth: 1,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 50,
        padding: 8,
        marginBottom: 7,
        textAlignVertical: 'top'
    },

});

export default CheckedHomeWork

