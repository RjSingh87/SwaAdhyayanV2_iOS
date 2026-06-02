import React, { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import { useState, useContext } from "react"
import Ionicons from 'react-native-vector-icons/Ionicons';
import AssessmentResult from "./AssessmentResult"
import AssessmentReport from "./AssessmentReport"
import { GlobleData } from "../../../Store"
import Services from "../../../Services"
import { apiRoot, SWATheam } from "../../../constant/ConstentValue"
import SelectionBox from "../../common/SelectionBox"
import BottomDrawerList from "../../common/BottomDrawerList"

const AssessmentStatus = () => {
    const { userData } = useContext(GlobleData)

    const [selectOption, setSelectOption] = useState({ class: null, section: null, subject: null, assessName: null, type: null })
    const [ModalData, setModalData] = useState({ list: null, type: null, status: false })
    const [showPopUp, setShowPopUp] = useState(false)
    const [showFields, setShowFields] = useState(true)
    const [showDataDrawer, setShowDataDrawer] = useState(false)
    const [assessmentData, setAssessmentData] = useState({ data: null, status: false })
    const [resultData, setResultData] = useState({ data: null, status: false })
    const [reportData, setReportData] = useState({ data: null, status: false })


    const getList = async (type) => {
        if (type == "class") {
            const payload = {
                "schoolID": userData.data.schoolID,
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
                            return { ...prev, list: data, type: type, status: true }
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
                    "schoolID": userData.data.schoolID,
                    "academicYear": userData.data.academicYear,
                    "classID": selectOption.class.getClassDetail.classID,
                    "userTypeID": userData.data.userTypeID,
                    "userRefID": userData.data.userRefID
                }
                Services.post(apiRoot.getSectionList, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setShowPopUp(true)
                            const data = res.data
                            setModalData((prev) => {
                                return { ...prev, list: data, type: type, status: true }
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
                    "schoolID": userData.data.schoolID,
                    "academicYear": userData.data.academicYear,
                    "userTypeID": userData.data.userTypeID,
                    "userRefID": userData.data.userRefID,
                    "classID": selectOption.class.getClassDetail.classID,
                    "sectionID": selectOption.section.sectionID
                }
                Services.post(apiRoot.getSubjectList, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setShowPopUp(true)
                            const data = res.data
                            setModalData((prev) => {
                                return { ...prev, list: data, type: type, status: true }
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
        else if (type == 'assessment') {
            if (selectOption.subject != null) {
                const payload = {
                    "schoolID": userData.data.schoolID,
                    "userTypeID": userData.data.userTypeID,
                    "userRefID": userData.data.userRefID,
                    "classID": selectOption.class.getClassDetail.classID,
                    "sectionID": selectOption.section.sectionID,
                    "subjectID": selectOption.subject.subjectID,
                }
                Services.post(apiRoot.getAssessmentList, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setShowPopUp(true)
                            const data = res.data
                            setModalData((prev) => {
                                return { ...prev, list: data, type: type, status: true }
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
                alert("Please Select subject first")
            }
        }
    }

    const selectModalOption = (item, type) => {
        setShowDataDrawer(false)
        if (type == 'class') {
            setSelectOption((prev) => {
                return { ...prev, class: item, section: null, subject: null, assessName: null, type: type }
            });
            setModalData((prev) => {
                return { ...prev, status: false }
            })
        }
        else if (type == 'section') {
            setSelectOption((prev) => {
                return { ...prev, section: item, subject: null, assessName: null, type: type }
            })
            setModalData((prev) => {
                return { ...prev, status: false }
            })
        }
        else if (type == 'subject') {
            setSelectOption((prev) => {
                return { ...prev, subject: item, assessName: null, type: type }
            })
            setModalData((prev) => {
                return { ...prev, status: false }
            })
        }
        else if (type == 'assessment') {
            setSelectOption((prev) => {
                return { ...prev, assessName: item, type: type }
            })
            setModalData((prev) => {
                return { ...prev, status: false }
            })
            searchAssessment(item)
        }
    }

    const closeModal = () => {
        setShowPopUp(false)
        setResultData((prev) => {
            return { ...prev, status: false }
        })
        setReportData((prev) => {
            return { ...prev, status: false }
        })
        setModalData((prev) => {
            return { ...prev, status: false }
        })
    }

    const searchAssessment = async (item) => {
        const payload = {
            "schoolID": userData.data.schoolID,
            "academicYear": userData.data.academicYear,
            "transYear": userData.data.transYear,
            "userTypeID": userData.data.userTypeID,
            "userRefID": userData.data.userRefID,
            "classID": selectOption.class.classID,
            "sectionID": selectOption.section.sectionID,
            "subjectID": selectOption.subject.subjectID,
            "assessmentID": item.assessmentID
        }

        Services.post(apiRoot.getStudentListWithAssessment, payload)
            .then((res) => {

                if (res.status == "success") {
                    const data = res.data
                    setShowDataDrawer(true)
                    setAssessmentData((prev) => {
                        return { ...prev, data: data, status: true }
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

    const viewResult = async (item) => {

        const payload = {
            "schoolID": userData.data.schoolID,
            "userTypeID": item.userTypeID,
            "userRefID": item.userRefID,
            "assessmentID": item?.getFaMarksData?.assessmentID
        }
        Services.post(apiRoot.viewAssessmentResult, payload)
            .then((res) => {
                if (res.status == "success") {
                    const data = res.data
                    setResultData((prev) => {
                        return { ...prev, data: data, status: true }
                    })
                } else if (res.status == 'error') {
                    alert(res.message)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {

            })



    }

    const viewReport = async (item) => {
        const payload = {
            "schoolID": userData.data.schoolID,
            "userTypeID": item?.userTypeID,
            "userRefID": item?.userRefID,
            "assessmentID": item?.getFaMarksData?.assessmentID
        }
        Services.post(apiRoot.viewAssessmentReport, payload)
            .then((res) => {
                if (res.status == "success") {
                    const data = res.data
                    setReportData((prev) => {
                        return { ...prev, data: data, status: true }
                    })
                } else if (res.status == 'error') {
                    alert(res.message)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {

            })

    }

    return (
        <>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderColor: SWATheam.SwaBlack, backgroundColor: userData.data.colors.liteTheme }}>
                    <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>
                        Assessment Status
                    </Text>
                    <TouchableOpacity style={{ padding: 4, backgroundColor: userData.data.colors.mainTheme, borderRadius: 4 }} onPress={() => setShowFields(!showFields)}>
                        <Ionicons name={"filter-sharp"} size={25} color={SWATheam.SwaWhite} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, backgroundColor: SWATheam.SwaWhite, padding: 10 }}>
                    {
                        showFields &&
                        <View style={{ marginBottom: 10, }}>
                            <SelectionBox getListItem={getList} selectedField={selectOption?.class?.getClassDetail?.classDesc} type="class" placeholder="Select class" />
                            <SelectionBox getListItem={getList} selectedField={selectOption?.section?.sectionName} type="section" placeholder="Select Section" />
                            <SelectionBox getListItem={getList} selectedField={selectOption?.subject?.subjectName} type="subject" placeholder="Select Subject" />
                            <SelectionBox getListItem={getList} selectedField={selectOption?.assessName?.assessmentName} type="assessment" placeholder="Select Assessment" />
                        </View>
                    }

                    {
                        showDataDrawer &&
                        <ScrollView>
                            <View style={{ borderWidth: .7, borderColor: 'grey', borderRadius: 5, padding: 5 }}>
                                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', marginVertical: 10, textTransform: 'uppercase', textAlign: 'center' }}>Student List </Text>
                                {
                                    assessmentData.data?.map((item, index) => {
                                        const fName = item.getStudentName.firstName
                                        const mName = item.getStudentName.middleName != null ? ' ' + item.getStudentName.middleName : ''
                                        const LName = item.getStudentName.lastName != null ? ' ' + item.getStudentName.lastName : ''
                                        const fullName = fName + mName + LName

                                        return (
                                            <View style={{ borderWidth: .7, borderRadius: 5, borderColor: 'grey', padding: 5, marginBottom: 7 }} key={index}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ width: 130 }}>
                                                        <Text style={{ color: '#000', fontWeight: 500 }}>Enrollment No</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={{ color: '#000' }}>:</Text>
                                                    </View>
                                                    <View style={{ flex: 1, paddingLeft: 5 }}>
                                                        <Text style={{ color: '#000' }}>{item.getStudentName.registrationNo}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ width: 130 }}>
                                                        <Text style={{ color: '#000', fontWeight: 500 }}>Student Name</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={{ color: '#000' }}>:</Text>
                                                    </View>
                                                    <View style={{ flex: 1, paddingLeft: 5 }}>
                                                        <Text style={{ color: '#000' }}>{fullName}</Text>
                                                    </View>
                                                </View>
                                                {
                                                    item.getFaMarksData != null &&
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ width: 130 }}>
                                                            <Text style={{ color: '#000', fontWeight: 500 }}>Assessment Name</Text>
                                                        </View>
                                                        <View>
                                                            <Text style={{ color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, paddingLeft: 5 }}>
                                                            <Text style={{ color: '#000' }}>{item.getFaMarksData.getAssessmentData.assessmentName}</Text>
                                                        </View>
                                                    </View>
                                                }
                                                {
                                                    item.getFaMarksData != null &&
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ width: 130 }}>
                                                            <Text style={{ color: '#000', fontWeight: 500 }}>Total Marks</Text>
                                                        </View>
                                                        <View>
                                                            <Text style={{ color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, paddingLeft: 5 }}>
                                                            <Text style={{ color: '#000' }}>{item.getFaMarksData.totalMarks}</Text>
                                                        </View>
                                                    </View>
                                                }
                                                {
                                                    item.getFaMarksData != null &&
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ width: 130 }}>
                                                            <Text style={{ color: '#000', fontWeight: 500 }}>Obtained Marks</Text>
                                                        </View>
                                                        <View>
                                                            <Text style={{ color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, paddingLeft: 5 }}>
                                                            <Text style={{ color: '#000' }}>{item.getFaMarksData.obtainedMarks}</Text>
                                                        </View>
                                                    </View>
                                                }
                                                {
                                                    item.getFaMarksData != null &&
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ width: 130 }}>
                                                            <Text style={{ color: '#000', fontWeight: 500 }}>Attempt Date</Text>
                                                        </View>
                                                        <View>
                                                            <Text style={{ color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, paddingLeft: 5 }}>
                                                            <Text style={{ color: '#000' }}>{item.getFaMarksData.attemptDate}</Text>
                                                        </View>
                                                    </View>
                                                }
                                                {
                                                    item.getFaMarksData != null &&
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ width: 130 }}>
                                                            <Text style={{ color: '#000', fontWeight: 500 }}>Test Attempt Mode</Text>
                                                        </View>
                                                        <View>
                                                            <Text style={{ color: '#000' }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1, paddingLeft: 5 }}>
                                                            <Text style={{ color: '#000' }}>{item.getFaMarksData.marksEntryType}</Text>
                                                        </View>
                                                    </View>
                                                }
                                                {
                                                    item.getFaMarksData == null &&
                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5, borderTopWidth: .7, borderColor: 'grey', marginTop: 5 }}>
                                                        <TouchableOpacity style={{ backgroundColor: '#dc3545', borderRadius: 5, paddingHorizontal: 10 }}>
                                                            <Text style={{ color: '#fff', padding: 5 }}>Pending</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                }

                                                {
                                                    item.getFaMarksData != null &&
                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5, borderTopWidth: .7, borderColor: 'grey', marginTop: 5 }}>
                                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 5, paddingHorizontal: 3, marginRight: 5 }} onPress={() => viewReport(item)}>
                                                            <Text style={{ color: '#fff', padding: 5 }}>View Report</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ backgroundColor: '#198754', borderRadius: 5, paddingHorizontal: 3 }} onPress={() => viewResult(item)}>
                                                            <Text style={{ color: '#fff', padding: 5 }}>View Result</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                }
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                    }
                </View>


            </View>
            {
                resultData.status &&
                <AssessmentResult resultData={resultData} closeModal={closeModal} colorSwa={userData.data.colors.mainTheme} />
            }

            {
                reportData.status &&
                <AssessmentReport reportData={reportData} closeModal={closeModal} colorSwa={userData.data.colors.mainTheme} />
            }

            {/* {
                    showPopUp &&
                    <Modal ModalData={ModalData} closeModal={closeModal} selectModalOption={selectModalOption} selectOption={selectOption} colorSwa={userData.data.colors.mainTheme} />
                } */}

            {
                ModalData.status &&
                <BottomDrawerList listItem={ModalData} closeModule={closeModal} getSelectedItem={selectModalOption} selectedField={selectOption} />
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

    TxtInput: {
        borderWidth: .7,
        borderColor: 'grey',
        marginBottom: 7,
        borderRadius: 5,
        paddingHorizontal: 7
    }

});

export default AssessmentStatus