import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { GlobleData } from '../../../../Store'
import { SWATheam } from '../../../../constant/ConstentValue'
import { ScrollView } from 'react-native-gesture-handler'
import Loader from '../../../common/Loader'
const HalfYearlyAndAnnualProgressReport = ({ reportData, reportSubIconID, testType, userType, selectedIcon }) => {
  const { userData } = useContext(GlobleData)
  const indicatorsList = []
  const disciplineIndicatorList = []
  let totalObtainMarks = null
  let totalAnnualMarks = null
  let totalMarks = reportData.data.reportData.length * 100
  let GlobleGrade = ""
  let subjectMarksList = [];
  let anualReportData = []
  let totalMarkArray = []
  let grandsTotalMarks = 0

  if ((reportSubIconID == 63 && testType == 5) || (userType == 5 && selectedIcon == 106)) {
    reportData.data.halfYearData.data.assignedSubjects.map((item, index) => {
      let index2 = reportData.data.halfYearData.data.reportData.findIndex((res) => res.subjectID == item.subjectID);
      if (index2 == -1) {
        subjectMarksList.push(item)
      } else {
        subjectMarksList.push(reportData.data.halfYearData.data.reportData[index2])
      }
    })
    subjectMarksList.map((item, index) => {
      if (item.subjectMarks != undefined) {
        totalObtainMarks += (item?.subjectMarks?.periodicTest?.obtainedMarks != undefined ? item?.subjectMarks?.periodicTest?.obtainedMarks : "") + (item?.subjectMarks?.noteBookMarks != undefined ? item?.subjectMarks?.noteBookMarks : "") + (item?.subjectMarks?.seaMarks != undefined ? item?.subjectMarks?.seaMarks : "") + (item?.subjectMarks?.halfYearlyMarks != undefined ? item?.subjectMarks?.halfYearlyMarks?.obtainedMarks : "")
      }
    });

    reportData.data.assignedSubjects.map((item, index) => {
      let index2 = reportData.data.reportData.findIndex((res) => res.subjectID == item.subjectID);
      if (index2 == -1) {
        anualReportData.push(item)
      } else {
        anualReportData.push(reportData.data.reportData[index2])
      }
    })


    anualReportData.map((item, index) => {
      if (item.subjectMarks != undefined) {
        totalAnnualMarks += (item?.subjectMarks?.periodicTest?.obtainedMarks != undefined ? item?.subjectMarks?.periodicTest?.obtainedMarks : "") + (item?.subjectMarks?.noteBookMarks != undefined ? item?.subjectMarks?.noteBookMarks : "") + (item?.subjectMarks?.seaMarks != undefined ? item?.subjectMarks?.seaMarks : "") + (item?.subjectMarks?.term2YearlyMarks != undefined ? item?.subjectMarks?.term2YearlyMarks?.obtainedMarks : "")
      }
    })


  } else {
    reportData.data.assignedSubjects.map((item, index) => {
      let index2 = reportData.data.reportData.findIndex((res) => res.subjectID == item.subjectID);
      if (index2 == -1) {
        subjectMarksList.push(item)
      } else {
        subjectMarksList.push(reportData.data.reportData[index2])
      }
    })

    subjectMarksList.map((item, index) => {
      if (item.subjectMarks != undefined) {
        totalObtainMarks += (item?.subjectMarks?.periodicTest?.obtainedMarks != undefined ? item?.subjectMarks?.periodicTest?.obtainedMarks : 0) + (item?.subjectMarks?.noteBookMarks != undefined ? item?.subjectMarks?.noteBookMarks : 0) + (item?.subjectMarks?.seaMarks != undefined ? item?.subjectMarks?.seaMarks : 0) + (item?.subjectMarks?.halfYearlyMarks != undefined ? item?.subjectMarks?.halfYearlyMarks?.obtainedMarks : 0)
      }
    })
  }


  const indicatorData = reportData?.data?.scholasticIndicator?.indicatorDetails
  if (indicatorData != undefined) {
    Object.keys(indicatorData).forEach(function (key, index) {
      indicatorsList.push(indicatorData[key])
    })
  }
  const disciplineIndicator = reportData?.data?.disciplineIndicator?.indicatorDetails
  if (disciplineIndicator != undefined) {
    Object.keys(disciplineIndicator).forEach(function (key, index) {
      disciplineIndicatorList.push(disciplineIndicator[key])
    })
  }
  return (
    <View style={{ flex: 1, width: '100%' }}>
      {subjectMarksList[0] == undefined ?
        <Loader /> :
        <ScrollView>
          <View style={{ padding: 10, borderBottomWidth: .7, borderColor: userData.data.colors.mainTheme }}>
            <Text style={{ textAlign: 'center', fontWeight: '700', textTransform: 'uppercase', fontSize: 18, color: userData.data.colors.mainTheme, marginBottom: 10 }}>{reportData.data.schoolData.schoolName}</Text>
            <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>{reportData.data.schoolData.affiliatedBy}</Text>
            <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>Dise Code : {reportData.data.schoolData.diceCode}</Text>
            <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>{reportData.data.schoolData.city + ' ' + reportData.data.schoolData.state + ' ' + reportData.data.schoolData.country + '-' + reportData.data.schoolData.pinCode}</Text>
          </View>
          <View style={{ flexDirection: 'row', backgroundColor: userData.data.colors.liteTheme, padding: 10 }}>
            <View style={{ width: '50%' }}>
              <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500', marginBottom: 6 }}>School Code</Text>
              <Text style={{ color: SWATheam.SwaBlack }}>{reportData.data.schoolData.schoolID}</Text>
            </View>
            <View style={{ width: '50%', alignItems: 'flex-end' }}>
              <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500', marginBottom: 6 }}>Admission No:</Text>
              <Text style={{ color: SWATheam.SwaBlack }}>{reportData.data.studentData.admissionNo}</Text>
            </View>
          </View>

          <View style={{ padding: 10 }}>
            <View style={{ marginTop: 6, flexDirection: 'row' }}>
              <View style={{ width: 115 }}>
                <Text style={{ color: SWATheam.SwaBlack, }}>Name:</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: SWATheam.SwaBlack }}>{reportData.data.studentData.firstName + ' ' + reportData.data.studentData.lastName}</Text>
              </View>
            </View>
            <View style={{ marginTop: 6, flexDirection: 'row' }}>
              <View style={{ width: 115 }}>
                <Text style={{ color: SWATheam.SwaBlack, }}>Mother's Name:</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: SWATheam.SwaBlack }}>{reportData.data.studentData.motherName != null ? reportData.data.studentData.motherName : ''}</Text>
              </View>
            </View>
            <View style={{ marginTop: 6, flexDirection: 'row' }}>
              <View style={{ width: 115 }}>
                <Text style={{ color: SWATheam.SwaBlack, }}>Father's Name:</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: SWATheam.SwaBlack }}>{reportData.data.studentData.fatherName != null ? reportData.data.studentData.fatherName : ''}</Text>
              </View>
            </View>
            <View style={{ marginTop: 6, flexDirection: 'row' }}>
              <View style={{ width: 115 }}>
                <Text style={{ color: SWATheam.SwaBlack, }}>Date of Birth:</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: SWATheam.SwaBlack }}>{reportData.data.studentData.dateOfBirth != null ? reportData.data.studentData.dateOfBirth : ''}</Text>
              </View>
            </View>
            <View style={{ marginTop: 6, flexDirection: 'row' }}>
              <View style={{ width: 115 }}>
                <Text style={{ color: SWATheam.SwaBlack, }}>Address:</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: SWATheam.SwaBlack }}>{reportData.data.studentData.address}</Text>
              </View>
            </View>
          </View>
          <View style={{ backgroundColor: userData.data.colors.liteTheme, paddign: 10, marginTop: 10 }}>
            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center', paddingVertical: 10, fontWeight: '700' }}>ACADEMIC PERFORMANCE : SCHOLASTIC AREA</Text>
            <ScrollView horizontal>
              {(reportSubIconID == 63 && testType == 5) || (userType == 5 && selectedIcon == 106) ?
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{}}>
                      <Text style={{ backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, padding: 10 }}>SCHOLASTIC AREA</Text>
                      <View style={{ backgroundColor: userData.data.colors.mainTheme, borderTopWidth: 1, borderColor: SWATheam.SwaWhite, padding: 10, width: 150 }}>
                        <Text style={{ color: SWATheam.SwaWhite }}>Sujbectsdsdsd</Text>
                      </View>
                    </View>
                    <View style={{ borderRightWidth: 1, borderLeftWidth: 1, borderColor: SWATheam.SwaWhite }}>
                      <Text style={{ backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, textAlign: 'center', padding: 10 }}>TERM - I (100 Marks)</Text>
                      <View style={{ backgroundColor: userData.data.colors.mainTheme, flexDirection: 'row' }}>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Periodic Test (10)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>NoteBook (5)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>SEA (5)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Half Yearly (80)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Total (100)</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ borderRightWidth: 1, borderLeftWidth: 1, borderColor: SWATheam.SwaWhite }}>
                      <Text style={{ backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, textAlign: 'center', padding: 10 }}>TERM - II (100 Marks)</Text>
                      <View style={{ backgroundColor: userData.data.colors.mainTheme, flexDirection: 'row' }}>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Periodic Test (10)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>NoteBook (5)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>SEA (5)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Annualy (80)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Total (100)</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{}}>
                      <Text style={{ backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, padding: 10, textAlign: 'center' }}>OVERALL T1(50) + T2(50)</Text>
                      <View style={{ backgroundColor: userData.data.colors.mainTheme, flexDirection: 'row' }}>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Grand Total</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Grade</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  {subjectMarksList.map((item, index) => {
                    let grade = ""
                    let annualObtainMarks = ""
                    let obtainedMarks = (item?.subjectMarks?.periodicTest?.obtainedMarks != undefined ? item?.subjectMarks?.periodicTest?.obtainedMarks : "") + (item?.subjectMarks?.noteBookMarks != undefined ? item?.subjectMarks?.noteBookMarks : "") + (item?.subjectMarks?.seaMarks != undefined ? item?.subjectMarks?.seaMarks : "") + (item?.subjectMarks?.halfYearlyMarks != undefined ? item?.subjectMarks?.halfYearlyMarks?.obtainedMarks : "")

                    annualObtainMarks += (anualReportData[index]?.subjectMarks?.periodicTest?.obtainedMarks != undefined ? anualReportData[index]?.subjectMarks?.periodicTest?.obtainedMarks : "") + (anualReportData[index]?.subjectMarks?.noteBookMarks != undefined ? anualReportData[index]?.subjectMarks?.noteBookMarks : "") + (anualReportData[index]?.subjectMarks?.seaMarks != undefined ? anualReportData[index]?.subjectMarks?.seaMarks : "") + (anualReportData[index]?.subjectMarks?.term2YearlyMarks != undefined ? anualReportData[index]?.subjectMarks?.term2YearlyMarks?.obtainedMarks : "")



                    let grandTotal = Math.round((Number(obtainedMarks) + Number(annualObtainMarks)) / 2)
                    grandsTotalMarks += grandTotal

                    if (grandTotal <= 100 && grandTotal >= 91) {
                      grade = 'A1';
                      GlobleGrade = "A1"
                    } else if (grandTotal <= 90 && grandTotal >= 81) {
                      grade = 'A2';
                      GlobleGrade = "A2"
                    } else if (grandTotal <= 80 && grandTotal >= 71) {
                      grade = 'B1';
                      GlobleGrade = "B1"
                    } else if (grandTotal <= 70 && grandTotal >= 61) {
                      grade = 'B2';
                      GlobleGrade = "B1"
                    } else if (grandTotal <= 60 && grandTotal >= 51) {
                      grade = 'C1';
                      GlobleGrade = "C1"
                    } else if (grandTotal <= 50 && grandTotal >= 41) {
                      grade = 'C2';
                      GlobleGrade = "C1"
                    } else if (grandTotal <= 40 && grandTotal >= 33) {
                      grade = 'D';
                      GlobleGrade = "D"
                    } else if (grandTotal <= 32 && grandTotal != 0) {
                      grade = 'E';
                      GlobleGrade = "E"
                    }






                    return (
                      <View style={{ flexDirection: 'row' }} key={index}>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaBlack }}>{item.subjectName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{item?.subjectMarks?.periodicTest?.obtainedMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{item?.subjectMarks?.noteBookMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{item?.subjectMarks?.seaMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{item.subjectMarks?.halfYearlyMarks?.obtainedMarks}</Text>
                          </View>
                        </View>

                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{obtainedMarks}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{anualReportData[index]?.subjectMarks?.periodicTest?.obtainedMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{anualReportData[index]?.subjectMarks?.noteBookMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{anualReportData[index]?.subjectMarks?.seaMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{anualReportData[index]?.subjectMarks?.term2YearlyMarks?.obtainedMarks}</Text>
                          </View>
                        </View>

                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{annualObtainMarks}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{grandTotal == 0 ? "" : grandTotal}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{grade}</Text>
                          </View>
                        </View>
                      </View>
                    )
                  })}
                </View>

                :
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{}}>
                      <Text style={{ backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, padding: 10 }}>SCHOLASTIC AREA</Text>
                      <View style={{ backgroundColor: userData.data.colors.mainTheme, borderTopWidth: 1, borderColor: SWATheam.SwaWhite, padding: 10, width: 150 }}>
                        <Text style={{ color: SWATheam.SwaWhite }}>Sujbect</Text>
                      </View>
                    </View>
                    <View style={{}}>
                      <Text style={{ backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, textAlign: 'center', padding: 10 }}>Half Yearly (100 Marks)</Text>
                      <View style={{ backgroundColor: userData.data.colors.mainTheme, flexDirection: 'row' }}>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Periodic Test (10)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>NoteBook (5)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>SEA (5)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Half Yearly (80)</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{}}>
                      <Text style={{ backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, padding: 10, textAlign: 'center' }}>OVERALL</Text>
                      <View style={{ backgroundColor: userData.data.colors.mainTheme, flexDirection: 'row' }}>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Total (100)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Grade</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* datapart */}
                  {subjectMarksList.map((item, index) => {
                    let grade = ""
                    let obtainedMarks = (item?.subjectMarks?.periodicTest?.obtainedMarks != undefined ? item?.subjectMarks?.periodicTest?.obtainedMarks : "") + (item?.subjectMarks?.noteBookMarks != undefined ? item?.subjectMarks?.noteBookMarks : "") + (item?.subjectMarks?.seaMarks != undefined ? item?.subjectMarks?.seaMarks : "") + (item?.subjectMarks?.halfYearlyMarks != undefined ? item?.subjectMarks?.halfYearlyMarks?.obtainedMarks : "")

                    if (obtainedMarks <= 100 && obtainedMarks >= 91) {
                      grade = 'A1';
                    } else if (obtainedMarks <= 90 && obtainedMarks >= 81) {
                      grade = 'A2';
                    } else if (obtainedMarks <= 80 && obtainedMarks >= 71) {
                      grade = 'B1';
                    } else if (obtainedMarks <= 70 && obtainedMarks >= 61) {
                      grade = 'B2';
                    } else if (obtainedMarks <= 60 && obtainedMarks >= 51) {
                      grade = 'C1';
                    } else if (obtainedMarks <= 50 && obtainedMarks >= 41) {
                      grade = 'C2';
                    } else if (obtainedMarks <= 40 && obtainedMarks >= 33) {
                      grade = 'D';
                    } else if (obtainedMarks <= 32 && obtainedMarks != 0) {
                      grade = 'E';
                      GlobleGrade = "E"
                    }




                    return (
                      <View style={{ flexDirection: 'row' }} key={index}>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaBlack }}>{item.subjectName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{item?.subjectMarks?.periodicTest?.obtainedMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{item?.subjectMarks?.noteBookMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{item?.subjectMarks?.seaMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{item.subjectMarks?.halfYearlyMarks?.obtainedMarks}</Text>
                          </View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{obtainedMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{grade}</Text>
                          </View>
                        </View>

                      </View>
                    )
                  })}
                  {/* datapart */}
                </View>
              }
            </ScrollView>
          </View>
          <View style={{ padding: 10 }}>
            <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', marginVertical: 6 }}>8 Point Grading Scale:</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <View style={{ flexDirection: 'row', width: '38%' }}>
                <Text style={{ width: 30, color: SWATheam.SwaBlack, fontWeight: '500' }}>A1</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>(91%-100%),</Text>
              </View>
              <View style={{ flexDirection: 'row', width: '58%' }}>
                <Text style={{ width: 30, color: SWATheam.SwaBlack, fontWeight: '500' }}>A2</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>(81%-90%), </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <View style={{ flexDirection: 'row', width: '38%' }}>
                <Text style={{ width: 30, color: SWATheam.SwaBlack, fontWeight: '500' }}>B1</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>(71%-80%),</Text>
              </View>
              <View style={{ flexDirection: 'row', width: '58%' }}>
                <Text style={{ width: 30, color: SWATheam.SwaBlack, fontWeight: '500' }}>B2</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>(61%-70%),</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <View style={{ flexDirection: 'row', width: '38%' }}>
                <Text style={{ width: 30, color: SWATheam.SwaBlack, fontWeight: '500' }}>C1</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>(51%-60%),</Text>
              </View>
              <View style={{ flexDirection: 'row', width: '58%' }}>
                <Text style={{ width: 30, color: SWATheam.SwaBlack, fontWeight: '500' }}>C2</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>(41%-50%),</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <View style={{ flexDirection: 'row', width: '38%' }}>
                <Text style={{ width: 30, color: SWATheam.SwaBlack, fontWeight: '500' }}>D</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>(33%-40%),</Text>
              </View>
              <View style={{ flexDirection: 'row', width: '58%' }}>
                <Text style={{ width: 30, color: SWATheam.SwaBlack, fontWeight: '500' }}>E</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>(32% or below - Needs Improvement)</Text>
              </View>
            </View>
          </View>
          <ScrollView horizontal>
            <View style={{ backgroundColor: userData.data.colors.liteTheme, paddingHorizontal: 10, paddingVertical: 4, flexDirection: 'row', justifyContent: 'space-between', }}>
              <View style={{ width: 250, flexDirection: 'row', marginVertical: 4 }}>
                <Text style={{ padding: 10, width: '60%', backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Overall</Text>
                <Text style={{ padding: 10, width: '40%', backgroundColor: SWATheam.SwaWhite, color: SWATheam.SwaBlack }}>{(reportSubIconID == 63 && testType == 5) || (userType == 5 && selectedIcon == 106) ? grandsTotalMarks : totalObtainMarks}/{totalMarks}</Text>
              </View>
              <View style={{ width: 250, flexDirection: 'row', marginVertical: 4 }}>
                <Text style={{ padding: 10, width: '60%', backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Percentage</Text>
                <Text style={{ padding: 10, width: '40%', backgroundColor: SWATheam.SwaWhite, color: SWATheam.SwaBlack }}>{(reportSubIconID == 63 && testType == 5) || (userType == 5 && selectedIcon == 106) ? grandsTotalMarks * 100 / totalMarks : totalObtainMarks * 100 / totalMarks}%</Text>
              </View>
              <View style={{ width: 250, flexDirection: 'row', marginVertical: 4 }}>
                <Text style={{ padding: 10, width: '60%', backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Grade</Text>
                <Text style={{ padding: 10, width: '40%', backgroundColor: SWATheam.SwaWhite, color: SWATheam.SwaBlack }}>{GlobleGrade}</Text>
              </View>
              <View style={{ width: 250, flexDirection: 'row', marginVertical: 4 }}>
                <Text style={{ padding: 10, width: '60%', backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Rank</Text>
                <Text style={{ padding: 10, width: '40%', backgroundColor: SWATheam.SwaWhite, color: SWATheam.SwaBlack }}></Text>
              </View>
            </View>

          </ScrollView>
          {indicatorsList[0] != undefined ?
            <View>
              <View style={{ backgroundColor: userData.data.colors.mainTheme, padding: 10 }}>
                <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, fontWeight: '500' }}>CO-SCHOLASTIC AREA</Text>
              </View>
              <ScrollView horizontal>
                <View>
                  <View style={{ backgroundColor: userData.data.colors.mainTheme, flexDirection: 'row', borderTopWidth: 1, borderColor: SWATheam.SwaWhite }}>
                    <Text style={{ width: 200, padding: 10, textAlign: 'center', borderRightWidth: 1, borderLeftWidth: 1, borderColor: SWATheam.SwaWhite, color: SWATheam.SwaWhite }}>Indicator</Text>
                    <Text style={{ width: 300, padding: 10, textAlign: 'center', borderRightWidth: 1, borderLeftWidth: 1, borderColor: SWATheam.SwaWhite, color: SWATheam.SwaWhite }}>Sub-Indicator</Text>
                    <Text style={{ width: 200, padding: 10, textAlign: 'center', borderRightWidth: 1, borderLeftWidth: 1, borderColor: SWATheam.SwaWhite, color: SWATheam.SwaWhite }}>Marks</Text>
                  </View>
                  {indicatorsList.map((value, keys) => {
                    let subIndicator = []
                    if (value?.subIndicators != undefined) {
                      Object.keys(value.subIndicators).forEach(function (key, index) {
                        subIndicator.push(value.subIndicators[key])
                      })
                    }
                    return (
                      <View style={{ flexDirection: 'row', }} key={value.mainIndicatorID}>
                        <View style={{ width: 200, padding: 10, borderWidth: 1, borderColor: SWATheam.SwaGray }}>
                          <Text style={{ color: SWATheam.SwaBlack }}>{value.mainIndicatorName != null ? value.mainIndicatorName : null}</Text>
                        </View>
                        <View style={{ width: 300, padding: 10, borderWidth: 1, borderColor: SWATheam.SwaGray }}>
                          {subIndicator[0] != undefined ?
                            <>
                              {subIndicator.map((value2, keys2) => {
                                return (
                                  <Text style={{ color: SWATheam.SwaBlack }} key={keys2}>{value2.subIndicatorName}</Text>
                                )
                              })}
                            </> : null
                          }
                        </View>
                        <View style={{ width: 200, padding: 10, borderWidth: 1, borderColor: SWATheam.SwaGray }}>
                          {subIndicator[0] != undefined ?
                            <>
                              {subIndicator.map((value3, keys3) => {
                                return (
                                  <Text style={{ color: SWATheam.SwaBlack }} key={keys3}>{value3.subIndicatorMarks}</Text>)
                              })}
                            </> :
                            <Text style={{ color: SWATheam.SwaBlack }}>{value.mainIndicatorMarks}</Text>
                          }
                        </View>
                      </View>
                    )
                  })}
                </View>
              </ScrollView>
            </View> : null
          }

          {disciplineIndicatorList[0] != undefined ?
            <View style={{ marginTop: 20 }}>
              <View style={{ backgroundColor: userData.data.colors.mainTheme, padding: 10 }}>
                <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, fontWeight: '500' }}>DISCIPLINE</Text>
              </View>
              <ScrollView horizontal>
                <View>
                  <View style={{ backgroundColor: userData.data.colors.mainTheme, flexDirection: 'row', borderTopWidth: 1, borderColor: SWATheam.SwaWhite }}>
                    <Text style={{ width: 200, padding: 10, textAlign: 'center', borderRightWidth: 1, borderLeftWidth: 1, borderColor: SWATheam.SwaWhite, color: SWATheam.SwaWhite }}>Indicator</Text>
                    <Text style={{ width: 300, padding: 10, textAlign: 'center', borderRightWidth: 1, borderLeftWidth: 1, borderColor: SWATheam.SwaWhite, color: SWATheam.SwaWhite }}>Sub-Indicator</Text>
                    <Text style={{ width: 200, padding: 10, textAlign: 'center', borderRightWidth: 1, borderLeftWidth: 1, borderColor: SWATheam.SwaWhite, color: SWATheam.SwaWhite }}>Marks</Text>
                  </View>
                  {disciplineIndicatorList[0] == undefined ?
                    <Loader /> :
                    <>
                      {disciplineIndicatorList.map((value, keys) => {
                        let subIndicator = []
                        Object.keys(value.subIndicators).forEach(function (key, index) {
                          subIndicator.push(value.subIndicators[key])
                        })
                        return (
                          <View style={{ flexDirection: 'row', }} key={value.mainIndicatorID}>
                            <View style={{ width: 200, padding: 10, borderWidth: 1, borderColor: SWATheam.SwaGray }}>
                              <Text style={{ color: SWATheam.SwaBlack }}>{value.mainIndicatorName != null ? value.mainIndicatorName : null}</Text>
                            </View>
                            <View style={{ width: 300, padding: 10, borderWidth: 1, borderColor: SWATheam.SwaGray }}>
                              {subIndicator[0] != undefined ?
                                <>
                                  {subIndicator.map((value2, keys2) => {
                                    return (
                                      <Text style={{ color: SWATheam.SwaBlack }} key={keys2}>{value2.subIndicatorName}</Text>
                                    )
                                  })}

                                </> : null
                              }
                            </View>
                            <View style={{ width: 200, padding: 10, borderWidth: 1, borderColor: SWATheam.SwaGray }}>
                              {subIndicator[0] != undefined ?
                                <>
                                  {subIndicator.map((value3, keys3) => {
                                    return (
                                      <Text style={{ color: SWATheam.SwaBlack }} key={keys3}>{value3.subIndicatorMarks}</Text>
                                    )
                                  })}

                                </> : null
                              }
                            </View>
                          </View>
                        )
                      })}
                    </>

                  }
                </View>
              </ScrollView>
            </View> : null

          }
        </ScrollView>
      }

    </View>
  )
}

export default HalfYearlyAndAnnualProgressReport

const styles = StyleSheet.create({})