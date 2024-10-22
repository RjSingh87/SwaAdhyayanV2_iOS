import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Image, Button } from "react-native"
import { useEffect, useState, useContext } from "react"

import ImageViewer from "../../../common/ImageViewer"
import Services from "../../../../Services"
import { apiRoot, SWATheam } from "../../../../constant/ConstentValue"
import { GlobleData } from "../../../../Store"
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
            "isChecked": 1
        }
        Services.post(apiRoot.getSubmittedHomeworkTeacher, payload)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    const data = res.data
                    setCheckedHomeWork((prev) => {
                        return { ...prev, data: data, status: true }
                    })
                } else {
                    setLoading(false)
                    alert(res.message)
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
                const fType = item.submittedHomework.studentUploaded.split('.')
                const itemLowerCase = fType[fType.length - 1].toLowerCase()
                setFileType((prev) => {
                    return { ...prev, data: item, type: itemLowerCase, fileSrc: item.submittedHomework.studentUploaded, status: true }
                })
            }
            else if (type == 2) {
                const fType = item.submittedHomework.checkedFile.split('.')
                const itemLowerCase = fType[fType.length - 1].toLowerCase()
                setFileType((prev) => {
                    return { ...prev, data: item, type: itemLowerCase, fileSrc: item.submittedHomework.checkedFile, status: true }
                })
            }
        }
    }

    return (
        <>
            <View style={{ flex: 1, padding: 10 }}>
                {loading ?
                    <Loader /> :
                    <ScrollView>
                        {
                            checkedHomeWork.status ?
                                <View>
                                    {
                                        checkedHomeWork.data.map((item, index) => {
                                            const fileName = item.uploadFileName
                                            return (
                                                <View style={{ borderWidth: .7, borderColor: userData.data.colors.mainTheme, marginBottom: 5, borderRadius: 5, padding: 8, backgroundColor: SWATheam.SwaWhite }} key={index}>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 100, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Name </Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.submittedHomework.submittedBy.fullName}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 100, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Class </Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.submittedHomework.submittedBy.className}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 100, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Section </Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.submittedHomework.submittedBy.sectionName}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 100, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Subject </Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.assignedHomeWork.subjectName}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 100, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Description</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.assignedHomeWork.checkedComment}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 100, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Created Date</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.assignedHomeWork.createdDate}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 100, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Submission Date</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.submittedHomework.submissionDate}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 100, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Status</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>Checked</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5, borderTopWidth: .7, borderColor: 'grey', marginTop: 5 }}>
                                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 5, paddingHorizontal: 5, marginRight: 5 }} onPress={() => viewFile(item, 1)}>
                                                            <Text style={{ color: SWATheam.SwaWhite, padding: 5 }}>Atached File</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 5, paddingHorizontal: 5, marginRight: 5 }} onPress={() => viewFile(item, 2)}>
                                                            <Text style={{ color: SWATheam.SwaWhite, padding: 5 }}>Checked File</Text>
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
                }

            </View>
            {fileType.status &&
                <ImageViewer fileType={fileType} setFileType={setFileType} />
            }
        </>
    )
}

const styles = StyleSheet.create({
    headerText: {
        fontSize: 20,
        marginBottom: 5,
        fontWeight: 'bold',
        color: SWATheam.SwaBlack,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'center'
    },

    flexContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },

    BtextClr: {
        color: SWATheam.SwaBlack
    },

    thClr: {
        color: '#654b25'
    },


    WtextClr: {
        color: SWATheam.SwaWhite
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

