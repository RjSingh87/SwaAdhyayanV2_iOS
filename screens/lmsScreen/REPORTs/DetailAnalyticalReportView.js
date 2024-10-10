import { StyleSheet, Text, View, FlatList, TouchableOpacity, Platform } from 'react-native'
import React, { useContext } from 'react'
import SwaHeader from '../../common/SwaHeader'
import { GlobleData } from '../../../Store'
import { apiRoot, SWATheam } from '../../../constant/ConstentValue'
import Services from '../../../Services'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'


const DetailAnalyticalReportView = ({ navigation, route }) => {
  const { userData } = useContext(GlobleData)
  // console.log(route, 'hello54545')
  const reportList = route.params.data
  const toolName = route.params.reportName
  const testType = route.params.testType
  function onClickLeftIcon() {
    navigation.goBack()
  }
  function onClickRightIcon() {
    setIsInstruction(true)
  }
  console.log(reportList, 'reportList')
  function ViewReport(item) {
    console.log(item, 'check item selected')
    if (testType == 1) {
      const payload = {
        "schoolCode": userData.data.schoolCode,
        "academicYear": userData.data.academicYear,
        "classID": item.getClassName.classID,
        "sectionID": item.getSectionName.sectionID,
        "subjectID": item.getSubjectName.subjectID,
        "assessmentID": item.assessmentID
      }
      Services.post(apiRoot.analyticalReportSubjectWise, payload)
        .then((res) => {
          console.log(JSON.stringify(res), 'reportData')
        })
    } else {
      alert("report 2")
    }

  }

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['left', 'right', 'top']} style={{ flex: 1, backgroundColor: userData.data.colors.mainTheme }}>
        <View style={{ flex: 1, marginTop: Platform.OS == "ios" ? 0 : 24 }}>
          <SwaHeader title={toolName} leftIcon={"arrowleft"} onClickLeftIcon={onClickLeftIcon} onClickRightIcon={onClickRightIcon} />
          <View style={{ flex: 1, backgroundColor: userData.data.colors.liteTheme, padding: 10 }}>
            <Text style={{ color: userData.data.colors.mainTheme, textTransform: 'uppercase', fontSize: 15, fontWeight: '700', textAlign: 'center', marginVertical: 6, borderBottomWidth: 1, borderColor: userData.data.colors.mainTheme, paddingVertical: 4 }}>{toolName}</Text>
            <FlatList
              data={reportList}
              renderItem={({ item, indx }) => {
                console.log(item, 'hello item')
                return (
                  <View style={{ borderRadius: 6, backgroundColor: SWATheam.SwaWhite, padding: 10, elevation: 7, marginBottom: 15 }}>
                    <Text style={{ fontWeight: '500', color: SWATheam.SwaGray }}>Assessment Name:</Text>
                    <Text style={{ fontWeight: '500', color: SWATheam.SwaBlack, textTransform: 'uppercase', marginVertical: 4 }}>{item.assessmentName}</Text>
                    <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                      <Text style={{ width: '40%', fontWeight: '500', color: SWATheam.SwaGray }}>Date of Creation</Text>
                      <Text style={{ width: 15 }}>:</Text>
                      <Text style={{ width: '50%', fontWeight: '500', color: SWATheam.SwaBlack }}>{item.createdDate}</Text>
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
                      <Text style={{ width: '50%', fontWeight: '500', color: SWATheam.SwaBlack }}>{item.noOfQuestion}</Text>
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


          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default DetailAnalyticalReportView

const styles = StyleSheet.create({})