import React, { useState, useEffect, useContext } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TouchableHighlight, Alert, Platform } from "react-native"
import { GlobleData } from '../../Store';
import SwaHeader from '../common/SwaHeader';
import Services from '../../Services';
import { apiRoot } from '../../constant/ConstentValue';
import Loader from '../common/Loader';
import { SafeAreaProvider, useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';

const font17 = 17
const font15 = 15
const ZP = 'Zero Period'
const BR = 'Break'
const PR = 'Prayer'
const EP = 'Extra Period'
const RC = 'Recess'
const PD = 'Period'
const greyClr = '#fff'

let assignTabHeight = 35;
let templateID = '';

const ZPcolor = '#01c690';
const EPcolor = '#9659d2';
const RCcolor = '#ff846e';
const PRcolor = '#ffa42e';
const BRcolor = '#47cc2b';
const lightZPcolor = '#d7f2e9';
const lightEPcolor = '#e6d7f6';
const lightRCcolor = '#ffe8e5';
const lightPRcolor = '#ffedd5';
const lightBRcolor = '#d5f7ce';
const lightPDcolor = '#f0f8ff';

const ordinalNo = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth']
let pDCount = 0

const allTeacherArr = []
const allTeacherIDArr = []
const allsubjectArr = []
const allsubjectIDArr = []
const allsectionArr = []

// const api = "https://swaadhyayan.com/lmsv2/api/"

// const dayArr = ['Sun', 'Mon', 'Tue', 'Thu', 'Fri', 'Sat']
const date = new Date()
let dayNo = date.getDay()

const TimeTable = ({ navigation, route }) => {

    const { userData } = useContext(GlobleData)


    const userID = userData.data.userTypeID

    const [timeTable, setTimeTable] = useState({ data1: null, data2: null, status: true })
    const [classList, setClassList] = useState({ data: null, status: true })
    const [sectionList, setSectionList] = useState({ data: null, status: true })
    const [teacherList, setTeacherList] = useState({ data: null, status: true })
    const [subjectList, setSubjectList] = useState({ data: null, status: true })
    const [showAssignPop, setShowAssignPop] = useState(false)
    const [selectedTeacher, SetSelectedTeacher] = useState()
    const [selectedSubject, SetSelectedSubject] = useState()
    const [showSelectField1, SetShowSelectField1] = useState(false)
    const [showSelectField2, SetShowSelectField2] = useState(false)
    const [selectClass, setSelectClass] = useState({ data: null, radioID: null })
    const [selectSection, setSelectSection] = useState({ data: null, radioID: null })
    const [isLoading, setIsLoading] = useState(true)

    const [assignTeacherData, setAssignTeacherData] = useState({
        schoolCode: "SWA1854060081",
        academicYear: "2024-2025",
        cellData: null,
        createdByID: "323",
        templateID: null,
        subjectID: null,
        classID: null,
        sectionID: null,
        teacherID: null,
        isCustom: "0"
    })

    const deleteAsgnTeacher = {
        schoolCode: "SWA1854060081",
        academicYear: "2024-2025",
        cellData: null,
        templateID: null,
        subjectID: null,
        classID: null,
        sectionID: null,
        teacherID: null,
    }

    useEffect(() => {
        if (userID != 2) {
            getTimeTableData()
        }
    }, []);

    function onClickLeftIcon() {
        navigation.goBack()
    }
    function onClickRightIcon() {
        setIsInstruction(true)
    }

    function getTimeTableData() {
        setIsLoading(true)
        const payload = {
            "userRefID": userData.data.userRefID,
            "schoolCode": userData.data.schoolCode,
            "academicYear": userData.data.academicYear,
            "userTypeID": userData.data.userTypeID,
        }

        if (userData.data.userTypeID == 5 || userData.data.userTypeID == 6) {
            payload["classID"] = userData.data.classID
            payload["sectionID"] = userData.data.sectionID
        }
        Services.post(apiRoot.timeTable, payload)
            .then((res) => {
                if (res.status == "success") {
                    setIsLoading(false)
                    const data = res.data.structure.structure
                    const structure = data.split(',')
                    const schoolStartTime = res.data.structure.schoolStartTime
                    const firstPDTime = schoolStartTime.split(':')
                    firstPDTime.pop(2)
                    const pdName = []
                    const pdTotalTime = []
                    const pdTime = []
                    structure.map((item) => {
                        const splitData = item.split('_')
                        pdName.push(splitData[1])
                        pdTotalTime.push(splitData[2])
                        pdTime.push(splitData[3])
                    })
                    const assignedData = res.data.assignedData
                    const totalDayDataArr = []
                    const singleDayDataArr = []

                    assignedData.map((item) => {
                        totalDayDataArr.push(item.cellData)
                        templateID = item.templateID
                    })

                    totalDayDataArr.map((item) => {
                        const data = item.split('|')
                        singleDayDataArr.push(data)
                    })


                    const tdayArr = []
                    singleDayDataArr.map((item, index) => {
                        if (item[0] == 'D_' + dayNo) {
                            tdayArr.push(item)
                            tdayArr.sort()
                        }
                    })


                    const finalTdayData = []
                    tdayArr.map((item) => {
                        finalTdayData.push(item[0] + '|' + item[1])
                    })

                    const indexNo = []
                    const arrTeacher = []
                    const arrTeacherID = []
                    const arrSubject = []
                    const arrSubjectID = []
                    const arrSection = []
                    for (let i = 0; i < pdName.length; i++) {
                        arrTeacher.push('0')
                        arrSubject.push('0')
                        arrSection.push('0')
                    }

                    assignedData.map((item, index) => {
                        let fName = ''
                        let lName = ''
                        let teacherName = ''
                        let subjectName = ""
                        pdName.map((name, key) => {
                            if (item.cellData == finalTdayData[key]) {
                                arrTeacherID.push(item.userRefID)
                                arrSubjectID.push(item.subjectID)
                                indexNo.push(item.cellData[6] - 1)
                                fName = item.firstName
                                lName = item.lastName == null ? '' : item.lastName
                                teacherName = fName + ' ' + lName
                                subjectName = item.subjectName
                                allTeacherArr.push(teacherName)
                                allsubjectArr.push(subjectName)
                                allsectionArr.push(item.className + ' / ' + item.sectionName)
                            }
                        })
                    })

                    for (let i = 0; i < pdName.length; i++) {
                        arrTeacher[indexNo[i]] = allTeacherArr[i]
                        arrSubject[indexNo[i]] = allsubjectArr[i]
                        arrSection[indexNo[i]] = allsectionArr[i]
                    }
                    for (let j = 0; j < arrTeacherID.length; j++) {
                        allTeacherIDArr.push(arrTeacherID[j])
                        allsubjectIDArr.push(arrSubjectID[j])
                    }

                    setTimeTable((prev) => {
                        return { ...prev, data1: structure, data2: assignedData, pdName: pdName, pdTotalTime: pdTotalTime, firstPDTime: firstPDTime, pdTime: pdTime, schoolStartTime: schoolStartTime, arrTeacher: arrTeacher, arrSubject: arrSubject, arrSection: arrSection, status: false }
                    })
                }

            })
            .catch((err) => {
                console.log(err)
            }).finally(() => {
                setIsLoading(false)
            })


    }

    function getClassAndSecList(name) {
        if (name == 'class') {
            if (selectSection.data != null) {
                selectSection.data.sectionName = "Select Class"
                setSelectSection((prev) => {
                    return { ...prev, data: null, radioID: null }
                })
            }
            const payload = {
                "schoolCode": userData.data.schoolCode,
                "userTypeID": userData.data.userTypeID,
            }
            Services.post(apiRoot.getClassList, payload)
                .then((res) => {
                    if (res.status == "success") {
                        SetShowSelectField1(true)
                        const data = res.data
                        setClassList((prev) => {
                            return { ...prev, data: data, status: false }
                        })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {

                })
        }
        else {
            if (classList.data != null) {
                const payload = {
                    "userRefID": userData.data.userRefID,
                    "schoolCode": userData.data.schoolCode,
                    "academicYear": userData.data.academicYear,
                    "userTypeID": userData.data.userTypeID,
                    "classID": selectClass.data.classID,
                }
                Services.post(apiRoot.getSectionList, payload)
                    .then((res) => {
                        console.log(res, 'section')
                        if (res.status == "success") {
                            SetShowSelectField2(true)
                            const data = res.data
                            setSectionList((prev) => {
                                return { ...prev, data: data, status: false }
                            })
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } else {
                alert('Please select class.')
            }
            pDCount = 0
        }
    }

    function getTeachersList() {
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": userData.data.academicYear,
        }
        Services.post(apiRoot.getTeachersListApp, payload)
            .then((res) => {
                if (res.status == "success") {
                    const data = res.data
                    setTeacherList((prev) => {
                        return { ...prev, data: data, status: false }
                    })
                }

            }).catch((err) => {
                console.log(err)
            })
        pDCount = 0
    }

    function assignTeacher() {
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": userData.data.academicYear,
            "cellData": assignTeacherData.cellData,
            "createdByID": assignTeacherData.createdByID,
            "templateID": assignTeacherData.templateID,
            "subjectID": assignTeacherData.subjectID,
            "classID": assignTeacherData.classID,
            "sectionID": assignTeacherData.sectionID,
            "teacherID": assignTeacherData.teacherID,
            "isCustom": assignTeacherData.isCustom
        }
        Services.post(apiRoot.assignTimeTableToTeacherApp, payload)
            .then((res) => {
                if (res.status == "success") {
                    getTimeTableData(classID, sectionID)
                }
            })
        pDCount = 0
    }
    function getSubjectList() {
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "schoolID": userData.data.schoolID
        }
        Services.post(apiRoot.subjectsTimeTableApp, payload)
            .then((res) => {
                if (res.status == "success") {
                    const data = res.data.assignedSubj
                    setSubjectList((prev) => {
                        return { ...prev, data: data, status: false }
                    })
                }
            })
        pDCount = 0
    }

    function daySelect(ID) {
        allTeacherArr.length = 0
        allsubjectArr.length = 0
        allTeacherIDArr.length = 0
        allsubjectIDArr.length = 0
        dayNo = ID
        pDCount = 0
    }
    pDCount = 0

    function selectTeacher(userRefID) {
        SetSelectedTeacher(userRefID)
        setAssignTeacherData((prev) => {
            return { ...prev, teacherID: userRefID }
        })
    }

    function selectSubject(subjectID) {
        SetSelectedSubject(subjectID)
        setAssignTeacherData((prev) => {
            return { ...prev, subjectID: subjectID }
        })
    }

    function classOptionSelect(ID, item) {
        setSelectClass((prev) => {
            return { ...prev, data: item, radioID: ID }
        })
    }

    function sectionOptionSelect(ID, item) {
        setSelectSection((prev) => {
            return { ...prev, data: item, radioID: ID }
        })
    }

    function assignTeacherBtn(cellData) {
        setAssignTeacherData((prev) => {
            return { ...prev, cellData: cellData, classID: selectClass.radioID, sectionID: selectSection.radioID, templateID: templateID }
        })
    }

    function deleteTeacher(celData, index) {
        const cellData = celData
        const classID = selectClass.radioID
        const sectionID = selectSection.radioID
        const teacherID = allTeacherIDArr[index]
        const subjectID = allsubjectIDArr[index]

        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": userData.data.academicYear,
            "cellData": cellData,
            "templateID": templateID,
            "subjectID": subjectID,
            "classID": classID,
            "sectionID": sectionID,
            "teacherID": teacherID,
        }
        Services.post(apiRoot.deAssignTeacherTimeTableApp, payload)
            .then((res) => {
                if (res.status == "success") {
                    getTimeTableData(classID, sectionID)
                }
            })
        pDCount = 0
    }

    function searchClassTable() {
        getTimeTableData(dayNo, selectClass.radioID, selectSection.radioID)
    }
    // console.log("isLoading", userData.data.colors.liteTheme)
    const insets = useSafeAreaInsets()


    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, marginTop: Platform.OS == "ios" ? 0 : 24, backgroundColor: userData.data.colors.mainTheme }}>
                <SwaHeader title={route.params.iconData.iconName} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
                <View style={{ backgroundColor: userData.data.colors.liteTheme, flex: 1, }} >
                    {isLoading ?
                        <Loader /> :
                        <>
                            {userID == 2 ?
                                <View style={{ paddingVertical: 8, paddingHorizontal: 5 }}>
                                    <View>
                                        <TouchableHighlight onPress={() => getClassAndSecList('class')} underlayColor="#fff" style={{ borderRadius: 50, borderWidth: 2, borderColor: greyClr, marginBottom: 5 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1 }}>
                                                    {
                                                        selectClass.data == null ?
                                                            <Text style={{ fontSize: font15, padding: 10 }}>Select Class</Text> :
                                                            <Text style={{ fontSize: font15, padding: 10 }}>{selectClass.data.className}</Text>
                                                    }
                                                </View>
                                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 10 }}>
                                                    <Entypo name={"chevron-thin-down"} size={20} color={'#000'} />
                                                </View>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <View>
                                        <TouchableHighlight onPress={() => getClassAndSecList('section')} underlayColor="#fff" style={{ borderRadius: 50, borderWidth: 2, borderColor: greyClr, marginBottom: 5 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1 }}>
                                                    {
                                                        selectSection.data == null ?
                                                            <Text style={{ fontSize: font15, padding: 10 }}>Select Section</Text> :
                                                            <Text style={{ fontSize: font15, padding: 10 }}>{selectSection.data.sectionName}</Text>
                                                    }
                                                </View>
                                                <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 10 }}>
                                                    <Entypo name={"chevron-thin-down"} size={20} color={'#000'} />
                                                </View>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <TouchableOpacity style={{ width: 130, alignSelf: 'center', borderRadius: 10, backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 30, paddingVertical: 8, marginVertical: 10 }} onPress={() => searchClassTable()}>
                                        <Text style={{ color: '#fff', textAlign: 'center' }}>Search</Text>
                                    </TouchableOpacity>
                                </View> : null
                            }
                            {timeTable.status ?
                                '' :
                                <View style={{ flex: 1 }}>
                                    {userID == 2 &&
                                        <View style={{ padding: 10, backgroundColor: userData.data.colors.mainTheme, alignItems: 'center' }}>
                                            <Text style={[styles.WtextClr, { fontWeight: '500', fontSize: font17 }]}>
                                                Manage Time Table
                                            </Text>
                                        </View>
                                    }
                                    <View style={{ flexDirection: 'row', borderWidth: 0, borderColor: greyClr, marginTop: 5, borderRadius: 5, paddingHorizontal: 3 }}>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <View style={{ flex: 1, borderRadius: 5, margin: 2, backgroundColor: dayNo == '1' ? userData.data.colors.mainTheme : greyClr }}>
                                                <TouchableOpacity onPress={() => { daySelect(1); getTimeTableData(dayNo, selectClass.radioID, selectSection.radioID) }}>
                                                    <Text style={[dayNo == '1' ? styles.WtextClr : styles.BtextClr, { fontSize: '500', fontSize: font15, textAlign: 'center', padding: 10 }]}>Mon</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flex: 1, borderRadius: 5, margin: 2, backgroundColor: dayNo == '2' ? userData.data.colors.mainTheme : greyClr }}>
                                                <TouchableOpacity onPress={() => { daySelect(2); getTimeTableData(dayNo, selectClass.radioID, selectSection.radioID) }}>
                                                    <Text style={[dayNo == '2' ? styles.WtextClr : styles.BtextClr, { fontSize: '500', fontSize: font15, textAlign: 'center', padding: 10 }]}>Tue</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flex: 1, borderRadius: 5, margin: 2, backgroundColor: dayNo == '3' ? userData.data.colors.mainTheme : greyClr }}>
                                                <TouchableOpacity onPress={() => { daySelect(3); getTimeTableData(dayNo, selectClass.radioID, selectSection.radioID) }}>
                                                    <Text style={[dayNo == '3' ? styles.WtextClr : styles.BtextClr, { fontSize: '500', fontSize: font15, textAlign: 'center', padding: 10 }]}>Wed</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flex: 1, borderRadius: 5, margin: 2, backgroundColor: dayNo == '4' ? userData.data.colors.mainTheme : greyClr }}>
                                                <TouchableOpacity onPress={() => { daySelect(4); getTimeTableData(dayNo, selectClass.radioID, selectSection.radioID) }}>
                                                    <Text style={[dayNo == '4' ? styles.WtextClr : styles.BtextClr, { fontSize: '500', fontSize: font15, textAlign: 'center', padding: 10 }]}>Thu</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flex: 1, borderRadius: 5, margin: 2, backgroundColor: dayNo == '5' ? userData.data.colors.mainTheme : greyClr }}>
                                                <TouchableOpacity onPress={() => { daySelect(5); getTimeTableData(dayNo, selectClass.radioID, selectSection.radioID) }}>
                                                    <Text style={[dayNo == '5' ? styles.WtextClr : styles.BtextClr, { fontSize: '500', fontSize: font15, textAlign: 'center', padding: 10 }]}>Fri</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flex: 1, borderRadius: 5, margin: 2, backgroundColor: dayNo == '6' ? userData.data.colors.mainTheme : greyClr }}>
                                                <TouchableOpacity onPress={() => { daySelect(6); getTimeTableData(dayNo, selectClass.radioID, selectSection.radioID) }}>
                                                    <Text style={[dayNo == '6' ? styles.WtextClr : styles.BtextClr, { fontSize: '500', fontSize: font15, textAlign: 'center', padding: 10 }]}>Sat</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                    {isLoading ?
                                        <Loader /> :
                                        <View style={{ borderTopWidth: 1, borderColor: '#eaeaea', padding: 5, flex: 1 }}>
                                            <ScrollView>
                                                {
                                                    timeTable.pdName.map((name, index) => {
                                                        let pDName = ""
                                                        let color = ""
                                                        let bgColor = ""
                                                        let pdStartTime = timeTable.firstPDTime[0] + ':' + timeTable.firstPDTime[1]
                                                        let notPeriodTemplate = ""
                                                        let blankDataImg = <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                                            <Image source={require('../assets/swaLogoMini.png')} style={{ width: 25, height: 25, opacity: 0.2 }} />
                                                        </View>
                                                        let assignTeacherMsg = <View style={{ flex: 1, width: '100%' }}>
                                                            <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 20 }} onPress={() => { setShowAssignPop(true), getTeachersList(), getSubjectList(), assignTeacherBtn('D_' + dayNo + '|P_' + (index + 1)) }}>
                                                                <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
                                                                    <TouchableOpacity style={{}} onPress={() => { getTeachersList(), getSubjectList(), setShowAssignPop(true), assignTeacherBtn('D_' + dayNo + '|P_' + (index + 1)) }}>
                                                                        <AntDesign name={"pluscircleo"} size={30} color={'#343a40'} />
                                                                    </TouchableOpacity>
                                                                </View>
                                                                <Text style={{ textAlign: 'center' }}>Assign Teacher</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                        if (name == 'PD') {
                                                            pDName = ordinalNo[pDCount] + ' ' + PD
                                                            pDCount++
                                                            color = userData.data.colors.mainTheme
                                                            bgColor = lightPDcolor
                                                            pdStartTime = timeTable.pdTime[index - 1] == undefined ? pdStartTime : timeTable.pdTime[index - 1]
                                                        }
                                                        else if (name == 'ZP') {
                                                            pDName = ZP
                                                            color = ZPcolor
                                                            bgColor = lightZPcolor
                                                            pdStartTime = timeTable.pdTime[index - 1] == undefined ? pdStartTime : timeTable.pdTime[index - 1]

                                                        }
                                                        else if (name == 'EP') {
                                                            pDName = EP
                                                            color = EPcolor
                                                            bgColor = lightEPcolor
                                                            pdStartTime = timeTable.pdTime[index - 1] == undefined ? pdStartTime : timeTable.pdTime[index - 1]
                                                        }
                                                        else if (name == 'PR') {
                                                            pDName = PR
                                                            color = PRcolor
                                                            bgColor = lightPRcolor
                                                            pdStartTime = timeTable.pdTime[index - 1] == undefined ? pdStartTime : timeTable.pdTime[index - 1]
                                                            notPeriodTemplate = <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                                                <View style={{ flex: 1, padding: 5, margin: 5 }}>
                                                                    <Text style={{ color: color, fontWeight: '500', fontSize: font17 }}>P</Text>
                                                                </View>
                                                                <View style={{ flex: 1, padding: 5, margin: 5 }}>
                                                                    <Text style={{ color: color, fontWeight: '500', fontSize: font17 }}>R</Text>
                                                                </View>
                                                                <View style={{ flex: 1, padding: 5, margin: 5 }}>
                                                                    <Text style={{ color: color, fontWeight: '500', fontSize: font17 }}>A</Text>
                                                                </View>
                                                                <View style={{ flex: 1, padding: 5, margin: 5 }}>
                                                                    <Text style={{ color: color, fontWeight: '500', fontSize: font17 }}>Y</Text>
                                                                </View>
                                                                <View style={{ flex: 1, padding: 5, margin: 5 }}>
                                                                    <Text style={{ color: color, fontWeight: '500', fontSize: font17 }}>E</Text>
                                                                </View>
                                                                <View style={{ flex: 1, padding: 5, margin: 5 }}>
                                                                    <Text style={{ color: color, fontWeight: '500', fontSize: font17 }}>R</Text>
                                                                </View>
                                                            </View>
                                                            blankDataImg = ""
                                                            assignTeacherMsg = ""
                                                        }
                                                        else if (name == 'RC') {
                                                            pDName = RC
                                                            color = RCcolor
                                                            bgColor = lightRCcolor
                                                            pdStartTime = timeTable.pdTime[index - 1] == undefined ? pdStartTime : timeTable.pdTime[index - 1]
                                                            notPeriodTemplate = <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                                                <View style={{ flex: 1, padding: 5, margin: 5 }}>
                                                                    <Text style={{ color: color, fontWeight: '500', fontSize: font17 }}>R</Text>
                                                                </View>
                                                                <View style={{ flex: 1, padding: 5, margin: 5 }}>
                                                                    <Text style={{ color: color, fontWeight: '500', fontSize: font17 }}>E</Text>
                                                                </View>
                                                                <View style={{ flex: 1, padding: 5, margin: 5 }}>
                                                                    <Text style={{ color: color, fontWeight: '500', fontSize: font17 }}>C</Text>
                                                                </View>
                                                                <View style={{ flex: 1, padding: 5, margin: 5 }}>
                                                                    <Text style={{ color: color, fontWeight: '500', fontSize: font17 }}>E</Text>
                                                                </View>
                                                                <View style={{ flex: 1, padding: 5, margin: 5 }}>
                                                                    <Text style={{ color: color, fontWeight: '500', fontSize: font17 }}>S</Text>
                                                                </View>
                                                                <View style={{ flex: 1, padding: 5, margin: 5 }}>
                                                                    <Text style={{ color: color, fontWeight: '500', fontSize: font17 }}>S</Text>
                                                                </View>
                                                            </View>
                                                            blankDataImg = ""
                                                            assignTeacherMsg = ""
                                                        }
                                                        else if (name == 'BR') {
                                                            pDName = BR
                                                            color = BRcolor
                                                            bgColor = lightBRcolor
                                                            pdStartTime = timeTable.pdTime[index - 1] == undefined ? pdStartTime : timeTable.pdTime[index - 1]
                                                            notPeriodTemplate = <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                                                <View style={{ flex: 1, padding: 5, margin: 5 }}>
                                                                    <Text style={{ color: color, fontWeight: '500', fontSize: font17 }}>B</Text>
                                                                </View>
                                                                <View style={{ flex: 1, padding: 5, margin: 5 }}>
                                                                    <Text style={{ color: color, fontWeight: '500', fontSize: font17 }}>R</Text>
                                                                </View>
                                                                <View style={{ flex: 1, padding: 5, margin: 5 }}>
                                                                    <Text style={{ color: color, fontWeight: '500', fontSize: font17 }}>E</Text>
                                                                </View>
                                                                <View style={{ flex: 1, padding: 5, margin: 5 }}>
                                                                    <Text style={{ color: color, fontWeight: '500', fontSize: font17 }}>A</Text>
                                                                </View>
                                                                <View style={{ flex: 1, padding: 5, margin: 5 }}>
                                                                    <Text style={{ color: color, fontWeight: '500', fontSize: font17 }}>K</Text>
                                                                </View>
                                                            </View>
                                                            blankDataImg = ""
                                                            assignTeacherMsg = ""
                                                        }

                                                        return (
                                                            <View style={{ flexDirection: 'row' }} key={index}>
                                                                <View style={{ width: 150, backgroundColor: '#eaeaea', borderRightWidth: 3, borderColor: color }}>
                                                                    <View style={{ backgroundColor: color }}>
                                                                        <Text style={[styles.WtextClr, { textAlign: 'center', fontWeight: '500', fontSize: font15, paddingVertical: 5 }]}>
                                                                            {pDName}
                                                                        </Text>
                                                                    </View>
                                                                    <View style={{ backgroundColor: '#fff', paddingVertical: 5 }}>
                                                                        <Text style={[styles.BtextClr, { fontSize: font15, fontWeight: '500', textAlign: 'center' }]}>
                                                                            {pdStartTime} am
                                                                        </Text>
                                                                        <Text style={[styles.BtextClr, { fontSize: font15, fontWeight: '500', textAlign: 'center' }]}>
                                                                            to
                                                                        </Text>
                                                                        <Text style={[styles.BtextClr, { fontSize: font15, fontWeight: '500', textAlign: 'center' }]}>
                                                                            {timeTable.pdTime[index]} am
                                                                        </Text>
                                                                        <Text style={{ textAlign: 'center', color: userData.data.colors.mainTheme, fontWeight: '500', marginTop: 5 }}>
                                                                            {
                                                                                timeTable.pdTotalTime[index]
                                                                            }
                                                                            &nbsp; Minutes
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                                <View style={{ flex: 1, padding: 5, height: '100%', backgroundColor: bgColor, borderBottomWidth: 1, borderColor: color }}>
                                                                    {notPeriodTemplate}
                                                                    {
                                                                        userID == 2 ?
                                                                            timeTable.arrTeacher[index] == 0 ? assignTeacherMsg :
                                                                                <View style={{ paddingTop: 40 }}>
                                                                                    <Text style={{ fontSize: font15, fontWeight: '500', marginBottom: 5, textAlign: 'center', color: userData.data.colors.mainTheme }}>
                                                                                        {timeTable.arrTeacher[index] == 0 ? blankDataImg : timeTable.arrTeacher[index]}
                                                                                    </Text>
                                                                                    <Text style={{ textAlign: 'center', marginBottom: 5, color: userData.data.colors.mainTheme }}>
                                                                                        {timeTable.arrSubject[index] == 0 ? '' : timeTable.arrSubject[index]}
                                                                                    </Text>
                                                                                    <View style={{ position: 'absolute', top: 0, right: 0 }}>
                                                                                        <TouchableOpacity onPress={() => deleteTeacher('D_' + dayNo + '|P_' + (index + 1), index)}>
                                                                                            <MaterialCommunityIcons name={"delete"} size={25} color={'#343a40'} />
                                                                                        </TouchableOpacity>
                                                                                    </View>
                                                                                </View> :
                                                                            userID == 5 ?
                                                                                timeTable.arrTeacher[index] == 0 ? blankDataImg :
                                                                                    <View style={{ paddingTop: 40 }}>
                                                                                        <Text style={{ fontSize: font15, fontWeight: '500', marginBottom: 5, textAlign: 'center', color: userData.data.colors.mainTheme }}>
                                                                                            {timeTable.arrTeacher[index] == 0 ? blankDataImg : timeTable.arrTeacher[index]}
                                                                                        </Text>
                                                                                        <Text style={{ textAlign: 'center', color: userData.data.colors.mainTheme, marginBottom: 5 }}>
                                                                                            {timeTable.arrSubject[index] == 0 ? '' : timeTable.arrSubject[index]}
                                                                                        </Text>
                                                                                    </View> :
                                                                                userID == 6 ?
                                                                                    timeTable.arrTeacher[index] == 0 ? blankDataImg :
                                                                                        <View style={{ paddingTop: 40 }}>
                                                                                            <Text style={{ fontSize: font15, fontWeight: '500', marginBottom: 5, textAlign: 'center', color: userData.data.colors.mainTheme }}>
                                                                                                {timeTable.arrTeacher[index] == 0 ? blankDataImg : timeTable.arrTeacher[index]}
                                                                                            </Text>
                                                                                            <Text style={{ textAlign: 'center', color: userData.data.colors.mainTheme, marginBottom: 5 }}>
                                                                                                {timeTable.arrSubject[index] == 0 ? '' : timeTable.arrSubject[index]}
                                                                                            </Text>
                                                                                        </View> :
                                                                                    userID == 4 ?
                                                                                        timeTable.arrSubject[index] == 0 ? blankDataImg :
                                                                                            <View style={{ paddingTop: 40 }}>
                                                                                                <Text style={{ fontSize: font15, fontWeight: '500', textAlign: 'center', color: userData.data.colors.mainTheme, marginBottom: 5 }}>
                                                                                                    {timeTable.arrSubject[index] == 0 ? '' : timeTable.arrSubject[index]}
                                                                                                </Text>
                                                                                                <Text style={{ textAlign: 'center', color: userData.data.colors.mainTheme }}>
                                                                                                    {timeTable.arrSubject[index] == 0 ? '' : timeTable.arrSection[index]}
                                                                                                </Text>
                                                                                            </View>
                                                                                        :
                                                                                        null
                                                                    }
                                                                </View>
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </ScrollView>
                                        </View>
                                    }



                                </View>
                            }
                            {/* table */}

                            {/* teacher Assign Popup */}
                            {showAssignPop &&
                                <View style={styles.AssignTeacherModal}>
                                    <View style={{ backgroundColor: '#fff', width: 350, padding: 8, borderRadius: 5 }}>
                                        <Text style={[styles.BtextClr, { borderBottomWidth: 2, borderColor: greyClr, fontWeight: '500', paddingVertical: 5, fontSize: font17 }]}>
                                            Assign Teacher & Subject
                                        </Text>
                                        <View style={{ marginVertical: 5 }}>
                                            <View style={{ borderWidth: 1, borderRadius: 5, borderColor: greyClr, marginBottom: 10 }}>
                                                <View style={{ marginBottom: 2 }}>
                                                    <Text style={[styles.WtextClr, { backgroundColor: userData.data.colors.mainTheme, padding: 7, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: '500' }]}>TEACHER LIST</Text>
                                                </View>
                                                <View style={{ height: 150, paddingHorizontal: 5, paddingBottom: 5 }}>
                                                    <ScrollView>
                                                        {teacherList.status ?
                                                            <Text>Loader....</Text> :
                                                            teacherList.data.map((item, index) => {
                                                                let teachFName = item.userData.firstName
                                                                let teachLName = item.userData.lastName == null ? '' : item.userData.lastName
                                                                let teachName = teachFName + ' ' + teachLName
                                                                let color = ''
                                                                let fontColor = ''
                                                                const userRefID = item.userData.userRefID
                                                                if (userRefID == selectedTeacher) {
                                                                    color = userData.data.colors.mainTheme
                                                                    fontColor = '#fff'
                                                                } else {
                                                                    color = '#fff'
                                                                    fontColor = '#000'
                                                                }
                                                                return (
                                                                    <TouchableOpacity style={{ borderWidth: 1, borderColor: greyClr, borderRadius: 20, height: assignTabHeight, marginTop: 5, justifyContent: 'center', paddingHorizontal: 10, backgroundColor: color }} key={index} onPress={() => selectTeacher(userRefID)}>
                                                                        <Text style={{ color: fontColor }}>{teachName} </Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            })
                                                        }
                                                    </ScrollView>
                                                </View>
                                            </View>
                                            <View style={{ borderWidth: 1, borderRadius: 5, borderColor: greyClr }}>
                                                <View style={{ marginBottom: 2 }}>
                                                    <Text style={[styles.WtextClr, { backgroundColor: userData.data.colors.mainTheme, padding: 7, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: '500' }]}>SUBJECT LIST</Text>
                                                </View>
                                                <View style={{ height: 150, paddingHorizontal: 5, paddingBottom: 5 }}>
                                                    <ScrollView>
                                                        {subjectList.status ?
                                                            <Text>Loader....</Text> :
                                                            subjectList.data.map((item, index) => {
                                                                let subejctName = item.subjectName
                                                                let color = ''
                                                                let fontColor = ''
                                                                const subjectID = item.subjectID
                                                                if (subjectID == selectedSubject) {
                                                                    color = userData.data.colors.mainTheme
                                                                    fontColor = '#fff'
                                                                } else {
                                                                    color = '#fff'
                                                                    fontColor = '#000'
                                                                }
                                                                return (
                                                                    <TouchableOpacity style={{ borderWidth: 1, borderColor: greyClr, borderRadius: 20, height: assignTabHeight, marginTop: 5, justifyContent: 'center', paddingHorizontal: 10, backgroundColor: color }} key={index} onPress={() => selectSubject(subjectID)}>
                                                                        <Text style={{ color: fontColor }}>{subejctName}</Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            })
                                                        }
                                                    </ScrollView>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ alignItems: 'flex-end', borderTopWidth: 1, borderColor: greyClr, paddingTop: 5 }}>
                                            <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 5 }} onPress={() => { assignTeacher(), setShowAssignPop(!showAssignPop) }}>
                                                <Text style={styles.WtextClr}>Assign</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            }
                            {/* teacher Assign Popup */}

                            {/* select class Field Popup */}
                            {showSelectField1 &&
                                <View style={styles.selectFieldPopUp}>
                                    <View style={{ backgroundColor: '#fff', marginHorizontal: 30, padding: 8, height: 300, borderRadius: 5 }}>
                                        <View style={{ borderWidth: 1, borderColor: greyClr, borderRadius: 5 }}>
                                            <TouchableOpacity style={{ position: 'absolute', top: -15, right: -15 }} onPress={() => SetShowSelectField1(false)}>
                                                <Entypo name={"circle-with-cross"} size={30} color={'#343a40'} />
                                            </TouchableOpacity>
                                            <ScrollView>
                                                {
                                                    classList.data?.map((item, index) => {
                                                        const ID = item.classID
                                                        return (
                                                            <TouchableOpacity onPress={() => { classOptionSelect(ID, item), SetShowSelectField1(!showSelectField1) }} key={index}>
                                                                <View style={{ padding: 10, borderBottomWidth: 1, borderColor: greyClr, flexDirection: 'row', alignItems: 'center' }}>
                                                                    <View style={{ borderWidth: 2, borderColor: 'grey', width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20 / 2 }}>
                                                                        <View style={{ width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 2, borderColor: 'grey', justifyContent: 'center', alignItems: 'center' }} value="first">
                                                                            {
                                                                                selectClass.radioID === ID ? <View style={{ borderWidth: 2, borderColor: 'grey', backgroundColor: '#0c8781', height: 10, width: 10, borderRadius: 10 / 2 }}></View> : null
                                                                            }
                                                                        </View>
                                                                    </View>
                                                                    <Text style={{ paddingLeft: 10, fontSize: font15 }}>
                                                                        {item.className}
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        )
                                                    })
                                                }
                                            </ScrollView>
                                        </View>
                                    </View>
                                </View>
                            }
                            {/* select class Field Popup */}

                            {/* select section Field Popup */}
                            {showSelectField2 &&
                                <View style={styles.selectFieldPopUp}>
                                    <View style={{ backgroundColor: '#fff', marginHorizontal: 30, padding: 10, height: 300, borderRadius: 5 }}>
                                        <View style={{ borderWidth: 1, borderColor: greyClr, borderRadius: 5 }}>
                                            <TouchableOpacity style={{ position: 'absolute', top: -15, right: -15 }} onPress={() => SetShowSelectField2(false)}>
                                                <Entypo name={"circle-with-cross"} size={30} color={'#343a40'} />
                                            </TouchableOpacity>
                                            <ScrollView>
                                                {
                                                    sectionList.data?.map((item, index) => {
                                                        const ID = item.sectionID
                                                        return (
                                                            <TouchableOpacity onPress={() => { sectionOptionSelect(ID, item), SetShowSelectField2(!showSelectField2) }} key={index}>
                                                                <View style={{ padding: 10, borderBottomWidth: 1, borderColor: greyClr, flexDirection: 'row', alignItems: 'center' }}>
                                                                    <View style={{ borderWidth: 2, borderColor: 'grey', width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20 / 2 }}>
                                                                        <View style={{ width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 2, borderColor: 'grey', justifyContent: 'center', alignItems: 'center' }} value="first">
                                                                            {
                                                                                selectClass.radioID === ID ? <View style={{ borderWidth: 2, borderColor: 'grey', backgroundColor: '#0c8781', height: 10, width: 10, borderRadius: 10 / 2 }}></View> : null
                                                                            }
                                                                        </View>
                                                                    </View>
                                                                    <Text style={{ paddingLeft: 10, fontSize: font15 }}>
                                                                        {item.sectionName}
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        )
                                                    })
                                                }
                                            </ScrollView>
                                        </View>
                                    </View>
                                </View>
                            }
                            {/* select class Field Popup */}

                        </>
                    }
                </View>


            </SafeAreaView>

        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({

    BtextClr: {
        color: '#000'
    },

    WtextClr: {
        color: '#fff'
    },


    fwBold: {
        fontWeight: 500
    },

    AssignTeacherModal: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    selectFieldPopUp: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    }

});

export default TimeTable