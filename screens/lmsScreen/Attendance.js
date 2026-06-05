import React, { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert } from "react-native"
import { useContext, useState } from "react"
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Calendar } from 'react-native-calendars';
import DatePicker from 'react-native-date-picker'
import { GlobleData } from "../../Store"
import SwaHeader from "../common/SwaHeader"
import { apiRoot, SWATheam } from "../../constant/ConstentValue"
import Services from "../../Services"
import SelectionBox from "../common/SelectionBox"
import Loader from "../common/Loader"
import BottomDrawerList from "../common/BottomDrawerList"
import MsgModal from "../common/MsgModal"
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';


const font15 = 15
const totalDaysArr = []
const totalDaysNameArr = []
const periodMarkAttendanceArr = []
const totalPeriodMarkAttendance = []
const classMarkAttendanceArr = []
const totalclassMarkAttendance = []

const dayNameArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const monthNameArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


const Attendance = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { userData } = useContext(GlobleData)
  const [selectPeriodText, setSelectPeriodText] = useState('Select Period')
  const [selectTeacherDate, setSelectTeacherDate] = useState('Select Date')
  const [dayNo, setDayNo] = useState('')
  const [date, setDate] = useState(new Date())
  const [selectPeriod, setSelectPeriod] = useState({ data: null, radioID: null })
  const [classData, setClassData] = useState({ data: null, type: null, status: false })
  const [studentData, setStudentData] = useState({ data: null, status: false })
  const [totalMonthAttendance, setTotalMonthAttendance] = useState({ data: null, status: false })
  const [dateAttendance, setDateAttendance] = useState({ data: null, status: false })
  const [showPopUp, setShowPopUp] = useState(false)
  const [currentDate, setCurrentDate] = useState()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showCalender, setShowCalender] = useState(false)
  const [showClassTeacherButtons, setShowClassTeacherButtons] = useState(false)
  const [showSubjctAndClassTeacherButtons, setShowSubjctAndClassTeacherButtons] = useState(false)
  const [markAttendanceView, setMarkAttendanceView] = useState(false)
  const [viewWholeMonthAttendance, setViewWholeMonthAttendance] = useState(false)
  const [viewSubjectTeacher, setViewSubjectTeacher] = useState(false)
  const [calenderSelect, setCalenderSelect] = useState('');
  const [selectAll, setSelectAll] = useState(false)
  const [selectDateMonthNo, setSelectDateMonthNo] = useState('')
  const [selectDateYear, setSelectDateYear] = useState('')
  const [teacherStatus, setTeacherStatus] = useState('')
  const [selectBtn, setSelectBtn] = useState({ radioID: null })
  const [schoolSession, setSchoolSession] = useState({ start: "", end: "" })
  const [loading, setLoading] = useState(false)
  const [selectedField, setSelectedField] = useState({ class: null, section: null, })
  const [listItem, setListItem] = useState({ list: null, status: false, type: '' })
  const [msgModalVisible, setMsgModalVisible] = useState({ msg: '', status: false, type: '' })

  let periodAttendanceData = {
    userRefID: "",
    periodNo: "",
    subjectID: "",
    isPresent: "",
  }

  const wholeClassAttendanceData = {
    attendanceStatus: "",
    studentRefID: ""
  }

  function getCurrentDate() {
    const date = new Date()
    const todayDate = date.toISOString().split('T')[0];
    setCurrentDate(todayDate)
  }

  function getListItem(type) {
    setLoading(true)
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
            setListItem((prev) => {
              return { ...prev, list: res.data, status: true, type: type }
            });
            setLoading(false)
          } else if (res.status == "error") {
            setLoading(false)
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


    } else if (type == "section") {
      if (selectedField.class != null) {
        const payload = {
          "schoolID": userData.data.schoolID,
          "academicYear": userData.data.academicYear,
          "classID": selectedField.class.classID,
          "userTypeID": userData.data.userTypeID,
          "userRefID": userData.data.userRefID
        }
        Services.post(apiRoot.getSectionList, payload)
          .then((res) => {
            if (res.status == "success") {
              setLoading(false)
              setListItem((prev) => {
                return { ...prev, list: res.data, status: true, type: type }
              });
            } else if (res.status == "error") {
              setLoading(false)
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
      } else {
        alert("Please select class.")
        setLoading(false)
      }

    }

  }

  function getSelectedItem(item, type) {
    if (type == "class") {
      setSelectedField((prev) => {
        return { ...prev, class: item, section: null }
      })
      setListItem((prev) => {
        return { ...prev, status: false }
      })
      // setSelectClassText(item.getClassDetail.classDesc)
      // setSelectSectionText('Select Section')
      // setSelectPeriodText('Select Period')
      setShowCalender(false)
      setMarkAttendanceView(false)
      setShowClassTeacherButtons(false)
      setShowSubjctAndClassTeacherButtons(false)
      setViewWholeMonthAttendance(false)
      setViewSubjectTeacher(false)
      setSelectTeacherDate('Select Date')
      setDayNo('')
      setTeacherStatus('')

    } else if (type == "section") {
      setSelectedField((prev) => {
        return { ...prev, section: item }
      })
      setListItem((prev) => {
        return { ...prev, status: false }
      })
      // searchStuAttendance(item)  
      // setSelectSectionText(item.sectionName)
      // setSelectSectionNo(item.sectionID)
      checkStatus(item)
      setSelectPeriodText('Select Period')
      setViewSubjectTeacher(false)
      setShowSubjctAndClassTeacherButtons(false)
    }

  }



  function getAllDaysOfMonth(dateStr) {
    const splitDateStr = dateStr.split("-")
    const year = splitDateStr[0]
    const month = splitDateStr[1]
    totalDaysArr.length = 0
    totalDaysNameArr.length = 0
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    for (let i = lastDayOfMonth; i > 0; i--) {
      totalDaysArr.push(i)
    }

    totalDaysArr.reverse()
    totalDaysArr.map((item) => {
      const finalDate = `${year}-${month}-${item}`
      const dayNo = new Date(finalDate).getDay()
      totalDaysNameArr.push(dayNameArr[dayNo])
    })
  }


  function selectPeriodOpt(ID, item, periodNo) {
    setSelectPeriod((prev) => {
      return { ...prev, data: item, radioID: ID }
    })
    setSelectPeriodText('Period ' + periodNo + ' - ' + item.subjectName)
  }

  function getStudentDataList() {
    const payload = {
      "schoolID": userData?.data?.schoolID,
      "classID": selectedField?.class?.classID,
      "sectionID": selectedField?.section?.sectionID,
      "academicYear": userData?.data?.academicYear,
      "transYear": userData?.data?.transYear
    }
    Services.post(apiRoot.getStudentsData, payload)
      .then((res) => {
        if (res.status == "success") {
          const data = res.data
          setStudentData((prev) => {
            return { ...prev, data: data, status: true }
          })
        } else {
          // alert(res.message)
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

      })
  }

  function checkStatus(sectionID) {
    const payload = {
      "schoolID": userData.data.schoolID,
      "academicYear": userData.data.academicYear,
      "userRefID": userData.data.userRefID,
      "userTypeID": userData.data.userTypeID,
      "classID": selectedField.class.classID,
      "sectionID": sectionID.sectionID
    }
    Services.post(apiRoot.getAttendanceTeacherStatus, payload)
      .then((res) => {
        console.log(JSON.stringify(res), 'teacher status')
        if (res.status == "success") {
          setTeacherStatus(res.data)
        } else if (res.status == "error") {
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

      })


  }

  function getAttendanceViewStatusWise() {
    const payload = {
      "schoolID": userData.data.schoolID,
      "academicYear": userData.data.academicYear,
      "userRefID": userData.data.userRefID,
      "userTypeID": userData.data.userTypeID,
      "classID": selectedField?.class?.classID,
      "sectionID": selectedField?.section?.sectionID,
      "day": dayNo
    }
    Services.post(apiRoot.getAttendanceStatusClassSectionDayWise, payload)
      .then((res) => {
        if (res.status == "success") {
          const data = res.data
          setClassData((prev) => {
            return { ...prev, data: data, type: 'period', status: true }
          })
          setViewSubjectTeacher(true)
          getStudentDataList()
          setShowCalender(false)
        } else if (res.status == 'error') {

          setMsgModalVisible((prev) => {
            return { ...prev, msg: res.message, status: true, type: 'error' }
          })
          setTimeout(() => {
            setMsgModalVisible((prev) => {
              return { ...prev, status: false }
            })
          }, 2000)
          setViewSubjectTeacher(false)
          setSelectPeriodText('Select Period')
          setSelectPeriod({ data: null, radioID: null })
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {

      })
  }
  // console.log(userData, 'check academit year')

  function getPeriodAttendance(selectPeriod, subjectID, selectTeacherDate) {
    const date = selectTeacherDate.split('/').reverse().join('-')
    const payload = {
      "schoolID": userData.data.schoolID,
      "academicYear": userData.data.academicYear,
      "transYear": userData.data.transYear,
      "classID": selectedField?.class?.classID,
      "sectionID": selectedField?.section?.sectionID,
      "date": calenderSelect || date
    }
    Services.post(apiRoot.getPeriodicAttendanceWithStudentList, payload)
      .then((res) => {
        if (res.status == "success") {
          const data = res.data.attendanceData
          periodMarkAttendanceArr.length = 0
          getStudentDataList()
          data.map((item) => {
            item.periodicAttendance.map((periodData) => {
              if (periodData.periodNo == selectPeriod && periodData.subjectID == subjectID) {
                periodMarkAttendanceArr.push(periodData.isPresent)
                totalPeriodMarkAttendance.push(periodAttendanceData)
              }
            })
          })
        } else if (res.status == 'error') {
          // Alert.alert("Info!", res.message)
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

      })

  }

  function searchStuAttendance() {
    getCurrentDate()
    getStudentDataList()
    if (teacherStatus == 1) {
      setShowCalender(true)
      getCurrentDate()
    } else if (teacherStatus == 2) {
      if (selectTeacherDate != 'Select Date') {
        getAttendanceViewStatusWise()
      } else {
        Alert.alert("Info!", 'Please Select Date')
      }
    } else if (teacherStatus == 3) {
      setShowCalender(true)
    } else {
      // alert(res.message)
    }
  }

  function editDate(date) {
    const selectDate = new Date(date).toLocaleDateString()
    const splitDate = selectDate.split('/')
    const finalDate = splitDate[1] + '/' + splitDate[0] + '/' + splitDate[2]
    setSelectTeacherDate(finalDate)
    setDayNo(new Date(date).getDay())
  }

  function selectAllBtn() {
    setSelectAll(true)
    classMarkAttendanceArr.length = 0
    totalclassMarkAttendance.length = 0
    dateAttendance.data.map((item) => {
      const wholeClassAttendanceData = {
        attendanceStatus: 4,
        studentRefID: item.userRefID
      }
      classMarkAttendanceArr.push(4)
      totalclassMarkAttendance.push(wholeClassAttendanceData)
    })
  }

  function disableWeekends(dateStr) {
    const day = new Date(dateStr).getDay()
    if (day == 0) {
      setShowClassTeacherButtons(false)
      setShowSubjctAndClassTeacherButtons(false)
      // Alert.alert("Info!","Can't add attendance - weekend")
      setMsgModalVisible((prev) => {
        return { ...prev, msg: "Can't add attendance - weekend", status: true, type: "error" }
      })
      setTimeout(() => {
        setMsgModalVisible((prev) => {
          return { ...prev, status: false }
        })
      }, 2000)
    }
  }

  function markStudentPeriodWise(btnID, index, item) {
    setSelectBtn((prev) => {
      return { ...prev, radioID: btnID }
    })

    periodMarkAttendanceArr[index] = btnID
    periodAttendanceData.userRefID = item.userRefID
    periodAttendanceData.periodNo = selectPeriod.data.cellData.split('_')[2]
    periodAttendanceData.subjectID = selectPeriod.data.subjectID
    periodAttendanceData.isPresent = btnID
    totalPeriodMarkAttendance[index] = periodAttendanceData
  }

  function markPeriodAttendance(selectTeacherDate) {
    setLoading(true)
    const date = selectTeacherDate.split('/').reverse().join('-')
    const payload = {
      "schoolID": userData.data.schoolID,
      "academicYear": userData.data.academicYear,
      "addedBy": userData.data.userRefID,
      "classID": selectedField?.class?.classID,
      "sectionID": selectedField?.section?.sectionID,
      "date": calenderSelect || date,
      "attendance": totalPeriodMarkAttendance
    }
    Services.post(apiRoot.markPeriodicAttendance, payload)
      .then((res) => {
        if (res.status == "success") {
          setLoading(false)
          setMsgModalVisible((prev) => {
            return { ...prev, msg: res.message, status: true, type: res.status }
          })
          setTimeout(() => {
            setMsgModalVisible((prev) => {
              return { ...prev, status: false }
            })
          }, 2000)
        } else if (res.status == 'error') {
          setLoading(false)
          setMsgModalVisible((prev) => {
            return { ...prev, msg: res.message, status: true, type: res.status }
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
  }

  function getWholeMonthAttendanceSummary(year, month) {
    setLoading(true)
    const payload = {
      "schoolID": userData.data.schoolID,
      "academicYear": userData.data.academicYear,
      "userRefID": userData.data.userRefID,
      "classID": selectedField.class.classID,
      "sectionID": selectedField.section.sectionID,
      "year": year,
      "month": month
    }
    Services.post(apiRoot.getMonthlyAttendanceSummary, payload)
      .then((res) => {
        if (res.status == "success") {
          const data = res.attendace
          setTotalMonthAttendance((prev) => {
            return { ...prev, data: data, status: true }
          })
        } else if (res.status == "error") {
          setLoading(false)
          setMsgModalVisible((prev) => {
            return { ...prev, msg: res.message, status: true, type: res.status }
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

  }

  function getClassMonthAttendance(dateStr) {
    setLoading(true)
    const payload = {
      "schoolID": userData.data.schoolID,
      "academicYear": userData.data.academicYear,
      "transYear": userData.data.transYear,
      "classID": selectedField.class.classID,
      "sectionID": selectedField.section.sectionID,
      "date": dateStr || date
    }
    Services.post(apiRoot.getStudentAttendanceDateWise, payload)
      .then((res) => {
        if (res.status == "success") {
          classMarkAttendanceArr.length = 0
          totalclassMarkAttendance.length = 0
          getStudentDataList()
          const arr = []
          const data = res.data
          setDateAttendance((prev) => {
            return { ...prev, data: data, status: true }
          })

          res.data.map((item) => {
            if (item.attendance.length != 0) {
              arr.push(item.attendance.attendanceStatus)
              classMarkAttendanceArr.push(item.attendance.attendanceStatus)
              const wholeClassAttendanceData = {
                attendanceStatus: item.attendance.attendanceStatus,
                studentRefID: item.userRefID
              }
              totalclassMarkAttendance.push(wholeClassAttendanceData)
              let totalPresent = ""
              totalclassMarkAttendance.map((item) => {
                totalPresent += item.attendanceStatus == 4 ? item.attendanceStatus : ""
              })
              if (totalPresent.length == studentData.data.length) {
                setSelectAll(true)
              } else {
                setSelectAll(false)
              }
            }
          })

        } else if (res.status == 'error') {
          setLoading(false)
          setMsgModalVisible((prev) => {
            return { ...prev, msg: res.message, status: true, type: res.status }
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


  }

  function markStudentClassWise(btnID, index, item) {
    setSelectBtn((prev) => {
      return { ...prev, radioID: btnID }
    })
    classMarkAttendanceArr[index] = btnID
    wholeClassAttendanceData.attendanceStatus = btnID
    wholeClassAttendanceData.studentRefID = item.userRefID
    totalclassMarkAttendance[index] = wholeClassAttendanceData
    if (classMarkAttendanceArr.length == studentData.data.length) {
      let check = 0
      classMarkAttendanceArr.map((item) => {
        if (item == 4) {
          check++
        } else {
          check--
        }
        if (check == studentData.data.length) {
          setSelectAll(true)
        } else {
          setSelectAll(false)
        }
      })
    }
  }

  function markClassAttendance() {
    setLoading(true)
    const date = selectTeacherDate.split('/').reverse().join('-')
    const payload = {
      "schoolID": userData.data.schoolID,
      "academicYear": userData.data.academicYear,
      "userRefID": userData.data.userRefID,
      "classID": selectedField.class.classID,
      "sectionID": selectedField.section.sectionID,
      "date": calenderSelect || date,
      "attendance": totalclassMarkAttendance
    }
    Services.post(apiRoot.markMonthlyAttendance, payload)
      .then((res) => {
        if (res.status == "success") {
          // Alert.alert("Info!",res.message)
          setLoading(false)
          setMsgModalVisible((prev) => {
            return { ...prev, msg: res.message, status: true, type: res.status }
          })
          setTimeout(() => {
            setMsgModalVisible((prev) => {
              return { ...prev, status: false }
            })
          }, 2000)
        } else if (res.status == 'error') {
          // Alert.alert("Info!",res.message)
          setLoading(false)
          setMsgModalVisible((prev) => {
            return { ...prev, msg: res.message, status: true, type: res.status }
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
      })
  }

  function onClickLeftIcon() {
    navigation.goBack()
  }
  function onClickRightIcon() {
    setIsInstruction(true)
  }

  function checkAcademicYear() {
    const schStartDate = userData?.data?.startSchool?.split(" ")[0]
    const schEndDate = userData.data.endSchool
    setSchoolSession((prev) => {
      return { ...prev, start: schStartDate, end: schEndDate }
    })
  }

  function closeModule() {
    setListItem((prev) => {
      return { ...prev, status: false }
    });
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top, marginBottom: insets.bottom, backgroundColor: userData.data.colors.mainTheme }}>
      <SwaHeader title={"Student Attendance"} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
      <View style={{ padding: 10, flex: 1, backgroundColor: userData.data.colors.liteTheme }}>
        <SelectionBox getListItem={getListItem} selectedField={selectedField?.class?.getClassDetail?.classDesc} type="class" placeholder="Select class" />
        <SelectionBox getListItem={getListItem} selectedField={selectedField?.section?.sectionName} type="section" placeholder="Select section" />

        {teacherStatus == 2 &&
          <View style={{ marginTop: 8 }}>
            <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderColor: SWATheam.SwaGray, borderRadius: 8, paddingVertical: 6, backgroundColor: SWATheam.SwaWhite }} onPress={() => setShowDatePicker(true)}>
              <View style={{ flex: 1 }}>
                <Text style={{ paddingVertical: 5, paddingHorizontal: 10, color: SWATheam.SwaBlack }}>{selectTeacherDate}</Text>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                <FontAwesome6 name={"calendar"} size={20} color={SWATheam.SwaGray} />
              </View>
            </TouchableOpacity>
          </View>
        }
        <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, width: 100, height: 45, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }} onPress={() => { searchStuAttendance() }}>
            <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>Search</Text>
          </TouchableOpacity>
        </View>

        {teacherStatus == 2 &&
          <DatePicker
            modal
            open={showDatePicker}
            date={date}
            mode='date'
            onConfirm={(date) => {
              setShowDatePicker(false)
              editDate(date)
            }}
            onCancel={() => {
              setShowDatePicker(false)
            }}
          />
        }

        {showCalender &&
          <View style={{ flex: 1, borderTopWidth: .7, marginTop: 10, borderColor: userData.data.colors.mainTheme }}>
            <View style={{ borderWidth: 1, borderColor: SWATheam.SwaWhite, borderRadius: 10, marginTop: 10, elevation: 4 }}>
              <Calendar
                style={{ borderRadius: 10 }}
                current={currentDate}
                onDayPress={day => {
                  setCalenderSelect(day.dateString)
                  // checkAcademicYear(day.dateString)
                  setShowCalender(true)
                  setSelectDateMonthNo(day.month)
                  setSelectDateYear(day.dateString.split("-")[0])
                  getAllDaysOfMonth(day.dateString)
                  disableWeekends(day.dateString)
                  editDate(day.dateString)
                  getWholeMonthAttendanceSummary(day.year, day.month)
                  getClassMonthAttendance(day.dateString)
                  if (teacherStatus == 1 && new Date(day.dateString).getDay() != 0) {
                    setShowClassTeacherButtons(true)
                  } else if (teacherStatus == 3 && new Date(day.dateString).getDay() != 0) {
                    setShowSubjctAndClassTeacherButtons(true)
                  }
                }}
                enableSwipeMonths={true}
                onMonthChange={changeMonth => {
                  setShowClassTeacherButtons(false)
                  setShowSubjctAndClassTeacherButtons(false)
                }}
                markedDates={{
                  [calenderSelect]: { selected: true, selectedDotColor: userData.data.colors.mainTheme },
                  currentDate: { selected: true }
                }}
              />
            </View>

            {showClassTeacherButtons &&
              <View style={{ borderTopWidth: .7, borderColor: userData.data.colors.mainTheme, flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10, paddingVertical: 10 }}>
                <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 5 }} onPress={() => {
                  if ((new Date(currentDate) >= new Date(calenderSelect))) {
                    setMarkAttendanceView(true)
                    setShowCalender(false)
                  } else {
                    setMsgModalVisible((prev) => {
                      return { ...prev, msg: "Please select valid date.", status: true, type: "error" }
                    })
                    setTimeout(() => {
                      setMsgModalVisible((prev) => {
                        return { ...prev, status: false }
                      })
                    }, 2000)
                  }

                }}>
                  <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Mark Attendance</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 5 }} onPress={() => { getCurrentDate(), setShowCalender(false), setViewWholeMonthAttendance(true) }}>
                  <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>View Attendance</Text>
                </TouchableOpacity>
              </View>
            }

            {showSubjctAndClassTeacherButtons &&
              <View>
                <View style={{ borderTopWidth: .7, borderColor: userData.data.colors.mainTheme, marginTop: 10, paddingVertical: 10 }}>
                  <TouchableOpacity style={{ width: '80%', alignSelf: 'center', backgroundColor: userData.data.colors.mainTheme, borderRadius: 6, padding: 8, marginVertical: 6 }} onPress={() => {
                    if (new Date(currentDate) >= new Date(calenderSelect)) {
                      setMarkAttendanceView(true),
                        setShowCalender(false)
                    } else {
                      setMsgModalVisible((prev) => {
                        return { ...prev, msg: "Please select valid date.", status: true, type: "error" }
                      })
                      setTimeout(() => {
                        setMsgModalVisible((prev) => {
                          return { ...prev, status: false }
                        })
                      }, 2000)
                    }
                  }}>
                    <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Class-wise Attendance</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: '80%', alignSelf: 'center', backgroundColor: userData.data.colors.mainTheme, borderRadius: 6, padding: 8, marginVertical: 6 }} onPress={() => { getAttendanceViewStatusWise() }}>
                    <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Period-wise Attendance</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{ width: '80%', alignSelf: 'center', backgroundColor: userData.data.colors.mainTheme, borderRadius: 6, padding: 8, marginVertical: 6 }} onPress={() => { getCurrentDate(), setShowCalender(false), setViewWholeMonthAttendance(true) }}>
                    <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>View Attendance</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
          </View>
        }

        {markAttendanceView &&
          <View style={{ flex: 1, paddingBottom: 30, backgroundColor: SWATheam.SwaWhite, marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center', borderBottomWidth: .5, paddingVertical: 10, backgroundColor: userData.data.colors.mainTheme }}>
                <View style={{ width: 90, }}>
                  <Text style={{ color: SWATheam.SwaWhite, fontWeight: '700' }}>
                    Class {selectedField.class.getClassDetail.classDesc} / {selectedField.section.sectionName}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: SWATheam.SwaWhite, fontWeight: '700', textAlign: 'center' }}>
                    {calenderSelect.split('-')[2]} {monthNameArr[selectDateMonthNo - 1]} {selectDateYear}
                  </Text>
                </View>
                <View style={{ width: 90 }}>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center', marginBottom: 5, borderBottomWidth: .5, paddingVertical: 10 }}>
                <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700' }}>
                  Student Name
                </Text>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => selectAllBtn()}>
                  <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', fontSize: font15, marginRight: 5 }}>
                    Present All
                  </Text>
                  {selectAll ?
                    <MaterialIcons name={"check-box"} size={22} color={userData.data.colors.mainTheme} /> :
                    // studentUserArr.length > 0 ?
                    //     < AntDesign name={"minussquare"} size={17} color={userData.data.colors.mainTheme} /> :
                    <MaterialIcons name={"check-box-outline-blank"} size={22} color={SWATheam.SwaGray} />
                  }
                </TouchableOpacity>
              </View>
              <View style={{ borderWidth: .5, flex: 1, padding: 4, borderColor: SWATheam.SwaGray, borderRadius: 5 }}>
                <ScrollView>
                  {
                    studentData?.data?.map((item, index) => {
                      return (
                        <View style={{ borderWidth: .5, marginBottom: 5, borderRadius: 5, padding: 5, borderColor: SWATheam.SwaGray }} key={index}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#0c878136' }}>
                              <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>
                                {item.fullName}
                              </Text>
                            </View>
                            <View style={{ width: 120, paddingLeft: 5 }}>
                              <TouchableOpacity style={{ padding: 5, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#ffe8e5' }} onPress={() => markStudentClassWise(1, index, item)}>
                                <View style={{ width: 80 }}>
                                  <Text style={{ color: SWATheam.SwaBlack }}>Absent</Text>
                                </View>
                                <View>
                                  {
                                    classMarkAttendanceArr[index] == 1 ?
                                      <MaterialIcons name={"check-box"} size={22} color={userData.data.colors.mainTheme} /> :
                                      <MaterialIcons name={"check-box-outline-blank"} size={22} color={SWATheam.SwaGray} />
                                  }
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity style={{ padding: 5, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#dfdaeb' }} onPress={() => markStudentClassWise(2, index, item)}>
                                <View style={{ width: 80 }}>
                                  <Text style={{ color: SWATheam.SwaBlack }}>Medical</Text>
                                </View>
                                <View>
                                  {
                                    classMarkAttendanceArr[index] == 2 ?
                                      <MaterialIcons name={"check-box"} size={22} color={userData.data.colors.mainTheme} /> :
                                      <MaterialIcons name={"check-box-outline-blank"} size={22} color={SWATheam.SwaGray} />
                                  }
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity style={{ padding: 5, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#fcf0e3' }} onPress={() => markStudentClassWise(3, index, item)}>
                                <View style={{ width: 80 }}>
                                  <Text style={{ color: SWATheam.SwaBlack }}>Leave</Text>
                                </View>
                                <View>
                                  {
                                    classMarkAttendanceArr[index] == 3 ?
                                      <MaterialIcons name={"check-box"} size={22} color={userData.data.colors.mainTheme} /> :
                                      <MaterialIcons name={"check-box-outline-blank"} size={22} color={SWATheam.SwaGray} />
                                  }
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity style={{ padding: 5, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#d7f3e9' }} onPress={() => markStudentClassWise(4, index, item)}>
                                <View style={{ width: 80 }}>
                                  <Text style={{ color: SWATheam.SwaBlack }}>Present</Text>
                                </View>
                                <View>
                                  {
                                    classMarkAttendanceArr[index] == 4 ?
                                      <MaterialIcons name={"check-box"} size={22} color={userData.data.colors.mainTheme} /> :
                                      <MaterialIcons name={"check-box-outline-blank"} size={22} color={SWATheam.SwaGray} />
                                  }
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      )
                    })
                  }
                </ScrollView>
              </View>
            </View>
            <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0, left: 0, width: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: SWATheam.SwaWhite, padding: 5, borderTopWidth: .5, borderColor: SWATheam.SwaGray }}>
              <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 20, paddingVertical: 5, borderRadius: 5 }} onPress={() => { setMarkAttendanceView(false), setShowCalender(true), setSelectAll(false), setShowClassTeacherButtons(false), setShowSubjctAndClassTeacherButtons(false) }}>
                <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 20, paddingVertical: 5, borderRadius: 5 }} onPress={() => markClassAttendance()}>
                <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        }

        {viewWholeMonthAttendance &&
          <View style={{ flex: 1, paddingBottom: 40, marginTop: 10, borderColor: SWATheam.SwaGray, borderTopWidth: 1, }}>
            <View style={{ flex: 1 }}>
              <View style={{ paddingVertical: 5, backgroundColor: userData.data.colors.mainTheme }}>
                <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, fontWeight: '700', fontSize: 16 }}>
                  {monthNameArr[selectDateMonthNo - 1]} {selectDateYear}
                </Text>
              </View>
              <View style={{ flex: 1, borderWidth: 1, borderColor: SWATheam.SwaGray, borderRadius: 5, marginTop: 5, padding: 5, backgroundColor: SWATheam.SwaWhite }}>
                <View style={{ borderWidth: 2, borderColor: userData.data.colors.mainTheme, width: 0, height: '100%', position: 'absolute', top: '0', left: 18, borderRadius: 50 }}>
                </View>
                <ScrollView>
                  {
                    totalDaysArr.map((item, index) => {
                      let totalAbsent = ""
                      let totalPresent = ""
                      let totalLeave = ""
                      let totalMedical = ""
                      totalMonthAttendance?.data?.map((markedAttendance) => {
                        if (item == markedAttendance?.date) {
                          totalAbsent = markedAttendance?.title.absent
                          totalPresent = markedAttendance?.title.present
                          totalLeave = markedAttendance?.title.leave
                          totalMedical = markedAttendance?.title.medical
                        }
                      })
                      return (
                        <View key={index}>
                          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 50, backgroundColor: userData.data.colors.mainTheme }}>
                              <Text style={{ color: SWATheam.SwaWhite, fontSize: 15, fontWeight: '500' }}>{item}</Text>
                            </View>
                            <View style={{ borderWidth: .5, borderColor: SWATheam.SwaGray, flex: 1, justifyContent: 'center', paddingBottom: 5, marginLeft: 10, borderRadius: 3 }}>
                              <View style={{ borderBottomWidth: .5, bordeColor: SWATheam.SwaGray, marginBottom: 5, paddingVertical: 8, backgroundColor: '#def2f1' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center' }}>
                                  <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>{totalDaysNameArr[index]}</Text>
                                  {
                                    (totalAbsent == 0 && totalPresent == 0 && totalLeave == 0 && totalMedical == 0 && totalDaysNameArr[index] != 'Sunday' && new Date(currentDate) >= new Date(calenderSelect)) ?
                                      <Text style={{ color: 'red', fontWeight: '500', fontSize: 12 }}>Not Marked
                                      </Text> : null
                                  }
                                </View>
                              </View>
                              {
                                totalDaysNameArr[index] != 'Sunday' ?
                                  <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 5 }}>
                                      <View style={{ flexDirection: 'row', width: 140, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffe8e5', borderTopRightRadius: 20, borderBottomRightRadius: 20 }}>
                                        <View>
                                          <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500', paddingLeft: 10, fontSize: 13 }}>
                                            Absent
                                          </Text>
                                        </View>
                                        <View style={{ backgroundColor: '#ff846e', borderRadius: 50, justifyContent: 'center', alignItems: 'center', width: 32, height: 32 }}>
                                          <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500', fontSize: 13 }}>
                                            {totalAbsent != 0 ? totalAbsent : 0}
                                          </Text>
                                        </View>
                                      </View>
                                      <View style={{ flexDirection: 'row', width: 140, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#d7f3e9', borderTopRightRadius: 20, borderBottomRightRadius: 20 }}>
                                        <View>
                                          <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500', paddingLeft: 10, fontSize: 13 }}>
                                            Present
                                          </Text>
                                        </View>
                                        <View style={{ backgroundColor: '#00c78d', borderRadius: 50, justifyContent: 'center', alignItems: 'center', width: 32, height: 32 }}>
                                          <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500', fontSize: 13 }}>
                                            {totalPresent != 0 ? totalPresent : 0}
                                          </Text>
                                        </View>
                                      </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 5 }}>
                                      <View style={{ flexDirection: 'row', width: 140, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#dfdaeb', borderTopRightRadius: 20, borderBottomRightRadius: 20 }}>
                                        <View>
                                          <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500', paddingLeft: 10, fontSize: 13 }}>
                                            Leave
                                          </Text>
                                        </View>
                                        <View style={{ backgroundColor: '#4a2697', borderRadius: 50, justifyContent: 'center', alignItems: 'center', width: 32, height: 32 }}>
                                          <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500', fontSize: 13 }}>
                                            {totalLeave != 0 ? totalLeave : 0}
                                          </Text>
                                        </View>
                                      </View>
                                      <View style={{ flexDirection: 'row', width: 140, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fcf0e3', borderTopRightRadius: 20, borderBottomRightRadius: 20 }}>
                                        <View>
                                          <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500', paddingLeft: 10, fontSize: 13 }}>
                                            Medical
                                          </Text>
                                        </View>
                                        <View style={{ backgroundColor: '#f4ae69', borderRadius: 50, justifyContent: 'center', alignItems: 'center', width: 32, height: 32 }}>
                                          <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500', fontSize: 13 }}>
                                            {totalMedical != 0 ? totalMedical : 0}
                                          </Text>
                                        </View>
                                      </View>
                                    </View>
                                  </View> :
                                  <View>
                                    <Text style={{ color: 'red', fontSize: 16, fontWeight: '500', paddingLeft: 10, textAlign: 'center' }}>Holiday</Text>
                                  </View>
                              }
                            </View>
                          </View>
                        </View>
                      )
                    })
                  }
                </ScrollView>
              </View>
            </View>
            <View style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: SWATheam.SwaWhite, paddingVertical: 5, borderTopWidth: .5, borderColor: SWATheam.SwaGray }}>
              <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }} onPress={() => { setViewWholeMonthAttendance(false), setShowCalender(true), setShowClassTeacherButtons(false), setShowSubjctAndClassTeacherButtons(false) }}>
                <Text style={{ color: SWATheam.SwaWhite, fontWeight: '500' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        }

        {viewSubjectTeacher &&
          <View style={{ flex: 1, marginTop: 10, }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: userData.data.colors.mainTheme, alignItems: 'center' }}>
              <View style={{ padding: 6 }}>
                <Text style={{ color: SWATheam.SwaWhite, fontWeight: '600', fontSize: 14 }}>Student Name</Text>
              </View>
              <View style={{ padding: 6 }}>
                <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: SWATheam.SwaWhite, borderRadius: 50, paddingVertical: 2, justifyContent: 'space-between', paddingHorizontal: 10 }} onPress={() => { setShowPopUp(true) }}>
                  <View>
                    <Text style={{ color: SWATheam.SwaBlack }}>{selectPeriodText}</Text>
                  </View>
                  <View style={{ marginLeft: 5 }}>
                    <Entypo name={"chevron-thin-down"} size={20} color={SWATheam.SwaBlack} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {selectPeriodText != 'Select Period' &&
              <View style={{ flex: 1, paddingBottom: 45, backgroundColor: SWATheam.SwaWhite, }}>
                <ScrollView style={{ borderWidth: .5, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, borderColor: SWATheam.SwaGray }}>
                  {
                    studentData?.data?.map((item, index) => {
                      return (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: .5, paddingHorizontal: 6, paddingVertical: 7 }} key={index}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: SWATheam.SwaBlack }}>{item.fullName}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', width: 200, justifyContent: 'space-evenly' }}>
                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => markStudentPeriodWise(0, index, item)}>
                              <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, width: 20, height: 20, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                                {
                                  periodMarkAttendanceArr[index] == 0 &&
                                  <View style={{ height: 10, width: 10, borderRadius: 50, backgroundColor: userData.data.colors.mainTheme }}>
                                  </View>
                                }
                              </View>
                              <Text style={{ color: SWATheam.SwaBlack, paddingLeft: 5 }}>Absent</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => markStudentPeriodWise(1, index, item)}>
                              <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, width: 20, height: 20, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                                {
                                  periodMarkAttendanceArr[index] == 1 &&
                                  <View style={{ height: 10, width: 10, borderRadius: 50, backgroundColor: userData.data.colors.mainTheme }}>
                                  </View>
                                }
                              </View>
                              <Text style={{ color: SWATheam.SwaBlack, paddingLeft: 5 }}>Present</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )
                    })
                  }
                </ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: teacherStatus != 3 ? 'flex-end' : 'space-between', position: 'absolute', bottom: 0, width: '100%', paddingVertical: 5, borderTopWidth: .5, padding: 5, borderColor: SWATheam.SwaGray }}>
                  {teacherStatus == 3 &&
                    <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: userData.data.colors.mainTheme, borderRadius: 5 }} onPress={() => { setViewSubjectTeacher(false), setShowCalender(true), setShowSubjctAndClassTeacherButtons(true), setSelectPeriodText('Select Period'), setSelectPeriod({ data: null, radioID: null }), setShowClassTeacherButtons(false), setShowSubjctAndClassTeacherButtons(false) }}>
                      <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Close</Text>
                    </TouchableOpacity>
                  }
                  <TouchableOpacity style={{ paddingHorizontal: 15, paddingVertical: 5, backgroundColor: userData.data.colors.mainTheme, borderRadius: 5 }} onPress={() => markPeriodAttendance(selectTeacherDate)}>
                    <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Mark Attendance</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
          </View>
        }

        {loading &&
          <Loader />
        }

      </View>

      {showPopUp &&
        <View style={styles.selectFieldPopUp}>
          <View style={{ backgroundColor: SWATheam.SwaWhite, marginHorizontal: 30, padding: 8, maxHeight: 300, borderRadius: 5 }}>
            <TouchableOpacity style={{ position: 'absolute', top: -12, right: -12 }} onPress={() => setShowPopUp(!showPopUp)}>
              <Entypo name={"circle-with-cross"} size={30} color={'#343a40'} />
            </TouchableOpacity>
            <ScrollView>
              {
                classData.type == 'period' ?
                  classData?.data?.timeTable.teacherData.map((item, index) => {
                    const ID = item.subjectID
                    const periodNo = item.cellData.split('_')[2]
                    return (
                      <View key={index}>
                        <TouchableOpacity onPress={() => { selectPeriodOpt(ID, item, periodNo), setShowPopUp(!showPopUp), getPeriodAttendance(periodNo, ID, selectTeacherDate) }}>
                          <View style={{ padding: 10, borderBottomWidth: 1, borderColor: SWATheam.SwaGray, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20 / 2 }}>
                              <View style={{ width: 10, height: 10, borderRadius: 10 / 2, borderWidth: 2, borderColor: SWATheam.SwaGray, justifyContent: 'center', alignItems: 'center' }} value="first">
                                {
                                  selectPeriod.radioID === ID ? <View style={{ borderWidth: 2, borderColor: SWATheam.SwaGray, backgroundColor: userData.data.colors.mainTheme, height: 10, width: 10, borderRadius: 10 / 2 }}></View> : null
                                }
                              </View>
                            </View>
                            <Text style={{ paddingLeft: 10, fontSize: font15, color: SWATheam.SwaBlack }}>
                              Period {periodNo} - {item.subjectName}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )
                  })
                  : null
              }
            </ScrollView>
          </View>
        </View>
      }

      {listItem.status ?
        <BottomDrawerList closeModule={closeModule} listItem={listItem} getSelectedItem={getSelectedItem} selectedField={selectedField} /> : null
      }

      <MsgModal msgModalVisible={msgModalVisible} />
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
  }

});

export default Attendance

