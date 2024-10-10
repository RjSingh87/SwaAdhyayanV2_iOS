import { Platform, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { GlobleData } from '../../../Store'
import SwaHeader from '../../common/SwaHeader'
import SelectionBox from '../../common/SelectionBox'
import { SWATheam, apiRoot } from '../../../constant/ConstentValue'
import Services from '../../../Services'
import BottomDrawerList from '../../common/BottomDrawerList'
import Loader from '../../common/Loader'
import ReportViwer from '../../common/ReportViwer'
import ReportInstructions from './ReportInstructions'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'


const ViewReport = ({ navigation, route }) => {

    const { userData } = useContext(GlobleData)
    const reportName = route.params.data.childIconName
    const reportSubIconID = route.params.data.subIconID
    const reportChildIconSequence = route.params.data.childIconSequence

    const [selectedField, setSelectedField] = useState({ class: null, section: null, student: null, subject: null, assessment: null })
    const [listItem, setListItem] = useState({ list: null, status: false, type: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [reportData, setReportData] = useState({ data: null, status: false })
    const [consolidatedReportData, setConsolidatedReportData] = useState({ APP: null, LS: null, MI: null, KM: null, BD: null, msg: '', status: false })
    const [combineReport, SetCombineReport] = useState(false)

    const testType = route.params.data.childIconSequence


    function onClickLeftIcon() {
        navigation.goBack()
    }
    function onClickRightIcon() {
        setIsInstruction(true)
    }

    function closeModule() {
        setListItem((prev) => {
            return { ...prev, status: false }
        });
        setReportData((prev) => {
            return { ...prev, status: false }
        })
        SetCombineReport(false)
    }

    function getListItem(type) {
        setIsLoading(true)
        if (type == "class") {
            setSelectedField((prev) => {
                return { ...prev, section: null, subject: null, assessment: null }
            })
            if (reportSubIconID == 60) {
                const payload = {
                    septID: route.params.data.childIconSequence,
                    classIDs: route.params.data.classIDs,
                    classIDs: (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? route.params.data.classIDs : userData.data.classID,
                    schoolCode: userData.data.schoolCode,
                    userTypeID: userData?.data?.userTypeID,
                    userRefID: userData?.data?.userRefID,
                    academicYear: userData?.data?.academicYear
                }
                Services.post(apiRoot.getClassesAccToReport, payload)
                    .then((res) => {
                        if (res.status == "success") {

                            setIsLoading(false)
                            setListItem((prev) => {
                                return { ...prev, list: res.data, status: true, type: "reportClass" }
                            })
                        } else if (res.status == "error") {
                            alert(res.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            } else {
                const classPayload = {
                    "schoolCode": userData?.data?.schoolCode,
                    "userTypeID": userData?.data?.userTypeID
                }
                if (userData.data.userTypeID == 4) {
                    classPayload["academicYear"] = userData?.data?.academicYear,
                        classPayload["userRefID"] = userData?.data?.userRefID
                }
                Services.post(apiRoot.getClassList, classPayload)
                    .then((res) => {
                        if (res.status == "success") {
                            setSelectedField((prev) => {
                                return { ...prev, section: null, subject: null }
                            })
                            setListItem((prev) => {
                                return { ...prev, list: res.data, status: true, type: type }
                            });
                            setIsLoading(false)
                        } else if (res.status == "error") {
                            alert(res.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })

            }
        } else if (type == "section") {
            setSelectedField((prev) => {
                return { ...prev, subject: null, assessment: null }
            })
            if (selectedField.class != null) {
                const payload = {
                    "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
                    "schoolCode": userData?.data?.schoolCode,
                    "userTypeID": userData?.data?.userTypeID,
                    "userRefID": userData?.data?.userRefID,
                    "academicYear": userData?.data?.academicYear
                }
                Services.post(apiRoot.getSectionList, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setSelectedField((prev) => {
                                return { ...prev, subject: null }
                            })
                            setIsLoading(false)
                            setListItem((prev) => {
                                return { ...prev, list: res.data, status: true, type: "reportSection" }
                            })
                        } else if (res.status == "error") {
                            alert(res.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            } else {
                alert('Please select required fields.')
                setIsLoading(false)
                setListItem((prev) => {
                    return { ...prev, status: false }
                })
            }
        } else if (type == "student") {
            if (selectedField.class != null && selectedField.section != null) {
                const payload = {
                    "schoolCode": userData.data.schoolCode,
                    "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
                    "sectionID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.section.sectionID : userData.data.sectionID,
                    "academicYear": userData.data.academicYear,
                    "transYear": userData.data.transYear
                }
                Services.post(apiRoot.getStudentsData, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setIsLoading(false)
                            setListItem((prev) => {
                                return { ...prev, list: res.data, status: true, type: "reportStudent" }
                            })
                        } else {
                            alert(res.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            } else {
                alert('Please select required fields.')
                setIsLoading(false)
                setListItem((prev) => {
                    return { ...prev, status: false }
                })
            }
        } else if (type == 'subject') {
            if (reportSubIconID == 65 && testType == 1 ? (selectedField.class != null && selectedField.section != null) : (selectedField.class != null && selectedField.section != null && selectedField.student != null)) {
                const payload = {
                    "schoolCode": userData?.data?.schoolCode,
                    "userTypeID": userData?.data?.userTypeID,
                    "academicYear": userData?.data?.academicYear,
                    "userRefID": userData?.data?.userRefID,
                    "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
                    "sectionID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.section.sectionID : userData.data.sectionID,
                }
                Services.post(apiRoot.getSubjectList, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setIsLoading(false)
                            setListItem((prev) => {
                                return { ...prev, list: res.data, status: true, type: "reportSubject" }
                            })
                        } else if (res.status == "error") {
                            alert(res.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        setIsLoading(false)
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            } else {
                alert('Please select required fields.')
                setIsLoading(false)
                setListItem((prev) => {
                    return { ...prev, status: false }
                })
            }
        } else if (type == "assessment") {
            setIsLoading(true)
            if (reportSubIconID == 62 && (testType == 4 || testType == 7)) {

                const payload = {
                    "schoolCode": userData?.data?.schoolCode,
                    "academicYear": userData?.data?.academicYear,
                    "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
                    "sectionID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.section.sectionID : userData.data.sectionID,
                    "subjectID": selectedField.subject.subjectID
                }
                Services.post(apiRoot.getAssessmentReportData, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setIsLoading(false)
                            setListItem((prev) => {
                                return { ...prev, list: res.data, status: true, type: "reportAss" }
                            })
                        } else if (res.status == "error") {
                            alert(res.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        setIsLoading(false)
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            } else if (reportSubIconID == 64 && testType == 1) {
                if (selectedField.class != null && selectedField.section != null) {
                    const payload = {
                        schoolCode: userData.data.schoolCode
                    }
                    Services.post(apiRoot.defaultExamList, payload)
                        .then((res) => {
                            if (res.status == "success") {
                                setIsLoading(false)
                                setListItem((prev) => {
                                    return { ...prev, list: res.data, status: true, type: "clsWiseReportAss" }
                                })

                            } else if (res.status == 'error') {
                                alert(res.message)
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                        .finally(() => {
                            setIsLoading(false)
                        })

                } else {
                    alert('Please select required fields.')
                    setIsLoading(false)
                }
            } else if (reportSubIconID == 64 && testType == 2) {
                const payload = {
                    "schoolCode": userData.data.schoolCode,
                    "academicYear": userData.data.academicYear,
                    "classID": selectedField.class.classID,
                    "sectionID": selectedField.section.sectionID,
                    "subjectID": selectedField.subject.subjectID
                }
                Services.post(apiRoot.assessmentReportListSubjectWise, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setIsLoading(false)
                            setListItem((prev) => {
                                return { ...prev, list: res.data, status: true, type: "reportAss" }
                            })
                        } else if (res.status == "error") {
                            alert(res.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        setIsLoading(false)
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            }
        }
    }

    function getSelectedItem(item, type) {
        if (type == "reportClass" || type == "class") {
            setSelectedField((prev) => {
                return { ...prev, class: type == "class" ? item.getClassDetail : item, section: null, student: null }
            });
            setListItem((prev) => {
                return { ...prev, status: false }
            })
        } else if (type == "reportSection") {
            if (reportSubIconID == 62 && reportChildIconSequence == 1) {
                setIsLoading(true)
                setSelectedField((prev) => {
                    return { ...prev, section: item, student: null }
                });
                setListItem((prev) => {
                    return { ...prev, status: false }
                })
                const payload = {
                    "schoolCode": userData.data.schoolCode,
                    "academicYear": userData.data.academicYear,
                    "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
                    "sectionID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? item.sectionID : userData.data.sectionID

                }
                Services.post(apiRoot.overAllClassAnalysisReport, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setIsLoading(false)
                            setReportData((prev) => {
                                return { ...prev, data: res.data, status: true }
                            })
                        } else if (res.status == "error") {
                            alert(res.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        setIsLoading(false)
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            } else if (reportSubIconID == 62 && reportChildIconSequence == 2) {
                setIsLoading(true)
                setSelectedField((prev) => {
                    return { ...prev, section: item, student: null }
                });
                setListItem((prev) => {
                    return { ...prev, status: false }
                })
                const payload = {
                    "schoolCode": userData.data.schoolCode,
                    "academicYear": userData.data.academicYear,
                    "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
                    "sectionID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? item.sectionID : userData.data.sectionID
                }
                Services.post(apiRoot.allSubjectsProficiencyReport, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setIsLoading(false)
                            setReportData((prev) => {
                                return { ...prev, data: res.data, status: true }
                            })
                        } else if (res.status == "error") {
                            alert(res.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        setIsLoading(false)
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            } else if (reportSubIconID == 62 && reportChildIconSequence == 3) {
                setIsLoading(true)
                setSelectedField((prev) => {
                    return { ...prev, section: item, student: null }
                });
                setListItem((prev) => {
                    return { ...prev, status: false }
                })
                const payload = {
                    "schoolCode": userData.data.schoolCode,
                    "academicYear": userData.data.academicYear,
                    "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
                    "sectionID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? item.sectionID : userData.data.sectionID
                }
                Services.post(apiRoot.classWisePercentageReport, payload)
                    .then((res) => {
                        if (res.status == "success") {
                            setIsLoading(false)
                            setReportData((prev) => {
                                return { ...prev, data: res.data, status: true }
                            })

                        } else if (res.status == "error") {
                            alert(res.message)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        setIsLoading(false)
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            }
            else {
                setSelectedField((prev) => {
                    return { ...prev, section: item, student: null }
                });
                setListItem((prev) => {
                    return { ...prev, status: false }
                })
            }
        } else if (type == "reportStudent") {
            if (reportSubIconID != 62 && testType == 6) {
                getConsolidatedReport(item.userRefID)
                setListItem((prev) => {
                    return { ...prev, status: false }
                });
            } else if (reportSubIconID == 60) {
                getReport(item.userRefID)
            } else if (reportSubIconID == 62 && testType == 6) {
                setSelectedField((prev) => {
                    return { ...prev, student: item }
                });
                setListItem((prev) => {
                    return { ...prev, status: false }
                });
                allSubjectStudentComparisonReport(item)
            } else if (reportSubIconID == 63 && testType == 1) {
                setSelectedField((prev) => {
                    return { ...prev, student: item }
                });
                setListItem((prev) => {
                    return { ...prev, status: false }
                });
                getSubjectWiseDifficultyAnalysis(item)

            } else if (reportSubIconID == 63 && testType == 4) {
                setSelectedField((prev) => {
                    return { ...prev, student: item }
                });
                setListItem((prev) => {
                    return { ...prev, status: false }
                });

                getHalfYearlyReports(item)
            } else if (reportSubIconID == 63 && testType == 5) {
                setSelectedField((prev) => {
                    return { ...prev, student: item }
                });
                setListItem((prev) => {
                    return { ...prev, status: false }
                });
                getAnnualReport(item)
            }
            else {
                setSelectedField((prev) => {
                    return { ...prev, student: item }
                });
                setListItem((prev) => {
                    return { ...prev, status: false }
                });
            }
            console.log(reportSubIconID, testType)

        } else if (type == 'reportSubject') {
            if (reportSubIconID == 62 && testType == 5) {
                setSelectedField((prev) => {
                    return { ...prev, subject: item }
                });
                setListItem((prev) => {
                    return { ...prev, status: false }
                });
                subjectWiseStudentComparisonReport(item)
            } else if (reportSubIconID == 63 && testType == 2) {
                setSelectedField((prev) => {
                    return { ...prev, subject: item }
                });
                setListItem((prev) => {
                    return { ...prev, status: false }
                });
                getAssessmentWiseSubjectReport(item)

            } else if (reportSubIconID == 63 && testType == 3) {
                setSelectedField((prev) => {
                    return { ...prev, subject: item }
                });
                setListItem((prev) => {
                    return { ...prev, status: false }
                });

                getSubjectWiseComprehensiveReport(item)
            } else if (reportSubIconID == 65 && testType == 1) {
                setSelectedField((prev) => {
                    return { ...prev, subject: item }
                });
                setListItem((prev) => {
                    return { ...prev, status: false }
                });
                assessmentReportListSubjectWise(item)

            } else {
                setSelectedField((prev) => {
                    return { ...prev, subject: item }
                });
                setListItem((prev) => {
                    return { ...prev, status: false }
                });
            }

        } else if (type == "reportAss") {
            setSelectedField((prev) => {
                return { ...prev, assessment: item }
            });
            setListItem((prev) => {
                return { ...prev, status: false }
            });
            if (reportSubIconID == 62 && testType == 4) {
                subjectAndAssessmentGradingReport(item)
            } else if (reportSubIconID == 62 && testType == 7) {
                assessmentWiseStudentReport(item)
            } else if (reportSubIconID == 64 && testType == 2) {
                chapterWiseStudentAssessmentReport(item)
            }
        } else if (type == "clsWiseReportAss") {
            setSelectedField((prev) => {
                return { ...prev, assessment: item }
            });
            setListItem((prev) => {
                return { ...prev, status: false }
            });
            classWiseAssWiseSubjReport(item)

        }
    }

    function assessmentReportListSubjectWise(item) {
        console.log(item, 'hari krishan pant')
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": userData.data.academicYear,
            "classID": selectedField.class.classID,
            "sectionID": selectedField.section.sectionID,
            "subjectID": item.subjectID
        }
        Services.post(apiRoot.assessmentReportListSubjectWise, payload)
            .then((res) => {
                console.log(JSON.stringify(res), 'check')
                if (res.status == "success") {
                    let reportName = ""
                    if (reportSubIconID == 65 && testType == 1) {
                        reportName = "Detailed Analytical Report of Class for Teacher Subject-wise"
                    } else {
                        reportName = "Detailed Analytical Report of Student"

                    }
                    navigation.navigate("detailAnalyticalList", { data: res.data, reportName: reportName, testType: testType })

                } else if (res.status == "error") {

                }
            })

    }

    function chapterWiseStudentAssessmentReport(item) {
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": userData.data.academicYear,
            "userRefID": selectedField.student.userRefID,
            "classID": selectedField.class.classID,
            "sectionID": selectedField.section.sectionID,
            "subjectID": selectedField.subject.subjectID,
            "assessmentID": item.assessmentID
        }
        Services.post(apiRoot.chapterWiseStudentAssessmentReport, payload)
            .then((res) => {
                if (res.status == "success") {
                    setIsLoading(false)
                    setReportData((prev) => {
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
                setIsLoading(false)
            })

    }

    function classWiseAssWiseSubjReport(item) {
        setIsLoading(true)
        console.log(item, 'check item')
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": userData.data.academicYear,
            "classID": selectedField.class.classID,
            "sectionID": selectedField.section.sectionID,
            "assessmentID": item.examID,
            "assessmentName": item.examName
        }
        Services.post(apiRoot.classAssessmentWiseSubjectReport, payload)
            .then((res) => {
                if (res.status == "success") {
                    setIsLoading(false)
                    setReportData((prev) => {
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
                setIsLoading(false)
            })

    }

    function getAnnualReport(item) {
        setIsLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": item.academicYear,
            "classID": item.classID,
            "sectionID": item.sectionID,
            "userRefID": item.userRefID
        }
        Services.post(apiRoot.getAnnualReport, payload)
            .then((res) => {
                if (res.status == "success") {
                    setIsLoading(false)
                    setReportData((prev) => {
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
                setIsLoading(false)
            })
    }

    function getHalfYearlyReports(item) {
        setIsLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": item.academicYear,
            "classID": item.classID,
            "sectionID": item.sectionID,
            "userRefID": item.userRefID
        }
        Services.post(apiRoot.getHalfYearlyReports, payload)
            .then((res) => {
                if (res.status == "success") {
                    setIsLoading(false)
                    setReportData((prev) => {
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
                setIsLoading(false)
            })
    }
    function getSubjectWiseComprehensiveReport(item) {
        setIsLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": userData.data.academicYear,
            "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
            "sectionID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.section.sectionID : userData.data.sectionID,
            "userRefID": selectedField.student.userRefID,
            "userTypeID": selectedField.student.userTypeID,
            "subjectID": item.subjectID
        }
        Services.post(apiRoot.getSubjectWiseComprehensiveReport, payload)
            .then((res) => {
                if (res.status == "success") {
                    setIsLoading(false)
                    setReportData((prev) => {
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
                setIsLoading(false)
            })
    }

    function getAssessmentWiseSubjectReport(item) {
        setIsLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": userData.data.academicYear,
            "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
            "sectionID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.section.sectionID : userData.data.sectionID,
            "userRefID": selectedField.student.userRefID,
            "userTypeID": selectedField.student.userTypeID,
            "subjectID": item.subjectID
        }
        Services.post(apiRoot.getAssessmentWiseSubjectReport, payload)
            .then((res) => {
                if (res.status == "success") {
                    setIsLoading(false)
                    setReportData((prev) => {
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
                setIsLoading(false)
            })

    }
    function getSubjectWiseDifficultyAnalysis(item) {
        setIsLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": userData.data.academicYear,
            "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
            "sectionID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.section.sectionID : userData.data.sectionID,
            "userRefID": item.userRefID
        }
        Services.post(apiRoot.getSubjectWiseDifficultyAnalysis, payload)
            .then((res) => {
                if (res.status == "success") {
                    setIsLoading(false)
                    setReportData((prev) => {
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
                setIsLoading(false)
            })
    }

    function assessmentWiseStudentReport(item) {
        setIsLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": userData.data.academicYear,
            "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
            "sectionID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.section.sectionID : userData.data.sectionID,
            "userRefID": selectedField.student.userRefID,
            "subjectID": selectedField.subject.subjectID,
            "assessmentID": item.assessmentID
        }
        Services.post(apiRoot.assessmentWiseStudentReport, payload)
            .then((res) => {
                if (res.status == "success") {
                    setIsLoading(false)
                    setReportData((prev) => {
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
                setIsLoading(false)
            })

    }
    function allSubjectStudentComparisonReport(item) {
        setIsLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": userData.data.academicYear,
            "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
            "sectionID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.section.sectionID : userData.data.sectionID,
            "userRefID": item.userRefID
        }
        Services.post(apiRoot.allSubjectStudentComparisonReport, payload)
            .then((res) => {
                if (res.status == "success") {
                    setIsLoading(false)
                    setReportData((prev) => {
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
                setIsLoading(false)
            })
    }
    function subjectWiseStudentComparisonReport(item) {

        setIsLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": userData.data.academicYear,
            "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
            "sectionID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.section.sectionID : userData.data.sectionID,
            "userRefID": selectedField.student.userRefID,
            "subjectID": item.subjectID
        }
        Services.post(apiRoot.subjectWiseStudentComparisonReport, payload)
            .then((res) => {
                if (res.status == "success") {
                    setIsLoading(false)
                    setReportData((prev) => {
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
                setIsLoading(false)
            })

    }
    function subjectAndAssessmentGradingReport(item) {
        setIsLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": userData.data.academicYear,
            "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
            "sectionID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.section.sectionID : userData.data.sectionID,
            "subjectID": selectedField.subject.subjectID,
            "assessmentID": item.assessmentID
        }
        Services.post(apiRoot.subjectAndAssessmentGradingReport, payload)
            .then((res) => {
                if (res.status == "success") {
                    setIsLoading(false)
                    setReportData((prev) => {
                        return { ...prev, data: res.data, status: true }
                    })
                } else if (res.status == "error") {
                    alert(res.message)
                }
            })
            .catch((err) => {
                console.log(err)
                setIsLoading(false)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    function getReport(userRefID) {
        setIsLoading(true)
        const payload = {
            "schoolCode": userData.data.schoolCode,
            "academicYear": userData.data.academicYear,
            "userRefID": userRefID,
            "testID": route.params.data.childIconSequence,
            "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
            "sectionID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.section.sectionID : userData.data.sect
        }
        Services.post(apiRoot.reportSEPT, payload)
            .then((res) => {
                if (res.status == "success") {
                    setIsLoading(false)
                    const nameArray = []
                    if (res.data.pdCategoryNameList != undefined) {
                        for (i = 0; i < res.data.pdCategoryNameList.length; i++) {
                            nameArray.push(res.data.pdCategoryNameList[i].toString().replaceAll(",", ""))
                        }
                        setReportData((prev) => {
                            return { ...prev, data: res.data, legendList: nameArray, status: true }
                        })
                    }
                    setReportData((prev) => {
                        return { ...prev, data: res.data, status: true }
                    })
                } else {
                    alert(res.message)
                }
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                setIsLoading(false)
            })
    }

    function getConsolidatedReport(userRefID) {
        setIsLoading(true)
        const payload = {
            schoolCode: userData.data.schoolCode,
            academicYear: userData.data.academicYear,
            userRefID: userRefID,
            classID: (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
            sectionID: (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.section.sectionID : userData.data.sectionID
        }
        Services.post(apiRoot.consolidatedSeptReport, payload)
            .then((res) => {
                if (res.status == "success") {
                    SetCombineReport(true)
                    if (res.data.APP.status == "success") {
                        setIsLoading(false)
                        setConsolidatedReportData((prev) => {
                            return { ...prev, APP: res.data.APP.data, status: true }
                        })
                    } else if (res.data.APP.status == "error") {
                        setConsolidatedReportData((prev) => {
                            return { ...prev, msg: res.data.APP.message, status: true }
                        })
                    }

                    if (res.data.LS.status == "success") {
                        setConsolidatedReportData((prev) => {
                            return { ...prev, LS: res.data.LS.data, status: true }
                        })

                    } else if (res.data.LS.status == "error") {
                        setConsolidatedReportData((prev) => {
                            return { ...prev, msg: res.data.LS.message, status: true }
                        })

                    }
                    if (res.data.MI.status == "success") {
                        setConsolidatedReportData((prev) => {
                            return { ...prev, MI: res.data.MI.data, status: true }
                        })
                    } else if (res.data.MI.status == "error") {
                        setConsolidatedReportData((prev) => {
                            return { ...prev, msg: res.data.MI.message, status: true }
                        })
                    }
                    if (res.data.KM.status == "success") {
                        const nameArray = []
                        if (res.data.KM.data.pdCategoryNameList != undefined) {
                            for (i = 0; i < res.data.KM.data.pdCategoryNameList.length; i++) {

                                nameArray.push(res.data.KM.data.pdCategoryNameList[i].toString().replaceAll(",", ""))
                            }
                        }
                        setConsolidatedReportData((prev) => {
                            return { ...prev, KM: res.data.KM.data, legendList: nameArray, status: true }
                        })
                    } else if (res.data.KM.status == "error") {
                        setConsolidatedReportData((prev) => {
                            return { ...prev, msg: res.data.KM.message, status: true }
                        })
                    }
                    if (res.data.BD.status == "success") {
                        setConsolidatedReportData((prev) => {
                            return { ...prev, BD: res.data.BD.data, status: true }
                        })
                    } else if (res.data.BD.status == "error") {
                        setConsolidatedReportData((prev) => {
                            return { ...prev, msg: res.data.BD.message, status: true }
                        })
                    }
                } else if (res.status == "error") {
                    const message = res.message == undefined ? 'Student has not attempted any of the SEPT test.' : res.message
                    alert(message)

                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })

    }

    // console.log(reportSubIconID, testType)




    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['left', 'right', 'top']} style={{ flex: 1, backgroundColor: userData.data.colors.mainTheme }}>
                <View style={{ flex: 1, marginTop: Platform.OS == "ios" ? 0 : 24, backgroundColor: userData.data.colors.liteTheme }}>
                    {isLoading ?
                        <Loader /> :
                        <>
                            <SwaHeader title={"Report"} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
                            <View style={{ flex: 1, backgroundColor: userData.data.colors.liteTheme, padding: 10 }}>
                                <View style={{ padding: 10 }}>
                                    <Text style={{ textAlign: 'center', textTransform: 'uppercase', fontWeight: '700', color: SWATheam.SwaBlack }}>{reportName}</Text>
                                </View>
                                <SelectionBox getListItem={getListItem} selectedField={selectedField?.class?.classDesc} type="class" placeholder="Select class" />
                                <SelectionBox getListItem={getListItem} selectedField={selectedField?.section?.sectionName} type="section" placeholder="Select section" />
                                {reportSubIconID == 60 || reportSubIconID == 62 && (testType == 5 || testType == 6 || testType == 7) || (reportSubIconID == 63 && (testType == 1 || testType == 2 || testType == 4 || testType == 5 || testType == 6 || testType == 7)) ?
                                    <SelectionBox getListItem={getListItem} selectedField={selectedField?.student?.fullName} type="student" placeholder="Select student" /> : null
                                }
                                {reportSubIconID == 62 || reportSubIconID == 63 || reportSubIconID == 64 || reportSubIconID == 65 ?
                                    <>{(reportSubIconID == 63 && (testType == 2 || testType == 3)) || testType == 4 || testType == 5 || testType == 7 ?
                                        <>
                                            {reportSubIconID == 63 && testType == 3 ?
                                                <SelectionBox getListItem={getListItem} selectedField={selectedField?.student?.fullName} type="student" placeholder="Select student" /> : null
                                            }
                                            {reportSubIconID == 63 && testType != 4 && testType != 5 || reportSubIconID == 65 && testType == 1 ?
                                                <SelectionBox getListItem={getListItem} selectedField={selectedField?.subject?.subjectName} type="subject" placeholder="Select subject" /> : null
                                            }
                                        </> : null
                                    }
                                        {(reportSubIconID == 64 && testType == 2) || (reportSubIconID == 65 && testType == 1 || testType == 2) ?
                                            <>
                                                {(reportSubIconID == 64 && testType == 2) || (reportSubIconID == 65 && testType == 2) ?
                                                    <SelectionBox getListItem={getListItem} selectedField={selectedField?.student?.fullName} type="student" placeholder="Select student" /> : null
                                                }
                                                <SelectionBox getListItem={getListItem} selectedField={selectedField?.subject?.subjectName} type="subject" placeholder="Select subject" />
                                            </> : null
                                        }
                                        {reportSubIconID == 62 || reportSubIconID == 64 && testType == 1 || testType == 2 || testType == 4 || testType == 7 ?
                                            <>

                                                <SelectionBox getListItem={getListItem} selectedField={reportSubIconID == 64 && testType == 1 ? selectedField?.assessment?.examName : selectedField?.assessment?.assessmentName} type="assessment" placeholder="Select assessment" />

                                            </>
                                            : null
                                        }
                                    </> : null
                                }
                                <ReportInstructions instruction={route.params.data.iconDescription} />
                            </View>
                            {reportData.status || combineReport ?
                                <ReportViwer closeModule={closeModule} reportData={combineReport ? consolidatedReportData : reportData} selectedField={selectedField} reportName={reportName} testType={testType} reportSubIconID={reportSubIconID} reportChildIconSequence={reportChildIconSequence} /> : null
                            }
                            {listItem.status ?
                                <BottomDrawerList closeModule={closeModule} listItem={listItem} getSelectedItem={getSelectedItem} selectedField={selectedField} /> : null
                            }

                        </>
                    }

                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default ViewReport

const styles = StyleSheet.create({})