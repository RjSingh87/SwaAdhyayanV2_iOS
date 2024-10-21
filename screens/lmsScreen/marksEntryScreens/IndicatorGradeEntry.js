import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import SwaHeader from '../../common/SwaHeader'
import { GlobleData } from '../../../Store'
import { apiRoot, SWATheam } from '../../../constant/ConstentValue'
import CustomInput from '../../common/CustomInput'
import Services from '../../../Services'
import Loader from '../../common/Loader'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'


const IndicatorGradeEntry = ({ navigation, route }) => {
  const { userData } = useContext(GlobleData)
  const selectedField = route.params.selectedField;
  const gradeType = route.params.marksType
  const [gradeEntry, setGradeEntry] = useState({
    list: [
      { grade: "A", gradeID: 1 },
      { grade: "B", gradeID: 2 },
      { grade: "C", gradeID: 3 },
      { grade: "D", gradeID: 4 },
      { grade: "E", gradeID: 5 },
    ], selectedGrade: null, status: false, type: "gradeEntry"
  })
  const [gradeData, setGradeData] = useState({ data: null, status: false })
  useEffect(() => {
    getIndicatorDataForMarks()
  }, [])
  function getIndicatorDataForMarks() {
    const payload = {
      "schoolCode": userData.data.schoolCode,
      "classID": selectedField.class.classID,
      "sectionID": selectedField.section.sectionID,
      "termID": selectedField.term.id,
      "marksType": gradeType,
      "groupID": route.params.groupID,
      "userRefID": userData.data.userRefID,
      "academicYear": userData.data.academicYear
    }
    Services.post(apiRoot.getIndicatorDataForMarks, payload)
      .then((res) => {
        if (res.status == "success") {
          console.log(JSON.stringify(res.data), 'student Data')
          setGradeData((prev) => {
            return { ...prev, data: res.data, status: true }
          })
        } else if (res.status == "error") {
          alert(res.message)
          setGradeData((prev) => {
            return { ...prev, status: false }
          })
          navigation.goBack()
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setGradeData((prev) => {
          return { ...prev, status: true }
        })
      })
  }


  let toolName = ''
  if (route.params.groupID == 1) {
    toolName = "Co-Scholastic Grade Entry"
  } else if (route.params.groupID == 2) {
    toolName = "Discipline Grade Entry"
  }
  function onClickLeftIcon() {
    navigation.goBack()
  }
  function onClickRightIcon() {
    setIsInstruction(true)
  }

  function saveSingleIndicatorMarks(item, val) {
    setGradeData((prev) => {
      return { ...prev, status: false }
    })
    let marksValue = []
    val?.subIndicatorData?.map((itm, ind) => {
      if (itm.subIndicatorID != undefined) {
        if (itm.subIndicatorMarksID != '') {
          marksValue.push(itm.subIndMarks + '-' + val.indicatorID + '-' + itm.subIndicatorID + '-' + itm.subIndicatorMarksID)
        } else if (itm.subIndMarks != '') {
          marksValue.push(itm.subIndMarks + '-' + val.indicatorID + '-' + itm.subIndicatorID + '-' + 0)
        } else {
          return
        }
      }
    })
    const Payload = {
      "schoolCode": userData.data.schoolCode,
      "classID": val.classID,
      "sectionID": selectedField.section.sectionID,
      "userRefID": item.getStudentName.userRefID,
      "termID": selectedField.term.id,
      "marksType": gradeType,
      "groupID": route.params.groupID,
      "marksValue": marksValue.toString(),
      "academicYear": userData.data.academicYear
    }

    Services.post(apiRoot.saveSingleIndicatorMarks, Payload)
      .then((res) => {
        if (res.status == "success") {
          alert(res.message)
          setGradeData((prev) => {
            return { ...prev, status: true }
          })
        } else if (res.status == "error") {
          alert(res.message)
          setGradeData((prev) => {
            return { ...prev, status: true }
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setGradeData((prev) => {
          return { ...prev, status: true }
        })

      })
  }

  function onChangeText(val, subItem, index, ind, subIndex) {
    gradeData.data.studentData[index].indicatorData[ind].subIndicatorData[subIndex].subIndMarks = val;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['left', "right", "top"]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: userData?.data?.colors?.mainTheme }}>
        {!gradeData.status ?
          <Loader /> :
          <View style={{ marginTop: Platform.OS === "ios" ? 0 : 24, backgroundColor: userData.data.colors.liteTheme, flex: 1 }}>
            <SwaHeader title={toolName} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
            <View style={{ padding: 10, flex: 1 }}>
              <ScrollView>
                {gradeData?.data?.studentData.map((item, index) => {
                  return (
                    <View style={{ backgroundColor: userData.data.colors.mainTheme, borderWidth: .5, borderColor: userData.data.colors.hoverTheme, borderRadius: 8, marginBottom: 20, paddingBottom: 6 }} key={item.userRefID}>
                      <View style={{ flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 6 }}>
                        <View style={{ width: 80, }}>
                          <Text style={{ color: SWATheam.SwaWhite, fontWeight: '700' }}>Enroll. No.</Text>
                        </View>
                        <View style={{ width: 20 }}>
                          <Text style={{ color: SWATheam.SwaWhite, fontWeight: '700' }}>:</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: SWATheam.SwaWhite, }}>{item.getStudentName.registrationNo}</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 6 }}>
                        <View style={{ width: 80 }}>
                          <Text style={{ color: SWATheam.SwaWhite, fontWeight: '700' }}>Name</Text>
                        </View>
                        <View style={{ width: 20 }}>
                          <Text style={{ color: SWATheam.SwaWhite, fontWeight: '700' }}>:</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: SWATheam.SwaWhite }}>{item.getStudentName.firstName + " " + item.getStudentName.lastName}</Text>
                        </View>
                      </View>
                      {item.indicatorData.map((val, ind) => {
                        return (
                          <View style={{ padding: 8, borderRadius: 10, backgroundColor: SWATheam.SwaWhite }} key={ind}>
                            <View style={{ backgroundColor: userData.data.colors.liteTheme, borderRadius: 6 }}>
                              <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500', textAlign: 'center', padding: 4, borderBottomWidth: .7, borderColor: userData.data.colors.mainTheme }}>{val.indicatorName}</Text>
                              {val.subIndicatorData.map((subItem, subIndex) => {
                                return (
                                  <View style={{ flexDirection: 'row', marginTop: 6, paddingHorizontal: 8, alignItems: 'center' }} key={subIndex}>
                                    <View style={{ padding: 6, flex: 1 }}>
                                      <Text style={{ color: SWATheam.SwaBlack }}>{subItem.subIndicatorName}</Text>
                                    </View>
                                    <View style={{ width: 60 }}>
                                      <CustomInput defaultValue={subItem.subIndMarks} placeHolder={'--'} styleFrom={"GradeEntry"} keyboardType={gradeType == "numerical" ? "numeric" : null} onChangeText={(val) => onChangeText(val, subItem, index, ind, subIndex)} />
                                    </View>
                                  </View>
                                )
                              })
                              }
                              <View style={{ paddingHorizontal: 8, marginVertical: 8, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <TouchableOpacity style={{ padding: 6, width: 60, borderRadius: 6, backgroundColor: userData.data.colors.mainTheme }} onPress={() => { saveSingleIndicatorMarks(item, val) }}>
                                  <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Save</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>

                        )
                      })}
                    </View>
                  )
                })}
              </ScrollView>
            </View>
            {/* {gradeEntry.status &&
            <BottomDrawerList listItem = {gradeEntry} closeModule={closeModule} getSelectedItem={getSelectedItem}/>
      } */}
            {/* <View style={{ backgroundColor: SWATheam.SwaWhite, width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10, elevation: 9 }}>
        <View style={{ padding: 10, borderRadius: 8, backgroundColor: userData.data.colors.mainTheme, width: 80 }}>
          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center', textTransform: 'uppercase' }}>Submit</Text>
        </View>
      </View> */}
          </View>
        }
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default IndicatorGradeEntry

const styles = StyleSheet.create({})