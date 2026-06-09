import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, PermissionsAndroid, Platform, Alert } from "react-native"
import { useEffect, useState, useContext } from "react"
import ImageViewer from "../../../common/ImageViewer"
import { apiRoot, SWATheam } from "../../../../constant/ConstentValue"
import { GlobleData } from "../../../../Store"
import Services from "../../../../Services"
import Loader from "../../../common/Loader"
import RNBlobUtil from 'react-native-blob-util';


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
            "schoolID": userData.data.schoolID,
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
            let filePath = null;

            if (type === 1) {
                filePath = item?.submittedBy?.uploadedFile;
            } else if (type === 2) {
                filePath = item?.checkedBy?.checkedFile;
            }

            if (!filePath) {
                Alert.alert("Error", "File source not found!");
                return;
            }

            const fType = filePath.split(".");
            const itemLowerCase = fType[fType.length - 1].toLowerCase();

            setFileType((prev) => {
                return {
                    ...prev,
                    data: item,
                    type: itemLowerCase,
                    fileSrc: filePath,
                    status: true,
                };
            });
        }
    };

    const downloadDoc = async (docPath, type) => {
        if (Platform.OS === 'android' && Platform.Version >= 30) {
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
                Alert.alert('Info!', "File downloaded successfully.")
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
                <View style={{ padding: 10, flex: 1 }}>
                    <ScrollView>
                        {
                            checkedHomeWork.status ?
                                <View>
                                    {
                                        checkedHomeWork.data.map((item, index) => {
                                            const fileName = item.uploadFileName
                                            return (
                                                <View style={{ borderWidth: .7, borderColor: 'grey', marginBottom: 5, borderRadius: 5, padding: 5, backgroundColor: SWATheam.SwaWhite }} key={index}>
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
                                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 5, paddingHorizontal: 5, marginRight: 5 }} onPress={() => viewFile(item, 1)}>
                                                            <Text style={{ color: '#fff', padding: 5 }}>Atached File</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 5, paddingHorizontal: 5, marginRight: 5 }} onPress={() => viewFile(item, 2)}>
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
                <ImageViewer fileType={fileType} setFileType={setFileType} downloadDoc={downloadDoc} />
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

