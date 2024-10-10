import { Platform, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import SwaHeader from '../../common/SwaHeader'
import { GlobleData } from '../../../Store'
import SelectionBox from '../../common/SelectionBox'
import Services from '../../../Services'
import { apiRoot } from '../../../constant/ConstentValue'
import BottomDrawerList from '../../common/BottomDrawerList'
import Loader from '../../common/Loader'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'


const Safal = ({ navigation }) => {
    const { userData } = useContext(GlobleData)
    const [selectedField, setSelectedField] = useState({ class: null, section: null, subject: null, set: null, type: null })
    const [listItem, setListItem] = useState({ list: null, status: false, type: '' })
    const [loading, setLoading] = useState(false)

    function onClickLeftIcon() {
        navigation.goBack()
    }
    function onClickRightIcon() {
        setIsInstruction(true)
    }

    function getListItem(val) {
        setLoading(true)
        if (val == 'class') {
            const payload = {
                "schoolCode": userData?.data?.schoolCode,
                "userTypeID": userData?.data?.userTypeID
            }
            if (userData.data.userTypeID == 4) {
                payload["academicYear"] = userData?.data?.academicYear,
                    payload["userRefID"] = userData?.data?.userRefID
            }
            Services.post(apiRoot.getClassList, payload)
                .then((res) => {
                    if (res.status == "success") {
                        setLoading(false)
                        let classList = []
                        res.data.map((item, index) => {
                            if (item.classID == 3 || item.classID == 5 || item.classID == 8) {
                                classList.push(item)
                            }
                        })
                        let showstatus = false
                        if (classList.length) {
                            showstatus = true
                        }
                        setListItem((prev) => {
                            return { ...prev, list: classList, status: showstatus, type: val }
                        });
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
        } else if (val == 'section') {
            if (selectedField.class != null) {
                const payload = {
                    "classID": selectedField.class.classID,
                    "schoolCode": userData?.data?.schoolCode,
                    "userTypeID": userData?.data?.userTypeID,
                    "userRefID": userData?.data?.userRefID,
                    "academicYear": userData?.data?.academicYear
                }
                Services.post(apiRoot.getSectionList, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setLoading(false)
                            setListItem((prev) => {
                                return { ...prev, list: res.data, status: true, type: val }
                            });
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
            } else {
                setLoading(false)
                alert('Please select class')
            }
        } else if (val == 'subject') {
            if (selectedField.class != null || selectedField.section != null) {
                const payload = {
                    "classID": selectedField.class.getClassDetail.classID,
                }
                Services.post(apiRoot.getSafalSubjectAccToClass, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setLoading(false)
                            setListItem((prev) => {
                                return { ...prev, list: res.data, status: true, type: val }
                            });
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
            } else {
                setLoading(false)
                alert('Please select section')
            }
        } else if (val == 'set') {
            if (selectedField.class != null || selectedField.section != null || selectedField.subject != null) {
                const setList = [
                    { setName: "set-1", setID: 1 },
                    { setName: "set-2", setID: 2 },
                    { setName: "set-3", setID: 3 },
                    { setName: "set-4", setID: 4 }
                ]
                setListItem((prev) => {
                    return { ...prev, list: setList, status: true, type: val }
                });
                setLoading(false)
            } else {
                setLoading(false)
                alert('Please select subject')
            }
        } else if (val == 'QAns') {
            if (selectedField.class != null || selectedField.section != null || selectedField.subject != null || selectedField.set != null) {
                const setList = [
                    { type: "SAFAL Practice Papers", typeID: 9 },
                    { type: "Answers to SAFAL Practice Papers", typeID: 10 },
                ]
                setListItem((prev) => {
                    return { ...prev, list: setList, status: true, type: val }
                });
                setLoading(false)
            } else {
                setLoading(false)
                alert('Please select subject')
            }
        }
    }

    function getSelectedItem(item, type) {

        if (type == 'class') {
            setSelectedField((prev) => {
                return { ...prev, class: item, section: null, subject: null, set: null, type: null }
            })
            setListItem((prev) => {
                return { ...prev, status: false }
            })
        } else if (type == "section") {
            setSelectedField((prev) => {
                return { ...prev, section: item, subject: null, set: null, type: null }
            })
            setListItem((prev) => {
                return { ...prev, status: false }
            })
        } else if (type == "subject") {
            setSelectedField((prev) => {
                return { ...prev, subject: item, set: null, type: null }
            })
            setListItem((prev) => {
                return { ...prev, status: false }
            })
        } else if (type == "set") {
            setSelectedField((prev) => {
                return { ...prev, set: item, type: null }
            })
            setListItem((prev) => {
                return { ...prev, status: false }
            })
        } else if (type == "QAns") {

            setSelectedField((prev) => {
                return { ...prev, type: item }
            })
            setListItem((prev) => {
                return { ...prev, status: false }
            })
            setLoading(true)
            const payload = {
                "classID": selectedField.class.classID,
                "subjectID": selectedField.subject.subjectID,
                "setID": selectedField.set.setID,
                "safalType": item.typeID,
                "schoolCode": userData.data.schoolCode

            }
            Services.post(apiRoot.getAllSafalLessonPlan, payload)
                .then((res) => {
                    if (res.status == "success") {
                        setLoading(false)
                        const pdfPath = res.safalData[0].fullPath
                        navigation.navigate('pdfView', { url: pdfPath })
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


        }

    }

    function closeModule() {
        setListItem((prev) => {
            return { ...prev, status: false }
        });
    }

    const insets = useSafeAreaInsets()

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, marginTop: Platform.OS == "ios" ? 0 : 24, backgroundColor: userData?.data?.colors?.mainTheme, }}>
                {loading ?
                    <Loader /> :
                    <>
                        <SwaHeader title={"CBSE SAFAL & Other Competitive Exams"} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
                        <View style={{ flex: 1, backgroundColor: userData.data.colors.liteTheme }}>
                            <View style={{ padding: 10 }}>
                                <SelectionBox getListItem={getListItem} selectedField={selectedField?.class?.getClassDetail?.classDesc} type="class" placeholder="Select class" />
                                <SelectionBox getListItem={getListItem} selectedField={selectedField?.section?.sectionName} type="section" placeholder="Select section" />
                                <SelectionBox getListItem={getListItem} selectedField={selectedField?.subject?.subjectName} type="subject" placeholder="Select subject" />
                                <SelectionBox getListItem={getListItem} selectedField={selectedField?.set?.setName} type="set" placeholder="Select set" />
                                <SelectionBox getListItem={getListItem} selectedField={selectedField?.type?.type} type="QAns" placeholder="Select Question/Answer" />

                            </View>

                        </View>
                        {listItem.status ?
                            <BottomDrawerList closeModule={closeModule} listItem={listItem} getSelectedItem={getSelectedItem} selectedField={selectedField} /> : null
                        }
                    </>
                }
            </SafeAreaView>

        </SafeAreaProvider>
    )
}

export default Safal

const styles = StyleSheet.create({})