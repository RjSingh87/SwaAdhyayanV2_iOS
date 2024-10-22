import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native"
import { useEffect, useState, useContext} from "react"
import HWPdfViewer from "../../../common/HWPdfViewer"
import { apiRoot, SwaTheam } from "../../../../constant/ConstentValue"
import { GlobleData } from "../../../../Store"
import Services from "../../../../Services"
import Loader from "../../../common/Loader"

const CertificateAwarded = () => {
    const {userData} = useContext(GlobleData)
    const [loading, setLoading] = useState(false)
    const [certificate, setCertificate] = useState({ data: null, status: false })
    const [fileType, setFileType] = useState({ data: null, type: '', fileSrc: null, status: false })

    useEffect(() => {
        getCertificateData()
    }, [])

    const getCertificateData = () => {
        setLoading(true)
        const payload = {
                "schoolCode": userData.data.schoolCode,
                "userRefID": userData.data.userRefID,
                "userTypeID": userData.data.userTypeID,
                "certificateData": 0
        }
        Services.post(apiRoot.getAwardedCertificateStudent, payload)
        .then((res) => {
            if (res.status == "success") {
                setLoading(false)
                const data = res.data
                setCertificate((prev) => {
                    return { ...prev, data: data, status: true }
                })
            } else {
                setLoading(false)
                // alert(res.message)
                setCertificate({ data: null, status: false })
            }
        })
        .catch((err)=>{
            console.log(err)
        })
        .finally(()=>{
            setLoading(false)
        })
       
    }

    const getCertificatePdf = (item) => {
        setLoading(true)
        const payload = {
           "schoolCode": userData.data.schoolCode,
                "userRefID": userData.data.userRefID,
                "userTypeID": userData.data.userTypeID,
                "classID": item.classID,
                "sectionID": item.sectionID,
                "subjectID": item.subjectID,
                "certificateID": item.certificateID
        }
        Services.post(apiRoot.getCertificatePdf, payload)
        .then((res) => {
            if (res.status == "success"){
                setLoading(false)
                setFileType((prev) =>{
                    return { ...prev, data: res.data, type: 'pdf', status: true, from: 'certificate'}
                })
            } else {
                setLoading(false)
                alert(res.message)
            }
        })
        .catch((err)=>{
            console.log(err)
        })
        .finally(()=>{
          setLoading(false)
        })
    }

    return (
        <>
        {loading?
        <Loader/>:
            <View style={{ flex: 1, padding:10}}>
                    <ScrollView>
                        {
                            certificate.status ?
                                <View>
                                    {
                                        certificate.data.map((item, index) => {
                                            const fileName = item.uploadFileName
                                            return (
                                                <View style={{ borderWidth: .7, borderColor: 'grey', marginBottom: 10, borderRadius: 5, padding: 5, backgroundColor:SwaTheam.SwaWhite }} key={index}>
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
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Section </Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, }}>
                                                            <Text style={{ color: '#000', fontSize: 14 }}>{item.sectionName}</Text>
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
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Teacher Name</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, }}>
                                                            <Text style={{ color: '#000', fontSize: 14 }}>{item.teacherName}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 120, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Certificate Type</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, }}>
                                                            <Text style={{ color: '#000', fontSize: 14 }}>{item.durationName}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 120, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Month/Duration</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: '#000', fontSize: 14 }}>{item.durationValue}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 120, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Issued On</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: '#000', fontSize: 14 }}>{item.createdDate}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5, borderTopWidth: .7, borderColor: 'grey', marginTop: 5 }}>
                                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 5, paddingHorizontal: 5, marginRight: 5 }} onPress={() => getCertificatePdf(item)}>
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
                {(fileType.status && fileType.type == 'pdf') &&
                    <HWPdfViewer colorSwa={userData.data.colors.mainTheme} fileType={fileType} setFileType={setFileType} />
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

export default CertificateAwarded

