import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Image, Button, PermissionsAndroid } from "react-native"
import { useEffect, useState, useContext } from "react"
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import ImageViewer from "../../../common/ImageViewer"
import HWPdfViewer from '../../../common/HWPdfViewer'
import YouTubeUrlView from "../../../common/YoutubeUrlView";
import Loader from "../../../common/Loader"
import { apiRoot, SWATheam } from "../../../../constant/ConstentValue"
import { GlobleData } from "../../../../Store"
import Services from "../../../../Services"
// import RNFetchBlob from 'rn-fetch-blob';


const AssignedHomeWork = () => {
    const { userData } = useContext(GlobleData)
    const [assignedHomework, setAssignedHomework] = useState({ data: null, status: false })
    const [fileType, setFileType] = useState({ data: null, type: '', fileSrc: null, status: false })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getAssignedHomeWork()
    }, [])

    const getAssignedHomeWork = () => {
        setLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "userRefID": userData.data.userRefID,
            "isAssigned": 1
        }
        Services.post(apiRoot.getCreatedHomework, payload)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    const data = res.data
                    setAssignedHomework((prev) => {
                        return { ...prev, data: data, status: true }
                    })
                } else {
                    setLoading(false)
                    alert(res.message)
                    setAssignedHomework({ data: null, status: false })
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })

    }

    const deleteAssignedHomeWork = (homeWorkID) => {
        setLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "userRefID": userData.data.userRefID,
            "homeWorkID": homeWorkID
        }
        Services.post(apiRoot.deAssignHomework, payload)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    alert(res.message)
                    if (assignedHomework.data.length > 0) {
                        getAssignedHomeWork()
                    }
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

    const viewFile = (item) => {
        console.log(item, 'itemds')
        if (item.fileType != null) {
            const fType = item?.filePath != null ? item?.filePath?.split('.') : ''
            let itemLowerCase = ''
            if (fType != '') {
                itemLowerCase = fType[fType.length - 1].toLowerCase()
            }
            console.log(itemLowerCase)
            setFileType((prev) => {
                return { ...prev, data: item, type: itemLowerCase, fileSrc: item.filePath, status: true }
            })
        }
    }
    const downloadDoc = async (item, type) => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Swaadhyayan LMS Storage Permission',
                    message:
                        'Swaadhyayan LMS App needs access to your storag ' +
                        'so you can download files.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                downloadFile(item, type)
            } else {
                console.log('Storage permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    //   const downloadFile = (item, type)=>{
    //     const {config, fs} = RNFetchBlob
    //     const date = new Date()
    //     const fileDir = fs.dirs.DownloadDir
    //     let fileExtension=''
    //     if(type=='img'){
    //         if(item.endsWith('png')){
    //                 fileExtension='.png'
    //         }else if(item.endsWith('jpg')){
    //             fileExtension='.jpg'
    //         }else if(item.endsWith('jpeg')){
    //             fileExtension='.jpeg'
    //         }else if(item.endsWith('gif')){
    //             fileExtension='.gif'
    //         }
    //     }else if(type=='doc'){
    //         if(item.endsWith('doc')){
    //             fileExtension='.doc'
    //         }else if(item.endsWith('docx')){
    //             fileExtension='.docx'
    //         }else if(item.endsWith('pdf')){
    //             fileExtension='.pdf'
    //         }else if(item.endsWith('ott')){
    //             fileExtension='.ott'
    //         }
    //     }
    //     config({
    //         fileCache : true,
    //         addAndroidDownloads:{
    //             useDownloadManager:true,
    //             notification:true,
    //             path:fileDir+"/homeWork"+Math.floor(date.getDate()+date.getSeconds()/2)+fileExtension,
    //             description:"file download"
    //         }
    //     })
    //     .fetch('GET', item,{
    //     })
    //     .then((res) => {
    //         console.log('The file saved to ', res.path())
    //         alert("File downloaded successfully.")
    //         setLoading(false)
    //     })
    //     .catch((err)=>{
    //         console.log(err)
    //     })
    //     .finally(()=>{
    //         setLoading(false)
    //     })
    // }


    return (
        <>
            <View style={{ flex: 1, padding: 10 }}>
                {loading ?
                    <Loader /> :
                    <ScrollView>
                        {
                            assignedHomework.status ?
                                <View>
                                    {
                                        assignedHomework.data.map((item, index) => {
                                            const fileName = item.uploadFileName
                                            return (
                                                <View style={{ borderWidth: .7, borderColor: userData.data.colors.mainTheme, marginBottom: 10, borderRadius: 5, padding: 8, backgroundColor: SWATheam.SwaWhite }} key={index}>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 100, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Class </Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.className}</Text>
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
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.sectionNames}</Text>
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
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.subjectName}</Text>
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
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.homeWorkDesc}</Text>
                                                        </View>
                                                    </View>
                                                    {item.filePath != null ?
                                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                            <View style={{ width: 100, }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Attached File</Text>
                                                            </View>
                                                            <View style={{ paddingRight: 10 }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                            </View>
                                                            <View style={{ flex: 1, }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{fileName}</Text>
                                                            </View>
                                                        </View> : null
                                                    }
                                                    {item.youTubeUrl != null ?
                                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                            <View style={{ width: 100, }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Youtube Url</Text>
                                                            </View>
                                                            <View style={{ paddingRight: 10 }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                            </View>
                                                            <View style={{ flex: 1, }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.youTubeUrl}</Text>
                                                            </View>
                                                        </View> : null
                                                    }
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 100, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Created Date</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.createdDate}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 100, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Start Date</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.assignedDate}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 100, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>End Date</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.submissionDate}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5, borderTopWidth: .7, borderColor: 'grey', marginTop: 5 }}>
                                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 5, paddingHorizontal: 10, marginRight: 5 }} onPress={() => viewFile(item)}>
                                                            <Text style={{ color: SWATheam.SwaWhite, padding: 5 }}>View</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ backgroundColor: SWATheam.SwaRed, borderRadius: 5, paddingHorizontal: 10 }} onPress={() => deleteAssignedHomeWork(item.homeWorkID)}>
                                                            <Text style={{ color: SWATheam.SwaWhite, padding: 5 }}>Delete</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                                :
                                <View style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 5 }}>
                                    <Text style={{ color: SWATheam.SwaRed, fontSize: 14, textAlign: 'center', padding: 5 }}>Homework not available</Text>
                                </View>
                        }
                    </ScrollView>
                }
            </View>

            {(fileType.status && fileType.type == 'image' || fileType.type == 'png' || fileType.type == 'jpg' || fileType.type == 'jpeg') &&
                <ImageViewer fileType={fileType} setFileType={setFileType} downloadDoc={downloadDoc} />
            }
            {(fileType.status && fileType.type == 'pdf') &&
                <HWPdfViewer colorSwa={userData.data.colors.mainTheme} fileType={fileType} setFileType={setFileType} downloadDoc={downloadDoc} />
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

export default AssignedHomeWork

