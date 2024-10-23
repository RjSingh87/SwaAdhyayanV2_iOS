import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Image, Button } from "react-native"
import { useEffect, useState, useLayoutEffect, useContext } from "react"
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DocumentPicker from 'react-native-document-picker';
import Modal from "../../../common/Modal"
import { launchCamera as openCamera, launchImageLibrary } from 'react-native-image-picker';
// import ImagePicker from 'react-native-image-crop-picker';
import { GlobleData } from "../../../../Store"
import { apiRoot, SWATheam } from "../../../../constant/ConstentValue"
import Services from "../../../../Services"
import Loader from "../../../common/Loader"

const CreateHomeWork = () => {
    const { userData } = useContext(GlobleData)
    const [selectOption, setSelectOption] = useState({ class: null, section: null, subject: null, type: null })
    const [ModalData, setModalData] = useState({ data: null, type: null, status: false })
    const [showPopUp, setShowPopUp] = useState(false)
    const [loading, setLoading] = useState(false)

    const [showYoutubeUrlView, setShowYoutubeUrlView] = useState(false)
    const [showDataDrawer, setShowDataDrawer] = useState(true)
    const [selectFileOpt, setSelectFileOpt] = useState({ data: null, status: false })
    const popUpOptArr = [{ name: 'Camera', ID: 1 }, { name: 'Image/Document', ID: 2 }, { name: 'Youtube Url', ID: 3 }]
    const [inputVal, setInputVal] = useState('')
    const [urlList, setUrlList] = useState([])
    const [youtubeUrlShow, setYoutubeUrlShow] = useState(false)
    const [description, setDescription] = useState('')
    const [imgAndDocArr, setImgAndDocArr] = useState([])

    //camera
    const [cameraType, setCameraType] = useState('back');
    const [isCameraOpen, setIsCameraOpen] = useState(false);


    const getList = (type) => {
        setLoading(true)
        if (type == "class") {
            const payload = {
                "schoolCode": userData.data.schoolCode,
                "userTypeID": userData.data.userTypeID,
                "userRefID": userData.data.userRefID,
                "academicYear": userData.data.academicYear
            }
            Services.post(apiRoot.getClassList, payload)
                .then((res) => {
                    if (res.status == "success") {
                        setLoading(false)
                        setShowPopUp(true)
                        const data = res.data
                        setModalData((prev) => {
                            return { ...prev, data: data, type: type, status: true }
                        })
                    } else {
                        alert(res.message)
                        setLoading(false)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
        else if (type == 'section') {
            if (selectOption.class != null) {
                const payload = {
                    "schoolCode": userData.data.schoolCode,
                    "academicYear": userData.data.academicYear,
                    "classID": selectOption.class.classID,
                    "userTypeID": userData.data.userTypeID,
                    "userRefID": userData.data.userRefID
                }
                Services.post(apiRoot.getSectionList, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setShowPopUp(true)
                            setLoading(false)
                            const data = res.data
                            setModalData((prev) => {
                                return { ...prev, data: data, type: type, status: true }
                            })
                        } else {
                            alert(res.message)
                            setLoading(false)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            } else {
                alert("Please Select class first")
            }
        }
        else if (type == 'subject') {
            if (selectOption.section != null) {
                const payload = {
                    "schoolCode": userData.data.schoolCode,
                    "academicYear": userData.data.academicYear,
                    "userTypeID": userData.data.userTypeID,
                    "userRefID": userData.data.userRefID,
                    "classID": selectOption.class.getClassDetail.classID,
                    "sectionID": selectOption.section.sectionID
                }
                Services.post(apiRoot.getSubjectList, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setLoading(false)
                            setShowPopUp(true)
                            const data = res.data
                            setModalData((prev) => {
                                return { ...prev, data: data, type: type, status: true }
                            })
                        } else {
                            alert(res.message)
                            setLoading(false)
                        }
                    })
                    .catch((err) => {
                        console.log(err)

                    })
                    .finally(() => {
                        setLoading(false)
                    })
            } else {
                alert("Please Select section first")
            }
        }
    }

    const selectModalOption = (item, type) => {
        if (type == 'class') {
            setSelectOption((prev) => {
                return { ...prev, class: item, section: null, subject: null, type: type }
            })
        } else if (type == 'section') {
            setSelectOption((prev) => {
                return { ...prev, section: item, subject: null, type: type }
            })
        } else if (type == 'subject') {
            setSelectOption((prev) => {
                return { ...prev, subject: item, type: type }
            })
            setShowDataDrawer(true)
        }
    }

    const closeModal = () => {
        setShowPopUp(false)
        setSelectFileOpt((prev) => {
            return { ...prev, status: false }
        })
    }

    const openFileModal = () => {
        setSelectFileOpt((prev) => {
            return { ...prev, status: true }
        })
    }

    const selectfile = (item) => {
        setSelectFileOpt((prev) => {
            return { ...prev, data: item }
        })
        if (item.ID == 1) {
            if (imgAndDocArr.length < 5 - urlList.length) {
                handleOpenCamera()
            } else {
                alert("You can add only 5 type of media whether it is Images/Documents/Urls")
            }
        }
        else if (item.ID == 2) {
            if (imgAndDocArr.length < 5 - urlList.length) {
                getBrowseImg()
            } else {
                alert("You can add only 5 type of media whether it is Images/Documents/Urls")
            }
        }
        else if (item.ID == 3) {
            if (urlList.length < 5 - imgAndDocArr.length) {
                setYoutubeUrlShow(true)
                setShowYoutubeUrlView(true)
            } else {
                alert("You can add only 5 type of media whether it is Images/Documents/Urls")
            }
        }
    }

    const getBrowseImg = async () => {
        try {
            const remaingLen = urlList.length + imgAndDocArr.length
            const file = await DocumentPicker.pick({
                type: [DocumentPicker.types.images, DocumentPicker.types.doc, DocumentPicker.types.pdf],
                allowMultiSelection: true,
                presentationStyle: "fullScreen"
            });

            if (file.length <= 5 - remaingLen) {
                const imgArr = []
                file.map((item) => {
                    if (item.type.split('/')[0] == 'image' || item.type.split('/')[0] == 'application') {
                        if (item.type.split('/')[1] == 'png' || item.type.split('/')[1] == 'jpg' || item.type.split('/')[1] == 'jpeg' || item.type.split('/')[1] == 'msword' || item.type.split('/')[1] == 'pdf' || item.type.split('/')[1] == 'doc') {
                            imgArr.push(item)
                            setImgAndDocArr([...imgAndDocArr, ...imgArr])
                        } else {
                            alert("You can upload documents/images in these format: .png, .jpg, .jpeg, .msword, .doc, .pdf")
                        }

                    }
                })
            }
            else {
                alert("You can add only 5 type of media whether it is Images/Documents/Urls")
                return;
            }
        } catch (err) {
            console.log(err)
        }
    }

    function saveinputValue(text) {
        setInputVal(text)
    }

    const getUrls = () => {
        const remainLen = imgAndDocArr.length
        if (urlList.length < 5 - remainLen) {
            if (inputVal != '') {
                if (inputVal.includes('www.youtube.com/') || inputVal.includes('/youtu.be/')) {
                    setUrlList((prev) => {
                        return [...urlList, { id: prev.length + 1, val: inputVal }]
                    })
                    setInputVal('')
                } else {
                    alert('Please Enter valid Url')
                    setInputVal('')
                }
            } else {
                alert('Please Enter your Url')
            }
        }
        else {
            alert("You can add only 5 type of media whether it is Images/Documents/Urls")
        }
    }

    const createHomeWork = async () => {
        setLoading(true)
        const formData = new FormData();
        formData.append("schoolCode", userData.data.schoolCode)
        formData.append("userTypeID", userData.data.userTypeID)
        formData.append("userRefID", userData.data.userRefID)
        formData.append("classID", selectOption?.class?.classID)
        formData.append("subjectID", selectOption?.subject?.subjectID)
        formData.append("description", description)

        if (urlList.length) {
            const tempUrlArr = []
            urlList.map((item) => {
                tempUrlArr.push(item.val)
            })

            for (let i = 0; i < tempUrlArr.length; i++) {
                formData.append("urls[]", tempUrlArr[i])
            }
        }

        if (imgAndDocArr.length) {
            for (let i = 0; i < imgAndDocArr.length; i++) {
                formData.append("files[]", imgAndDocArr[i])
            }
        }

        await Services.formMethod(apiRoot.createHomework, formData)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    alert(res.message)
                    setDescription("")
                    setUrlList([])
                    setImgAndDocArr([])
                    setSelectOption({ class: null, section: null, subject: null, type: null })
                    setModalData({ data: null, type: null, status: false })
                    setSelectFileOpt({ data: null, status: false })
                } else if (res.status == "error") {
                    alert(res.message)
                    setLoading(false)
                }
            }).catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleOpenCamera = () => {
        const options = {
            mediaType: 'photo',
            cameraType: 'back',
            quality: 1,
            saveToPhotos: true,
            includeBase64: true,
            presentationStyle: "fullScreen"
        };
        openCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets) {
                // console.log(response, "Response...?")
                setImgAndDocArr([...imgAndDocArr, {
                    uri: response.assets[0].uri,
                    name: 'image.png',
                    fileName: 'image',
                    type: 'image/png'
                }])
                setIsCameraOpen(false);
                // setImageUri(response.assets[0].uri);
            }
        });


        return
        ImagePicker.openCamera({
            cache: true,
            width: 500,
            height: 410,
            cropping: true,
            compressImageQuality: 0.7
        })
            .then(image => {
                console.log(image);
                setImgAndDocArr([...imgAndDocArr, {
                    uri: image.path,
                    name: 'image.png',
                    fileName: 'image',
                    type: 'image/png'
                }])
            });
        setIsCameraOpen(false);
    };

    const deleteUploadFile = (item, index) => {
        const newImageUrl = imgAndDocArr.filter((item, i) => i !== index)
        const arr = []
        setImgAndDocArr(newImageUrl);
        newImageUrl.map((item, key) => {
            if (item != `yUrl${key + 1}`) {
                arr.push(key)
            }
        });
    }

    const deleteUrl = (item) => {
        const newYoutubeUrl = urlList.filter((value, i) => value.id !== item.id)
        setUrlList(newYoutubeUrl)
    }

    return (
        <>
            {loading ?
                <Loader /> :
                <View style={{ flex: 1, padding: 10, backgroundColor: userData.data.colors.liteTheme }}>
                    <View style={{ paddingHorizontal: 5, flex: 1 }}>
                        <View style={{ marginBottom: 10, borderBottomWidth: .7, paddingBottom: 10, borderColor: 'grey' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 4, borderColor: userData.data.colors.hoverTheme, backgroundColor: SWATheam.SwaWhite, marginVertical: 5, padding: 4 }} onPress={() => { getList("class"), 1 }}>
                                <View style={{ flex: 1, padding: 6, }}>
                                    <Text style={{ color: selectOption.class == null ? SWATheam.SwaGray : SWATheam.SwaBlack }}>{selectOption.class == null ? 'Select class' : selectOption.class.getClassDetail.classDesc}</Text>
                                </View>
                                <View style={{ width: 45, justifyContent: 'center', alignItems: 'center' }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 4, borderColor: userData.data.colors.hoverTheme, backgroundColor: SWATheam.SwaWhite, marginVertical: 5, padding: 4 }} onPress={() => { getList("section"), 2 }}>
                                <View style={{ flex: 1, padding: 6, }}>
                                    <Text style={{ color: selectOption.section == null ? SWATheam.SwaGray : SWATheam.SwaBlack }}>{selectOption.section == null ? 'Select section' : selectOption.section.sectionName}</Text>
                                </View>
                                <View style={{ width: 45, justifyContent: 'center', alignItems: 'center' }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 4, borderColor: userData.data.colors.hoverTheme, backgroundColor: SWATheam.SwaWhite, marginVertical: 5, padding: 4 }} onPress={() => { getList("subject"), 3 }}>
                                <View style={{ flex: 1, padding: 6, }}>
                                    <Text style={{ color: selectOption.subject == null ? SWATheam.SwaGray : SWATheam.SwaBlack }}>{selectOption.subject == null ? 'Select subject' : selectOption.subject.subjectName}</Text>
                                </View>
                                <View style={{ width: 45, justifyContent: 'center', alignItems: 'center' }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>
                        </View>

                        {showDataDrawer &&
                            <ScrollView>
                                <View style={{ flex: 1 }}>
                                    <View style={{ borderWidth: .5, bordercolor: 'grey', paddingHorizontal: 5, borderRadius: 5, marginBottom: 10 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 4, borderColor: userData.data.colors.hoverTheme, backgroundColor: SWATheam.SwaWhite, marginVertical: 5, padding: 4 }} onPress={() => openFileModal()}>
                                            <View style={{ flex: 1, padding: 6 }}>
                                                <Text style={{ color: selectOption.data?.name == null ? SWATheam.SwaGray : SWATheam.SwaBlack }}>{selectFileOpt.data?.name != null ? selectFileOpt.data?.name : 'File Type'}</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                                <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                            </View>
                                        </TouchableOpacity>

                                        {imgAndDocArr.length != 0 &&
                                            <View style={{ borderWidth: .7, borderColor: 'grey', flexWrap: 'wrap', flexDirection: 'row', padding: 5, borderRadius: 5, justifyContent: 'center', marginBottom: 8, }}>
                                                {
                                                    imgAndDocArr?.map((item, index) => {
                                                        let imgPrint = ""
                                                        if (!item.mime && item.type.split('/')[0] == 'application') {
                                                            imgPrint = <View>
                                                                <TouchableOpacity style={{ position: "absolute", top: 0, right: 0, zIndex: 99 }} onPress={() => deleteUploadFile(item, index)}>
                                                                    <AntDesign name={"close"} size={20} color={SWATheam.SwaBlack} />
                                                                </TouchableOpacity>
                                                                <Image source={require('../../../assets/doc.png')} style={{ height: 60, width: 60 }} />
                                                            </View>
                                                        }
                                                        else {
                                                            imgPrint = <View>
                                                                <TouchableOpacity style={{ position: "absolute", top: 0, right: 0, zIndex: 99 }} onPress={() => deleteUploadFile(item, index)}>
                                                                    <AntDesign name={"close"} size={20} color={SWATheam.SwaBlack} />
                                                                </TouchableOpacity>
                                                                <Image source={{ uri: item.mime != undefined ? item.path : item.uri }} style={{ height: 65, width: 65 }} />
                                                            </View>
                                                        }
                                                        return (
                                                            <View style={{ margin: 5, flexDirection: 'row', alignItems: 'flex-end' }} key={index}>
                                                                {imgPrint}
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        }

                                        {youtubeUrlShow &&
                                            <View>
                                                {showYoutubeUrlView &&
                                                    <View style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 4, borderColor: userData.data.colors.hoverTheme, backgroundColor: SWATheam.SwaWhite, marginVertical: 5, padding: 4 }}>
                                                        <View style={{ flex: 1 }}>
                                                            <TextInput defaultValue={inputVal}
                                                                style={[styles.urlInput, { color: SWATheam.SwaBlack, height: 35, padding: 5, paddingStart: 8 }]} placeholder='URL' onChangeText={(txt) => { saveinputValue(txt) }} />
                                                        </View>
                                                        <TouchableOpacity style={{ paddingRight: 3 }} onPress={() => getUrls()}>
                                                            <MaterialCommunityIcons name={"send"} size={30} color={userData.data.colors.mainTheme} />
                                                        </TouchableOpacity>
                                                    </View>
                                                }

                                                {
                                                    urlList.length != 0 &&
                                                    <View style={{ backgroundColor: SWATheam.SwaWhite, borderRadius: 5, marginVertical: 5 }}>
                                                        {
                                                            urlList?.map((item, index) => {
                                                                return (
                                                                    <View style={{ flexDirection: 'row', margin: 8, alignItems: 'center' }} key={index}>
                                                                        <View>
                                                                            <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>{index + 1}.</Text>
                                                                        </View>
                                                                        <View style={{ flex: 1, paddingHorizontal: 5 }}>
                                                                            <View style={{ flexDirection: 'row' }}>
                                                                                <View style={{ flex: 1 }}>
                                                                                    <Text style={{ paddingLeft: 5, color: SWATheam.SwaBlack }}>{item.val}</Text>
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                        <View style={{ width: 30 }}>
                                                                            <TouchableOpacity onPress={() => deleteUrl(item, index)}>
                                                                                <MaterialCommunityIcons name={"delete"} size={25} color={'#dc3545'} />
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                }

                                            </View>
                                        }

                                    </View>
                                    <TextInput
                                        style={[styles.description,
                                        { color: SWATheam.SwaBlack }]}
                                        placeholder='Description'
                                        placeholderTextColor={SWATheam.SwaGray}
                                        multiline={true}
                                        numberOfLines={4}
                                        maxLength={250}
                                        onChangeText={setDescription}
                                        value={description}
                                    />
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 30, borderRadius: 3, paddingVertical: 8 }} onPress={() => createHomeWork()}>
                                            <Text style={{ color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        }
                    </View>





                </View>

            }
            {
                showPopUp &&
                <Modal ModalData={ModalData} closeModal={closeModal} selectModalOption={selectModalOption} selectOption={selectOption} colorSwa={userData.data.colors.mainTheme} />
            }
            {selectFileOpt.status &&
                <View style={styles.selectFieldPopUp}>
                    <View style={{ backgroundColor: '#fff', marginHorizontal: 30, padding: 8, maxHeight: 300, borderRadius: 5 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', borderBottomWidth: .7, paddingBottom: 5, borderColor: 'grey' }} onPress={() => closeModal()}>
                            <AntDesign name={"close"} size={20} color={SWATheam.SwaBlack} />
                        </TouchableOpacity>
                        <ScrollView>
                            <View>
                                {
                                    popUpOptArr.map((item) => {
                                        let selectBtnID = 0
                                        if (selectFileOpt?.data?.ID == item.ID) {
                                            selectBtnID = 1
                                        }
                                        return (
                                            <TouchableOpacity onPress={() => { selectfile(item); closeModal() }} key={item.ID}>
                                                <View style={{ padding: 10, borderBottomWidth: 1, borderColor: 'grey', flexDirection: 'row', alignItems: 'center' }}>
                                                    <View style={{ borderWidth: 2, borderColor: 'grey', width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20 / 2 }}>
                                                        <View style={{ borderWidth: 2, borderColor: 'grey', width: 11, height: 11, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                                                            {
                                                                selectBtnID == 1 ? <View style={{ backgroundColor: userData.data.colors.mainTheme, height: 11, width: 11, borderRadius: 50 }}></View> : null
                                                            }
                                                        </View>
                                                    </View>
                                                    <Text style={{ paddingLeft: 10, fontSize: 15, color: SWATheam.SwaBlack }}>
                                                        {item.name}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                    </View>
                </View>
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
        color: '#fff'
    },

    selectFieldPopUp: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    },

    description: {
        height: 100,
        backgroundColor: SWATheam.SwaWhite,
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
        // borderWidth: .7,
        // borderColor: 'grey',
        // borderRadius: 50,
        padding: 8,
        // textAlignVertical: 'top'
    },

});

export default CreateHomeWork