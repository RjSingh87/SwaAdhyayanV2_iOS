import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from "react-native"
import { useEffect, useState, useRef, useContext } from "react"
import AntDesign from 'react-native-vector-icons/AntDesign'
import ImageViewer from "../../../common/ImageViewer"
import SignatureScreen from "react-native-signature-canvas";
import Services from "../../../../Services";
import { apiRoot, SWATheam } from "../../../../constant/ConstentValue";
import { GlobleData } from "../../../../Store";

let checkHomeWorkData = {
    "classID": "",
    "sectionID": "",
    "homeWorkID": "",
    "submitHomeworkID": "",
    "studentRefID": ""
}

let imgDataUri = ''
const SubmittedHomeWork = () => {
    const { userData } = useContext(GlobleData)
    const [showCanvas, setShowCanvas] = useState(false)
    const [showColorPalate, setShowColorPalate] = useState(false)
    const [fileType, setFileType] = useState({ data: null, type: '', fileSrc: null, status: false })
    const [submittedHomework, setsubmittedHomework] = useState({ data: null, status: false })
    const [penColor, setPenColor] = useState(SWATheam.SwaBlack)
    const [imgpath, setImgpath] = useState(SWATheam.SwaBlack)
    const ref = useRef();
    const [signature, setSign] = useState(null);
    const [comment, setComment] = useState('')

    useEffect(() => {
        getSubmittedHomeWork()
    }, [])

    const getSubmittedHomeWork = () => {
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "userRefID": userData.data.userRefID,
            "userTypeID": userData.data.userTypeID,
            "isChecked": 0
        }
        Services.post(apiRoot.getSubmittedHomeworkTeacher, payload)
            .then((res) => {
                if (res.status == "success") {
                    const data = res.data
                    setsubmittedHomework((prev) => {
                        return { ...prev, data: data, status: true }
                    })
                } else {
                    // alert(res.message)
                    setsubmittedHomework({ data: null, status: false })
                }

            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {

            })

    }

    const viewFile = (item) => {
        const splitItem = item.submittedHomework.studentUploaded.split('.')
        const fileType = splitItem[splitItem.length - 1]
        setFileType((prev) => {
            return { ...prev, data: item, type: fileType, fileSrc: item.submittedHomework.studentUploaded, status: true }
        })
    }

    const checkHomeWorkBtn = (item) => {
        const splitItem = item.submittedHomework.studentUploaded.split('.')
        const fileType = splitItem[splitItem.length - 1]
        if (fileType == 'png' || fileType == 'jpeg' || fileType == 'jpg') {
            convertImgToDataUrl(item?.submittedHomework?.studentUploaded, (myBase64) => {
                imgDataUri = myBase64
                const splitSrc = item?.submittedHomework?.studentUploaded.split('/')
                const imgName = splitSrc[splitSrc.length - 1]
                setImgpath(imgName)
                checkHomeWorkData.classID = item.submittedHomework.submittedBy.classID
                checkHomeWorkData.sectionID = item.submittedHomework.submittedBy.sectionID
                checkHomeWorkData.homeWorkID = item.submittedHomework.homeWorkID
                checkHomeWorkData.submitHomeworkID = item.assignedHomeWork.hwSubmitID
                checkHomeWorkData.studentRefID = item.submittedHomework.submittedBy.submittedBy
                setShowCanvas(true)
            });
        }
    }

    const convertImgToDataUrl = (url, callback) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            const reader = new FileReader();
            reader.onloadend = () => {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    };

    const saveCheckHomeWork = async (sign) => {
        const getImgExtension = imgpath.split('.')
        let fileImgData = {
            "fileCopyUri": null,
            "name": imgpath,
            "size": "2576",
            "type": "image/" + getImgExtension[1],
            "uri": sign
        }

        const formData = new FormData();
        formData.append("schoolCode", userData.data.schoolCode)
        formData.append("userRefID", userData.data.userRefID)
        formData.append("userTypeID", userData.data.userTypeID)
        formData.append("classID", checkHomeWorkData.classID)
        formData.append("sectionID", checkHomeWorkData.sectionID)
        formData.append("homeworkID", checkHomeWorkData.homeWorkID)
        formData.append("submitHomeworkID", checkHomeWorkData.submitHomeworkID)
        formData.append("studentRefID", checkHomeWorkData.studentRefID)
        formData.append("comment", comment)
        formData.append("checkedFile", fileImgData)

        Services.formMethod(apiRoot.checkHomework, formData)
            .then((res) => {
                if (res.status == "success") {
                    alert(res.message)
                    getSubmittedHomeWork()
                    setShowCanvas(false)
                    setComment('')
                    setSign('')
                }
                else if (res.status == "error") {
                    alert(res.message)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {

            })

    }

    const handleOK = (sign) => {
        setSign(sign);
        saveCheckHomeWork(sign)
    };

    const handleUndo = () => {
        ref.current.undo();
    };

    const handlePenColor = (color) => {
        ref.current.changePenColor(color);
    };

    const handleClear = () => {
        ref.current.clearSignature();
    };

    const handleConfirm = () => {
        ref.current.readSignature()
        saveCheckHomeWork()
    };

    const selectPenColor = (color) => {
        handlePenColor(color)
        setPenColor(color)
        setShowColorPalate(false)
    }

    const imgWidth = '50%'
    const imgHeight = '50%'

    const style = `.m-signature-pad--footer {display: none}`;

    return (
        <View style={{ padding: 10, flex: 1 }}>
            <ScrollView>
                {
                    submittedHomework.status ?
                        <View>
                            {
                                submittedHomework.data.map((item, index) => {
                                    return (
                                        <View style={{ borderWidth: .7, borderColor: userData.data.colors.mainTheme, marginBottom: 10, borderRadius: 5, padding: 5 }} key={index}>
                                            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                <View style={{ width: 120, }}>
                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Name</Text>
                                                </View>
                                                <View style={{ paddingRight: 10 }}>
                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                </View>
                                                <View style={{ flex: 1, }}>
                                                    <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.submittedHomework.submittedBy.fullName}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                <View style={{ width: 120, }}>
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
                                                <View style={{ width: 120, }}>
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
                                                <View style={{ width: 120, }}>
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
                                                <View style={{ width: 120, }}>
                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Description </Text>
                                                </View>
                                                <View style={{ paddingRight: 10 }}>
                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                </View>
                                                <View style={{ flex: 1, }}>
                                                    <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.assignedHomeWork.homeWorkDesc}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                <View style={{ width: 120, }}>
                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Created Date</Text>
                                                </View>
                                                <View style={{ paddingRight: 10 }}>
                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.assignedHomeWork.createdDate}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                <View style={{ width: 120, }}>
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
                                                <View style={{ width: 120, }}>
                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Status</Text>
                                                </View>
                                                <View style={{ paddingRight: 10 }}>
                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>Not Checked</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5, borderTopWidth: .7, borderColor: 'grey', marginTop: 5 }}>
                                                <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 5, paddingHorizontal: 10, marginRight: 5 }} onPress={() => viewFile(item)}>
                                                    <Text style={{ color: SWATheam.SwaWhite, padding: 5 }}>View</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ backgroundColor: '#198754', borderRadius: 5, paddingHorizontal: 10 }} onPress={() => checkHomeWorkBtn(item)}>
                                                    <Text style={{ color: SWATheam.SwaWhite, padding: 5 }}>Check</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                        :
                        <View style={{ borderWidth: 1, borderColor: userData.data.colors.mainTheme, borderRadius: 5, backgroundColor: SWATheam.SwaWhite }}>
                            <Text style={{ color: 'red', fontSize: 14, textAlign: 'center', padding: 5 }}>Homework not available</Text>
                        </View>
                }
            </ScrollView>
            {fileType.status &&
                <ImageViewer fileType={fileType} setFileType={setFileType} />
            }

            {showColorPalate &&
                <View style={styles.colorPalate}>
                    <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5, zIndex: 9 }} onPress={() => setShowColorPalate(false)}>
                        <AntDesign name={"close"} size={25} color={SWATheam.SwaBlack} />
                    </TouchableOpacity>
                    <View style={{ backgroundColor: SWATheam.SwaWhite, maxWidth: '100%', padding: 2, borderRadius: 5 }}>
                        <View style={{ flexDirection: 'row', }}>
                            <TouchableOpacity style={{ margin: 5, height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: SWATheam.SwaWhite, backgroundColor: '#FF0000' }} onPress={() => selectPenColor('#FF0000')}></TouchableOpacity>
                            <TouchableOpacity style={{ margin: 5, height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: SWATheam.SwaWhite, backgroundColor: '#FF1493' }} onPress={() => selectPenColor('#FF1493')}></TouchableOpacity>
                            <TouchableOpacity style={{ margin: 5, height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: SWATheam.SwaWhite, backgroundColor: '#FF4500' }} onPress={() => selectPenColor('#FF4500')}></TouchableOpacity>
                            <TouchableOpacity style={{ margin: 5, height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: SWATheam.SwaWhite, backgroundColor: '#FFD700' }} onPress={() => selectPenColor('#FFD700')}></TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <TouchableOpacity style={{ margin: 5, height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: SWATheam.SwaWhite, backgroundColor: '#800080' }} onPress={() => selectPenColor('#800080')}></TouchableOpacity>
                            <TouchableOpacity style={{ margin: 5, height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: SWATheam.SwaWhite, backgroundColor: '#7B68EE' }} onPress={() => selectPenColor('#7B68EE')}></TouchableOpacity>
                            <TouchableOpacity style={{ margin: 5, height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: SWATheam.SwaWhite, backgroundColor: '#228B22' }} onPress={() => selectPenColor('#228B22')}></TouchableOpacity>
                            <TouchableOpacity style={{ margin: 5, height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: SWATheam.SwaWhite, backgroundColor: '#00BFFF' }} onPress={() => selectPenColor('#00BFFF')}></TouchableOpacity>
                        </View>
                    </View>
                </View>
            }

            {showCanvas &&
                <View style={[styles.canavsPopUp, { alignItems: 'center' }]}>
                    <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5, zIndex: 9 }} onPress={() => { setShowCanvas(false), setSign(''), setComment(''), setPenColor(SWATheam.SwaBlack) }}>
                        <AntDesign name={"close"} size={25} color={SWATheam.SwaGray} />
                    </TouchableOpacity>
                    <View style={[styles.preview, { borderBottomWidth: 1, borderColor: userData.data.colors.mainTheme }]}>
                        {signature ?
                            <View>
                                <Image
                                    resizeMode="contain"
                                    style={{ width: 400, height: 200 }}
                                    source={{ uri: signature }}
                                />
                            </View>
                            : <Text>Preview</Text>
                        }
                    </View>
                    <View style={{ flex: 1, width: '100%', paddingHorizontal: 3, paddingVertical: 50 }}>
                        <ScrollView>
                            <View style={{ flex: 1 }}>
                                <SignatureScreen
                                    ref={ref}
                                    onOK={handleOK}
                                    dataURL={imgDataUri}
                                    descriptionText="Check"
                                    clearText="Clear"
                                    confirmText="Save"
                                    webStyle={style}
                                    style={{ borderWidth: .7, borderColor: userData.data.colors.mainTheme, height: 300, width: '100%' }}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
                                    <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={() => handleUndo()}>
                                        <Text style={{ color: SWATheam.SwaWhite }}>Undo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ backgroundColor: penColor, borderColor: userData.data.colors.mainTheme, width: 50, borderWidth: 3, paddingVertical: 10, borderRadius: 5 }} onPress={() => setShowColorPalate(true)}>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={() => handleClear()}>
                                        <Text style={{ color: SWATheam.SwaWhite }}>Clear</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ borderTopWidth: .7, borderColor: userData.data.colors.mainTheme, paddingTop: 5 }}>
                                    <Text style={{ color: SWATheam.SwaBlack }}>Comment</Text>
                                    <TextInput onChangeText={setComment} value={comment} style={[styles.input, { color: userData.data.colors.mainTheme, borderRadius: 5, height: 90, borderWidth: .7, textAlignVertical: 'top', borderColor: userData.data.colors.mainTheme, marginTop: 5 }]}
                                        multiline={true}
                                        numberOfLines={4}
                                        maxLength={250}
                                        placeholderTextColor={SWATheam.SwaGray}
                                        placeholder='Type Comment...' />
                                </View>
                            </View>
                        </ScrollView>
                        <View style={{ flexDirection: 'row', position: 'absolute', bottom: 10, width: '100%', justifyContent: 'space-around', borderTopWidth: 1, paddingTop: 10, borderColor: userData.data.colors.mainTheme, backgroundColor: SWATheam.SwaWhite }}>
                            <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleConfirm}>
                                <Text style={{ color: SWATheam.SwaWhite }}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }

        </View>
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
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    },

    description: {
        height: 100,
        borderWidth: 1,
        borderWidth: 1,
        borderColor: SWATheam.SwaGray,
        borderRadius: 5,
        padding: 8,
        marginBottom: 7,
        textAlignVertical: 'top'
    },

    urlInput: {
        height: 100,
        borderWidth: 1,
        borderWidth: 1,
        borderColor: SWATheam.SwaGray,
        borderRadius: 50,
        padding: 8,
        marginBottom: 7,
        textAlignVertical: 'top'
    },

    canavsPopUp: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: SWATheam.SwaWhite,
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    },

    preview: {
        backgroundColor: "#F8F8F8",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        borderWidth: 1,
        display: 'none',
    },

    colorPalate: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99
    }

});

export default SubmittedHomeWork

