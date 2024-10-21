import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { apiRoot, SWATheam } from '../../../constant/ConstentValue'
import { GlobleData } from '../../../Store'
import SwaHeader from '../../common/SwaHeader'
import Services from '../../../Services'
import Loader from '../../common/Loader'
import AntDesign from 'react-native-vector-icons/AntDesign'
import BottomDrawerList from '../../common/BottomDrawerList'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'


const NotbookSEAMarksEntry = ({ navigation, route }) => {
    const { userData } = useContext(GlobleData)
    const [studentData, setStudentData] = useState({ list: null, status: false, isNew: [] })
    const [markList, setMarksList] = useState({ status: false, list: null, type: '' })
    const [selectMarksID, setSelectMarksID] = useState({ notbookID: null, seaID: null })
    function onClickLeftIcon() {
        navigation.goBack()
    }
    function onClickRightIcon() {
        setIsInstruction(true)
    }
    useEffect(() => {
        getStudentForNotebookMarksEntry()

    }, [])

    function getStudentForNotebookMarksEntry() {
        setStudentData((prev) => {
            return { ...prev, status: true }
        })
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": userData.data.academicYear,
            "userTypeID": userData.data.userTypeID,
            "userRefID": userData.data.userRefID,
            "classID": route.params.classID,
            "sectionID": route.params.sectionID,
            "subjectID": route.params.subjectID,
            "termID": route.params.termID
        }
        Services.post(apiRoot.getStudentForNotebookMarksEntry, payload)
            .then((res) => {
                if (res.status == "success") {
                    console.log(JSON.stringify(res.data), 'hari----------')
                    setStudentData((prev) => {
                        return { ...prev, list: res.data, status: false }
                    })
                } else if (res.status == "error") {
                    alert(res.message)
                    setStudentData((prev) => {
                        return { ...prev, status: false }
                    })
                    navigation.goBack()
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setStudentData((prev) => {
                    return { ...prev, status: false }
                })
            })
    }
    function markassign(item, index, type) {
        let marksList = []
        for (mark of [1, 2, 3, 4, 5]) {
            marksList.push({ number: mark, id: mark })
        }
        setMarksList((prev) => {
            return { ...prev, status: true, list: marksList, index: index, selectedStudent: item, type: type }
        })
    }
    function getSelectedItem(item, type, index, itemIndex) {
        if (type == 'notbook') {
            if (studentData.list[itemIndex].bookMarks.noteSEAID == undefined) {
                studentData.isNew.push('new')
            } else {
                studentData.isNew.push(markList.selectedStudent.bookMarks.noteSEAID)
            }
            studentData.list[itemIndex].bookMarks.notebookMarks = item.number
            setSelectMarksID((prev) => {
                return { ...prev, notbookID: item.id, }
            })
        } else if (type == 'sea') {
            if (studentData.list[itemIndex].bookMarks.noteSEAID == undefined) {
                studentData.isNew.push('new')
            } else {
                studentData.isNew.push(markList.selectedStudent.bookMarks.noteSEAID)
            }
            studentData.list[itemIndex].bookMarks.seaMarks = item.number
            setSelectMarksID((prev) => {
                return { ...prev, seaID: item.id }
            })
        }
        setMarksList((prev) => {
            return { ...prev, status: false }
        })
    }
    function saveAllNotebookSeaMarks() {
        let studentIDs = []
        let notebookMarks = []
        let seaMarks = []
        let QueryUpNew = []
        studentData.list.map((value, index) => {
            studentIDs.push(value.getStudentName.userRefID)
            if (value.bookMarks.notebookMarks != undefined) {
                notebookMarks.push(value.bookMarks.notebookMarks == 0 ? "" : value.bookMarks.notebookMarks)
            } else {
                notebookMarks.push("")
            }
            if (value.bookMarks.seaMarks != undefined) {
                seaMarks.push(value.bookMarks.seaMarks == 0 ? "" : value.bookMarks.seaMarks)
            } else {
                seaMarks.push("")
            }
            if (value.bookMarks.noteSEAID != undefined) {
                QueryUpNew.push(value.bookMarks.noteSEAID)
            } else {
                QueryUpNew.push("")
            }
        })
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "classID": route.params.classID,
            "sectionID": route.params.sectionID,
            "subjectID": route.params.subjectID,
            "termID": route.params.termID,
            "academicYear": userData.data.academicYear,
            "studentIDs": studentIDs,
            "notebookMarks": notebookMarks,
            "seaMarks": seaMarks,
            "QueryUpNew": QueryUpNew,
            "userRefID": userData.data.userRefID
        }
        Services.post(apiRoot.saveAllNotebookSeaMarks, payload)
            .then((res) => {
                if (res.status == "success") {
                    alert(res.message)
                    getStudentForNotebookMarksEntry()
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
    function closeModule() {
        setMarksList((prev) => {
            return { ...prev, status: false }
        })
    }

    const insets = useSafeAreaInsets()


    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['left', 'right', 'top',]} style={{ flex: 1, backgroundColor: userData?.data?.colors?.mainTheme }}>
                {studentData.status ?
                    <Loader /> :
                    <View style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : 24, backgroundColor: userData.data.colors.liteTheme, paddingBottom: insets.bottom }}>
                        <SwaHeader title={"Nootbook & SEA Activities"} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
                        <View style={{ padding: 10, flex: 1 }}>
                            <ScrollView>
                                {studentData?.list?.map((item, index) => {
                                    return (
                                        <View style={{ backgroundColor: userData.data.colors.mainTheme, padding: 4, borderRadius: 6, borderWidth: 1, borderColor: userData.data.colors.mainTheme, marginBottom: 20 }} key={item.studentID}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ width: 80, padding: 4 }}>
                                                    <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>Enroll No.</Text>
                                                </View>
                                                <View style={{ width: 20, padding: 4 }}>
                                                    <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>:</Text>
                                                </View>
                                                <View style={{ flex: 1, padding: 4 }}>
                                                    <Text style={{ color: SWATheam.SwaWhite }}>{item.getStudentName.registrationNo}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ width: 80, padding: 4 }}>
                                                    <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>Name</Text>
                                                </View>
                                                <View style={{ width: 20, padding: 4 }}>
                                                    <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>:</Text>
                                                </View>
                                                <View style={{ flex: 1, padding: 4 }}>
                                                    <Text style={{ color: SWATheam.SwaWhite }}>{item?.getStudentName?.firstName + ' ' + item?.getStudentName?.lastName}</Text>
                                                </View>
                                            </View>
                                            <View style={{ borderRadius: 6, backgroundColor: SWATheam.SwaWhite, marginVertical: 6 }}>
                                                <View style={{ flexDirection: 'row', padding: 6 }}>
                                                    <View style={{ flex: 1, padding: 4 }}>
                                                        <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>Notbook</Text>
                                                    </View>
                                                    <TouchableOpacity style={{ flexDirection: 'row', width: 80, padding: 4, borderWidth: 1, borderRadius: 4 }} onPress={() => {
                                                        markassign(item, index, 'notbook')
                                                    }}>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: item.bookMarks.notebookMarks == 0 || item.bookMarks.notebookMarks == undefined ? SWATheam.SwaGray : SWATheam.SwaBlack, textAlign: 'center' }}>{item.bookMarks.notebookMarks == 0 || item.bookMarks.notebookMarks == undefined ? "select" : item.bookMarks.notebookMarks}</Text>
                                                        </View>
                                                        <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                                                            <AntDesign name="down" size={15} color={SWATheam.SwaGray} />
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ flexDirection: 'row', padding: 6 }}>
                                                    <View style={{ flex: 1, padding: 4 }}>
                                                        <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>Subject Enrichment Activities</Text>
                                                    </View>

                                                    <TouchableOpacity style={{ flexDirection: 'row', width: 80, padding: 4, borderWidth: 1, borderRadius: 4 }} onPress={() => { markassign(item, index, 'sea') }}>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: item.bookMarks.seaMarks == 0 || item.bookMarks.seaMarks == undefined ? SWATheam.SwaGray : SWATheam.SwaBlack, textAlign: 'center' }}>{item.bookMarks.seaMarks == 0 || item.bookMarks.seaMarks == undefined ? "select" : item.bookMarks.seaMarks}</Text>
                                                        </View>
                                                        <View style={{ width: 20, justifyContent: 'center', alignItems: 'center' }}>
                                                            <AntDesign name="down" size={15} color={SWATheam.SwaGray} />
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })}
                            </ScrollView>

                        </View>
                        <View style={{ padding: 6, justifyContent: 'center', alignItems: 'center', elevation: 9 }}>
                            <TouchableOpacity style={{ width: 100, padding: 10, borderRadius: 10, backgroundColor: userData.data.colors.mainTheme }} onPress={() => { saveAllNotebookSeaMarks() }}>
                                <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Submit</Text>
                            </TouchableOpacity>

                        </View>
                        {markList.status ?
                            <BottomDrawerList closeModule={closeModule} listItem={markList} getSelectedItem={getSelectedItem} selectedField={selectMarksID} /> : null
                        }
                    </View>
                }
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default NotbookSEAMarksEntry

const styles = StyleSheet.create({})