import { Platform, StyleSheet, Text, View, StatusBar, ScrollView, TouchableOpacity, Image, } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Loader from '../common/Loader'
import { GlobleData } from '../../Store'
import SwaHeader from '../common/SwaHeader'
import IconsContainer from '../common/IconsContainer'
import SelectionBox from '../common/SelectionBox'
import Services from '../../Services'
import { SWATheam, apiRoot } from '../../constant/ConstentValue'
import { useDispatch, useSelector } from 'react-redux';
import { fetchLearningTool } from '../redux/slices/LearningToolList'
import { fetModuleActivityList } from '../redux/slices/ModuleActivityList';
import SubIconActivityList from '../common/SubIconActivityList'
import GameList from '../common/GameList'
import Orientation from 'react-native-orientation-locker';
import MsgModal from '../common/MsgModal'
import AcademicProfIntro from './SEPT/AcademicProfIntro'
import CustomInput from '../common/CustomInput'
import ReportViwer from '../common/ReportViwer'
import AssessmentView from './Assessment/assessmentView'
import AutoAssessmentGenerate from './Assessment/autoAssessmentGenerate'
import AssessmentStatus from './Assessment/AssessmentStatus'
import ManageAssessment from './Assessment/ManageAssessment'
import AddQuestionManually from './Assessment/AddQuestionManually'




import BottomDrawerList from '../common/BottomDrawerList';
import Co_ScholasticIndicator from './marksEntryScreens/Co_ScholasticIndicator'
import AddEditSubIndicator from './marksEntryScreens/AddEditSubIndicator'
import CreateHomeWork from './homeWork/teacher/CreateHomeWork'
import SaveHomeWork from './homeWork/teacher/SavedHomeWork'
import AssignedHomeWork from './homeWork/teacher/AssignedHomeWork'
import SubmittedHomeWork from './homeWork/teacher/SubmittedHomeWork'
import CheckedHomeWork from './homeWork/teacher/CheckedHomeWork'
import CertificateIconsView from './homeWork/teacher/CertificateIconsView'
import ViewAndSubmitHomework from './homeWork/student/ViewAndSubmitHomework'
import SubmittedStudentHomeWork from './homeWork/student/SubmittedHomeWork'
import CheckedStuentHomeWork from './homeWork/student/CheckedHomeWork'
import CertificatedAwarded from './homeWork/student/CertificateAwarded'
import IssuedCertificate from './homeWork/teacher/IssuedCertificate'
import CreateCertificate from './homeWork/teacher/CreateCertificate'
import SubjectMarksEntryList from './marksEntryScreens/SubjectMarksEntryList'



const activeSubIconIDs = [18, 45, 94, 20, 48, 124, 47, 19, 46, 95, 34, 35, 36, 37, 38, 39, 60, 62, 63, 64, 65, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 114, 115, 54, 55, 87, 88, 89, 90, 91, 92, 93, 109, 110, 111, 112, 113]
// 19,46,45/   ---NCERT 
// 54, 55 marksEntry
const reportSubIconsIDs = [34, 35, 36, 37, 38, 39, 60, 62, 63, 64, 65, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 114, 115]
const ncertIDs = [19, 46, 95]
const assSubIconIDs = [23, 24, 25, 26, 42, 43, 49, 50, 51, 52, 113]
const reportMainIconIDs = [7, 20, 30, 37]
const marksEntrySubIconID = [27, 28, 29, 30, 31, 32, 33, 53, 54, 55, 56, 57, 58, 59]
// const homeWorkSubIconID = [87,88,89,90,91,92,93, 109,110,111,112]




const SubIconsScreen = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const { userData } = useContext(GlobleData)
  const [subIconsData, setSubIconsData] = useState({ icons: null, iconUrl: '', status: true, iconName: '' })
  const [selectedIcon, setSelectedIcon] = useState({ name: subIconsData.iconName, subIconID: subIconsData?.icons?.icons[0] })
  const [selectField, setSelectField] = useState(true)
  const [selectedField, setSelectedField] = useState({ class: null, section: null, subject: null, book: null, level: null, trkSub: null, trmType: null, markAss: null, markFormet: null, term: null, marksType: null, student: null })
  const [listItem, setListItem] = useState({ list: null, status: false, type: '' })
  const [toolItems, setToolItems] = useState()
  const [loading, setLoading] = useState(true)
  const [intro, setIntor] = useState({ selectedSubIcon: null, instruction: false })
  const [viewSeptReport, setViewSeptReport] = useState({ data: null, status: false })
  const [trkSubject, setTrkSubject] = useState(false)
  const [gameList, setGameList] = useState({ data: null, status: false })
  const [msgModalVisible, setMsgModalVisible] = useState({ msg: '', status: false, type: '' })
  const [childIconsList, setChildIconsList] = useState({ listItem: null, status: false })
  const [consolidatedReportData, setConsolidatedReportData] = useState({ APP: null, LS: null, MI: null, KM: null, BD: null, msg: '', status: false })
  const [combineReport, SetCombineReport] = useState(false)
  const [inputField, setInputField] = useState({ assName: null })
  const [indicatorsList, setIndicatorsList] = useState({ data: null, status: false })
  const [editIndicator, seteditIndicator] = useState({ actionName: '', editItem: null, type: '', status: false })
  const [subIndicatorName, setsubIndicatorName] = useState('');
  const [subjectMarksEntry, setSubjectMarksEntry] = useState({ list: null, status: false, })
  const [certificateAct, setCertificateAct] = useState({ create: false, issued: false, iconView: true })
  const [termBtnID, setTermBtnId] = useState(1)
  const [selectedTerm, setSelectedTerm] = useState()
  const [editAss, setEditAss] = useState({ type: '', data: null, status: false })
  const toolName = route.params.from == "assign" ? "Swa-Assessment" : route.params.getMainIconsData.iconName
  const mainIconID = route.params.from == "assign" ? 18 : route.params.mainIconID



  const trkLevelItems = [
    { level: "Level A,B,C", levelID: 1 },
    { level: "Level 1-8", levelID: 2 }
  ]
  const trmTypeList = [
    { trmType: "Complete Solutions/Answers", trmID: 6 },
    { trmType: "Lesson Plans", trmID: 5 }
  ]
  const trkSubjectList = [
    { subjectName: "Hindi", subjectID: 1 },
    { subjectName: "English", subjectID: 2 },
    { subjectName: "Mathematics", subjectID: 3 },
    { subjectName: "Science", subjectID: 4 },
    { subjectName: "Social Science", subjectID: 5 },
    { subjectName: "EVS", subjectID: 6 }
  ]
  const marksEntryFormat = [
    { format: "Question Wise Marks", formatID: 1 },
    { format: "Full Marks", formatID: 2 }
  ]

  useEffect(() => {
    const goBack = navigation.addListener('focus', () => {
      setLoading(false)
      if (userData.data.userTypeID == 5) {
        getSubIcons()
      }
      Orientation.lockToPortrait();
      StatusBar.setHidden(false);
    });
    return goBack
  }, [navigation])

  function selectTerm(item, type) {
    setSelectedTerm(item.userRefID)
    let termID = 1
    if (type == "term1") {
      setTermBtnId(1)
      termID = 1
      getStudentListWithSubjectMarks(termID, type)
    } else if (type == "term2") {
      setTermBtnId(2)
      termID = 2
      getStudentListWithSubjectMarks(termID, type)
    }

  }

  useEffect(() => {
    getSubIcons()
  }, [])

  useEffect(() => {
    if (selectedIcon.subIconID == 60) {
      const payload = {
        "schoolCode": userData.data.schoolCode,
        "subIconID": selectedIcon.subIconID
      }
      Services.post(apiRoot.getChildIcons, payload)
        .then((res) => {
          if (res.status == "success") {
            setChildIconsList((prev) => {
              return { ...prev, listItem: res.data, status: true }
            })
          } else if (res.status == "error") {
            alert(res.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally((err) => {
        })
    }
  }, [selectedIcon])

  function getSubIcons() {
    if (mainIconID == 27) {

      setLoading(true)
      const payload = {
        "userRefID": userData?.data?.userRefID,
        "schoolCode": userData?.data?.schoolCode,
        "academicYear": userData?.data?.academicYear,
        "userTypeID": userData?.data?.userTypeID,
        "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
        "sectionID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.section.sectionID : userData.data.sectionID,
      }
      Services.post(apiRoot.septModules, payload)
        .then((res) => {
          if (res.status == "success") {

            setLoading(false)
            setSubIconsData((prev) => {
              return { ...prev, icons: res.data, iconUrl: res.data.path, status: false, iconName: "sept" }
            });
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
      const subIconPayload = {
        "userRefID": userData?.data?.userRefID,
        "schoolCode": userData?.data?.schoolCode,
        "academicYear": userData?.data?.academicYear,
        "userTypeID": userData?.data?.userTypeID,
        "mainIconID": mainIconID
      }
      Services.post(apiRoot.appSubIcons, subIconPayload)
        .then((res) => {
          if (res.status == "success") {
            setLoading(false)
            setSubIconsData((prev) => {
              return { ...prev, icons: res.data, iconUrl: res.data.domain, status: false, iconName: res.data.icons[0].getSubIconsData.subIconName }
            });

            setSelectedIcon((prev) => {
              return { ...prev, name: res.data.icons[0].getSubIconsData.subIconName, subIconID: res.data.icons[0].getSubIconsData.subIconID }
            });


          } else if (res.status == "error") {
            alert(res.message)
            navigation.goBack()
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
    SetCombineReport(false);
    seteditIndicator((prev) => {
      return { ...prev, status: false }
    })
  }
  function getIconDetail(val) {
    // console.log(val.getSubIconsData.subIconID, 'hello subIconID check')
    setEditAss((prev) => {
      return { ...prev, type: "", status: false }
    })
    setSelectedField({});
    setToolItems()
    setTrkSubject(false)
    setGameList((prev) => {
      return { ...prev, status: false }
    })
    setIndicatorsList((prev) => {
      return { ...prev, status: false }
    })
    if (val.testID != undefined) {
      if (val.isSeptAttempt) {
        setViewSeptReport((prev) => {
          return { ...prev, data: val, status: true }
        });
        setIntor((prev) => {
          return { ...prev, selectedSubIcon: val, instruction: false }
        });
      } else {
        setIntor((prev) => {
          return { ...prev, selectedSubIcon: val, instruction: true }
        });
        setViewSeptReport((prev) => {
          return { ...prev, status: false }
        })
      }

    } else if (activeSubIconIDs.includes(val.getSubIconsData.subIconID) && !reportSubIconsIDs.includes(val.getSubIconsData.subIconID)) {
      setCertificateAct((prev) => {
        return { ...prev, create: false, issued: false, iconView: true }
      })

      if (val.getSubIconsData.subIconID == 96) {
        navigation.navigate('cbseSafal', val)
      } else if (val.getSubIconsData.subIconID == 54 || val.getSubIconsData.subIconID == 55) {
        setSelectedIcon((prev) => {
          return { ...prev, name: val.getSubIconsData.subIconName, subIconID: val.getSubIconsData.subIconID }
        });
        getIndicatorList("", val.getSubIconsData.subIconID)

      } else {
        setSelectedField({});
        setToolItems();
        setSelectField(true);
        setSelectedIcon((prev) => {
          return { ...prev, name: val.getSubIconsData.subIconName, subIconID: val.getSubIconsData.subIconID }
        });
      }

    } else if ((activeSubIconIDs.includes(val.getSubIconsData.subIconID)) && reportSubIconsIDs.includes(val.getSubIconsData.subIconID)) {
      setSelectedIcon((prev) => {
        return { ...prev, name: val.getSubIconsData.subIconName, subIconID: val.getSubIconsData.subIconID }
      });
      if (userData.data.userTypeID == 5 || userData.data.userTypeID == 6) {

        if (val.mainIconID == 30 && val.subIconID == 97) {
          setLoading(true)
          const payload = {
            schoolCode: userData.data.schoolCode,
            academicYear: userData.data.academicYear,
            userRefID: userData.data.userRefID,
            classID: userData.data.classID,
            sectionID: userData.data.sectionID
          }
          Services.post(apiRoot.consolidatedSeptReport, payload)
            .then((res) => {
              if (res.status == "success") {
                SetCombineReport(true)
                if (res.data.APP.status == "success") {
                  setLoading(false)
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
              setLoading(false)
            })
        }
      } else {
        const payload = {
          "schoolCode": userData.data.schoolCode,
          "subIconID": val.getSubIconsData.subIconID
        }
        Services.post(apiRoot.getChildIcons, payload)
          .then((res) => {
            if (res.status == "success") {
              setChildIconsList((prev) => {
                return { ...prev, listItem: res.data, status: true }
              })
            } else if (res.status == "error") {
              alert(res.message)
            }
          })
          .catch((err) => {
            console.log(err)
          })
          .finally((err) => {
          })
      }
    } else if (assSubIconIDs.includes(val.getSubIconsData.subIconID)) {
      setSelectedIcon((prev) => {
        return { ...prev, name: val.getSubIconsData.subIconName, subIconID: val.getSubIconsData.subIconID }
      });
    } else if (marksEntrySubIconID.includes(val.getSubIconsData.subIconID)) {
      setSelectedIcon((prev) => {
        return { ...prev, name: val.getSubIconsData.subIconName, subIconID: val.getSubIconsData.subIconID }
      });
      if (val.getSubIconsData.subIconID == 59) {
        setSubjectMarksEntry((prev) => {
          return { ...prev, list: null, status: false }
        })
      }
    } else {
      alert('coming soon!')
    }
  }

  function getSeptReport(item) {
    if (item.data.testID == 1) {
      navigation.navigate('septAcademicReport', item.data)
    } else if (item.data.testID == 2) {
      navigation.navigate('septLearningReport', item.data)
    } else if (item.data.testID == 3) {
      navigation.navigate('septMultipleIntellReport', item.data)
    } else if (item.data.testID == 4) {
      navigation.navigate('septKnowingMeReport', item.data)
    } else if (item.data.testID == 5) {
      navigation.navigate('septBrainDominReport', item.data)
    }
  }

  function getListItem(type) {
    setLoading(true)
    setGameList((prev) => {
      return { ...prev, status: false }
    })
    if (type == "class" || type == "trmClass") {
      setLoading(true)
      if (type == "trmClass" && selectedField.trmType == null) {
        alert("Please select type.")
        setLoading(false)
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
              setListItem((prev) => {
                return { ...prev, list: res.data, status: true, type: type }
              });
              setLoading(false)
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
    } else if (type == "section") {
      if ((userData?.data?.userTypeID == 4 || userData?.data?.userTypeID == 2) && selectedField.class == null) {
        alert('Please select class.')
        setLoading(false)
      } else {
        const sectionPayload = {
          "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
          "schoolCode": userData?.data?.schoolCode,
          "userTypeID": userData?.data?.userTypeID,
          "userRefID": userData?.data?.userRefID,
          "academicYear": userData?.data?.academicYear
        }
        Services.post(apiRoot.getSectionList, sectionPayload)
          .then((res) => {
            if (res.status == "success") {
              setListItem((prev) => {
                return { ...prev, list: res.data, status: true, type: type }
              });
              setLoading(false)
            } else if (res.statue == "error") {
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
    } else if (type == "subject" || type == "trmSubject" || type == "gameSubject" || type == "subjAddBySchool") {
      if (type == "subjAddBySchool") {
        if (selectedField.class == null || selectedField.section == null) {
          setLoading(false)
          alert('Please select required field.')
        } else {
          const payload = {
            "schoolCode": userData.data.schoolCode,
            "classID": selectedField.class.classID,
            "sectionID": selectedField.section.sectionID,
            "academicYear": userData.data.academicYear
          }
          Services.post(apiRoot.getSubjectAddedBySchool, payload)
            .then((res) => {
              if (res.status == "success") {
                setLoading(false)
                setListItem((prev) => {
                  return { ...prev, list: res.data, status: true, type: type }
                });

              } else if (res.status == "failed") {
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

      } else {
        if (ncertIDs.includes(selectedIcon.subIconID)) {
          if (type == 'trmSubject' && (selectedField.trmType == null || selectedField.class == null || selectedField.section == null)) {
            alert('Please select required field.')
            setLoading(false)
          } else {
            Services.post(apiRoot.getNcertSubjectOfClass, { "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID })
              .then((res) => {
                if (res.status == "success") {
                  setListItem((prev) => {
                    return { ...prev, list: res.data, status: true, type: type }
                  });
                  setLoading(false)
                } else if (res.statue == "error") {
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

        } else {
          setLoading(true)
          if ((userData?.data?.userTypeID == 4 || userData?.data?.userTypeID == 2) && (selectedField.class == null || selectedField.section == null)) {
            alert('Please select section.')
            setLoading(false)
          } else {
            const subjectPayload = {
              "schoolCode": userData?.data?.schoolCode,
              "userTypeID": userData?.data?.userTypeID,
              "academicYear": userData?.data?.academicYear,
              "userRefID": userData?.data?.userRefID,
              "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
              "sectionID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.section.sectionID : userData.data.sectionID,
            }
            Services.post(apiRoot.getSubjectList, subjectPayload)
              .then((res) => {
                if (res.status == 'success') {
                  setListItem((prev) => {
                    return { ...prev, list: res.data, status: true, type: type }
                  });
                  setLoading(false)
                } else if (res.status == "failed") {
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
      }

    } else if (type == "book") {
      setLoading(true)
      if (ncertIDs.includes(selectedIcon.subIconID)) {
        if ((userData?.data?.userTypeID == 4 || userData?.data?.userTypeID == 2) && (selectedField.class == null || selectedField.section == null || selectedField.subject == null)) {
          alert('Please select required fields.')
          setLoading(false)
        } else {
          const payload = {
            "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
            "subjectID": selectedField?.subject?.subjectID,
            "schoolCode": userData.data.schoolCode
          }
          Services.post(apiRoot.ncertBookAccToSubject, payload)
            .then((res) => {
              if (res.status == "success") {
                setListItem((prev) => {
                  return { ...prev, list: res.bookData, status: true, type: type }
                });
                setLoading(false)
              } else if (res.status == "failed") {
                setLoading(false)
                alert(res.msg)

              }
            })
            .catch((err) => {
              console.log(err)
            })
            .finally(() => {
              setLoading(false)
            })
        }


      } else {
        if ((userData?.data?.userTypeID == 4 || userData?.data?.userTypeID == 2) && (selectedField.class == null || selectedField.section == null || selectedField.subject == null)) {
          alert('Please select subject.')
          setLoading(false)
        } else {
          if (selectedField.subject == null) {
            alert('Please select subject.')
            setLoading(false)
          } else {
            const bookPayload = {
              "schoolCode": userData?.data?.schoolCode,
              "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
              "subjectID": selectedField?.subject?.subjectID,
              "isAssess": ""
            }
            Services.post(apiRoot.getBooksList, bookPayload)
              .then((res) => {
                if (res.status == "success") {
                  setListItem((prev) => {
                    return { ...prev, list: res.data, status: true, type: type }
                  });
                  setLoading(false)
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
      }

    } else if (type == 'trk') {
      setListItem((prev) => {
        return { ...prev, list: trkLevelItems, status: true, type: type }
      });
      setLoading(false)
    } else if (type == "trksub") {
      setListItem((prev) => {
        return { ...prev, list: trkSubjectList, status: true, type: type }
      });
      setLoading(false)
    } else if (type == "gameSubject") {
      if ((userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) && selectedField.class == null) {
        alert('Please select class.')
        setLoading(false)
      } else {
        const payload = {
          "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
          "schoolCode": userData?.data?.schoolCode,
          "academicYear": userData?.data?.academicYear,
          "sectionID": "",
          "isAssess": 0
        }
        Services.post(apiRoot.swaGamesSubjectForSchool, payload)
          .then((res) => {
            if (res.status == "success") {
              setListItem((prev) => {
                return { ...prev, list: res.subjectList, status: true, type: type }
              });
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

    } else if (type == 'trmType') {
      setListItem((prev) => {
        return { ...prev, list: trmTypeList, status: true, type: type }
      });
      setLoading(false)
    } else if (type == "assessment") {
      if (selectedField.subject == null) {
        alert('Please select subject.')
        setLoading(false)
      } else {
        payload = {
          "schoolCode": userData.data.schoolCode,
          "classID": selectedField.class.classID,
          "sectionID": selectedField.section.sectionID,
          "subjectID": selectedField.subject.subjectID,
          "academicYear": userData.data.academicYear
        }
        Services.post(apiRoot.getAssessmentData, payload)
          .then((res) => {
            if (res.status == "success") {
              setLoading(false)
              setListItem((prev) => {
                return { ...prev, list: res.data, status: true, type: type }
              });
            } else if (res.status == "failed") {
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

    } else if (type == 'meFormet') {
      if (selectedField.markAss == null) {
        setLoading(false)
        alert("Please select assessment name.")
      } else {
        setListItem((prev) => {
          return { ...prev, list: marksEntryFormat, status: true, type: type }
        });
        setLoading(false)
      }
    } else if (type == 'term') {
      if (selectedField.class == null || selectedField.section == null) {
        alert('Please select required field.')
        setLoading(false)
      } else {
        const termArray = [
          { term: "First", id: 1 },
          { term: "Second", id: 2 }
        ]
        setListItem((prev) => {
          return { ...prev, list: termArray, status: true, type: type }
        });
        setLoading(false)
      }
    } else if (type == "marksType") {
      if (selectedField.class == null || selectedField.section == null || selectedField.term == null) {
        setLoading(false)
        alert('Please select required field.')
      } else {
        const marksType = [
          { marksType: "Numerical Grade", id: 1 },
          { marksType: "Letter Grade", id: 2 }
        ]
        setListItem((prev) => {
          return { ...prev, list: marksType, status: true, type: type }
        });
        setLoading(false)

      }
    } else if (type == "student") {
      if (selectedField.class != null && selectedField.section != null && selectedField.subject != null) {
        const payload = {
          "schoolCode": userData.data.schoolCode,
          "classID": selectedField.class.classID,
          "sectionID": selectedField.section.sectionID,
          "subjectID": selectedField.subject.subjectID,
        }
        Services.post(apiRoot.getStudentsForCertificate, payload)
          .then((res) => {
            if (res.status == "success") {
              setLoading(false)
              setListItem((prev) => {
                return { ...prev, list: res.data, status: true, type: "student" }
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
        alert('Please select required fields.')
        setLoading(false)
      }
    }

  }

  function getSelectedItem(item, type) {
    if (type == "class" || type == "trmClass") {
      setSelectedField((prev) => {
        return { ...prev, class: item, section: null, subject: null, book: null, level: null, trkSub: null, }
      })
      setListItem((prev) => {
        return { ...prev, status: false }
      })
      setToolItems()
    } else if (type == "section") {
      setSelectedField((prev) => {
        return { ...prev, section: item, subject: null, book: null, level: null, trkSub: null }
      })
      setListItem((prev) => {
        return { ...prev, status: false }
      })
      setToolItems()

    } else if (type == "subject" || type == "gameSubject" || type == "trmSubject" || type == "subjAddBySchool") {

      setSelectedField((prev) => {
        return { ...prev, subject: item, book: null, level: null, trkSub: null, student: null }
      })
      setListItem((prev) => {
        return { ...prev, status: false }
      })
      setToolItems()
      if (type == "gameSubject") {
        setLoading(true)
        const payload = {
          "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
          "subjectID": item.subjectID
        }
        Services.post(apiRoot.getAppSwaGamesLink, payload)
          .then((res) => {
            if (res.status == "success") {
              setLoading(false)
              setGameList((prev) => {
                return { ...prev, data: res.data, status: true }
              })
            } else {
              setMsgModalVisible((prev) => {
                return { ...prev, msg: res.message, status: true, type: 'error' }
              })
              setTimeout(() => {
                setMsgModalVisible((prev) => {
                  return { ...prev, status: false }
                })
              }, 2000)

            }
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            setLoading(false)
          })
      } else if (type == "trmSubject") {
        setLoading(true)
        const payload =
        {
          "classID": selectedField.class.classID,
          "subjectID": item.subjectID,
          "schoolCode": userData?.data?.schoolCode,
          "lessonType": selectedField.trmType.trmID
        }
        Services.post(apiRoot.trmLessonPlanOfClass, payload)
          .then((res) => {
            if (res.status == "success") {
              navigation.navigate('pdfView', { url: res.data.siteUrl + res.data.mainData[0].pdfPath })
              setLoading(false)
            }
          })
          .then((err) => {
            console.log(err)
          })
          .finally(() => {
            setLoading(false)
          })
      } else if (type == "subjAddBySchool") {
        getStudentListWithSubjectMarks(item, type = "subject")
      }

    } else if (type == "book") {
      if (ncertIDs.includes(selectedIcon.subIconID)) {
        setSelectedField((prev) => {
          return { ...prev, book: item }
        })
        setListItem((prev) => {
          return { ...prev, status: false }
        });
        const payload = {
          "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
          "subjectID": selectedField.subject.subjectID,
          "schoolCode": userData.data.schoolCode,
          "bookID": item.bookID
        }
        Services.post(apiRoot.getChapterOfNcertBook, payload)
          .then((res) => {
            if (res.status == 'success') {
              navigation.navigate("ncert", { data: res.chapData, selectedField: selectedField })
            }
          })

      } else {
        setSelectedField((prev) => {
          return { ...prev, book: item }
        })
        setListItem((prev) => {
          return { ...prev, status: false }
        })
        getLearningToolsList(item)
      }

    } else if (type == "trk") {
      if (item.levelID == 2) {
        setTrkSubject(true)
      } else {
        setTrkSubject(false)
        navigation.navigate('pdfView', { url: "https://swaadhyayan.com/data/TRM_PDF/Kindergarten.pdf" })
      }
      setSelectedField((prev) => {
        return { ...prev, level: item }
      })
      setListItem((prev) => {
        return { ...prev, status: false }
      })
    } else if (type == 'trksub') {
      let pdfPath = ''
      if (item.subjectID == 1) {
        navigation.navigate('pdfView', { url: "https://swaadhyayan.com/data/TRM_PDF/Hindi.pdf" })
      } else if (item.subjectID == 2) {
        navigation.navigate('pdfView', { url: "https://swaadhyayan.com/data/TRM_PDF/English.pdf" })

      } else if (item.subjectID == 3) {
        navigation.navigate('pdfView', { url: "https://swaadhyayan.com/data/TRM_PDF/Math.pdf" })

      } else if (item.subjectID == 4) {
        navigation.navigate('pdfView', { url: "https://swaadhyayan.com/data/TRM_PDF/Science.pdf" })

      } else if (item.subjectID == 5) {
        navigation.navigate('pdfView', { url: "https://swaadhyayan.com/data/TRM_PDF/Social_Science.pdf" })

      } else if (item.subjectID == 6) {
        navigation.navigate('pdfView', { url: "https://swaadhyayan.com/data/TRM_PDF/EVS.pdf" })
      }
      setSelectedField((prev) => {
        return { ...prev, trkSub: item }
      })
      setListItem((prev) => {
        return { ...prev, status: false }
      })
    } else if (type == "trmType") {
      setSelectedField((prev) => {
        return { ...prev, trmType: item, class: null, section: null, book: null, level: null, trkSub: null, }
      })
      setListItem((prev) => {
        return { ...prev, status: false }
      })

    } else if (type == "assessment") {
      setSelectedField((prev) => {
        return { ...prev, markAss: item, markFormet: null }
      })
      setListItem((prev) => {
        return { ...prev, status: false }
      })
    } else if (type == "meFormet") {
      setSelectedField((prev) => {
        return { ...prev, markFormet: item }
      })
      setListItem((prev) => {
        return { ...prev, status: false }
      })
      navigation.navigate('assMarkEntry', { data: selectedField, isfullMark: item })
    } else if (type == "term") {
      setSelectedField((prev) => {
        return { ...prev, term: item, marksType: null }
      })
      setListItem((prev) => {
        return { ...prev, status: false }
      })
      if (selectedIcon.subIconID == 58) {

        const sendData = {
          "classID": selectedField.class.classID,
          "sectionID": selectedField.section.sectionID,
          "subjectID": selectedField.subject.subjectID,
          "termID": item.id
        }
        navigation.navigate('nootbookMarksEntry', sendData)
      }


    } else if (type == "marksType") {
      let marksType = ""
      if (item.id == 1) {
        marksType = "numerical"
      } else if (item.id == 2) {
        marksType = "letter"
      }
      setSelectedField((prev) => {
        return { ...prev, marksType: item }
      })
      setListItem((prev) => {
        return { ...prev, status: false }
      });

      const sendData = {
        groupID: selectedIcon.subIconID == 56 ? 1 : 2,
        selectedField: selectedField,
        marksType: marksType
      }
      navigation.navigate("indicatorGradeEntry", sendData)


    } else if (type == "student") {
      setSelectedField((prev) => {
        return { ...prev, student: item }
      })
      setListItem((prev) => {
        return { ...prev, status: false }
      });
      getStudentReportData(item)
    }
  }

  function getStudentListWithSubjectMarks(item, type) {
    let subjectID = item.subjectID
    let termID = 1
    if (type == "subject") {
      termID = item.subjectID
      termID = 1
    } else if (type == 'term1') {
      subjectID = selectedField.subject.subjectID
      termID = item
    } else if (type == "term2") {
      subjectID = selectedField.subject.subjectID
      termID = item
    }
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "academicYear": userData.data.academicYear,
      "transYear": userData.data.transYear,
      "classID": selectedField.class.classID,
      "sectionID": selectedField.section.sectionID,
      "subjectID": subjectID,
      "termID": termID
    }
    Services.post(apiRoot.getStudentListWithSubjectMarks, payload)
      .then((res) => {
        if (res.status == "success") {
          setSubjectMarksEntry((prev) => {
            return { ...prev, list: res.data, termID: termID, status: true }
          });
        } else if (res.status == "failed") {
          alert(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
      })

  }



  function getStudentReportData(item) {
    setLoading(true)
    const payload = {
      "studentID": item.userRefID,
    }
    Services.post(apiRoot.getStudentReportData, payload)
      .then((res) => {
        if (res.status == "success") {
          setLoading(false)
          navigation.navigate('homeWorkReport', res.data)
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

  function getLearningToolsList(item) {
    setGameList((prev) => {
      return { ...prev, status: false }
    })
    setLoading(true)
    const toolsPayload = {
      "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
      "subjectID": item.subjectID,
      "bookID": item.bookID,
      "userTypeID": userData?.data?.userTypeID
    }
    dispatch(fetchLearningTool(toolsPayload))
    Services.post(apiRoot.getLearningToolsList, toolsPayload)
      .then((res) => {
        if (res.status == "success") {
          setToolItems(res.data)
          setSelectField(false)
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
  function getModuleActivityData(item, val1, val2, val3, navigation) {
    if (item.childIconID != undefined) {
      navigation.navigate("viewReport", { data: item })
    } else {
      const classID = ((userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID)

      let actArr = ['134', '135', '136', '137', '73', '68', '77']

      if (classID == 13) {
        actArr = ['134', '135', '136', '137', '77', '171']
      }
      let pdfact = ['169', '73', '74', '186', '191', '170', '69', '187', '192', '76', '78', '188', '193'];
      const sendData = {
        screenName: selectedField.subject.subjectID == 1 ? item.subjectSubCatLang2 : item.subjectSubCategory.replace('<br>', ''),
        subTypeID: item.subTypeID,
        classID: classID,
        subjectID: selectedField.subject.subjectID,
        bookID: selectedField.book.bookID
      }
      if ((item.isSubMenu == 1 && item.isElearning != 1) || pdfact.includes(item.subTypeID)) {
        setLoading(true)
        if ((item.subTypeID == 73 && classID != 13) || item.subTypeID == 171 || item.subTypeID == 77 || item.subTypeID == 68) {
          const payload = {
            "classID": classID,
            "subjectID": item.subjectID,
            "subTypeID": item.subTypeID,
            "chapterID": ''
          }
          Services.post(apiRoot.getLearningRightToolsList, payload)
            .then((res) => {
              if (res.status == "success") {
                setLoading(false)
                navigation.navigate('ViewFunBag', { data: res.data, selectItem: item, classID: selectedField })
              } else {

              }
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          const activityPayload = {
            "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
            "subjectID": item.subjectID,
            "subTypeID": item.subTypeID,
            "bookID": (item.bookID != "" && item.bookID != null) ? item.bookID : "",
            "schoolCode": userData?.data?.schoolCode,
            "academicYear": userData?.data?.academicYear,
            "urlLink": (item.urlLink != "" && item.urlLink != null) ? item.urlLink : ""
          }
          dispatch(fetModuleActivityList(activityPayload))
          navigation.navigate('activityListScreen', { item: item, sendData: sendData, urlLink: 'swaWithTextbook' })
        }
      } else if (item.urlLink == "bookPDF") {
        const activityPayload = {
          "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
          "subjectID": item.subjectID,
          "subTypeID": item.subTypeID,
          "bookID": (item.bookID != "" && item.bookID != null) ? item.bookID : "",
          "schoolCode": userData?.data?.schoolCode,
          "academicYear": userData?.data?.academicYear,
          "urlLink": (item.urlLink != "" && item.urlLink != null) ? item.urlLink : ""
        }
        Services.post(apiRoot.getModuleActivityData, activityPayload)
          .then((res) => {

            if (res.status == "success") {
              setLoading(false)
              navigation.navigate('pdfView', { url: res.data.mainData[0].filePath + res.data.mainData[0].uploadFileName, title: res.data.mainData[0].chapterName, urlLink: 'bookPDF' })
            }
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {

          })
      }
      else {
        const activityPayload = {
          "classID": (userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID,
          "subjectID": item.subjectID,
          "subTypeID": item.subTypeID,
          "bookID": (item.bookID != "" && item.bookID != null) ? item.bookID : "",
          // "bookID": item.bookID,
          "schoolCode": userData?.data?.schoolCode,
          "academicYear": userData?.data?.academicYear,
          "urlLink": (item.urlLink != "" && item.urlLink != null) ? item.urlLink : ""
        }
        dispatch(fetModuleActivityList(activityPayload))
        navigation.navigate('activityListScreen', { item: item, sendData: sendData, urlLink: 'swaWithTextbook' })
      }
    }
  }

  function getAttemptedScreen(testID, testName) {
    if (viewSeptReport.status == "false") {
      alert('This test is already attempted.')
    } else {
      const classID = ((userData?.data?.userTypeID == 4) || (userData?.data?.userTypeID == 2) ? selectedField.class.classID : userData.data.classID)
      navigation.navigate('septAttempt', { classID: classID, testID: testID, testData: intro, schoolCode: userData?.data?.schoolCode })
    }

  }
  function getGameView(url) {
    navigation.navigate('gameView', { url: url })
  }

  function handleInputChange(val, type) {
    setInputField((prev) => {
      return { ...prev, assName: val }
    })
  }

  function coScholasticIndicator(subIconID) {
    let groupID = null
    if (subIconID == 54) {
      groupID = 1
    } else if (subIconID == 55) {
      groupID = 2
    }

    if (selectedField.class == null || inputField == '') {
      alert('Please select required fields.')
    } else {
      const payload = {
        "schoolCode": userData.data.schoolCode,
        "classID": selectedField.class.classID,
        "groupID": groupID,
        "indicatorName": inputField.assName,
      }
      Services.post(apiRoot.coScholasticIndicatorSave, payload)
        .then((res) => {
          if (res.status == "success") {
            alert(res.message)
            getIndicatorList("", subIconID)
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
  }

  function getIndicatorList(indicatorID, subIconID) {
    let groupID = null
    if (subIconID == 54) {
      groupID = 1
    } else if (subIconID == 55) {
      groupID = 2
    }
    setLoading(true)
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "groupID": groupID,
      "academicYear": userData.data.academicYear,
      "userTypeID": userData.data.userTypeID,
      "userRefID": userData.data.userRefID
    }
    Services.post(apiRoot.getIndicatorList, payload)
      .then((res) => {
        if (res.status == "success") {
          setIndicatorsList((prev) => {
            return { ...prev, data: res.indicatorList, status: true }
          })
          res.indicatorList.map((item, index) => {
            if (item.indicatorID == indicatorID) {
              seteditIndicator((prev) => {
                return { ...prev, editItem: item, status: true }
              })
            }
          })
          setLoading(false)
        } else if (res.status == 'failed') {
          setIndicatorsList((prev) => {
            return { ...prev, data: null, msg: res.message, status: true }
          })
          setLoading(false)
        }
      })

  }

  function actionOnIndicator(item, type) {
    let actionName = ''
    if (type == "addIndicator") {
      actionName = "Manage Indicator";
      seteditIndicator((prev) => {
        return { ...prev, action: actionName, editItem: item, type: type, status: true }
      })
    } else if (type == "editIndicator") {
      actionName = "Edit Indicator and Sub Indicator"
    } else if (type == "removeIndicator") {
      const payload = {
        "schoolCode": userData.data.schoolCode,
        "indicatorID": item.indicatorID
      }
      Services.post(apiRoot.deleteAppIndicator, payload)
        .then((res) => {
          if (res.status == "success") {
            alert(res.message)
            getIndicatorList("", selectedIcon.subIconID)
          }
        })
    }
  }

  function addSubIndicatorText(val) {
    setsubIndicatorName(val)
  }


  function addSubIndicator(val, indicatorID) {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "indicatorID": indicatorID,
      "subIndicatorName": val
    }
    Services.post(apiRoot.saveAppSubIndicator, payload)
      .then((res) => {
        if (res.status == "success") {
          setsubIndicatorName("")
          getIndicatorList(indicatorID, selectedIcon.subIconID)
        } else {
          alert(res.message)
        }
      })
  }
  function removesubIndicator(item, indicatorID) {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "subIndicatorID": item.subIndicatorID
    }
    Services.post(apiRoot.deleteSubIndicator, payload)
      .then((res) => {
        if (res.status == "success") {
          getIndicatorList(indicatorID, selectedIcon.subIconID)
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
  //   const subIndicatorIDs=[]

  function updateIndicator(item, id, indName, indCls) {
    let subIndcatorIDs = []
    let subIndcatorVals = []
    item.subIndicator.map((val, ind) => {
      subIndcatorIDs.push(val.id)
      subIndcatorVals.push(val.val)
    })
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "classID": indCls,
      "indicatorID": id,
      "groupID": 1,
      "subIndicatorIDs": subIndcatorIDs.toString(),
      "indicatorName": item.indicatorName == null ? indName : item.indicatorName,
      "subIndicatorName": subIndcatorVals.toString()

    }
    Services.post(apiRoot.editIndicatorNSubIndicator, payload)
      .then((res) => {
        if (res.status == "success") {
          alert(res.message)
          seteditIndicator((prev) => {
            return { ...prev, status: false }
          })
          getIndicatorList("", selectedIcon.subIconID)
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
  function certificateAction(type) {
    if (type == "create") {
      setCertificateAct((prev) => {
        return { ...prev, create: true, issued: false, iconView: false }
      })
    } else {
      setCertificateAct((prev) => {
        return { ...prev, create: false, issued: true, iconView: false }
      })
    }
  }
  function editAssessment(item) {
    console.log(item, 'editAssessment')
    setEditAss((prev) => {
      return { ...prev, type: 'editAss', data: item, status: true }
    })

  }

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['left', 'right', 'top']} style={{ flex: 1, backgroundColor: userData.data?.colors?.mainTheme, }} >
        {loading ?
          <Loader /> :
          <View style={{ marginTop: Platform.OS == "ios" ? 0 : 24, backgroundColor: userData.data.colors.liteTheme, flex: 1 }}>
            <View>
              <SwaHeader title={toolName} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
              <IconsContainer deshboardData={subIconsData} getIconDetail={getIconDetail} type={"subIcon"} selectSubIcon={intro} selectedIcon={selectedIcon} />


              {viewSeptReport.status ?
                <View style={{ flexDirection: 'row', backgroundColor: SWATheam.SwaWhite, margin: 10, padding: 10, borderRadius: 10, elevation: 7, justifyContent: "center", alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: SWATheam.SwaBlack }}>{viewSeptReport.data.testType}</Text>
                  </View>
                  <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, alignSelf: 'center', padding: 6, borderRadius: 6, marginLeft: 20 }}
                    onPress={() => getSeptReport(viewSeptReport)}
                  >
                    <Text style={{ color: SWATheam.SwaWhite }}>View Report</Text>
                  </TouchableOpacity>
                </View> :
                <>
                  {/* || selectedIcon.subIconID == 124 */}
                  {selectedIcon.name == "CBSE" || selectedIcon.name == "ICSE" || selectedIcon.name == 'NCERT' ?
                    (
                      <>
                        {(selectField && mainIconID != 27) ?
                          <View style={{ padding: 10, }}>
                            {userData.data.userTypeID == 4 || userData.data.userTypeID == 2 ?
                              (
                                <>
                                  <SelectionBox getListItem={getListItem} selectedField={selectedField?.class?.getClassDetail?.classDesc} type="class" placeholder="Select class" />

                                  <SelectionBox getListItem={getListItem} selectedField={selectedField?.section?.sectionName} type="section" placeholder="Select section" />

                                </>
                              ) :
                              null
                            }
                            <SelectionBox getListItem={getListItem} selectedField={selectedField?.subject?.subjectName} type="subject" placeholder="Select subject" />
                            <SelectionBox getListItem={getListItem} selectedField={selectedField?.book?.bookName} type="book" placeholder="Select book" />
                          </View> : null
                        }
                      </>
                    ) : null
                  }
                  {selectField && selectedIcon.subIconID == 48 ?
                    <View style={{ padding: 10, }}>
                      <SelectionBox getListItem={getListItem} selectedField={selectedField?.level?.level} type="trk" placeholder="Select levels" />
                      {trkSubject &&
                        <SelectionBox getListItem={getListItem} selectedField={selectedField?.trkSub?.subjectName} type="trksub" placeholder="Select subject" />
                      }
                    </View> : null

                  }
                  {selectField && selectedIcon.subIconID == 47 ?
                    <View style={{ padding: 10, }}>
                      <SelectionBox getListItem={getListItem} selectedField={selectedField?.trmType?.trmType} type="trmType" placeholder="Select type" />
                      <SelectionBox getListItem={getListItem} selectedField={selectedField?.class?.getClassDetail?.classDesc} type="trmClass" placeholder="Select class" />
                      <SelectionBox getListItem={getListItem} selectedField={selectedField?.section?.sectionName} type="section" placeholder="Select section" />
                      <SelectionBox getListItem={getListItem} selectedField={selectedField?.subject?.subjectName} type="trmSubject" placeholder="Select subject" />
                    </View> :
                    null
                  }
                  {selectField && selectedIcon.subIconID == 124 ?
                    <View style={{ padding: 10, }}>
                      {userData.data.userTypeID == 4 || userData.data.userTypeID == 2 ?
                        <>
                          <SelectionBox getListItem={getListItem} selectedField={selectedField?.class?.getClassDetail?.classDesc} type="class" placeholder="Select class" />
                          <SelectionBox getListItem={getListItem} selectedField={selectedField?.section?.sectionName} type="section" placeholder="Select section" />

                        </> : null
                      }
                      <SelectionBox getListItem={getListItem} selectedField={selectedField?.subject?.subjectName} type="gameSubject" placeholder="Select subject" />
                    </View> : null
                  }
                  {mainIconID == 6 || mainIconID == 19 ?
                    <View style={{ padding: 10 }}>
                      <SelectionBox getListItem={getListItem} selectedField={selectedField?.class?.getClassDetail?.classDesc} type="class" placeholder="Select class" />
                      {selectedIcon.subIconID == 54 || selectedIcon.subIconID == 55 ?
                        <>
                          <CustomInput placeHolder={"Enter indicator name"} onChangeText={(val) => handleInputChange(val, 'assessment')} maxLength={30} />
                          <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, padding: 10, width: '45%', alignSelf: 'center', borderRadius: 6, marginVertical: 10 }} onPress={() => {
                            if (selectedIcon.subIconID == 54 || selectedIcon.subIconID == 55) {
                              coScholasticIndicator(selectedIcon.subIconID)
                            }
                          }}>
                            <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center', textTransform: 'uppercase' }}>{selectedIcon.subIconID == 54 ? "Add Indicator" : "Submit"}</Text>
                          </TouchableOpacity>
                        </>
                        :
                        <>
                          <SelectionBox getListItem={getListItem} selectedField={selectedField?.section?.sectionName} type="section" placeholder="Select section" />
                          {selectedIcon.subIconID >= 56 && selectedIcon.subIconID <= 59 ?
                            <>
                              {selectedIcon.subIconID >= 58 &&
                                <SelectionBox getListItem={getListItem} selectedField={selectedField?.subject?.subjectName} type={selectedIcon.subIconID == 59 ? "subjAddBySchool" : "subject"} placeholder="Select subject" />
                              }
                              {selectedIcon.subIconID != 59 &&
                                <SelectionBox getListItem={getListItem} selectedField={selectedField?.term?.term} type="term" placeholder="Select term" />
                              }
                              {selectedIcon.subIconID <= 57 &&
                                <SelectionBox getListItem={getListItem} selectedField={selectedField?.marksType?.marksType} type="marksType" placeholder="Select marks type" />
                              }
                            </> :
                            <>
                              <SelectionBox getListItem={getListItem} selectedField={selectedField?.subject?.subjectName} type="subject" placeholder="Select subject" />
                              <SelectionBox getListItem={getListItem} selectedField={selectedField?.markAss?.assessmentName} type="assessment" placeholder="Select assessment name" />
                              <SelectionBox getListItem={getListItem} selectedField={selectedField?.markFormet?.format} type="meFormet" placeholder="Select marks entry format" />
                            </>
                          }
                        </>
                      }
                    </View> : mainIconID == 22 && selectedIcon.subIconID == 92 ?
                      <View style={{ padding: 12 }}>
                        <SelectionBox getListItem={getListItem} selectedField={selectedField?.class?.getClassDetail?.classDesc} type="class" placeholder="Select class" />
                        <SelectionBox getListItem={getListItem} selectedField={selectedField?.section?.sectionName} type="section" placeholder="Select section" />
                        <SelectionBox getListItem={getListItem} selectedField={selectedField?.subject?.subjectName} type="subject" placeholder="Select subject" />
                        <SelectionBox getListItem={getListItem} selectedField={selectedField?.student?.fullName} type="student" placeholder="Select student" />

                      </View> :
                      null

                  }
                  {(mainIconID != 27 && toolName == "Report") &&
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => setSelectField(!selectField)}>
                        <AntDesign name={selectField ? "upcircle" : "downcircle"} size={32} color={userData.data.colors.mainTheme} />
                      </TouchableOpacity>
                    </View>
                  }
                </>
              }
              {listItem.status ?
                <BottomDrawerList closeModule={closeModule} listItem={listItem} getSelectedItem={getSelectedItem} selectedField={selectedField} /> : null
              }
            </View>

            {gameList.status ?
              <GameList gameList={gameList} getGameView={getGameView} /> : null
            }
            <MsgModal msgModalVisible={msgModalVisible} />

            {childIconsList.status ?
              <SubIconActivityList selectedModuleItem={toolName} toolItems={childIconsList.listItem} getModuleActivityData={getModuleActivityData} navigation={navigation} /> : null
            }

            {intro.instruction ?
              <AcademicProfIntro getAttemptedScreen={getAttemptedScreen} intro={intro} /> : null
            }
            {toolItems?.mainData.length ?
              <View style={{ flex: 1, backgroundColor: userData.data.colors.liteTheme }}>
                <ScrollView>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginVertical: 10, paddingHorizontal: 10 }}>
                    {toolItems?.mainData.map((item, index) => {
                      let toolName = ''
                      if (selectedField.subject.subjectID == 1) {
                        toolName = item.subjectSubCatLang2.replace('<br>', '')
                      } else {
                        toolName = item.subjectSubCategory.replace('<br>', '')
                      }
                      return (
                        <TouchableOpacity style={{ height: 180, marginVertical: 10, width: "45%", justifyContent: 'center', alignItems: 'center', backgroundColor: SWATheam.SwaWhite, elevation: 9, borderRadius: 6, justifyContent: 'space-around', padding: 8 }} key={item.subTypeID}
                          onPress={() => getModuleActivityData(item, '', '', '', navigation)}>
                          <View style={{ height: item.subTypeID != undefined ? 80 : 144, width: item.subTypeID != undefined ? 80 : 90, justifyContent: 'center', alignItems: 'center', }}>
                            <Image source={{ uri: toolItems?.imgUrl + item?.iconName }} style={{ height: "100%", width: "100%", resizeMode: "contain" }} />
                          </View>
                          {item.subTypeID != undefined &&
                            <View style={{ height: 40, alignItems: 'center' }}>
                              <Text style={{ textAlign: 'center', color: SWATheam.SwaGray }}>{toolName}</Text>
                            </View>
                          }
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </ScrollView>
              </View> : null
            }

            {combineReport ?
              <ReportViwer closeModule={closeModule} reportData={consolidatedReportData} selectedField={selectedField} reportName={"Consolidated SEPT Report"} type="student" selectedIcon={selectedIcon} /> : null
            }
            {selectedIcon.subIconID == 49 || editAss.status ?
              <AssessmentView navigation={navigation} editAss={editAss} /> : selectedIcon.subIconID == 50 ?
                <AutoAssessmentGenerate /> : selectedIcon.subIconID == 51 ?
                  <AddQuestionManually /> : selectedIcon.subIconID == 52 ?
                    <AssessmentStatus /> : selectedIcon.subIconID == 113 ?
                      <ManageAssessment navigation={navigation} editAssessment={editAssessment} />
                      : null
            }

            {indicatorsList.status ?
              <Co_ScholasticIndicator indicatorsList={indicatorsList} actionOnIndicator={actionOnIndicator} subIconID={selectedIcon.subIconID} />
              :
              null
            }
            {editIndicator.status && (selectedIcon.subIconID == 54 || selectedIcon.subIconID == 55) ?
              <AddEditSubIndicator editIndicator={editIndicator} closeModule={closeModule} addSubIndicator={addSubIndicator} subIndicatorName={subIndicatorName} addSubIndicatorText={addSubIndicatorText} removesubIndicator={removesubIndicator} updateIndicator={updateIndicator} /> : null
            }

            {selectedIcon.subIconID == 87 ?
              <CreateHomeWork /> : selectedIcon.subIconID == 88 ?
                <SaveHomeWork /> : selectedIcon.subIconID == 89 ?
                  <AssignedHomeWork /> : selectedIcon.subIconID == 90 ?
                    <SubmittedHomeWork /> : selectedIcon.subIconID == 91 ?
                      <CheckedHomeWork /> : selectedIcon.subIconID == 93 && certificateAct.iconView ?
                        <CertificateIconsView certificateAction={certificateAction} /> : selectedIcon.subIconID == 109 ?
                          <ViewAndSubmitHomework /> : selectedIcon.subIconID == 110 ?
                            <SubmittedStudentHomeWork /> : selectedIcon.subIconID == 111 ?
                              <CheckedStuentHomeWork /> : selectedIcon.subIconID == 112 ?
                                <CertificatedAwarded />
                                : null
            }
            {certificateAct.issued ?
              <IssuedCertificate /> : certificateAct.create ?
                <CreateCertificate /> : null
            }
            {subjectMarksEntry.status && selectedIcon.subIconID == 59 ?
              <SubjectMarksEntryList subjectMarksEntry={subjectMarksEntry} selectedField={selectedField} selectTerm={selectTerm} termBtnID={termBtnID} />
              : null
            }

          </View>
        }
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default SubIconsScreen

const styles = StyleSheet.create({})