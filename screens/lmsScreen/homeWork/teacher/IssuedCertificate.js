import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Image, Button } from "react-native"
import { useEffect, useState, useContext } from "react"
import HWPdfViewer from "../../../common/HWPdfViewer"
import { GlobleData } from "../../../../Store"
import Services from "../../../../Services"
import { apiRoot, SWATheam } from "../../../../constant/ConstentValue"
import Loader from "../../../common/Loader"


const IssuedCertificate = () => {
    const { userData } = useContext(GlobleData)
    const [loading, setLoading] = useState(false)
    const [issuedCertificate, setIssuedCertificate] = useState({ data: null, status: false })
    const [fileType, setFileType] = useState({ data: null, type: '', fileSrc: null, status: false })

    useEffect(() => {
        getIssuedCertificates()
    }, [])

    const getIssuedCertificates = () => {
        setLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "userRefID": userData.data.userRefID,
            "userTypeID": userData.data.userTypeID,
            "certificateData": 0
        }
        Services.post(apiRoot.getIssuedCertificate, payload)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    const data = res.data
                    setIssuedCertificate((prev) => {
                        return { ...prev, data: data, status: true }
                    })
                } else {
                    setLoading(false)
                    // alert(res.message)
                    setIssuedCertificate({ data: null, status: false })
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const deleteIssuedCertificate = (item) => {
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "userRefID": userData.data.userRefID,
            "userTypeID": userData.data.userTypeID,
            "certificateID": item.certificateID
        }
        Services.post(apiRoot.deleteCertificate, payload)
            .then((res) => {

                if (res.status == "success") {
                    alert(res.message)
                    getIssuedCertificates()
                } else {
                    alert(res.message)
                }
            })

    }

    const viewFile = (item) => {
        setLoading(true)
        const payload = {
            "schoolCode": item.schoolCode,
            "userRefID": item.createdFor,
            "userTypeID": 5,
            "classID": item.classID,
            "sectionID": item.sectionID,
            "subjectID": item.subjectID,
            "certificateID": item.certificateID
        }
        Services.post(apiRoot.getCertificatePdf, payload)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    setFileType((prev) => {
                        return { ...prev, data: res.data, type: 'pdf', status: true, from: 'certificate' }
                    })
                } else {
                    setLoading(false)
                    alert(res.message)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <>
            {loading ?
                <Loader /> :
                <>
                    <View style={{ flex: 1, padding: 10 }}>
                        <ScrollView>
                            {
                                issuedCertificate.status ?
                                    <View>
                                        {
                                            issuedCertificate.data.map((item, index) => {
                                                return (
                                                    <View style={{ borderWidth: .7, borderColor: userData.data.colors.mainTheme, marginBottom: 5, borderRadius: 5, padding: 10, backgroundColor: SWATheam.SwaWhite }} key={index}>
                                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                            <View style={{ width: 120 }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Class</Text>
                                                            </View>
                                                            <View style={{ paddingRight: 10 }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                            </View>
                                                            <View style={{ flex: 1 }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.className}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                            <View style={{ width: 120 }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Section </Text>
                                                            </View>
                                                            <View style={{ paddingRight: 10 }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                            </View>
                                                            <View style={{ flex: 1, }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.sectionName}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                            <View style={{ width: 120, }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Subject </Text>
                                                            </View>
                                                            <View style={{ paddingRight: 10 }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                            </View>
                                                            <View style={{ flex: 1, }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.subjectName}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                            <View style={{ width: 120, }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Student Name </Text>
                                                            </View>
                                                            <View style={{ paddingRight: 10 }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                            </View>
                                                            <View style={{ flex: 1, }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.studentName}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                            <View style={{ width: 120, }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Certificate Type </Text>
                                                            </View>
                                                            <View style={{ paddingRight: 10 }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                            </View>
                                                            <View style={{ flex: 1, }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.durationName}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                            <View style={{ width: 120, }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Month/Duration</Text>
                                                            </View>
                                                            <View style={{ paddingRight: 10 }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                            </View>
                                                            <View style={{ flex: 1, }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.durationValue}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                            <View style={{ width: 120, }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Issued On</Text>
                                                            </View>
                                                            <View style={{ paddingRight: 10 }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                            </View>
                                                            <View style={{ flex: 1, }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.createdDate}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5, borderTopWidth: .7, borderColor: 'grey', marginTop: 5 }}>
                                                            <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 5, paddingHorizontal: 5, marginRight: 5 }} onPress={() => viewFile(item)}>
                                                                <Text style={{ color: SWATheam.SwaWhite, padding: 5 }}>View</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={{ backgroundColor: '#dc3545', borderRadius: 5, paddingHorizontal: 5, marginRight: 5 }} onPress={() => deleteIssuedCertificate(item)}>
                                                                <Text style={{ color: SWATheam.SwaWhite, padding: 5 }}>Delete</Text>
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
                    {(fileType.status && fileType.type == 'pdf') &&
                        <HWPdfViewer colorSwa={userData.data.colors.mainTheme} fileType={fileType} setFileType={setFileType} />
                    }
                </>
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

export default IssuedCertificate

