import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Image, Button } from "react-native"
import { useEffect, useState, useContext } from "react"
import AntDesign from 'react-native-vector-icons/AntDesign'
import ImageViewer from "../../../common/ImageViewer"
import HWPdfViewer from "../../../common/HWPdfViewer"
import YouTubeUrlView from "../../../common/YoutubeUrlView";
import DocumentPicker from 'react-native-document-picker';
import { apiRoot, SwaTheam } from "../../../../constant/ConstentValue"
import { GlobleData } from "../../../../Store"
import Services from "../../../../Services"
import Loader from "../../../common/Loader"

const SubmittedHomeWork = () => {
    const { userData } = useContext(GlobleData)
    const [submittedHomeWork, setSubmittedHomeWork] = useState({ data: null, status: false })
    const [fileType, setFileType] = useState({ data: null, type: '', fileSrc: null, status: false })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getSubmittedHomeWork()
    }, [])

    const getSubmittedHomeWork = () => {
        setLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "userRefID": userData.data.userRefID,
            "classID": userData.data.classID,
            "sectionID": userData.data.sectionID,
            "isSubmit": 0
        }
        Services.post(apiRoot.getCreatedHomeworkStudent, payload)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    const data = res.data
                    setSubmittedHomeWork((prev) => {
                        return { ...prev, data: data, status: true }
                    })
                } else {
                    setLoading(false)
                    alert(res.message)
                    setSubmittedHomeWork({ data: null, status: false })
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const viewFile = (item) => {
        if (item.fileType != null) {
            const fType = item.assignedfilePath.split('.')
            const itemLowerCase = fType[fType.length - 1].toLowerCase()
            setFileType((prev) => {
                return { ...prev, data: item, type: itemLowerCase, fileSrc: item.assignedfilePath, status: true }
            })
        }
    }

    return (
        <>
            {loading ?
                <Loader /> :
                <View style={{ flex: 1, padding: 10 }}>
                    <ScrollView>
                        {
                            submittedHomeWork.status ?
                                <View>
                                    {
                                        submittedHomeWork.data.map((item, index) => {
                                            const fileName = item.uploadFileName
                                            console.log(item, 'item')
                                            return (
                                                <View style={{ borderWidth: .7, borderColor: 'grey', marginBottom: 10, borderRadius: 5, padding: 5, backgroundColor: SwaTheam.SwaWhite }} key={index}>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 120, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Class </Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, }}>
                                                            <Text style={{ color: '#000', fontSize: 14 }}>{item.className}</Text>
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
                                                            <Text style={{ color: '#000', fontSize: 14 }}>{item.homeWorkDesc}</Text>
                                                        </View>
                                                    </View>
                                                    {item.uploadFileName != null ?
                                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                            <View style={{ width: 120, }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Attached File</Text>
                                                            </View>
                                                            <View style={{ paddingRight: 10 }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                            </View>
                                                            <View style={{ flex: 1, }}>
                                                                <Text style={{ color: '#000', fontSize: 14 }}>{fileName}</Text>
                                                            </View>
                                                        </View> : null
                                                    }
                                                    {item.youTubeUrl != null ?
                                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                            <View style={{ width: 120, }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Youtube Url</Text>
                                                            </View>
                                                            <View style={{ paddingRight: 10 }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                            </View>
                                                            <View style={{ flex: 1, }}>
                                                                <Text style={{ color: '#000', fontSize: 14 }}>{item.youTubeUrl}</Text>
                                                            </View>
                                                        </View> : null
                                                    }
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 120, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Assign Date</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: '#000', fontSize: 14 }}>{item.assignedDate}</Text>
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
                                                            <Text style={{ color: '#000', fontSize: 14 }}>{item.submissionDate}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 120, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Assign By</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: '#000', fontSize: 14 }}>{item.teacherData.fullName}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5, borderTopWidth: .7, borderColor: 'grey', marginTop: 5 }}>
                                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 5, paddingHorizontal: 10, marginRight: 5 }} onPress={() => viewFile(item)}>
                                                            <Text style={{ color: '#fff', padding: 5 }}>View</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                                :
                                <View style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 5 }}>
                                    <Text style={{ color: 'red', fontSize: 14, textAlign: 'center', padding: 5 }}>Homework not available</Text>
                                </View>
                        }
                    </ScrollView>
                </View>
            }

            {(fileType.status && fileType.type == 'image' || fileType.type == 'png' || fileType.type == 'jpg' || fileType.type == 'jpeg') &&
                <ImageViewer fileType={fileType} setFileType={setFileType} />
            }


            {(fileType.status && fileType.type == 'pdf') &&
                <HWPdfViewer colorSwa={userData.data.colors.mainTheme} fileType={fileType} setFileType={setFileType} />
            }

            {(fileType.status && fileType.type == 'url') &&
                <YouTubeUrlView fileType={fileType} colorSwa={userData.data.colors.mainTheme} setFileType={setFileType} />
            }

        </>


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

export default SubmittedHomeWork

