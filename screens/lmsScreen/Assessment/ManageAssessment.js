import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native"
import { useEffect, useState, useRef, useContext } from "react"
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SignatureScreen from "react-native-signature-canvas";
import { apiRoot, SWATheam } from "../../../constant/ConstentValue"
import Loader from "../../common/Loader"
import { GlobleData } from "../../../Store"
import Services from "../../../Services"



let counter = 0
let checkCount = 0;
let totalStudentIDsArr = []
let imgDataUriArr = []
let saveMarksArr = []

const ManageAssessment = ({ navigation, editAssessment }) => {
    const { userData } = useContext(GlobleData)
    const [loading, setLoading] = useState(false)
    const [assessmentData, setAssessmentData] = useState({ data: null, status: false })
    const [showPopUp, setShowPopUp] = useState({ data: null, radioID: null, status: false })
    const [showSelectedStu, setShowSelectedStu] = useState({ data: null, status: false })
    const [showReAssign, setShowReAssign] = useState({ data: null, status: false })
    let [studentUserArr, setStudentUserArr] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    const [showPDF, setShowPDF] = useState({ data: null, status: false })
    const [showCheckOffline, setShowCheckOffline] = useState({ data: null, status: false })
    const [offlinePaper, setOfflinePaper] = useState({ data: null, status: false })
    const ref = useRef();
    const [penColor, setPenColor] = useState('#000')
    const [showColorPalate, setShowColorPalate] = useState(false)
    const [signature, setSign] = useState(null)
    const [allCheckFilesArr, setAllCheckFilesArr] = useState([])
    const [hideMarks, setHideMarks] = useState(false)
    const [count, setCount] = useState(counter)
    const [marksSelectPopUp, setMarksSelectPopUp] = useState({ data: null, status: false })
    const [showCanvas, setShowCanvas] = useState({ canvas1: false, canvas2: false, canvas3: false, canvas4: false, canvas5: false, screenNo: null })

    useEffect(() => {
        getAllAssessments()
    }, [])

    const getAllAssessments = async () => {
        setLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "userTypeID": userData.data.userTypeID,
            "userRefID": userData.data.userRefID,
        }
        Services.post(apiRoot.getAssessmentList, payload)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    const data = res.data
                    setAssessmentData((prev) => {
                        return { ...prev, data: data, status: true }
                    })
                } else {
                    setLoading(false)
                    alert(res.message)
                    setAssessmentData({ data: null, status: false })
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })

    }

    const deleteAssessment = async (item) => {
        setLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "assessmentID": item.assessmentID
        }
        Services.post(apiRoot.deleteAssessment, payload)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    alert(res.message)
                    getAllAssessments()
                } else if (res.status == "error") {
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

    const declareResult = async (item) => {
        setLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "assessmentID": item.assessmentID
        }
        Services.post(apiRoot.declareAssessmentResult, payload)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    alert(res.message)
                    getAllAssessments()
                } else if (res.status == "error") {
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

    const getStudents = async (item = null) => {
        setShowSelectedStu({ data: null, status: false })
        setLoading(true)
        if (item == null) {
            const payload = {
                "schoolCode": userData.data.schoolCode,
                "classID": showPopUp.data?.classID,
                "sectionID": showPopUp.data?.sectionID,
                "academicYear": userData.data.academicYear,
                "transYear": userData.data.transYear
            }
            Services.post(apiRoot.getStudentsData, payload)
                .then((res) => {
                    if (res.status == "success") {
                        setLoading(false)
                        const data = res.data
                        setShowSelectedStu((prev) => {
                            return { ...prev, data: data, status: true }
                        })
                        totalStudentIDsArr = []
                        data.map((item) => {
                            totalStudentIDsArr.push(item.userRefID)
                        })
                    } else if (res.status == "error") {
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
        else {
            const payload = {
                "schoolCode": userData.data.schoolCode,
                "classID": item.classID,
                "sectionID": item.sectionID,
                "academicYear": userData.data.academicYear,
                "transYear": userData.data.transYear
            }
            Services.post(apiRoot.getStudentsData, payload)
                .then((res) => {
                    if (res.status == "success") {
                        setLoading(false)
                        const data = res.data
                        setShowSelectedStu((prev) => {
                            return { ...prev, data: data, status: true }
                        })
                        totalStudentIDsArr = []
                        studentUserArr.length = 0
                        data.map((item, key) => {
                            totalStudentIDsArr.push(item.userRefID)
                            studentUserArr.push(item.userRefID)
                            checkCount = key + 1
                        })

                        if (checkCount == totalStudentIDsArr.length) {
                            setSelectAll(true)
                        } else {
                            setSelectAll(true)
                        }
                    } else if (res.status == "error") {
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
    }


    const assignBtn = (item) => {
        setShowPopUp((prev) => {
            return { ...prev, data: item, status: true }
        })
    }

    const closeModal = (type = "") => {
        if (type == 1) {
            setOfflinePaper((prev) => {
                return { ...prev, status: false }
            })
            counter = 0
            setCount(counter)
            setShowCanvas({ canvas1: false, canvas2: false, canvas3: false, canvas4: false, canvas5: false })
            allCheckFilesArr.length = 0
        }
        else if (type == 2) {
            setMarksSelectPopUp((prev) => {
                return { ...prev, status: false }
            })
        }
        else {
            setShowPopUp((prev) => {
                return { ...prev, status: false }
            })
            setShowSelectedStu((prev) => {
                return { ...prev, status: false }
            })
            setShowReAssign((prev) => {
                return { ...prev, status: false }
            })
            setShowCheckOffline((prev) => {
                return { ...prev, status: false }
            })
            setOfflinePaper((prev) => {
                return { ...prev, status: false }
            })
            setMarksSelectPopUp((prev) => {
                return { ...prev, status: false }
            })
            studentUserArr.length = 0
            setSelectAll(false)
        }
    }

    const selectModalOpt = (ID) => {
        setShowPopUp((prev) => {
            return { ...prev, radioID: ID }
        })
        closeModal()
        getStudents()
    }

    const selectStudent = (ID) => {
        if (studentUserArr.includes(ID)) {
            setStudentUserArr(studentUserArr.filter(item => item !== ID))
            checkCount--
        } else {
            setStudentUserArr([...studentUserArr, ID])
            checkCount++
        }

        if (checkCount == totalStudentIDsArr.length) {
            setSelectAll(true)
        } else {
            setSelectAll(false)
        }
    }

    const selectAllBtn = () => {
        if (!selectAll) {
            setSelectAll(true)
            showSelectedStu.data.map((item) => {
                if (!studentUserArr.includes(item.userRefID)) {
                    studentUserArr.push(item.userRefID)
                }
            })
        } else {
            setSelectAll(false)
            studentUserArr.length = 0
        }
    }

    const assignStudents = async () => {
        setLoading(true)
        let IDs = ""
        let allIDs = "All"

        studentUserArr?.map((item) => {
            IDs += item + ','
        })

        let finalID = IDs.slice(0, IDs.length - 1)

        if (studentUserArr.length == totalStudentIDsArr.length) {
            finalID = allIDs
        } else {
            finalID
        }

        const payload = {
            "schoolCode": userData.data.schoolCode,
            "userRefID": showPopUp.data?.getUserName.userRefID,
            "academicYear": showPopUp.data?.getUserName.academicYear,
            "assessmentID": showPopUp.data?.assessmentID,
            "studentRefIDs": finalID
        }
        Services.post(apiRoot.assignAssessmentToStudents, payload)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    alert(res.message)
                    setShowSelectedStu({ data: null, status: false })
                    getAllAssessments()
                } else if (res.status == "error") {
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

    const getReAssignSections = async (item) => {
        setLoading(true)
        const payload = {
            "schoolCode": item?.schoolCode,
            "academicYear": item.getUserName?.academicYear,
            "userTypeID": item?.getUserName?.userTypeID,
            "assessmentID": item?.assessmentID
        }
        Services.post(apiRoot.getSectionForReAssign, payload)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    const data = res.data
                    setShowReAssign((prev) => {
                        return { ...prev, data: data, status: true }
                    })
                } else if (res.status == "error") {
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

    const selectNotAttemptBtn = (item) => {
        setShowReAssign((prev) => {
            return { ...prev, status: false }
        })
        getStudents(item)
    }

    const downloadAssessmentPdf = async (item) => {
        setLoading(true)
        Services.post(apiRoot.downloadAssPdf, { "assessmentID": item?.assessmentID })
            .then((res) => {
                navigation.navigate('asspdfView', { data: res })
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const checkOfflineBtn = async (item) => {
        setLoading(true)
        if (item != null) {
            const payload = {
                "schoolCode": item?.schoolCode,
                "classID": item?.classID,
                "subjectID": item?.subjectID,
                "assessmentID": item?.assessmentID
            }
            Services.post(apiRoot.checkOfflineList, payload)
                .then((res) => {
                    if (res.status == "success") {
                        const data = res.data
                        setShowCheckOffline((prev) => {
                            return { ...prev, data: data, status: true }
                        })
                    } else if (res.status == "error") {
                        alert(res.message)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    setLoading(false)
                })


        } else {
            const payload = {
                "schoolCode": userData.data.schoolCode,
                "classID": offlinePaper.data?.classID,
                "subjectID": offlinePaper.data?.subjectID,
                "assessmentID": offlinePaper.data?.assessmentID
            }
            Services.post(apiRoot.checkOfflineList, payload)
                .then((res) => {
                    if (res.status == "success") {
                        setLoading(false)
                        const data = res.data
                        setShowCheckOffline((prev) => {
                            return { ...prev, data: data, status: true }
                        })
                    } else if (res.status == "error") {
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
    }

    const checkPaperBtn = async (item) => {
        item?.solutionSheet?.map((src, index) => {
            convertImgToDataUrl(src, (myBase64) => {
                imgDataUriArr.push(myBase64)
                setOfflinePaper((prev) => {
                    return { ...prev, data: item, status: true }
                })
            });
        })
        // count = 1
        if (item?.solutionSheet.length) {
            setShowCanvas((prev) => {
                return { ...prev, canvas1: true }
            })
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

    const handlePenColor = (color) => {
        ref.current.changePenColor(color);
    };

    const selectPenColor = (color) => {
        handlePenColor(color)
        setPenColor(color)
        setShowColorPalate(false)
    }

    const selectMarksBtn = (item, index) => {
        setMarksSelectPopUp((prev) => {
            return { ...prev, data: item, status: true }
        })
        selectIndexNo = index
    }

    const selectMarks = (mark) => {
        let obj = {
            "questionID": marksSelectPopUp.data?.questionID,
            "marks": mark
        }
        saveMarksArr.push(obj)
    }

    const saveMarks = async () => {
        setLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "userRefID": offlinePaper.data?.userRefID,
            "assessmentID": offlinePaper.data?.assessmentID,
            "marks": saveMarksArr
        }
        Services.post(apiRoot.saveDescMarks, payload)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    alert(res.message)
                } else if (res.status == "error") {
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

    const handleOK = (sign) => {
        setSign(sign)
        let fileImgData = {
            "fileCopyUri": null,
            "name": 'check_img',
            "size": "2576",
            "type": "image/jpg",
            "uri": sign
        }
        setAllCheckFilesArr([...allCheckFilesArr, fileImgData])
        counter++
        setCount(counter)
        if (counter <= showCheckOffline.data?.uploadedList[0]?.solutionSheet?.length) {
            if (counter == 1 && showCheckOffline.data?.uploadedList[0]?.solutionSheet?.length > counter) {
                setShowCanvas((prev) => {
                    return { ...prev, canvas1: false, canvas2: true }
                })
            }
            else if (counter == 2 && showCheckOffline.data?.uploadedList[0]?.solutionSheet?.length > counter) {
                setShowCanvas((prev) => {
                    return { ...prev, canvas1: false, canvas2: false, canvas3: true }
                })
            }
            else if (counter == 3 && showCheckOffline.data?.uploadedList[0]?.solutionSheet?.length > counter) {
                setShowCanvas((prev) => {
                    return { ...prev, canvas1: false, canvas2: false, canvas3: false, canvas4: true }
                })
            }
            else if (counter == 4 && showCheckOffline.data?.uploadedList[0]?.solutionSheet?.length > counter) {
                setShowCanvas((prev) => {
                    return { ...prev, canvas1: false, canvas2: false, canvas3: false, canvas4: false, canvas5: true }
                })
            }
        }
    };

    const handleUndo = () => {
        ref.current.undo();
    };

    const handleClear = () => {
        ref.current.clearSignature();
    };

    const handleConfirm = () => {
        ref.current.readSignature()
    };

    const saveCheckOffline = async () => {
        setLoading(true)
        const formData = new FormData();
        formData.append("schoolCode", userData.data.schoolCode)
        formData.append("userRefID", offlinePaper.data?.userRefID)
        formData.append("assessmentID", offlinePaper.data?.assessmentID)

        for (let i = 0; i < allCheckFilesArr.length; i++) {
            formData.append("files[]", allCheckFilesArr[i])
        }

        Services.formMethod(apiRoot.checkDescSheets, formData)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    alert(res.message)
                    counter = 0
                    setCount(counter)
                    setShowCanvas({ canvas1: false, canvas2: false, canvas3: false, canvas4: false, canvas5: false })
                    allCheckFilesArr.length = 0
                    setOfflinePaper({ data: null, status: false })
                    checkOfflineBtn()
                } else if (res.status == "error") {
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

    const style = `.m-signature-pad--footer {display: none}`;

    return (
        <>
            {loading ?
                <Loader /> :
                <View style={{ flex: 1 }}>
                    <>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderColor: SWATheam.SwaBlack }}>
                            <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>
                                Manage Assessment
                            </Text>
                        </View>
                        <View style={{ flex: 1, padding: 10 }}>
                            <ScrollView>
                                {
                                    assessmentData.status ?
                                        <View>
                                            {
                                                assessmentData.data.map((item, index) => {
                                                    const fileName = item.uploadFileName
                                                    let fName = item.getUserName?.firstName
                                                    let mName = item.getUserName?.middleName != null ? ' ' + item.getUserName?.middleName : ''
                                                    let lName = item.getUserName?.lastName != null ? ' ' + item.getUserName?.lastName : ''
                                                    ""
                                                    let fullName = fName + mName + lName

                                                    personStatus = ""
                                                    if (item.getUserName.userTypeID == 2) {
                                                        personStatus = "School"
                                                    } else if (item.getUserName.userTypeID == 4) {
                                                        personStatus = "Teacher"
                                                    }

                                                    return (
                                                        <View style={{ borderWidth: .7, borderColor: 'grey', backgroundColor: SWATheam.SwaWhite, marginBottom: 10, borderRadius: 5, padding: 5 }} key={index}>
                                                            {
                                                                item.attemptStatus == 0 ?
                                                                    <View style={{ flexDirection: 'row', backgroundColor: SWATheam.SwaRed, justifyContent: 'center', padding: 2 }}>
                                                                        <Text style={{ color: '#fff', paddingHorizontal: 5, textAlign: 'right', paddingVertical: 2 }}>Not Attempted</Text>
                                                                    </View> :
                                                                    item.attemptStatus == 1 ?
                                                                        <View style={{ flexDirection: 'row', backgroundColor: SWATheam.SwaGreen, padding: 2, justifyContent: 'center' }}>
                                                                            <Text style={{ color: '#fff', paddingHorizontal: 5, textAlign: 'right', paddingVertical: 2 }}>Attempted</Text>
                                                                        </View>
                                                                        : null
                                                            }
                                                            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                                <View style={{ width: 100, }}>
                                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Assess. Name</Text>
                                                                </View>
                                                                <View style={{ paddingRight: 10 }}>
                                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                                </View>
                                                                <View style={{ flex: 1, }}>
                                                                    <Text style={{ color: '#000', fontSize: 14 }}>{item.assessmentName}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
                                                                <View style={{ width: 100, }}>
                                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Total Question </Text>
                                                                </View>
                                                                <View style={{ paddingRight: 10 }}>
                                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                                </View>
                                                                <View style={{ flex: 1, }}>
                                                                    <Text style={{ color: '#000', fontSize: 14 }}>{item.noOfQuestion}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
                                                                <View style={{ width: 100, }}>
                                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Start Date </Text>
                                                                </View>
                                                                <View style={{ paddingRight: 10 }}>
                                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                                </View>
                                                                <View style={{ flex: 1, }}>
                                                                    <Text style={{ color: '#000', fontSize: 14 }}>{item.startDate}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
                                                                <View style={{ width: 100, }}>
                                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>End Date </Text>
                                                                </View>
                                                                <View style={{ paddingRight: 10 }}>
                                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                                </View>
                                                                <View style={{ flex: 1, }}>
                                                                    <Text style={{ color: '#000', fontSize: 14 }}>{item.endDate}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
                                                                <View style={{ width: 100, }}>
                                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Generated By </Text>
                                                                </View>
                                                                <View style={{ paddingRight: 10 }}>
                                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                                </View>
                                                                <View style={{ flex: 1, }}>
                                                                    <Text style={{ color: '#000', fontSize: 14 }}>{fullName} ({personStatus})</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
                                                                <View style={{ width: 100, }}>
                                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>Status</Text>
                                                                </View>
                                                                <View style={{ paddingRight: 10 }}>
                                                                    <Text style={{ fontWeight: "500", fontSize: 14, color: '#000' }}>:</Text>
                                                                </View>
                                                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                                    {
                                                                        item.isAssign == 0 ?
                                                                            <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3 }} onPress={() => assignBtn(item)}>
                                                                                <Text style={{ color: '#fff', textAlign: 'center' }}>
                                                                                    Not Assigned
                                                                                </Text>
                                                                            </TouchableOpacity> :
                                                                            item.isAssign == 1 ?
                                                                                <TouchableOpacity style={{ backgroundColor: '#0d6efd', borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3 }} onPress={() => getReAssignSections(item)}>
                                                                                    <Text style={{ color: '#fff', textAlign: 'center' }}>
                                                                                        Re-Assign
                                                                                    </Text>
                                                                                </TouchableOpacity>
                                                                                :
                                                                                null
                                                                    }
                                                                </View>
                                                            </View>
                                                            <View style={{ borderTopWidth: .7, justifyContent: 'space-between', flexDirection: 'row', paddingTop: 6, borderColor: 'grey' }}>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    {
                                                                        item.resultDeclareStatus == 0 ?
                                                                            <TouchableOpacity style={{ borderRadius: 5, backgroundColor: '#198754', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 30 }} onPress={() => declareResult(item)}>
                                                                                <Text style={{ color: '#fff' }}>Declare Result</Text>
                                                                            </TouchableOpacity>
                                                                            :
                                                                            item.resultDeclareStatus == 1 ?
                                                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                                    <Text style={{ color: '#198754', textAlign: 'center', fontWeight: 700 }}>
                                                                                        Result Declared
                                                                                    </Text>
                                                                                </View>
                                                                                :
                                                                                null
                                                                    }
                                                                    {
                                                                        item.isDescriptive == 1 &&
                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                                                                            <TouchableOpacity style={{ borderRadius: 5, backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 30 }} onPress={() => checkOfflineBtn(item)}>
                                                                                <Text style={{ color: '#fff' }}>Check Offline</Text>
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    }
                                                                </View>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    {/* { item.attemptStatus != 1 &&
                                                        <TouchableOpacity style={{ width: 30, flexDirection: 'row', justifyContent: 'center', borderWidth: 1, borderColor: 'grey', borderRadius: 5, padding: 3 }} onPress={()=>editAssessment(item)}>
                                                            <Entypo name={"edit"} size={20} color={'#0d6efd'} />
                                                        </TouchableOpacity>

                                                    } */}
                                                                    <TouchableOpacity style={{ width: 30, flexDirection: 'row', justifyContent: 'center', borderWidth: 1, borderColor: 'grey', borderRadius: 5, padding: 3, marginLeft: 5 }} onPress={() => deleteAssessment(item)}>
                                                                        <MaterialIcons name={"delete"} size={20} color={'#dc3545'} />
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity style={{ width: 30, flexDirection: 'row', justifyContent: 'center', borderWidth: 1, borderColor: 'grey', borderRadius: 5, padding: 3, marginLeft: 5 }} onPress={() => downloadAssessmentPdf(item)}>
                                                                        <Octicons name="download" size={20} color={'#198754'} />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                        :
                                        <View style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 5, backgroundColor: SWATheam.SwaWhite }}>
                                            <Text style={{ color: 'red', fontSize: 14, textAlign: 'center', padding: 5 }}>Assessment not available</Text>
                                        </View>
                                }
                            </ScrollView>
                        </View>
                    </>
                </View>
            }
            {showPopUp.status &&
                <View style={styles.selectFieldPopUp}>
                    <View style={{ backgroundColor: '#fff', marginHorizontal: 30, padding: 8, maxHeight: 300, borderRadius: 5 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', borderBottomWidth: .7, paddingBottom: 5, borderColor: 'grey' }} onPress={() => closeModal()}>
                            <AntDesign name={"close"} size={20} color={'#000'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ borderBottomWidth: .7, padding: 8, flexDirection: 'row', alignItems: 'center' }} onPress={() => selectModalOpt()}>
                            <View style={{ borderWidth: 2, borderColor: 'grey', width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20 / 2 }}>
                                <View style={{ borderWidth: 2, borderColor: 'grey', width: 11, height: 11, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                                    {
                                        showPopUp.radioID == 1 ? <View style={{ backgroundColor: userData.data.colors.mainTheme, height: 11, width: 11, borderRadius: 50 }}></View> : null
                                    }
                                </View>
                            </View>
                            <Text style={{ color: '#000', paddingLeft: 7 }}>Select Students</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }

            {showSelectedStu.status &&
                <View style={styles.selectFieldPopUp}>
                    <View style={{ backgroundColor: '#fff', marginHorizontal: 30, padding: 8, maxHeight: 300, borderRadius: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: .7, borderColor: 'grey', marginBottom: 5 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }} onPress={() => selectAllBtn()}>
                                {
                                    selectAll ?
                                        <MaterialIcons name={"check-box"} size={20} color={userData.data.colors.mainTheme} /> :
                                        < MaterialIcons name={"check-box-outline-blank"} size={20} color={userData.data.colors.mainTheme} />
                                }
                                <Text style={{ color: '#000', paddingLeft: 5 }}>Select All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingBottom: 5 }} onPress={() => closeModal()}>
                                <AntDesign name={"close"} size={20} color={'#000'} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {
                                showSelectedStu.data?.map((item, index) => {
                                    const ID = item.userRefID
                                    return (
                                        <TouchableOpacity style={{ borderBottomWidth: .7, borderColor: 'grey', padding: 7 }} key={index} onPress={() => selectStudent(ID)}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                {
                                                    studentUserArr.includes(ID) ?
                                                        <MaterialIcons name={"check-box"} size={20} color={userData.data.colors.mainTheme} /> :
                                                        < MaterialIcons name={"check-box-outline-blank"} size={20} color={userData.data.colors.mainTheme} />
                                                }
                                                <Text style={{ color: '#000', paddingLeft: 5 }}>{item.fullName}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollView>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5, alignItems: 'center' }}>
                            <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5 }} onPress={() => assignStudents()}>
                                <Text style={{ color: '#fff' }}>Assign</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <TouchableOpacity style={{ borderBottomWidth: .7, padding: 8, flexDirection: 'row', alignItems: 'center' }} onPress={() => selectModalOpt(1)}>
                            <View style={{ borderWidth: 2, borderColor: 'grey', width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20 / 2 }}>
                                <View style={{ borderWidth: 2, borderColor: 'grey', width: 11, height: 11, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                                    {
                                        showPopUp.radioID == 1 ? <View style={{ backgroundColor: colorSwa, height: 11, width: 11, borderRadius: 50 }}></View> : null
                                    }
                                </View>
                            </View>
                            <Text style={{ color: '#000', paddingLeft: 7 }}>Selected Students</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 8, flexDirection: 'row', alignItems: 'center' }} onPress={() => selectModalOpt(2)}>
                            <View style={{ borderWidth: 2, borderColor: 'grey', width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20 / 2 }}>
                                <View style={{ borderWidth: 2, borderColor: 'grey', width: 11, height: 11, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                                    {
                                        showPopUp.radioID == 2 ? <View style={{ backgroundColor: colorSwa, height: 11, width: 11, borderRadius: 50 }}></View> : null
                                    }
                                </View>
                            </View>
                            <Text style={{ color: '#000', paddingLeft: 7 }}>Whole Class</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
            }

            {showReAssign.status &&
                <View style={styles.selectFieldPopUp}>
                    <View style={{ backgroundColor: '#fff', marginHorizontal: 30, padding: 8, maxHeight: 300, borderRadius: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: .7, borderColor: 'grey', paddingBottom: 5 }}>
                            <Text style={{ color: '#000', fontWeight: 500 }}>Assign Assessment to other sections</Text>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }} onPress={() => closeModal()}>
                                <AntDesign name={"close"} size={20} color={'#000'} />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ color: '#fff', backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 5, paddingVertical: 3 }}>Class {showReAssign.data[0]?.classID}</Text>
                        {
                            showReAssign.data?.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <View style={{ borderBottomWidth: .7, padding: 8, flexDirection: 'row', alignItems: 'center', borderColor: 'grey', justifyContent: 'space-between' }}>
                                            <Text style={{ color: '#000', paddingLeft: 7 }}>Section {item.sectionName}</Text>
                                            {
                                                item.sectionAttemptStatus == 1 ?
                                                    <View style={{ backgroundColor: '#198754', paddingHorizontal: 5, paddingVertical: 3, borderRadius: 3, width: 110 }}>
                                                        <Text style={{ color: '#fff', textAlign: 'center' }}>Attempted</Text>
                                                    </View> :
                                                    < TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 3, width: 110 }} onPress={() => { selectNotAttemptBtn(item), getStudents(item) }}>
                                                        <Text style={{ color: '#fff', textAlign: 'center' }}>Not Attempted</Text>
                                                    </TouchableOpacity>
                                            }
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            }

            {showPDF.status &&
                <Text>Download Component</Text>
            }

            {showCheckOffline.status &&
                <View style={styles.selectFieldPopUp2}>
                    <View style={{ backgroundColor: '#fff', padding: 8, maxHeight: 300, borderRadius: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: .7, borderColor: 'grey', paddingBottom: 5, marginBottom: 5 }}>
                            <Text style={{ color: '#000', fontWeight: 500, fontSize: 16 }}>Assessment: Offline Check</Text>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }} onPress={() => closeModal()}>
                                <AntDesign name={"close"} size={20} color={'#000'} />
                            </TouchableOpacity>
                        </View>
                        {
                            showCheckOffline.data?.uploadedList?.map((item, index) => {
                                return (
                                    <View style={{ borderWidth: .7, marginBottom: 5, padding: 5, borderColor: 'grey', borderRadius: 3 }} key={index}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: 110 }}>
                                                <Text style={{ color: '#000' }}>Student Name</Text>
                                            </View>
                                            <View style={{ paddingHorizontal: 5 }}>
                                                <Text style={{ color: '#000' }}>:</Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: '#000' }}>{item.studentData?.fullName}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: 110 }}>
                                                <Text style={{ color: '#000' }}>Class</Text>
                                            </View>
                                            <View style={{ paddingHorizontal: 5 }}>
                                                <Text style={{ color: '#000' }}>:</Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: '#000' }}>{item.classID}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: 110 }}>
                                                <Text style={{ color: '#000' }}>Subject</Text>
                                            </View>
                                            <View style={{ paddingHorizontal: 5 }}>
                                                <Text style={{ color: '#000' }}>:</Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: '#000' }}>{item.subjectName}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: 110 }}>
                                                <Text style={{ color: '#000' }}>Submission Date</Text>
                                            </View>
                                            <View style={{ paddingHorizontal: 5 }}>
                                                <Text style={{ color: '#000' }}>:</Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: '#000' }}>{item.subjectName}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: item.isValidateByExaminer == 1 ? 'flex-end' : 'space-between', paddingTop: 5, borderTopWidth: .7, borderColor: 'grey', marginTop: 5 }}>
                                            {item.isValidateByExaminer == null &&
                                                <View style={{ backgroundColor: '#dc3545', borderRadius: 5, paddingHorizontal: 5 }}>
                                                    <Text style={{ color: '#fff', padding: 5 }}>Pending</Text>
                                                </View>
                                            }
                                            <TouchableOpacity style={{ backgroundColor: '#198754', borderRadius: 5, width: 110 }} onPress={() => item.isValidateByExaminer == 1 ? null : checkPaperBtn(item)}>
                                                <Text style={{ color: '#fff', padding: 5, textAlign: 'center' }}>
                                                    {

                                                        item.isValidateByExaminer == 1 ?
                                                            "Checked" : "Check Paper"
                                                    }
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            }

            {offlinePaper.status &&
                <View style={styles.selectFieldPopUp2}>
                    <View style={{ backgroundColor: '#fff', padding: 8, maxHeight: 300, borderRadius: 5, flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: .7, borderColor: 'grey', paddingBottom: 5, marginBottom: 5 }}>
                            <Text style={{ color: '#000', fontWeight: 500, fontSize: 16 }}>Answer Sheet</Text>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }} onPress={() => closeModal(1)}>
                                <AntDesign name={"close"} size={20} color={'#000'} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 5 }}>
                            <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, borderRadius: 5, paddingVertical: 4, flexDirection: 'row' }} onPress={() => setHideMarks(!hideMarks)}>
                                <Ionicons name={hideMarks ? "eye" : "eye-off"} size={20} color={'#fff'} />
                                <Text style={{ color: '#fff', paddingLeft: 5 }}>Marks</Text>
                            </TouchableOpacity>
                        </View>

                        {
                            hideMarks &&
                            <View style={{ borderWidth: .7, borderRadius: 3, padding: 5, marginBottom: 5, borderColor: 'grey' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: 100 }}>
                                        <Text style={{ color: '#000' }}>Enrollment No.</Text>
                                    </View>
                                    <View style={{ paddingRight: 5 }}>
                                        <Text style={{ color: '#000' }}>:</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: '#000' }}>{offlinePaper.data.studentData?.registrationNo}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: 100 }}>
                                        <Text style={{ color: '#000' }}>Student Name</Text>
                                    </View>
                                    <View style={{ paddingRight: 5 }}>
                                        <Text style={{ color: '#000' }}>:</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: '#000' }}>{offlinePaper.data.studentData?.fullName}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: 100 }}>
                                        <Text style={{ color: '#000' }}>Contact No.</Text>
                                    </View>
                                    <View style={{ paddingRight: 5 }}>
                                        <Text style={{ color: '#000' }}>:</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: '#000' }}>{offlinePaper.data.studentData?.contactNo}</Text>
                                    </View>
                                </View>
                                <Text style={{ color: '#000', marginBottom: 3 }}>Marks:</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                    {
                                        showCheckOffline.data?.questionsList?.map((item, index) => {
                                            return (
                                                <View style={{ margin: 1, marginBottom: 4, width: '49%' }} key={index}>
                                                    <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 50, paddingVertical: 2 }} onPress={() => { selectMarksBtn(item, index) }}>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ paddingVertical: 5, paddingHorizontal: 10 }}>{saveMarksArr[index] == undefined ? "Select Marks" : saveMarksArr[index]?.marks}</Text>
                                                        </View>
                                                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                                            <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 20, borderRadius: 5, paddingVertical: 5 }} onPress={() => saveMarks()}>
                                        <Text style={{ color: '#fff' }}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }

                        {
                            showCanvas.canvas1 &&
                            <View style={{}}>
                                <View style={{ height: 300 }}>
                                    <SignatureScreen
                                        ref={ref}
                                        onOK={handleOK}
                                        dataURL={imgDataUriArr[0]}
                                        webStyle={style}
                                        style={{ borderWidth: .7, borderColor: 'grey', height: 300 }}
                                    />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleUndo}>
                                            <Text style={{ color: '#fff' }}>Undo</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ backgroundColor: penColor, borderColor: 'grey', width: 50, borderWidth: 3, paddingVertical: 10, borderRadius: 5 }} onPress={() => setShowColorPalate(true)}>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleClear}>
                                            <Text style={{ color: '#fff' }}>Clear</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {
                                    counter != showCheckOffline.data?.uploadedList[0].solutionSheet.length &&
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, paddingTop: 10, borderColor: 'grey', backgroundColor: '#fff' }}>
                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleConfirm}>
                                            <Text style={{ color: '#fff' }}>Next</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        }

                        {
                            showCanvas.canvas2 &&
                            <View style={{}}>
                                <View style={{ height: 300 }}>
                                    <SignatureScreen
                                        ref={ref}
                                        onOK={handleOK}
                                        dataURL={imgDataUriArr[1]}
                                        webStyle={style}
                                        style={{ borderWidth: .7, borderColor: 'grey', height: 300 }}
                                    />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleUndo}>
                                            <Text style={{ color: '#fff' }}>Undo</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ backgroundColor: penColor, borderColor: 'grey', width: 50, borderWidth: 3, paddingVertical: 10, borderRadius: 5 }} onPress={() => setShowColorPalate(true)}>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleClear}>
                                            <Text style={{ color: '#fff' }}>Clear</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {
                                    counter != showCheckOffline.data?.uploadedList[0].solutionSheet.length &&
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, paddingTop: 10, borderColor: 'grey', backgroundColor: '#fff' }}>
                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleConfirm}>
                                            <Text style={{ color: '#fff' }}>Next</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        }

                        {
                            showCanvas.canvas3 &&
                            <View style={{}}>
                                <View style={{ height: 300 }}>
                                    <SignatureScreen
                                        ref={ref}
                                        onOK={handleOK}
                                        dataURL={imgDataUriArr[2]}
                                        webStyle={style}
                                        style={{ borderWidth: .7, borderColor: 'grey', height: 300 }}
                                    />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleUndo}>
                                            <Text style={{ color: '#fff' }}>Undo</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ backgroundColor: penColor, borderColor: 'grey', width: 50, borderWidth: 3, paddingVertical: 10, borderRadius: 5 }} onPress={() => setShowColorPalate(true)}>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleClear}>
                                            <Text style={{ color: '#fff' }}>Clear</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {
                                    counter != showCheckOffline.data?.uploadedList[0].solutionSheet.length &&
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, paddingTop: 10, borderColor: 'grey', backgroundColor: '#fff' }}>
                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleConfirm}>
                                            <Text style={{ color: '#fff' }}>Next</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        }

                        {
                            showCanvas.canvas4 &&
                            <View style={{}}>
                                <View style={{ height: 300 }}>
                                    <SignatureScreen
                                        ref={ref}
                                        onOK={handleOK}
                                        dataURL={imgDataUriArr[3]}
                                        webStyle={style}
                                        style={{ borderWidth: .7, borderColor: 'grey', height: 300 }}
                                    />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleUndo}>
                                            <Text style={{ color: '#fff' }}>Undo</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ backgroundColor: penColor, borderColor: 'grey', width: 50, borderWidth: 3, paddingVertical: 10, borderRadius: 5 }} onPress={() => setShowColorPalate(true)}>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleClear}>
                                            <Text style={{ color: '#fff' }}>Clear</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {
                                    counter != showCheckOffline.data?.uploadedList[0].solutionSheet.length &&
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, paddingTop: 10, borderColor: 'grey', backgroundColor: '#fff' }}>
                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleConfirm}>
                                            <Text style={{ color: '#fff' }}>Next</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        }

                        {
                            showCanvas.canvas5 &&
                            <View style={{}}>
                                <View style={{ height: 300 }}>
                                    <SignatureScreen
                                        ref={ref}
                                        onOK={handleOK}
                                        dataURL={imgDataUriArr[4]}
                                        webStyle={style}
                                        style={{ borderWidth: .7, borderColor: 'grey', height: 300 }}
                                    />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleUndo}>
                                            <Text style={{ color: '#fff' }}>Undo</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ backgroundColor: penColor, borderColor: 'grey', width: 50, borderWidth: 3, paddingVertical: 10, borderRadius: 5 }} onPress={() => setShowColorPalate(true)}>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleClear}>
                                            <Text style={{ color: '#fff' }}>Clear</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {
                                    counter != showCheckOffline.data?.uploadedList[0].solutionSheet.length &&
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, paddingTop: 10, borderColor: 'grey', backgroundColor: '#fff' }}>
                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={handleConfirm}>
                                            <Text style={{ color: '#fff' }}>Next</Text>
                                        </TouchableOpacity>
                                    </View>
                                }

                            </View>
                        }

                        {
                            count == showCheckOffline.data?.uploadedList[0].solutionSheet.length &&
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, paddingTop: 10, borderColor: 'grey', backgroundColor: '#fff' }}>
                                <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 }} onPress={() => saveCheckOffline()}>
                                    <Text style={{ color: '#fff' }}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        }

                    </View>
                </View>
            }

            {showColorPalate &&
                <View style={styles.colorPalate}>
                    <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5, zIndex: 9 }} onPress={() => setShowColorPalate(false)}>
                        <AntDesign name={"close"} size={25} color={'#000'} />
                    </TouchableOpacity>
                    <View style={{ backgroundColor: '#fff', maxWidth: '100%', padding: 2, borderRadius: 5 }}>
                        <View style={{ flexDirection: 'row', }}>
                            <TouchableOpacity style={{ margin: 5, height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: '#fff', backgroundColor: '#FF0000' }} onPress={() => selectPenColor('#FF0000')}></TouchableOpacity>
                            <TouchableOpacity style={{ margin: 5, height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: '#fff', backgroundColor: '#FF1493' }} onPress={() => selectPenColor('#FF1493')}></TouchableOpacity>
                            <TouchableOpacity style={{ margin: 5, height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: '#fff', backgroundColor: '#FF4500' }} onPress={() => selectPenColor('#FF4500')}></TouchableOpacity>
                            <TouchableOpacity style={{ margin: 5, height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: '#fff', backgroundColor: '#FFD700' }} onPress={() => selectPenColor('#FFD700')}></TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                            <TouchableOpacity style={{ margin: 5, height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: '#fff', backgroundColor: '#800080' }} onPress={() => selectPenColor('#800080')}></TouchableOpacity>
                            <TouchableOpacity style={{ margin: 5, height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: '#fff', backgroundColor: '#7B68EE' }} onPress={() => selectPenColor('#7B68EE')}></TouchableOpacity>
                            <TouchableOpacity style={{ margin: 5, height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: '#fff', backgroundColor: '#228B22' }} onPress={() => selectPenColor('#228B22')}></TouchableOpacity>
                            <TouchableOpacity style={{ margin: 5, height: 50, width: 50, borderRadius: 50, borderWidth: 1, borderColor: '#fff', backgroundColor: '#00BFFF' }} onPress={() => selectPenColor('#00BFFF')}></TouchableOpacity>
                        </View>
                    </View>
                </View>
            }

            {
                marksSelectPopUp.status &&
                <View style={styles.selectFieldPopUp}>
                    <View style={{ backgroundColor: '#fff', marginHorizontal: 30, maxHeight: 300, borderRadius: 5 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', borderBottomWidth: .7, padding: 5, borderColor: 'grey' }} onPress={() => closeModal(2)}>
                            <AntDesign name={"close"} size={20} color={'#000'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ borderBottomWidth: .7, borderColor: 'grey', padding: 7, paddingLeft: 10 }} onPress={() => { selectMarks(0), closeModal(2) }}>
                            <Text style={{ color: '#000', textAlign: 'center' }}>0</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ borderBottomWidth: .7, borderColor: 'grey', padding: 7, paddingLeft: 10 }} onPress={() => { selectMarks(0.5), closeModal(2) }}>
                            <Text style={{ color: '#000', textAlign: 'center' }}>0.5</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 7, paddingLeft: 10 }} onPress={() => { selectMarks(1), closeModal(2) }}>
                            <Text style={{ color: '#000', textAlign: 'center' }}>1</Text>
                        </TouchableOpacity>
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

    selectFieldPopUp2: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#fff',
        width: '100%',
        height: '100%'
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

export default ManageAssessment

