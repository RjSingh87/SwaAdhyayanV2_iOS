import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Platform, PermissionsAndroid, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import SwaHeader from '../../../common/SwaHeader'
import { GlobleData } from '../../../../Store'
import { SWATheam } from '../../../../constant/ConstentValue'
import ImageViewer from '../../../common/ImageViewer'
import RNBlobUtil from 'react-native-blob-util';


const HomeWorkReports = ({ navigation, route }) => {
    const statusBarHeight = StatusBar.currentHeight
    const { userData } = useContext(GlobleData)
    const [fileType, setFileType] = useState({ data: null, type: '', fileSrc: null, status: false })

    function onClickLeftIcon() {
        navigation.goBack()
    }
    function onClickRightIcon() {
        setIsInstruction(true)
    }

    const viewFile = (item) => {
        const fType = item.checkedFile.split('.')
        const itemLowerCase = fType[fType.length - 1].toLowerCase()
        setFileType((prev) => {
            return { ...prev, data: item, type: itemLowerCase, fileSrc: item.checkedFile, status: true }
        })
    }

    function downloadDoc(item, type, baseUrl) {
        // setLoading(true)
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
            requestDownloadPermission(docPath, type)
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
                    // setLoading(false)
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
        <View style={{ flex: 1, marginTop: statusBarHeight, backgroundColor: userData.data.colors.liteTheme }}>
            <SwaHeader title={"Reports"} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
            <View style={{ flex: 1, padding: 10 }}>
                <ScrollView>
                    {route.params.map((item, index) => {
                        const studentName = item.studentDetails.firstName + ' ' + (item.studentDetails.middleName == null ? "" : item.studentDetails.middleName) + ' ' + item.studentDetails.lastName
                        const fatherName = item.studentDetails.fatherName

                        const checkedDate = item.checkedDate
                        const subMissionDate = item.submissionDate
                        const checkedBy = item.teacherData.firstName + ' ' + (item.teacherData.middleName == null ? "" : item.teacherData.middleName) + " " + (item.teacherData.lastName == null ? "" : item.teacherData.lastName)


                        return (
                            <View style={{ borderWidth: .7, borderColor: userData.data.colors.mainTheme, marginBottom: 10, borderRadius: 5, padding: 8, backgroundColor: SWATheam.SwaWhite }} key={item.hwSubmitID}>
                                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                    <View style={{ width: 100, }}>
                                        <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Name </Text>
                                    </View>
                                    <View style={{ paddingRight: 10 }}>
                                        <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                    </View>
                                    <View style={{ flex: 1, }}>
                                        <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{studentName}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                    <View style={{ width: 100, }}>
                                        <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Father's Name </Text>
                                    </View>
                                    <View style={{ paddingRight: 10 }}>
                                        <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                    </View>
                                    <View style={{ flex: 1, }}>
                                        <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{fatherName}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                    <View style={{ width: 100, }}>
                                        <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Checked Date</Text>
                                    </View>
                                    <View style={{ paddingRight: 10 }}>
                                        <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                    </View>
                                    <View style={{ flex: 1, }}>
                                        <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{checkedDate}</Text>
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
                                        <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{subMissionDate}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                    <View style={{ width: 100, }}>
                                        <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Checked by</Text>
                                    </View>
                                    <View style={{ paddingRight: 10 }}>
                                        <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{checkedBy}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5, borderTopWidth: .7, borderColor: 'grey', marginTop: 5 }}>
                                    <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 5, paddingHorizontal: 5, marginRight: 5 }} onPress={() => viewFile(item)}>
                                        <Text style={{ color: SWATheam.SwaWhite, padding: 5 }}>Checked File</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
            {fileType.status &&
                <ImageViewer fileType={fileType} setFileType={setFileType} downloadDoc={downloadDoc} />
            }
        </View>
    )
}

export default HomeWorkReports

const styles = StyleSheet.create({})