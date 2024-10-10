import React, { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, KeyboardAvoidingView, Platform, Keyboard } from "react-native"
import { useEffect, useState, useContext } from "react"
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DocumentPicker from 'react-native-document-picker';
import Modal from "../../common/Modal"
// import { CollapsedItem } from "react-native-paper/lib/typescript/components/Drawer/Drawer"
import { GlobleData } from "../../../Store"
import { apiRoot, SWATheam } from "../../../constant/ConstentValue"
import Services from "../../../Services"



const tAndFarr = []

const AddQuestionManually = () => {
    const { userData } = useContext(GlobleData)

    const [selectOption, setSelectOption] = useState({ class: null, section: null, subject: null, book: null, chapter: null, diffLevel: null, activityType: null, typeOfTandF: null, queFor: null, marks: null, type: null })
    const [ModalData, setModalData] = useState({ data: null, type: null, status: false })
    const [uploadInfo, setUploadInfo] = useState({ data: null, status: false })
    const [showPopUp, setShowPopUp] = useState(false)
    const [showFields, setShowFields] = useState(true)
    const [saveMCQTxt, setSaveMCQTxt] = useState({ queTxt: null, opt1: null, opt2: null, opt3: null, opt4: null, radioID: null })
    const [saveDescTxt, setSaveDescTxt] = useState({ queTxt: null, answer: null })
    const [saveFillUpTxt, setSaveFillUpTxt] = useState({ head: null, queTxt: null, answer: null })
    const [saveTandFTxt, setSaveTandFTxt] = useState({ head: null, queTxt: null, answer: null })
    const [showTandFpopUp, setShowTandFpopUp] = useState(false)
    const [selectTandF, setSelectTandF] = useState({ data: null, radioID: null })

    const getList = async (type) => {
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
                        setShowPopUp(true)
                        const data = res.data
                        setModalData((prev) => {
                            return { ...prev, data: data, type: type, status: true }
                        })
                    } else {
                        alert(res.message)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {

                })



        }
        else if (type == 'section') {
            if (selectOption.class != null) {
                const payload = {
                    "schoolCode": userData.data.schoolCode,
                    "userTypeID": userData.data.userTypeID,
                    "userRefID": userData.data.userRefID,
                    "academicYear": userData.data.academicYear,
                    "classID": selectOption.class.classID
                }
                Services.post(apiRoot.getSectionList, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setShowPopUp(true)
                            const data = res.data
                            setModalData((prev) => {
                                return { ...prev, data: data, type: type, status: true }
                            })
                        } else {
                            alert(res.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {

                    })

            } else {
                alert("Please Select class first")
            }
        }
        else if (type == 'subject') {
            if (selectOption.section != null) {
                const payload = {
                    "schoolCode": userData.data.schoolCode,
                    "userTypeID": userData.data.userTypeID,
                    "userRefID": userData.data.userRefID,
                    "academicYear": userData.data.academicYear,
                    "classID": selectOption.class.getClassDetail.classID,
                    "sectionID": selectOption.section.sectionID
                }
                Services.post(apiRoot.getSubjectList, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setShowPopUp(true)
                            const data = res.data
                            setModalData((prev) => {
                                return { ...prev, data: data, type: type, status: true }
                            })
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {

                    })
            } else {
                alert("Please Select section first")
            }
        }
        else if (type == 'book') {
            if (selectOption.subject != null) {
                const payload = {
                    "schoolCode": userData.data.schoolCode,
                    "classID": selectOption.class.getClassDetail.classID,
                    "subjectID": selectOption.subject.subjectID,
                    "isAssess": 1
                }
                Services.post(apiRoot.getBooksList, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setShowPopUp(true)
                            const data = res.data
                            setModalData((prev) => {
                                return { ...prev, data: data, type: type, status: true }
                            })
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {

                    })

            } else {
                alert("Please Select subject first")
            }
        }
        else if (type == 'chapter') {
            if (selectOption.book != null) {
                const payload = {
                    "schoolCode": userData.data.schoolCode,
                    "academicYear": userData.data.academicYear,
                    "classID": selectOption.class.getClassDetail.classID,
                    "subjectID": selectOption.subject.subjectID,
                    "bookID": selectOption.book.bookID,
                }
                Services.post(apiRoot.getBookChapterList, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setShowPopUp(true)
                            const data = res.data
                            setModalData((prev) => {
                                return { ...prev, data: data, type: type, status: true }
                            })
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {

                    })
            } else {
                alert("Please Select section first")
            }
        }
        else if (type == 'diffLevel') {
            if (selectOption.chapter != null) {
                Services.post(apiRoot.getDifficultyLevels)
                    .then((res) => {
                        if (res.status == "success") {
                            setShowPopUp(true)
                            const data = res.data
                            setModalData((prev) => {
                                return { ...prev, data: data, type: type, status: true }
                            })
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {

                    })

            } else {
                alert("Please Select chapter first")
            }
        }
        else if (type == 'activityType') {
            if (selectOption.diffLevel != null) {
                Services.post(apiRoot.getActivityType)
                    .then((res) => {
                        if (res.status == "success") {
                            setShowPopUp(true)
                            const data = res.data
                            setModalData((prev) => {
                                return { ...prev, data: data, type: type, status: true }
                            })
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {

                    })
            } else {
                alert("Please Select Difficulty level first")
            }
        }
        else if (type == 'typeOfTandF') {
            Services.post(apiRoot.getTnFValue)
                .then((res) => {
                    if (res.status == "success") {
                        setShowPopUp(true)
                        const data = res.data
                        setModalData((prev) => {
                            return { ...prev, data: data, type: type, status: true }
                        })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {

                })
        }
        else if (type == 'queFor') {
            if (selectOption.activityType != null) {
                Services.post(apiRoot.getQuestionFor)
                    .then((res) => {
                        if (res.status == "success") {
                            setShowPopUp(true)
                            const data = res.data
                            setModalData((prev) => {
                                return { ...prev, data: data, type: type, status: true }
                            })
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {

                    })

            } else {
                alert("Please Select Question type first")
            }
        }
        else if (type == 'marks') {
            if (selectOption.activityType != null) {
                Services.post(apiRoot.getMarksUptoTen)
                    .then((res) => {
                        if (res.status == "success") {
                            setShowPopUp(true)
                            const data = res.data
                            setModalData((prev) => {
                                return { ...prev, data: data, type: type, status: true }
                            })
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {

                    })

            } else {
                alert("Please Select Question for first")
            }
        }
    }



    const selectModalOption = (item, type) => {
        if (type == 'class') {
            setSelectOption((prev) => {
                return { ...prev, class: item, section: null, subject: null, book: null, chapter: null, diffLevel: null, activityType: null, typeOfTandF: null, queFor: null, marks: null, type: type }
            })
        }
        else if (type == 'section') {
            setSelectOption((prev) => {
                return { ...prev, section: item, subject: null, book: null, chapter: null, diffLevel: null, activityType: null, typeOfTandF: null, queFor: null, marks: null, type: type }
            })
        }
        else if (type == 'subject') {
            setSelectOption((prev) => {
                return { ...prev, subject: item, book: null, chapter: null, diffLevel: null, activityType: null, typeOfTandF: null, queFor: null, marks: null, type: type }
            })
        }
        else if (type == 'book') {
            setSelectOption((prev) => {
                return { ...prev, book: item, chapter: null, diffLevel: null, activityType: null, typeOfTandF: null, queFor: null, marks: null, type: type }
            })
        }
        else if (type == 'chapter') {
            setSelectOption((prev) => {
                return { ...prev, chapter: item, diffLevel: null, activityType: null, typeOfTandF: null, queFor: null, marks: null, type: type }
            })
        }
        else if (type == 'diffLevel') {
            setSelectOption((prev) => {
                return { ...prev, diffLevel: item, activityType: null, typeOfTandF: null, queFor: null, marks: null, type: type }
            })
        }
        else if (type == 'activityType') {
            setSelectOption((prev) => {
                return { ...prev, activityType: item, typeOfTandF: null, queFor: null, marks: null, type: type }
            })
        }
        else if (type == 'typeOfTandF') {
            tAndFarr.length = 0
            setSelectTandF({ data: null, radioID: null })
            setSelectOption((prev) => {
                return { ...prev, typeOfTandF: item, queFor: null, marks: null, type: type }
            })

            const splitItem = item.desc.split("/")
            splitItem.map((item) => {
                tAndFarr.push(item)
            })
        }
        else if (type == 'queFor') {
            setSelectOption((prev) => {
                return { ...prev, queFor: item, marks: null, type: type }
            })
        }
        else if (type == 'marks') {
            setSelectOption((prev) => {
                return { ...prev, marks: item, type: type }
            })

            setShowFields(false)

            if (selectOption.activityType.activityNameLang1 == "True and False") {
                setShowFields(true)
                if (selectOption.typeOfTandF != null) {
                    setShowFields(false)
                }
            }
        }
    }

    const browseDoc = async () => {
        try {
            const file = await DocumentPicker.pick({
                type: [DocumentPicker.types.xls, DocumentPicker.types.xlsx],
                presentationStyle: "fullScreen"
            });
            if (file) {
                uploadDoc(file[0])
            }
        } catch (err) {
            console.log(err)
        }
    }

    const uploadDoc = async (file) => {
        const formData = new FormData();
        formData.append("schoolCode", userData.data.schoolCode)
        formData.append("academicYear", userData.data.academicYear)
        formData.append("addedBy", userData.data.fullname)
        formData.append("file", file)

        Services.formMethod(apiRoot.addBulkQuestions, formData)
            .then((res) => {
                if (res.status == "success") {
                    setUploadInfo((prev) => {
                        return { ...prev, data: res.data, status: true }
                    })
                } else if (res.status == "error") {
                    alert(res.message)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {

            })
    }

    const closeModal = () => {
        setShowPopUp(false)
        setShowTandFpopUp(false)
        setUploadInfo((prev) => {
            return { ...prev, status: false }
        })
    }

    const saveMcqTxt = (txt, type) => {
        if (type == 'queTxt') {
            setSaveMCQTxt((prev) => {
                return { ...prev, queTxt: txt }
            })
        }
        else if (type == 'opt1') {
            setSaveMCQTxt((prev) => {
                return { ...prev, opt1: txt }
            })
        }
        else if (type == 'opt2') {
            setSaveMCQTxt((prev) => {
                return { ...prev, opt2: txt }
            })
        }
        else if (type == 'opt3') {
            setSaveMCQTxt((prev) => {
                return { ...prev, opt3: txt }
            })
        }
        else if (type == 'opt4') {
            setSaveMCQTxt((prev) => {
                return { ...prev, opt4: txt }
            })
        }
    }

    const saveDescriptiveText = (txt, type) => {
        if (type == 'ques') {
            setSaveDescTxt((prev) => {
                return { ...prev, queTxt: txt }
            })
        }
        else if (type == 'ans') {
            setSaveDescTxt((prev) => {
                return { ...prev, answer: txt }
            })
        }
    }

    const saveFillUpText = (txt, type) => {
        if (type == 'head') {
            setSaveFillUpTxt((prev) => {
                return { ...prev, head: txt }
            })
        }
        else if (type == 'ques') {
            setSaveFillUpTxt((prev) => {
                return { ...prev, queTxt: txt }
            })
        }
        else if (type == 'ans') {
            setSaveFillUpTxt((prev) => {
                return { ...prev, answer: txt }
            })
        }
    }

    const saveTandFText = (txt, type) => {
        if (type == 'head') {
            setSaveTandFTxt((prev) => {
                return { ...prev, head: txt }
            })
        }
        else if (type == 'ques') {
            setSaveTandFTxt((prev) => {
                return { ...prev, queTxt: txt }
            })
        }
    }

    const checkAns = (ID) => {
        setSaveMCQTxt((prev) => {
            return { ...prev, radioID: ID }
        })
    }

    const selectTandFOpt = (ID, item) => {
        setSaveTandFTxt((prev) => {
            return { ...prev, answer: item }
        })
        setSelectTandF((prev) => {
            return { ...prev, data: item, radioID: ID }
        })
    }

    const submitQuestions = async () => {
        if (selectOption.activityType?.activityNameLang1 == "Multiple Choice Question") {
            const valArr = Object.values(saveMCQTxt)
            let minOptLen = 0
            for (let i = 1; i < valArr.length; i++) {
                if (valArr[i] != '') {
                    minOptLen++
                }
            }
            if (saveMCQTxt.queTxt != null) {
                if (minOptLen >= 2) {
                    if (saveMCQTxt.radioID != null) {
                        const payload = {
                            "schoolCode": userData.data.schoolCode,
                            "academicYear": userData.data.academicYear,
                            "classID": selectOption.class.classID,
                            "subjectID": selectOption.subject.subjectID,
                            "bookID": selectOption.book.bookID,
                            "chapterID": selectOption.chapter.chapterID + '|' + selectOption.chapter.chapterNo + '|' + selectOption.chapter.chapterName,
                            "eadID": selectOption.diffLevel.eadID,
                            "quesType": selectOption.activityType.activityID,
                            "questionFor": selectOption.queFor.desc,
                            "marks": selectOption.marks,
                            "questionText": saveMCQTxt.queTxt,
                            "mcqOption1": saveMCQTxt.opt1,
                            "mcqOption2": saveMCQTxt.opt2,
                            "mcqOption3": saveMCQTxt.opt3,
                            "mcqOption4": saveMCQTxt.opt4,
                            "mcqCorrectAnswer": saveMCQTxt.radioID,
                            "addedBy": userData.data.fullname,
                        }
                        Services.post(apiRoot.saveQuestionManually, payload)
                            .then((res) => {
                                if (res.status == "success") {
                                    alert(res.message)
                                    setSaveMCQTxt({ queTxt: null, opt1: null, opt2: null, opt3: null, opt4: null, rightAns: null, radioID: null })
                                } else if (res.status == "error") {
                                    alert(res.message)
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                            .finally(() => {

                            })

                    } else {
                        alert('Please select right answer')
                    }
                } else {
                    alert('Minimum two option required')
                }
            } else {
                alert('Please Enter your question')
            }
        }
        else if (selectOption.activityType?.activityNameLang1 == "Fill in the Blank") {
            if (saveFillUpTxt.head != null) {
                if (saveFillUpTxt.queTxt != null) {
                    if (saveFillUpTxt.answer != null) {
                        const payload = {
                            "schoolCode": userData.data.schoolCode,
                            "academicYear": userData.data.academicYear,
                            "classID": selectOption.class.classID,
                            "subjectID": selectOption.subject.subjectID,
                            "bookID": selectOption.book.bookID,
                            "chapterID": selectOption.chapter.chapterID + '|' + selectOption.chapter.chapterNo + '|' + selectOption.chapter.chapterName,
                            "eadID": selectOption.diffLevel.eadID,
                            "quesType": selectOption.activityType.activityID,
                            "questionFor": selectOption.queFor.desc,
                            "marks": selectOption.marks,
                            "questionHeading": saveFillUpTxt.head,
                            "questionText": saveFillUpTxt.queTxt,
                            "fillupAnswerText": saveFillUpTxt.answer,
                            "addedBy": userData.data.fullname,
                        }
                        Services.post(apiRoot.saveQuestionManually, payload)
                            .then((res) => {
                                if (res.status == "success") {
                                    alert(res.message)
                                    setSaveFillUpTxt({ head: null, queTxt: null, answer: null })
                                } else if (res.status == "error") {
                                    alert(res.message)
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                            .finally(() => {

                            })
                    } else {
                        alert('Please Enter your answer')
                    }
                } else {
                    alert('Please Enter your question')
                }
            } else {
                alert('Please Enter your question heading')
            }
            console.log(saveFillUpTxt, 'saveFillUpTxt')
        }
        else if (selectOption.activityType?.activityNameLang1 == "True and False") {
            if (saveTandFTxt.head != null) {
                if (saveTandFTxt.queTxt != null) {
                    if (saveTandFTxt.answer != null) {
                        const payload = {
                            "schoolCode": userData.data.schoolCode,
                            "academicYear": userData.data.academicYear,
                            "classID": selectOption.class.classID,
                            "subjectID": selectOption.subject.subjectID,
                            "bookID": selectOption.book.bookID,
                            "chapterID": selectOption.chapter.chapterID + '|' + selectOption.chapter.chapterNo + '|' + selectOption.chapter.chapterName,
                            "eadID": selectOption.diffLevel.eadID,
                            "quesType": selectOption.activityType.activityID,
                            "questionFor": selectOption.queFor.desc,
                            "marks": selectOption.marks,
                            "questionHeading": saveTandFTxt.head,
                            "questionText": saveTandFTxt.queTxt,
                            "tnfTarg": selectOption.typeOfTandF.value,
                            "selectCorrectAnswer": saveTandFTxt.answer,
                            "addedBy": userData.data.fullname,
                        }
                        Services.post(apiRoot.saveQuestionManually, payload)
                            .then((res) => {
                                if (res.status == "success") {
                                    alert(res.message)
                                    setSaveTandFTxt({ head: null, queTxt: null, answer: null })
                                    setSelectTandF({ data: null, radioID: null })
                                } else if (res.status == "error") {
                                    alert(res.message)
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                            .finally(() => {

                            })

                    } else {
                        alert('Please select your answer')
                    }
                } else {
                    alert('Please Enter your question')
                }
            } else {
                alert('Please Enter your question heading')
            }
        }
        else if (selectOption.activityType?.activityNameLang1 == "Descriptive") {
            if (saveDescTxt.queTxt != null) {
                if (saveDescTxt.answer != null) {
                    const payload = {
                        "schoolCode": userData.data.schoolCode,
                        "academicYear": userData.data.academicYear,
                        "classID": selectOption.class.classID,
                        "subjectID": selectOption.subject.subjectID,
                        "bookID": selectOption.book.bookID,
                        "chapterID": selectOption.chapter.chapterID + '|' + selectOption.chapter.chapterNo + '|' + selectOption.chapter.chapterName,
                        "eadID": selectOption.diffLevel.eadID,
                        "quesType": selectOption.activityType.activityID,
                        "questionFor": selectOption.queFor.desc,
                        "marks": selectOption.marks,
                        "questionText": saveDescTxt.queTxt,
                        "descAnswerText": saveDescTxt.answer,
                        "addedBy": userData.data.fullname,
                    }
                    Services.post(apiRoot.saveQuestionManually, payload)
                        .then((res) => {
                            if (res.status == "success") {
                                alert(res.message)
                                setSaveDescTxt({ queTxt: null, answer: null })
                            } else if (res.status == "error") {
                                alert(res.message)
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                        .finally(() => {

                        })

                } else {
                    alert('Please Enter your answer')
                }
            } else {
                alert('Please Enter your question')
            }
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderColor: SWATheam.SwaBlack }}>
                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>
                    Add Question Manually
                </Text>
                <TouchableOpacity style={{ padding: 4, backgroundColor: userData.data.colors.mainTheme, borderRadius: 4 }} onPress={() => setShowFields(!showFields)}>
                    <Ionicons name={"filter-sharp"} size={25} color={SWATheam.SwaWhite} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, padding: 10, backgroundColor: SWATheam.SwaWhite }}>
                {
                    showFields &&
                    <View style={{ marginBottom: 10, borderBottomWidth: .7, borderColor: 'grey' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 50, flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name="cloud-download" size={20} color={'#fff'} />
                                <Text style={{ color: '#fff', textAlign: 'center', paddingLeft: 5 }}>
                                    Download Template
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 50, flexDirection: 'row', alignItems: 'center' }} onPress={() => browseDoc()}>
                                <MaterialCommunityIcons name="cloud-upload" size={20} color={'#fff'} />
                                <Text style={{ color: '#fff', textAlign: 'center', paddingLeft: 5 }}>
                                    Upload Template
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 50, paddingVertical: 2, marginBottom: 10 }} onPress={() => { getList("class") }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10 }}>{selectOption.class == null ? 'Select class' : selectOption.class.getClassDetail.classDesc}</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 50, paddingVertical: 2, marginBottom: 10 }} onPress={() => { getList("section") }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10 }}>{selectOption.section == null ? 'Select section' : selectOption.section.sectionName}</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 50, paddingVertical: 2, marginBottom: 10 }} onPress={() => { getList("subject") }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10 }}>{selectOption.subject == null ? 'Select subject' : selectOption.subject.subjectName}</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 50, paddingVertical: 2, marginBottom: 10 }} onPress={() => { getList("book") }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10 }}>{selectOption.book == null ? 'Select book' : selectOption.book.bookNameLang}</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 50, paddingVertical: 2, marginBottom: 10 }} onPress={() => { getList("chapter") }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
                                        {selectOption.chapter == null ? 'Select chapter' :
                                            selectOption.subject?.subjectName == 'Hindi' ?
                                                selectOption.chapter.chapterNameLang2 :
                                                selectOption.chapter.chapterName
                                        }
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 50, paddingVertical: 2, marginBottom: 10 }} onPress={() => { getList("diffLevel") }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10 }}>{selectOption.diffLevel == null ? 'Select Difficulty Levels' : selectOption.diffLevel.eadCategory}</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 50, paddingVertical: 2, marginBottom: 10 }} onPress={() => { getList("activityType") }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10 }}>{selectOption.activityType == null ? 'Select Question type' : selectOption.activityType.activityNameLang1}</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>
                            {selectOption.activityType?.activityID == 2 &&
                                < TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 50, paddingVertical: 2, marginBottom: 10 }} onPress={() => { getList("typeOfTandF") }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ paddingVertical: 5, paddingHorizontal: 10 }}>{selectOption.typeOfTandF == null ? 'Select Type of True/False' : selectOption.typeOfTandF.desc}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                        <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                    </View>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 50, paddingVertical: 2, marginBottom: 10 }} onPress={() => { getList("queFor") }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10 }}>{selectOption.queFor == null ? 'Select Question for' : selectOption.queFor.desc}</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 50, paddingVertical: 2, marginBottom: 10 }} onPress={() => { getList("marks") }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10 }}>{selectOption.marks == null ? 'Select Marks' : selectOption.marks}</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                }

                {
                    selectOption.marks != null && selectOption.activityType?.activityNameLang1 == "Multiple Choice Question" &&
                    <ScrollView>
                        <View style={{ paddingBottom: 10 }}>
                            <Text style={{ color: '#000', fontWeight: 500, marginBottom: 2 }}>Question:</Text>
                            <TextInput onChangeText={(txt) => saveMcqTxt(txt, 'queTxt')} value={saveMCQTxt.queTxt} style={styles.TxtInput}
                                multiline={true}
                                placeholder='Type your question here...' />
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7, alignItems: 'center' }} onPress={() => saveMCQTxt.opt1 != null ? checkAns('1') : null}>
                                <Text style={{ color: '#000', fontWeight: 500 }}>
                                    Option 1:
                                </Text>
                                <View>
                                    {
                                        saveMCQTxt.radioID == '1' && saveMCQTxt.queTxt != null ?
                                            <MaterialIcons name={"check-box"} size={25} color={userData.data.colors.mainTheme} /> :
                                            <MaterialIcons name={"check-box-outline-blank"} size={25} color={'grey'} />
                                    }
                                </View>
                            </TouchableOpacity>
                            <TextInput onChangeText={(txt) => saveMcqTxt(txt, 'opt1')} value={saveMCQTxt.opt1} style={styles.TxtInput}
                                multiline={true}
                                maxLength={saveMCQTxt.queTxt != null ? 100 : 0}
                                placeholder='Type option 1' />
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7, alignItems: 'center' }} onPress={() => saveMCQTxt.opt2 != null ? checkAns('2') : null}>
                                <Text style={{ color: '#000', fontWeight: 500 }}>
                                    Option 2:
                                </Text>
                                <View>
                                    {
                                        saveMCQTxt.radioID == '2' && saveMCQTxt.opt1 != null ?
                                            <MaterialIcons name={"check-box"} size={25} color={userData.data.colors.mainTheme} /> :
                                            <MaterialIcons name={"check-box-outline-blank"} size={25} color={'grey'} />
                                    }
                                </View>
                            </TouchableOpacity>
                            <TextInput onChangeText={(txt) => saveMcqTxt(txt, 'opt2')} value={saveMCQTxt.opt2} style={styles.TxtInput}
                                multiline={true}
                                maxLength={saveMCQTxt.opt1 != null ? 100 : 0}
                                placeholder='Type option 2' />
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7, alignItems: 'center' }} onPress={() => saveMCQTxt.opt3 != null ? checkAns('3') : null}>
                                <Text style={{ color: '#000', fontWeight: 500 }}>
                                    Option 3:
                                </Text>
                                <View>
                                    {
                                        saveMCQTxt.radioID == '3' && saveMCQTxt.opt2 != null ?
                                            <MaterialIcons name={"check-box"} size={25} color={userData.data.colors.mainTheme} /> :
                                            <MaterialIcons name={"check-box-outline-blank"} size={25} color={'grey'} />
                                    }
                                </View>
                            </TouchableOpacity>
                            <TextInput onChangeText={(txt) => saveMcqTxt(txt, 'opt3')} value={saveMCQTxt.opt3} style={styles.TxtInput}
                                multiline={true}
                                maxLength={saveMCQTxt.opt2 != null ? 100 : 0}
                                placeholder='Type option 3' />
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7, alignItems: 'center' }} onPress={() => saveMCQTxt.opt4 != null ? checkAns('4') : null}>
                                <Text style={{ color: '#000', fontWeight: 500 }}>
                                    Option 4:
                                </Text>
                                <View>
                                    {
                                        saveMCQTxt.radioID == '4' && saveMCQTxt.opt3 != null ?
                                            <MaterialIcons name={"check-box"} size={25} color={userData.data.colors.mainTheme} /> :
                                            <MaterialIcons name={"check-box-outline-blank"} size={25} color={'grey'} />
                                    }
                                </View>
                            </TouchableOpacity>
                            <TextInput onChangeText={(txt) => saveMcqTxt(txt, 'opt4')} value={saveMCQTxt.opt4} style={styles.TxtInput}
                                multiline={true}
                                maxLength={saveMCQTxt.opt3 != null ? 100 : 0}
                                placeholder='Type option 4' />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 50, paddingHorizontal: 20, paddingVertical: 5 }} onPress={() => submitQuestions()}>
                                <Text style={{ color: '#fff' }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                }

                {
                    selectOption.marks != null && selectOption.activityType?.activityNameLang1 == "Descriptive" &&
                    <ScrollView>
                        <View style={{ paddingBottom: 10 }}>
                            <Text style={{ color: '#000', fontWeight: 500, marginBottom: 2 }}>Question:</Text>
                            <TextInput onChangeText={(txt) => saveDescriptiveText(txt, 'ques')} value={saveDescTxt.queTxt} style={styles.TxtInput}
                                multiline={true}
                                placeholder='Type your question here...' />
                            <Text style={{ color: '#000', fontWeight: 500, marginBottom: 2 }}>Answer:</Text>
                            <TextInput onChangeText={(txt) => saveDescriptiveText(txt, 'ans')} value={saveDescTxt.answer} style={styles.TxtInput}
                                multiline={true}
                                maxLength={saveDescTxt.queTxt != null ? 500 : 0}
                                placeholder='Type your answer here...' />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 50, paddingHorizontal: 20, paddingVertical: 5 }} onPress={() => submitQuestions()}>
                                <Text style={{ color: '#fff' }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                }

                {
                    selectOption.marks != null && selectOption.activityType?.activityNameLang1 == "Fill in the Blank" &&
                    <ScrollView>
                        <Text style={{ backgroundColor: '#dc3545', color: '#fff', padding: 5 }}>Note:- Please type following character where you want to give fillup space <Text style={{ textDecorationLine: 'underline' }}>#</Text> . If you have multiple fillup in one statement then type fillup answers with ' , ' seperated.</Text>
                        <View style={{ paddingVertical: 10 }}>
                            <Text style={{ color: '#000', fontWeight: 500, marginBottom: 2 }}>Question Heading:</Text>
                            <TextInput onChangeText={(txt) => saveFillUpText(txt, 'head')}
                                value={saveFillUpTxt.head}
                                style={styles.TxtInput}
                                multiline={true}
                                placeholder='Type your question heading here...' />
                            <Text style={{ color: '#000', fontWeight: 500, marginBottom: 2 }}>Question Part:</Text>
                            <TextInput onChangeText={(txt) => saveFillUpText(txt, 'ques')}
                                value={saveFillUpTxt.queTxt}
                                style={styles.TxtInput}
                                multiline={true}
                                maxLength={saveFillUpTxt.head != null ? 500 : 0}
                                placeholder='Type your question here...' />
                            <Text style={{ color: '#000', fontWeight: 500, marginBottom: 2 }}>Answer:</Text>
                            <TextInput onChangeText={(txt) => saveFillUpText(txt, 'ans')}
                                value={saveFillUpTxt.answer}
                                style={styles.TxtInput}
                                multiline={true}
                                maxLength={saveFillUpTxt.queTxt != null ? 500 : 0}
                                placeholder='Type your answer here...' />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 50, paddingHorizontal: 20, paddingVertical: 5 }} onPress={() => submitQuestions()}>
                                <Text style={{ color: '#fff' }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                }

                {
                    selectOption.marks != null && selectOption.activityType?.activityNameLang1 == "True and False" && selectOption.typeOfTandF != null &&
                    <ScrollView>
                        {/* <Text style={{ backgroundColor: '#dc3545', color: '#fff', padding: 5 }}>If you have multiple true and false in one statement then type true and false answers with ' , ' seperated.</Text> */}
                        <View style={{ paddingBottom: 10 }}>
                            <Text style={{ color: '#000', fontWeight: 500, marginBottom: 2 }}>Question Heading:</Text>
                            <TextInput
                                onChangeText={(txt) => saveTandFText(txt, 'head')}
                                value={saveTandFTxt.head}
                                style={styles.TxtInput}
                                multiline={true}
                                placeholder='Type your question heading here...' />
                            <Text style={{ color: '#000', fontWeight: 500, marginBottom: 2 }}>Question Part:</Text>
                            <TextInput
                                onChangeText={(txt) => saveTandFText(txt, 'ques')}
                                value={saveTandFTxt.queTxt}
                                style={styles.TxtInput}
                                multiline={true}
                                maxLength={saveTandFTxt.head != null ? 500 : 0}
                                placeholder='Type your question here...' />
                            <Text style={{ color: '#000', fontWeight: 500, marginBottom: 2 }}>Answer:</Text>
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 5, paddingVertical: 2, marginBottom: 10 }} onPress={() => saveTandFTxt.queTxt != null ? setShowTandFpopUp(true) : null}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
                                        {selectTandF.data == null ? 'Select Answer' : selectTandF.data}
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 50, paddingHorizontal: 20, paddingVertical: 5 }} onPress={() => submitQuestions()}>
                                <Text style={{ color: '#fff' }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                }

            </View>

            {showTandFpopUp &&
                <View style={styles.selectFieldPopUp}>
                    <View style={{ backgroundColor: '#fff', marginHorizontal: 30, padding: 8, maxHeight: 300, borderRadius: 5 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', borderBottomWidth: .7, paddingBottom: 5, borderColor: 'grey' }} onPress={() => closeModal()}>
                            <AntDesign name={"close"} size={20} color={'#000'} />
                        </TouchableOpacity>
                        <ScrollView>
                            <View>
                                {
                                    tAndFarr.map((item, index) => {
                                        const ID = index
                                        return (
                                            <TouchableOpacity onPress={() => { selectTandFOpt(ID, item), closeModal() }} key={index}>
                                                <View style={{ padding: 10, borderBottomWidth: 1, borderColor: 'grey', flexDirection: 'row', alignItems: 'center' }}>
                                                    <View style={{ borderWidth: 2, borderColor: 'grey', width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20 / 2 }}>
                                                        <View style={{ borderWidth: 2, borderColor: 'grey', width: 11, height: 11, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                                                            {
                                                                selectTandF.radioID === ID ? <View style={{ backgroundColor: userData.data.colors.mainTheme, height: 11, width: 11, borderRadius: 50 }}></View> : null
                                                            }
                                                        </View>
                                                    </View>
                                                    <Text style={{ paddingLeft: 10, fontSize: 15, color: '#000' }}>
                                                        {item}
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

            {
                showPopUp &&
                <Modal ModalData={ModalData} closeModal={closeModal} selectModalOption={selectModalOption} selectOption={selectOption} colorSwa={userData.data.colors.mainTheme} />
            }

            {
                uploadInfo.status &&
                <View style={[styles.selectFieldPopUp, { paddingHorizontal: 10 }]}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 3 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 7, borderBottomWidth: .7, borderColor: 'grey' }}>
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: 500 }}>
                                Bulk Upload info
                            </Text>
                            <TouchableOpacity onPress={() => closeModal()}>
                                <AntDesign name={"close"} size={20} color={'#000'} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingTop: 5 }}>
                            {
                                uploadInfo.data?.rows.map((item, index) => {
                                    return (
                                        <View key={index}>
                                            <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
                                                <Text style={{ color: '#000' }}>
                                                    <Text style={{ color: '#0d6efd' }}>Row: </Text>{item.row},
                                                    <Text style={{ color: item.status == 'error' ? '#dc3545' : '#198754', textTransform: "capitalize" }}> {item.status}</Text>
                                                </Text>
                                                <Text style={{ color: '#000', textAlign: 'left' }}>
                                                    {item.message}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                })
                            }
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

    TxtInput: {
        borderWidth: .7,
        borderColor: 'grey',
        marginBottom: 7,
        borderRadius: 5,
        paddingHorizontal: 7
    }

});

export default AddQuestionManually