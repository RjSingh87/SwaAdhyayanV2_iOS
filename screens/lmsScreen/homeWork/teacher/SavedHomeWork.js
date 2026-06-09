import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Image, Button } from "react-native"
import { useEffect, useState, useContext } from "react"
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker'
import { GlobleData } from "../../../../Store"
import { apiRoot, SWATheam } from "../../../../constant/ConstentValue"
import Services from "../../../../Services"
import Loader from "../../../common/Loader"



var homeWorkIDNew = "";
const finalDateArr = []

const SaveHomeWork = () => {
    const { userData } = useContext(GlobleData)
    const [sectionData, setSectionData] = useState({ data: null, status: false })
    const [loading, setLoading] = useState(false)
    const [showPopUp, setShowPopUp] = useState(false)
    const [savedHomework, setSavedHomework] = useState({ data: null, status: false })
    const [showStartDatePicker, setShowStartDatePicker] = useState(false)
    const [showEndDatePicker, setShowEndDatePicker] = useState(false)
    const [datePickerControl, setDatePickerControl] = useState({ date: null, status: false, index: null, type: "" })
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [date, setDate] = useState(new Date())
    let [selectSectionArr, setSelectSectionArr] = useState([])

    useEffect(() => {
        getSavedHomeWork()
    }, [])

    function homeworkID(homeWorkID) {
        homeWorkIDNew = homeWorkID;
        // setHomeWorkIDNew(homeWorkID)
    }

    function getSavedHomeWork() {
        setLoading(true)
        const payload = {
            "schoolID": userData.data.schoolID,
            "userRefID": userData.data.userRefID,
            "isAssigned": 0
        }
        Services.post(apiRoot.getCreatedHomework, payload)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    const data = res.data
                    setSavedHomework((prev) => {
                        return { ...prev, data: data, status: true }
                    })
                } else {
                    // alert(res.message)
                    setSavedHomework({ data: null, status: false })
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    function editDate(dateStr, type) {
        console.log(dateStr, 'check dateStr')

        if (type == 'startDate') {
            let day = dateStr.getDate()
            let month = dateStr.getMonth() + 1
            let year = dateStr.getFullYear()

            let hours = dateStr.getHours()
            let minutes = dateStr.getMinutes()

            const fTime = hours + ':' + minutes

            if (day < 10) {
                day = "0" + day
            } else if (month < 10) {
                month = "0" + month
            }
            const selectedDate = year + '-' + month + '-' + day + ' ' + fTime
            console.log(selectedDate, 'selectDateh')
            setStartDate(selectedDate)
            setSavedHomework((prev) => {
                return { ...prev, }
            })

        }
        else if (type == 'endDate') {
            let day = dateStr.getDate()
            let month = dateStr.getMonth() + 1
            let year = dateStr.getFullYear()

            let hours = dateStr.getHours()
            let minutes = dateStr.getMinutes()

            const fTime = hours + ':' + minutes

            if (day < 10) {
                day = "0" + day
            } else if (month < 10) {
                month = "0" + month
            }
            const selectedDate = year + '-' + month + '-' + day + ' ' + fTime

            setEndDate(selectedDate)
            setSavedHomework((prev) => {
                return { ...prev, }
            })

        }
        // getSavedHomeWork(type)
    }

    function deleteHomeWork(homeWorkID) {
        const payload = {
            "schoolID": userData.data.schoolID,
            "userRefID": userData.data.userRefID,
            "homeWorkID": homeWorkID
        }
        Services.post(apiRoot.deleteSavedHomework, payload)
            .then((res) => {
                if (res.status == "success") {
                    alert(res.message)
                    if (savedHomework.data.length > 0) {
                        getSavedHomeWork()
                    }
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

    function getSections(item) {
        if (startDate != endDate) {
            homeWorkIDNew = item.homeWorkID
            setLoading(true)
            const payload = {
                "schoolID": userData.data.schoolID,
                "academicYear": userData.data.academicYear,
                "classID": item.classID,
                "userTypeID": userData.data.userTypeID,
                "userRefID": userData.data.userRefID
            }
            Services.post(apiRoot.getSectionList, payload)
                .then((res) => {
                    if (res.status == "success") {
                        setLoading(false)
                        const data = res.data
                        setSectionData((prev) => {
                            return { ...prev, data: data, status: true }
                        })
                        setShowPopUp(true)
                    } else {
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
            alert("Please select valid Date.")

        }

    }

    function closePopUp() {
        setShowPopUp(false)
    }

    function selectSection(item) {
        const ID = item.sectionID
        if (selectSectionArr.includes(ID)) {
            setSelectSectionArr(selectSectionArr.filter(item => item !== ID))
        } else {
            setSelectSectionArr([...selectSectionArr, ID])
        }
    }

    function assingHomeWork() {
        setLoading(true)
        const payload = {
            "schoolID": userData.data.schoolID,
            "userRefID": userData.data.userRefID,
            "homeWorkID": datePickerControl?.data?.homeWorkID,
            "startDate": startDate,
            "endDate": endDate,
            "sectionIDs": selectSectionArr,
        }

        Services.post(apiRoot.assignHomework, payload)
            .then((res) => {
                if (res.status == "success") {
                    setLoading(false)
                    alert(res.message)
                    getSavedHomeWork()
                    setShowPopUp(false)
                    finalDateArr.length = 0
                } else {
                    setLoading(false)
                    // alert(res.message)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    function setAssignDate(item, index, type) {
        if (type == "startDate") {
            setStartDate("")
            setEndDate("")
        } else if (type == "endDate") {
            setEndDate("")
        }
        setShowEndDatePicker(true)
        setDatePickerControl((prev) => {
            return { ...prev, data: item, status: true, index: index, type: type }
        })
        homeWorkIDNew = item.homeWorkID;
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: userData.data.colors.liteTheme, borderRadius: 5, flex: 1, padding: 10 }}>
                {loading ?
                    <Loader /> :
                    <ScrollView>
                        {
                            savedHomework.status ?
                                <View>
                                    {
                                        savedHomework.data.map((item, index) => {
                                            let newStartDate = ""
                                            let newEndDate = ""
                                            if (datePickerControl.index == index) {
                                                newStartDate = startDate
                                                newEndDate = endDate
                                            }
                                            {/* let startDate = finalDateArr[index] != undefined ? finalDateArr[index]?.startDate : ""; */ }
                                            {/* let endDate = finalDateArr[index] != undefined ? finalDateArr[index]?.endDate : ""; */ }
                                            return (
                                                <View style={{ borderWidth: .7, borderColor: 'grey', marginBottom: 5, borderRadius: 5, padding: 5, backgroundColor: SWATheam.SwaWhite }} key={index}>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 100 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Class</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.className}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 100 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Subject </Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.subjectName}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                        <View style={{ width: 100 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Description</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.homeWorkDesc}</Text>
                                                        </View>
                                                    </View>
                                                    {item.filePath != null ?
                                                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                                            <View style={{ width: 100 }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Attached File</Text>
                                                            </View>
                                                            <View style={{ paddingRight: 10 }}>
                                                                <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                            </View>
                                                            <View style={{ flex: 1, }}>
                                                                <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.filePath}</Text>
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
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Created Date</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: SWATheam.SwaBlack, fontSize: 14 }}>{item.createdDate}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
                                                        <View style={{ width: 100, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>Start Date</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 50, padding: 4 }} onPress={() => setAssignDate(item, index, "startDate")}>
                                                                <View style={{ flex: 1 }}>
                                                                    <Text style={{ color: SWATheam.SwaBlack }}>{newStartDate}</Text>
                                                                </View>
                                                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                                                    <FontAwesome6 name={"calendar"} size={16} color={'grey'} />
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
                                                        <View style={{ width: 100, }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>End Date</Text>
                                                        </View>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <Text style={{ fontWeight: "500", fontSize: 14, color: SWATheam.SwaBlack }}>:</Text>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 50, padding: 4 }} onPress={() => setAssignDate(item, index, "endDate")}>
                                                                <View style={{ flex: 1 }}>
                                                                    <Text style={{ color: SWATheam.SwaBlack }}>{newEndDate}</Text>
                                                                </View>
                                                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                                                                    <FontAwesome6 name={"calendar"} size={16} color={'grey'} />
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5, borderTopWidth: .7, borderColor: 'grey', marginTop: 5 }}>
                                                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 5, paddingHorizontal: 10, marginRight: 5 }} onPress={() => getSections(item)}>
                                                            <Text style={{ color: SWATheam.SwaWhite, padding: 5 }}>Assign</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ backgroundColor: SWATheam.SwaRed, borderRadius: 5, paddingHorizontal: 10 }} onPress={() => deleteHomeWork(item.homeWorkID)}>
                                                            <Text style={{ color: SWATheam.SwaWhite, padding: 5 }}>Delete</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                                :
                                <View style={{ borderWidth: 1, backgroundColor: SWATheam.SwaWhite, borderColor: 'grey', borderRadius: 5 }}>
                                    <Text style={{ color: SWATheam.SwaRed, fontSize: 14, textAlign: 'center', padding: 5 }}>Homework not available</Text>
                                </View>
                        }
                    </ScrollView>
                }
                <DatePicker
                    modal
                    open={datePickerControl.status}
                    date={date}
                    mode='datetime'
                    onConfirm={(date) => {
                        setDatePickerControl((prev) => {
                            return { ...prev, status: false }
                        })
                        editDate(date, datePickerControl.type)
                    }}
                    onCancel={(date) => {
                        setDatePickerControl((prev) => {
                            return { ...prev, status: false }
                        })
                    }}
                />

            </View>
            {showPopUp &&
                <View style={styles.selectFieldPopUp}>
                    <View style={{ backgroundColor: SWATheam.SwaWhite, marginHorizontal: 30, padding: 8, maxHeight: 300, borderRadius: 5 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', borderBottomWidth: .7, paddingBottom: 5, borderColor: 'grey' }} onPress={() => closePopUp()}>
                            <AntDesign name={"close"} size={20} color={SWATheam.SwaBlack} />
                        </TouchableOpacity>
                        <ScrollView>
                            <View>
                                {
                                    sectionData.data.map((item, index) => {
                                        return (
                                            <TouchableOpacity onPress={() => { selectSection(item) }} key={index}>
                                                <View style={{ padding: 10, borderBottomWidth: item.length > 1 ? .7 : null, borderColor: 'grey', flexDirection: 'row', alignItems: 'center' }}>
                                                    {selectSectionArr.includes(item.sectionID) ?
                                                        <MaterialIcons name={"check-box"} size={20} color={userData.data.colors.mainTheme} /> :
                                                        <MaterialIcons name={"check-box-outline-blank"} size={20} color={userData.data.colors.mainTheme} />
                                                    }
                                                    <Text style={{ paddingLeft: 10, fontSize: 15, color: SWATheam.SwaBlack }}>
                                                        {item.sectionName}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                        <View style={{ flexDirection: 'row', borderTopWidth: .7, borderColor: 'grey', paddingTop: 7, justifyContent: 'flex-end' }}>
                            <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 3, paddingHorizontal: 10, paddingVertical: 3 }} onPress={() => assingHomeWork()}>
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

export default SaveHomeWork

