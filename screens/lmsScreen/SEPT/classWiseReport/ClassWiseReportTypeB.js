import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'

import SubjectWiseStudentComparisionReport from './classWiseReportTypeB_graph.js/SubjectWiseStudentComparisionReport';
import AllSubjectStudentComparisonReport from './classWiseReportTypeB_graph.js/AllSubjectStudentComparisonReport';

const screenWidth = Dimensions.get("window").width;
const ClassWiseReportTypeB = ({ reportData, reportSubIconID, testType, subIcon }) => {

  return (
    <>
      {reportSubIconID == 62 && (testType == 5 || testType == 7) || subIcon == 103 || subIcon == 104 || subIcon == 102 ?
        <SubjectWiseStudentComparisionReport reportData={reportData} reportSubIconID={reportSubIconID} testType={testType} subIcon={subIcon} />
        : reportSubIconID == 62 && testType == 6 ?
          <AllSubjectStudentComparisonReport reportData={reportData} /> : null
      }
    </>
  )
}
export default ClassWiseReportTypeB
const styles = StyleSheet.create({})