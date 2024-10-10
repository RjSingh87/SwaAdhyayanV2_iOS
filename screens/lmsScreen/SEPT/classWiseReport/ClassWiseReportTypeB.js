import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { ProgressChart, PieChart } from 'react-native-chart-kit'
import SubjectWiseStudentComparisionReport from './classWiseReportTypeB_graph.js/SubjectWiseStudentComparisionReport';
import AllSubjectStudentComparisonReport from './classWiseReportTypeB_graph.js/AllSubjectStudentComparisonReport';

const screenWidth = Dimensions.get("window").width;
const ClassWiseReportTypeB = ({ reportData, reportSubIconID, testType}) => {
  
  return (
    <>
    {reportSubIconID==62 && (testType == 5 || testType==7)?
    <SubjectWiseStudentComparisionReport reportData={reportData} reportSubIconID={reportSubIconID} testType={testType}/>
    :reportSubIconID==62 && testType == 6?
    <AllSubjectStudentComparisonReport reportData={reportData}/>:null
    }
    </>
  )
}
export default ClassWiseReportTypeB
const styles = StyleSheet.create({})