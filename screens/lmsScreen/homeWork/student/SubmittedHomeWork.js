import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, PermissionsAndroid, Platform, Alert } from "react-native"
import { useEffect, useState, useContext } from "react"
import ImageViewer from "../../../common/ImageViewer"
import HWPdfViewer from "../../../common/HWPdfViewer"
import YouTubeUrlView from "../../../common/YoutubeUrlView";
import { apiRoot, SWATheam } from "../../../../constant/ConstentValue"
import { GlobleData } from "../../../../Store"
import Services from "../../../../Services"
import Loader from "../../../common/Loader"

import RNBlobUtil from 'react-native-blob-util';
// import RNFetchBlob from 'rn-fetch-blob';

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
            "schoolID": userData.data.schoolID,
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
                return { ...prev, data: item, type: itemLowerCase, fileSrc: item.assignedfilePath, status: true, from: "base64" }
            })
        }
    }

    function downloadDoc(item, type, baseUrl,) {
        setLoading(true)
        if (type == "video") {
            // navigation.navigate('videoView', { url: item })
            requestDownloadPermission(item, type)
        } else if (type == "img") {
            requestDownloadPermission(item, type)
            // setFileType((prev) =>{
            //     return {...prev, fileSrc: item, status: true}
            // })
        } else if (type == 'audio') {
            requestDownloadPermission(item, type)
        }
        else if (type == "doc") {
            const docPath = baseUrl + item.docFileNPath
            requestDownloadPermission(docPath, type, item)
            // if(docPath.endsWith('pdf')){
            //     navigation.navigate('pdfView', { url: docPath, title: "Swa-Sharing"})
            // }else if(docPath.endsWith('doc') || docPath.endsWith('docx')){
            //     requestDownloadPermission(docPath)
            // }
        }
    }

    const requestDownloadPermission = async (docPath, type) => {



        if (Platform.OS === 'android' && Platform.Version >= 33) {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
                ]);

                if (
                    granted['android.permission.READ_MEDIA_IMAGES'] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    downloadFile(docPath, type)
                    setLoading(false)
                } else {
                    console.log('Permissions denied');
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    const downloadFile = (docPath, type) => {
        const { config, fs } = RNBlobUtil
        const date = new Date()
        const fileDir = fs.dirs.DownloadDir
        let fileExtension = ''
        if (type == 'img') {
            if (docPath.endsWith('png')) {
                fileExtension = '.png'
            } else if (docPath.endsWith('jpg')) {
                fileExtension = '.jpg'
            } else if (docPath.endsWith('jpeg')) {
                fileExtension = '.jpeg'
            } else if (docPath.endsWith('gif')) {
                fileExtension = '.gif'
            }
        } else if (type == "video") {
            if (docPath.endsWith('mp4')) {
                fileExtension = '.mp4'
            } else if (docPath.endsWith('ogg')) {
                fileExtension = '.ogg'
            }
        } else if (type == "audio") {
            fileExtension = '.mp3'
        } else if (type == 'doc') {
            if (docPath.endsWith('doc')) {
                fileExtension = '.doc'
            } else if (docPath.endsWith('docx')) {
                fileExtension = '.docx'
            } else if (docPath.endsWith('pdf')) {
                fileExtension = '.pdf'
            } else if (docPath.endsWith('ott')) {
                fileExtension = '.ott'
            }
        }

        RNBlobUtil.config({
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: fileDir + "/homeWork" + Math.floor(date.getDate() + date.getSeconds() / 2) + fileExtension,
                description: "file download"
            },
        })
            .fetch('GET', docPath, {
            })
            .then((res) => {
                console.log('The file saved to', res.path())
                Alert.alert("Info!", "File downloaded successfully.")
                setLoading(false)
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
                <View style={{ flex: 1, padding: 10 }}>
                    <ScrollView>
                        {
                            submittedHomeWork.status ?
                                <View>
                                    {
                                        submittedHomeWork.data.map((item, index) => {
                                            const fileName = item.uploadFileName
                                            return (
                                                <View style={{ borderWidth: .7, borderColor: 'grey', marginBottom: 10, borderRadius: 5, padding: 5, backgroundColor: SWATheam.SwaWhite }} key={index}>
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

