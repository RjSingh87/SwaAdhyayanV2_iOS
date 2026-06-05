import { StyleSheet, Text, View, FlatList, TouchableOpacity, StatusBar } from 'react-native'
import React, { useContext, useState } from 'react'
import SwaHeader from '../../common/SwaHeader'
import { GlobleData } from '../../../Store'
import { apiRoot, SWATheam } from '../../../constant/ConstentValue'
import Services from '../../../Services'
import ReportViwer from '../../common/ReportViwer'
import MsgModal from '../../common/MsgModal'
import Loader from '../../common/Loader'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const DetailAnalyticalReportView = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { userData } = useContext(GlobleData)
  const [reportData, setReportData] = useState({ data: null, status: false })
  const [msgModalVisible, setMsgModalVisible] = useState({ msg: '', status: false, type: '' })
  const [loading, setLoading] = useState(false)
  const reportList = route.params.data
  const toolName = route.params.reportName
  const testType = route.params.testType
  const userRefID = route.params.userRefID
  const subjectID = route.params.selectedField
  function onClickLeftIcon() {
    navigation.goBack()
  }
  function onClickRightIcon() {
    setIsInstruction(true)
  }

  function ViewReport(item) {
    setLoading(true)
    if (testType == 1) {
      const payload = {
        "schoolID": userData.data.schoolID,
        "academicYear": userData.data.academicYear,
        "classID": item.getClassName.classID,
        "sectionID": item.getSectionName.sectionID,
        "subjectID": item.getSubjectName.subjectID,
        "assessmentID": item.assessmentID
      }
      Services.post(apiRoot.analyticalReportSubjectWise, payload)
        .then((res) => {
          if (res.status == "success") {
            setLoading(false)
            if (!res.data.chapterDetails.length && !res.data.classData.length && !res.data.chapterWiseData.length) {
              setMsgModalVisible((prev) => {
                return { ...prev, msg: "Student not attempted this test.", status: true, type: 'error' }
              })
              setTimeout(() => {
                setMsgModalVisible((prev) => {
                  return { ...prev, status: false }
                })
              }, 2000)
            } else {
              setReportData((prev) => {
                return { ...prev, data: res.data, status: true, type: 'detailAnlytical' }
              })
            }
          } else if (res.status == "error") {
            setLoading(true)
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
      const payload = {
        "schoolID": userData.data.schoolID,
        "academicYear": userData.data.academicYear,
        "classID": item.getClassName.classID,
        "sectionID": item.getSectionName.sectionID,
        "userRefID": userRefID,
        "subjectID": item.getSubjectName.subjectID,
        "assessmentID": item.assessmentID
      }
      Services.post(apiRoot.analyticalReportStudentWise, payload)
        .then((res) => {
          if (res.status == "success") {
            setLoading(false)
            setReportData((prev) => {
              return { ...prev, data: res.data, status: true, type: 'detailAnlyticalStudentWise' }
            })
          } else if (res.status == "error") {
            setLoading(true)
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
    }
  }
  function closeModule() {
    setReportData((prev) => {
      return { ...prev, status: false }
    })
  }
  return (
    <SafeAreaProvider>
      {loading ?
        <Loader /> :
        <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: userData.data.colors.mainTheme, marginBottom: insets.bottom }}>
          <SwaHeader title={toolName} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
          <View style={{ flex: 1, backgroundColor: userData.data.colors.liteTheme, padding: 10 }}>
            <Text style={{ color: userData.data.colors.mainTheme, textTransform: 'uppercase', fontSize: 15, fontWeight: '700', textAlign: 'center', marginVertical: 6, borderBottomWidth: 1, borderColor: userData.data.colors.mainTheme, paddingVertical: 4 }}>{toolName}</Text>
            <FlatList
              data={reportList}
              renderItem={({ item, indx }) => {
                let assessmentName = ''
                let doc = ""
                let totalQue = null
                if (testType == 1) {
                  assessmentName = item.assessmentName
                  doc = item.createdDate
                  totalQue = item.noOfQuestion
                } else {
                  assessmentName = item.getAssessmentData.assessmentName
                  doc = item.getAssessmentData.createdDate
                  totalQue = item.getAssessmentData.noOfQuestion
                }
                return (
                  <View style={{ borderRadius: 6, backgroundColor: SWATheam.SwaWhite, padding: 10, elevation: 7, marginBottom: 15 }}>
                    <Text style={{ fontWeight: '500', color: SWATheam.SwaGray }}>Assessment Name:</Text>
                    <Text style={{ fontWeight: '500', color: SWATheam.SwaBlack, textTransform: 'uppercase', marginVertical: 4 }}>{assessmentName}</Text>
                    <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                      <Text style={{ width: '40%', fontWeight: '500', color: SWATheam.SwaGray }}>Date of Creation</Text>
                      <Text style={{ width: 15 }}>:</Text>
                      <Text style={{ width: '50%', fontWeight: '500', color: SWATheam.SwaBlack }}>{doc}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                      <Text style={{ width: '40%', fontWeight: '500', color: SWATheam.SwaGray }}>Class/Section:</Text>
                      <Text style={{ width: 15 }}>:</Text>
                      <Text style={{ width: '50%', fontWeight: '500', color: SWATheam.SwaBlack }}>{item.getClassName.classDesc}/{item.getSectionName.sectionName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                      <Text style={{ width: '40%', fontWeight: '500', color: SWATheam.SwaGray }}>Subject:</Text>
                      <Text style={{ width: 15 }}>:</Text>
                      <Text style={{ width: '50%', fontWeight: '500', color: SWATheam.SwaBlack }}>{item.getSubjectName.subjectName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                      <Text style={{ width: '40%', fontWeight: '500', color: SWATheam.SwaGray }}>Total Questions:</Text>
                      <Text style={{ width: 15 }}>:</Text>
                      <Text style={{ width: '50%', fontWeight: '500', color: SWATheam.SwaBlack }}>{totalQue}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                      <View style={{ width: "40%" }}></View>
                      <View style={{ width: "60%", justifyContent: 'center', marginLeft: 15 }}>
                        <TouchableOpacity style={{ backgroundColor: userData.data.colors.mainTheme, padding: 8, borderRadius: 6, width: 110 }} onPress={() => ViewReport(item)}>
                          <Text style={{ color: SWATheam.SwaWhite, textTransform: 'uppercase', textAlign: 'center' }}>View Report</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )
              }}
            />
            {reportData.status &&
              <ReportViwer closeModule={closeModule} reportData={reportData} subjectID={subjectID} reportName={toolName} />
            }
            <MsgModal msgModalVisible={msgModalVisible} />
          </View>
        </View>
      }
    </SafeAreaProvider>
  )
}

export default DetailAnalyticalReportView
const styles = StyleSheet.create({})