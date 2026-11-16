import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Platform, PermissionsAndroid, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import SwaHeader from '../../../common/SwaHeader'
import { GlobleData } from '../../../../Store'
import { SWATheam } from '../../../../constant/ConstentValue'
import ImageViewer from '../../../common/ImageViewer'
import RNBlobUtil from 'react-native-blob-util';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Share from 'react-native-share';


const HomeWorkReports = ({ navigation, route }) => {
    const statusBarHeight = StatusBar.currentHeight
    const { userData } = useContext(GlobleData)
    const [fileType, setFileType] = useState({ data: null, type: '', fileSrc: null, status: false })
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false)

    function onClickLeftIcon() {
        navigation.goBack()
    }
    function onClickRightIcon() {
        setIsInstruction(true)
    }


    const viewFile = (item) => {
        if (!item || typeof item !== 'object') {
            Alert.alert("Error", "File data not found!");
            return;
        }

        const rawPath = item?.checkedFile;


        if (typeof rawPath !== 'string' || !rawPath.trim()) {
            Alert.alert("Error", "Checked file is not available!");
            return;
        }

        const filePath = rawPath.trim();
        const cleanPath = filePath.split(/[?#]/)[0];
        const isUrl = /^https?:\/\//i.test(filePath);

        const fileName = cleanPath.split('/').pop();
        const extension = fileName?.includes('.')
            ? fileName.split('.').pop().toLowerCase()
            : '';

        const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const isImage = imageTypes.includes(extension);
        const isPdf = extension === 'pdf';

        if (isImage || isPdf) {
            setFileType((prev) => ({
                ...prev,
                data: item,
                type: extension,
                fileSrc: filePath,
                status: true,
                from: isImage ? 'image' : 'document',
            }));
        } else if (isUrl) {
            setFileType((prev) => ({
                ...prev,
                data: item,
                type: 'url',
                fileSrc: filePath,
                status: true,
                from: 'url',
            }));
        } else {
            Alert.alert(
                "Error",
                "Unsupported file format. Please select an image, PDF, or valid HTTP/HTTPS URL."
            );
        }
    };






    async function downloadDoc(docPath, type) {
        try {
            const shareOptions = {
                title: 'Share PDF',
                url: `${docPath}`,
                type: 'application/pdf',
                failOnCancel: false,
            };
            setLoading(false)
            await Share.open(shareOptions);
        } catch (err) {
            console.log('Share error:', err);
            setLoading(false)
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
        <SafeAreaProvider style={{ paddingTop: insets.top, marginBottom: insets.bottom, backgroundColor: userData.data.colors.mainTheme }}>
            <View style={{ flex: 1, marginTop: statusBarHeight, backgroundColor: userData.data.colors.liteTheme }}>
                <SwaHeader title={"Reports"} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
                <View style={{ flex: 1, padding: 10 }}>
                    <ScrollView>
                        {route?.params?.map((item, index) => {
                            const studentName = item?.studentDetails?.firstName + ' ' + (item?.studentDetails?.middleName == null ? "" : item.studentDetails?.middleName) + ' ' + item.studentDetails?.lastName
                            const fatherName = item?.studentDetails?.fatherName

                            const checkedDate = item?.checkedDate
                            const subMissionDate = item?.submissionDate
                            const checkedBy = item?.teacherData?.firstName + ' ' + (item?.teacherData?.middleName == null ? "" : item?.teacherData?.middleName) + " " + (item?.teacherData?.lastName == null ? "" : item?.teacherData?.lastName)


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
        </SafeAreaProvider>
    )
}

export default HomeWorkReports

const styles = StyleSheet.create({})