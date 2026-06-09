import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, PermissionsAndroid, Platform, Alert } from "react-native"
import { useEffect, useState, useContext } from "react"
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImageViewer from "../../../common/ImageViewer"
import PdfViewer from "../../../common/HWPdfViewer"
import YouTubeUrlView from "../../../common/YoutubeUrlView";

import DocumentPicker from 'react-native-document-picker';
// import { apiRoot, SWATheam } from "../../../../constant/ConstentValue"
import { GlobleData } from "../../../../Store"
import Services from "../../../../Services"
import Loader from "../../../common/Loader"

import RNBlobUtil from 'react-native-blob-util';
import { apiRoot, SWATheam } from "../../../../constant/ConstentValue";
// import RNFetchBlob from 'rn-fetch-blob';


const ViewAndSubmitHomework = () => {
    const { userData } = useContext(GlobleData)
    const [showSubmitPopUp, setShowSubmitPopUp] = useState(false)
    const [assignedHomework, setAssignedHomework] = useState({ data: null, status: false })
    const [fileType, setFileType] = useState({ data: null, type: '', fileSrc: null, status: false })
    const [selectFile, setSelectFile] = useState(null)
    const [singleHomeworkData, setSingleHomeworkData] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getAssignedHomeWork()
    }, [])

    const getAssignedHomeWork = () => {
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

    const viewFile = async (item) => {
        if (item?.fileType != null) {
            if (!item?.assignedfilePath) {
                Alert.alert('Error', 'File source not found!');
                return;
            }

            const fType = item.assignedfilePath.split('.');
            const itemLowerCase = fType[fType.length - 1].toLowerCase();

            const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

            if (imageTypes.includes(itemLowerCase)) {
                try {
                    // Check if image is loadable
                    await Image.prefetch(item.assignedfilePath);

                    setFileType((prev) => {
                        return {
                            ...prev,
                            data: item,
                            type: itemLowerCase,
                            fileSrc: item.assignedfilePath,
                            status: true,
                            from: 'base64',
                        };
                    });
                } catch (err) {
                    Alert.alert('Error', 'Image not found at given path!');
                }
            } else {
                // Non-image files (like pdf/doc)
                setFileType((prev) => {
                    return {
                        ...prev,
                        data: item,
                        type: itemLowerCase,
                        fileSrc: item.assignedfilePath,
                        status: true,
                        from: 'base64',
                    };
                });
            }
        }
    };

    // const viewFile = (item) => {
    //     if (item.fileType != null) {
    //         const fType = item.assignedfilePath.split('.')
    //         const itemLowerCase = fType[fType.length - 1].toLowerCase()
    //         setFileType((prev) => {
    //             return { ...prev, data: item, type: itemLowerCase, fileSrc: item.assignedfilePath, status: true, from: 'base64' }
    //         })
    //     }
    // }

    function closeModal() {
        setShowSubmitPopUp(false)
    }

    const pickImage = async () => {
        try {
            const file = await DocumentPicker.pick({
                type: [DocumentPicker.types.images]
            });
            setSelectFile(file)
        } catch (err) {
            console.log(err)
        }
    }

    const submitBtn = (item) => {
        setShowSubmitPopUp(true)
        setSingleHomeworkData(item)
    }

    const submitHomeWork = () => {

        if (selectFile == null) {
            Alert.alert("Info!", "Please Select your homework file in image.")
        } else {
            const formData = new FormData();
            formData.append("schoolID", userData.data.schoolID)
            formData.append("userTypeID", userData.data.userTypeID)
            formData.append("userRefID", userData.data.userRefID)
            formData.append("classID", singleHomeworkData?.classID)
            formData.append("sectionID", singleHomeworkData?.sectionID)
            formData.append("homeworkID", singleHomeworkData?.homeWorkID)
            formData.append("homeworkFile", selectFile[0])

            Services.formMethod(apiRoot.submitHomework, formData)
                .then((res) => {
                    if (res.status == "success") {
                        Alert.alert("Info!", res.message)
                        getAssignedHomeWork()
                        setSingleHomeworkData(null)
                        setSelectFile(null)
                    } else {
                        Alert.alert("Info!", res.message)
                    }
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
                            assignedHomework.status ?
                                <View>
                                    {
                                        assignedHomework.data.map((item, index) => {
                                            const fileName = item.uploadFileName
                                            return (
                                                <View style={{ borderWidth: .7, borderColor: 'grey', marginBottom: 10, borderRadius: 5, padding: 5, backgroundColor: SWATheam.SwaWhite }} key={index}>
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
                                                    {item.uploadFileName != null ?
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
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 100, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Assign By</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.teacherData.fullName}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5, borderTopWidth: .7, borderColor: 'grey', marginTop: 5 }}>
                                                        <TouchableOpacity style={{ backgroundColor: SWATheam.SwaGreen, borderRadius: 5, paddingHorizontal: 10, marginRight: 5 }} onPress={() => viewFile(item)}>
                                                            <Text style={{ color: SWATheam.SwaWhite, padding: 5 }}>View</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ backgroundColor: item.submittedData == null ? userData.data.colors.mainTheme : SWATheam.SwaGray, borderRadius: 5, paddingHorizontal: 10, marginRight: 5 }} onPress={() => item.submittedData != null ? null : submitBtn(item)}>
                                                            <Text style={{ color: SWATheam.SwaWhite, padding: 5 }}>{item.submittedData == null ? "Submit" : "Submited"}</Text>
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
                <PdfViewer colorSwa={userData.data.colors.mainTheme} fileType={fileType} setFileType={setFileType} downloadDoc={downloadDoc} />
            }

            {(fileType.status && fileType.type == 'url') &&
                <YouTubeUrlView fileType={fileType} colorSwa={userData.data.colors.mainTheme} setFileType={setFileType} />
            }

            {showSubmitPopUp &&
                <View style={styles.selectFieldPopUp}>
                    <View style={{ backgroundColor: SWATheam.SwaWhite, marginHorizontal: 30, padding: 8, maxHeight: 300, borderRadius: 5 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', borderBottomWidth: .7, paddingBottom: 5, borderColor: 'grey' }} onPress={() => { closeModal(), setSelectFile(null) }}>
                            <AntDesign name={"close"} size={20} color={SWATheam.SwaBlack} />
                        </TouchableOpacity>
                        <ScrollView>
                            <View>
                                <TouchableOpacity onPress={() => { pickImage() }}>
                                    <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ paddingLeft: 10, fontSize: 15, color: SWATheam.SwaBlack }}>
                                            {
                                                selectFile != null ? selectFile[0].name : "Select Image"

                                            }
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: .7, boderColor: 'grey', paddingTop: 5 }}>
                                    <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 5, paddingHorizontal: 10, marginRight: 5 }} onPress={() => submitHomeWork()}>
                                        <Text style={{ color: SWATheam.SwaWhite, padding: 5 }}>Save & Submit</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                                    <Text style={{ color: SWATheam.SwaBlack, fontSize: 12 }}>* Please attach your homework file in image (.png, .jpg, .jpeg)</Text>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            }
        </>
    )
}

const styles = StyleSheet.create({

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

export default ViewAndSubmitHomework

