import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Image, Button } from "react-native"
import { useState, useContext } from "react"
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import Modal from "../../../common/Modal"
import DatePicker from 'react-native-date-picker'
import { apiRoot, SWATheam } from "../../../../constant/ConstentValue"
import { GlobleData } from "../../../../Store"
import Services from "../../../../Services"
import Loader from "../../../common/Loader"


const CreateCertificate = () => {
    const { userData } = useContext(GlobleData)

    const [selectOption, setSelectOption] = useState({ class: null, section: null, subject: null, student: null, awardType: null, type: null })
    const [ModalData, setModalData] = useState({ data: null, type: null, status: false })
    const [showPopUp, setShowPopUp] = useState(false)
    const [showFromDatePicker, setShowFromDatePicker] = useState(false)
    const [showToDatePicker, setShowToDatePicker] = useState(false)
    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [year, setYear] = useState(null)
    const [loading, setLoading] = useState(false)
    const date = new Date()

    function getList(type) {
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
                            setLoading(false)
                            setShowPopUp(true)
                            const data = res.data
                            setModalData((prev) => {
                                return { ...prev, data: data, type: type, status: true }
                            })
                        } else {
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
            } else {
                alert("Please select class first")
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
            } else {
                alert("Please select section first")
            }
        }
        else if (type == 'student') {
            if (selectOption.subject != null) {
                const payload = {
                    "schoolCode": userData.data.schoolCode,
                    "classID": selectOption.class.getClassDetail.classID,
                    "sectionID": selectOption.section.sectionID,
                    "subjectID": selectOption.subject.subjectID,
                }
                Services.post(apiRoot.getStudentsForCertificate, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setLoading(false)
                            setShowPopUp(true)
                            const data = res.data
                            setModalData((prev) => {
                                return { ...prev, data: data, type: type, status: true }
                            })
                        } else {
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
            } else {
                alert("Please select subejct first")
            }
        }
        else if (type == 'awardType') {
            if (selectOption.student != null) {
                Services.post(apiRoot.awardType)
                    .then((res) => {
                        if (res.status == "success") {
                            setLoading(false)
                            setShowPopUp(true)
                            const data = res.data
                            setModalData((prev) => {
                                return { ...prev, data: data, type: type, status: true }
                            })
                        } else {
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
            } else {
                alert("Please select student first")
            }
        }
        else if (type == 'month') {
            Services.post(apiRoot.getMonths)
                .then((res) => {
                    if (res.status == "success") {
                        setLoading(false)
                        setShowPopUp(true)
                        const data = res.data
                        setModalData((prev) => {
                            return { ...prev, data: data, type: type, status: true }
                        })
                    } else {
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
    function selectModalOption(item, type) {
        if (type == 'class') {
            setSelectOption((prev) => {
                return { ...prev, class: item, section: null, subject: null, student: null, awardType: null, month: null, type: type }
            })
            setYear(null)
        }
        else if (type == 'section') {
            setSelectOption((prev) => {
                return { ...prev, section: item, subject: null, student: null, awardType: null, month: null, type: type }
            })
            setYear(null)
        }
        else if (type == 'subject') {
            setSelectOption((prev) => {
                return { ...prev, subject: item, student: null, awardType: null, month: null, type: type }
            })
            setYear(null)
        }
        else if (type == 'student') {
            setSelectOption((prev) => {
                return { ...prev, student: item, awardType: null, month: null, type: type }
            })
            setYear(null)
        }
        else if (type == 'awardType') {
            setSelectOption((prev) => {
                return { ...prev, awardType: item, month: null, type: type }
            })

            if (item.awardValue != 2) {
                setYear(null)
            }
        }
        else if (type == 'month') {
            setSelectOption((prev) => {
                return { ...prev, month: item, type: type }
            })
        }
    }

    function closeModal() {
        setShowPopUp(false)
    }

    function editDate(date, type) {
        if (type == 'from') {
            const selectDate = new Date(date).toLocaleDateString()
            const splitDate = selectDate.split('/')
            const finalDate = splitDate[1] + '/' + splitDate[0] + '/' + splitDate[2]
            setFromDate(finalDate)
        }
        else if (type == 'to') {
            const selectDate = new Date(date).toLocaleDateString()
            const splitDate = selectDate.split('/')
            const finalDate = splitDate[1] + '/' + splitDate[0] + '/' + splitDate[2]
            setToDate(finalDate)
        }
    }

    function createCertificate() {
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "userTypeID": userData.data.userTypeID,
            "userRefID": userData.data.userRefID,
            "classID": selectOption.class?.classID,
            "sectionID": selectOption.section?.sectionID,
            "subjectID": selectOption.subject?.subjectID,
            "studentRefID": selectOption.student?.userRefID,
            "durationType": selectOption.awardType?.awardValue,
            "month": selectOption?.month,
            "year": year,
            "fromDate": fromDate,
            "toDate": toDate,
        }
        Services.post(apiRoot.issueCertificate, payload)
            .then((res) => {
                if (res.status == "success") {
                    alert(res.message)
                    setSelectOption({ class: null, section: null, subject: null, student: null, awardType: null, type: null })
                    setYear(null)
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

    return (
        <>
            {loading ?
                <Loader /> :
                <>
                    <View style={{ flex: 1, padding: 10 }}>
                        <View style={{ marginBottom: 10, paddingBottom: 10 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: .7, borderColor: userData.data.colors.mainTheme, borderRadius: 6, paddingVertical: 4, marginBottom: 10, backgroundColor: SWATheam.SwaWhite }} onPress={() => { getList("class") }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10, color: selectOption.class == null ? SWATheam.SwaGray : SWATheam.SwaBlack }}>{selectOption.class == null ? 'Select class' : selectOption.class.getClassDetail.classDesc}</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: .7, borderColor: userData.data.colors.mainTheme, borderRadius: 6, paddingVertical: 4, marginBottom: 10, backgroundColor: SWATheam.SwaWhite }} onPress={() => { getList("section") }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10, color: selectOption.section == null ? SWATheam.SwaGray : SWATheam.SwaBlack }}>{selectOption.section == null ? 'Select section' : selectOption.section.sectionName}</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: .7, borderColor: userData.data.colors.mainTheme, borderRadius: 6, paddingVertical: 4, marginBottom: 10, backgroundColor: SWATheam.SwaWhite }} onPress={() => { getList("subject") }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10, color: selectOption.subject == null ? SWATheam.SwaGray : SWATheam.SwaBlack }}>{selectOption.subject == null ? 'Select subject' : selectOption.subject.subjectName}</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: .7, borderColor: userData.data.colors.mainTheme, borderRadius: 6, paddingVertical: 4, marginBottom: 10, backgroundColor: SWATheam.SwaWhite }} onPress={() => { getList("student") }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10, color: selectOption.student == null ? SWATheam.SwaGray : SWATheam.SwaBlack }}>{selectOption.student == null ? 'Select student' : selectOption.student.fullName}</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: .7, borderColor: userData.data.colors.mainTheme, borderRadius: 6, paddingVertical: 4, marginBottom: 10, backgroundColor: SWATheam.SwaWhite }} onPress={() => getList('awardType')}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10, color: selectOption.awardType == null ? SWATheam.SwaGray : SWATheam.SwaBlack }}>{selectOption.awardType == null ? 'Select Month/Duration' : selectOption.awardType.awardName}</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                    <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                </View>
                            </TouchableOpacity>

                            {selectOption.awardType?.awardValue == 1 ?
                                <TouchableOpacity style={{ flexDirection: 'row', borderWidth: .7, borderColor: userData.data.colors.mainTheme, borderRadius: 6, paddingVertical: 4, marginBottom: 10, backgroundColor: SWATheam.SwaWhite }} onPress={() => getList('month')}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ paddingVertical: 5, paddingHorizontal: 10, color: selectOption.month == null ? SWATheam.SwaGray : SWATheam.SwaBlack }}>{selectOption.month == null ? 'Select Month' : selectOption.month}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                        <Entypo name={"chevron-thin-down"} size={20} color={'grey'} />
                                    </View>
                                </TouchableOpacity> :
                                selectOption.awardType?.awardValue == 2 ?
                                    <TextInput placeholderTextColor={SWATheam.SwaGray} style={[styles.input, { borderColor: userData.data.colors.mainTheme, color: SWATheam.SwaGray, backgroundColor: SWATheam.SwaWhite }]} onChangeText={setYear} value={year} placeholder='Type Year' /> :
                                    selectOption.awardType?.awardValue == 3 ?
                                        <View>
                                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: .7, borderColor: userData.data.colors.mainTheme, borderRadius: 6, paddingVertical: 4, marginBottom: 10, backgroundColor: SWATheam.SwaWhite }} onPress={() => setShowFromDatePicker(true)}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10, color: fromDate == null ? SWATheam.SwaGray : SWATheam.SwaBlack }}>{fromDate == null ? 'From' : fromDate}</Text>
                                                </View>
                                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                                    <FontAwesome6 name={"calendar"} size={20} color={'grey'} />
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: .7, borderColor: userData.data.colors.mainTheme, borderRadius: 6, paddingVertical: 4, marginBottom: 10, backgroundColor: SWATheam.SwaWhite }} onPress={() => setShowToDatePicker(true)}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ paddingVertical: 5, paddingHorizontal: 10 }}>{toDate == null ? 'To' : toDate}</Text>
                                                </View>
                                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                                    <FontAwesome6 name={"calendar"} size={20} color={'grey'} />
                                                </View>
                                            </TouchableOpacity>
                                        </View> : null
                            }

                            {showFromDatePicker &&
                                <DatePicker
                                    modal
                                    open={showFromDatePicker}
                                    date={date}
                                    mode='date'
                                    onConfirm={(date) => {
                                        setShowFromDatePicker(false)
                                        editDate(date, 'from')
                                    }}
                                    onCancel={() => {
                                        setShowFromDatePicker(false)
                                    }}
                                />
                            }

                            {showToDatePicker &&
                                <DatePicker
                                    modal
                                    open={showToDatePicker}
                                    date={date}
                                    mode='date'
                                    onConfirm={(date) => {
                                        setShowToDatePicker(false)
                                        editDate(date, 'to')
                                    }}
                                    onCancel={() => {
                                        setShowToDatePicker(false)
                                    }}
                                />
                            }


                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 30, paddingVertical: 8, borderRadius: 50 }} onPress={() => createCertificate()}>
                                    <Text style={{ color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Issue</Text>
                                </TouchableOpacity>
                            </View>

                        </View>



                        {/* {
                    selectOption.awardType
                } */}

                    </View>
                    {
                        showPopUp &&
                        <Modal ModalData={ModalData} closeModal={closeModal} selectModalOption={selectModalOption} selectOption={selectOption} colorSwa={userData.data.colors.mainTheme} />
                    }
                </>
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
    urlInput: {
        height: 100,
        borderWidth: .7,
        borderWidth: .7,
        borderColor: SWATheam.SwaGray,
        borderRadius: 50,
        padding: 8,
        marginBottom: 7,
        textAlignVertical: 'top'
    },
    input: {
        height: 38,
        borderWidth: .7,
        borderRadius: 6,
        padding: 8,
        marginBottom: 10
    },
});

export default CreateCertificate