import React, { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, ScrollView, SafeAreaView, TextInput, Image, Button } from "react-native"
import { useState, useContext } from "react"
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import DatePicker from 'react-native-date-picker'
import { apiRoot, SWATheam } from "../../../../constant/ConstentValue"
import { GlobleData } from "../../../../Store"
import Services from "../../../../Services"
import Loader from "../../../common/Loader"
import BottomDrawerList from "../../../common/BottomDrawerList"
import SelectionBox from "../../../common/SelectionBox"


const CreateCertificate = () => {
  const { userData } = useContext(GlobleData)

  const [selectOption, setSelectOption] = useState({ class: null, section: null, subject: null, student: null, awardType: null, type: null })
  const [ModalData, setModalData] = useState({ list: null, type: null, status: false })
  const [showPopUp, setShowPopUp] = useState(false)
  const [showFromDatePicker, setShowFromDatePicker] = useState(false)
  const [showToDatePicker, setShowToDatePicker] = useState(false)
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [year, setYear] = useState(null)
  const [loading, setLoading] = useState(false)
  const [issueBtnLoading, setIssueBtnLoading] = useState(false)
  const date = new Date()

  function getList(type) {
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
            setLoading(false)
            setShowPopUp(true)
            const data = res.data
            setModalData((prev) => {
              return { ...prev, list: data, type: type, status: true }
            })
          } else {
            setLoading(false)
            Alert.alert("Info", res.message)
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
          "schoolID": userData.data.schoolID,
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
                return { ...prev, list: data, type: type, status: true }
              })
            } else {
              setLoading(false)
              Alert.alert("Info", res.message)
            }
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            setLoading(false)

          })
      } else {
        Alert.alert("Info", "Please select class first")
        setLoading(false)
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
              setLoading(false)
              setShowPopUp(true)
              const data = res.data
              setModalData((prev) => {
                return { ...prev, list: data, type: type, status: true }
              })
            } else {
              setLoading(false)
              Alert.alert("Info", res.message)
            }
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        Alert.alert("Info", "Please select section first")
        setLoading(false)
      }
    }
    else if (type == 'student') {
      if (selectOption.subject != null) {
        const payload = {
          "schoolID": userData.data.schoolID,
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
                return { ...prev, list: data, type: type, status: true }
              })
            } else {
              setLoading(false)
              Alert.alert("Info", res.message)
            }
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        Alert.alert("Info", "Please select subject first")
        setLoading(false)
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
                return { ...prev, list: data, type: type, status: true }
              })
            } else {
              setLoading(false)
              Alert.alert("Info", res.message)
            }
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        Alert.alert("Info", "Please select student first")
        setLoading(false)
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
              return { ...prev, list: data, type: type, status: true }
            })
          } else {
            setLoading(false)
            Alert.alert("Info", res.message)
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
      setModalData((prev) => {
        return { ...prev, status: false }
      })
    }
    else if (type == 'section') {
      setSelectOption((prev) => {
        return { ...prev, section: item, subject: null, student: null, awardType: null, month: null, type: type }
      })
      setYear(null)
      setModalData((prev) => {
        return { ...prev, status: false }
      })
    }
    else if (type == 'subject') {
      setSelectOption((prev) => {
        return { ...prev, subject: item, student: null, awardType: null, month: null, type: type }
      })
      setYear(null)
      setModalData((prev) => {
        return { ...prev, status: false }
      })
    }
    else if (type == 'student') {
      setSelectOption((prev) => {
        return { ...prev, student: item, awardType: null, month: null, type: type }
      })
      setYear(null)
      setModalData((prev) => {
        return { ...prev, status: false }
      })
    }
    else if (type == 'awardType') {
      setSelectOption((prev) => {
        return { ...prev, awardType: item, month: null, type: type }
      })
      setModalData((prev) => {
        return { ...prev, status: false }
      })

      if (item.awardValue != 2) {
        setYear(null)
      }
    }
    else if (type == 'month') {
      setSelectOption((prev) => {
        return { ...prev, month: item, type: type }
      })
      setModalData((prev) => {
        return { ...prev, status: false }
      })
    }
  }

  function closeModal() {
    setShowPopUp(false)
    setModalData((prev) => {
      return { ...prev, status: false }
    })
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

  async function createCertificate() {
    if (selectOption.class == null) {
      Alert.alert("Required", "Please select a class")
      return
    } else if (selectOption.section == null) {
      Alert.alert("Required", "Please select a section")
      return
    } else if (selectOption.subject == null) {
      Alert.alert("Required", "Please select a subject")
      return
    } else if (selectOption.student == null) {
      Alert.alert("Required", "Please select a student")
      return
    } else if (selectOption.awardType == null) {
      Alert.alert("Required", "Please select month/duration")
      return
    }
    setIssueBtnLoading(true)

    const payload = {
      "schoolID": userData.data.schoolID,
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
    await Services.post(apiRoot.issueCertificate, payload)
      .then((res) => {
        if (res.status == "success") {
          Alert.alert("Info", res.message)
          setSelectOption({ class: null, section: null, subject: null, student: null, awardType: null, type: null })
          setYear(null)
        } else {
          Alert.alert("Error", res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setIssueBtnLoading(false)
      })

  }

  return (
    <>
      {loading ?
        <Loader /> :
        <>
          <View style={{ flex: 1, padding: 10 }}>
            <View style={{ marginBottom: 10, paddingBottom: 10 }}>

              <SelectionBox getListItem={getList} selectedField={selectOption?.class?.getClassDetail?.classDesc} type="class" placeholder="Select class" />
              <SelectionBox getListItem={getList} selectedField={selectOption?.section?.sectionName} type="section" placeholder="Select Section" />
              <SelectionBox getListItem={getList} selectedField={selectOption?.subject?.subjectName} type="subject" placeholder="Select Subject" />
              <SelectionBox getListItem={getList} selectedField={selectOption?.student?.fullName} type="student" placeholder="Select Student" />
              <SelectionBox getListItem={getList} selectedField={selectOption?.awardType?.awardName} type="awardType" placeholder="Select Month/Duration" />

              {selectOption.awardType?.awardValue == 1 ?
                <SelectionBox getListItem={getList} selectedField={selectOption?.month} type="month" placeholder="'Select Month" />
                :
                selectOption.awardType?.awardValue == 2 ?
                  <TextInput placeholderTextColor={SWATheam.SwaGray} style={[styles.input, { borderColor: userData.data.colors.mainTheme, color: SWATheam.SwaBlack, backgroundColor: SWATheam.SwaWhite }]} onChangeText={setYear} value={year} placeholder='Type Year' /> :
                  selectOption.awardType?.awardValue == 3 ?
                    <View>
                      <TouchableOpacity style={{ flexDirection: 'row', borderWidth: .7, borderColor: userData.data.colors.mainTheme, borderRadius: 4, paddingVertical: 4, marginBottom: 10, marginTop: 6, backgroundColor: SWATheam.SwaWhite }} onPress={() => setShowFromDatePicker(true)}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ paddingVertical: 5, paddingHorizontal: 10, color: fromDate == null ? SWATheam.SwaGray : SWATheam.SwaBlack }}>{fromDate == null ? 'From' : fromDate}</Text>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 7 }}>
                          <FontAwesome6 name={"calendar"} size={20} color={'grey'} />
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ flexDirection: 'row', borderWidth: .7, borderColor: userData.data.colors.mainTheme, borderRadius: 4, paddingVertical: 4, marginBottom: 10, backgroundColor: SWATheam.SwaWhite }} onPress={() => setShowToDatePicker(true)}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ paddingVertical: 5, paddingHorizontal: 10, color: toDate == null ? SWATheam.SwaGray : SWATheam.SwaBlack }}>{toDate == null ? 'To' : toDate}</Text>
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
                <TouchableOpacity
                  style={{
                    backgroundColor: userData.data.colors.mainTheme,
                    paddingHorizontal: 30,
                    paddingVertical: 8,
                    borderRadius: 50,
                    minWidth: 100,
                    alignItems: 'center',
                  }}
                  onPress={createCertificate}
                  disabled={loading}
                >
                  {issueBtnLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text
                      style={{
                        color: SWATheam.SwaWhite,
                        textTransform: 'uppercase',
                      }}
                    >
                      Issue
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

            </View>

          </View>
          {
            ModalData.status &&
            <BottomDrawerList listItem={ModalData} closeModule={closeModal} getSelectedItem={selectModalOption} selectedField={selectOption} />
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
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
    marginTop: 8
  },
});

export default CreateCertificate