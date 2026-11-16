import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { LineChart } from "react-native-chart-kit";
import { SWATheam } from '../../../../constant/ConstentValue';

const screenWidth = Dimensions.get("window").width;
const SubjectWiseComHensProgReport = ({ reportData, reportSubIconID, testType }) => {
  const data = {
    labels: [],
    datasets: [
      {
        data: [],
        color: (opacity = 0) => SWATheam.SwaGreen,
        strokeWidth: 2 // optional
      }
    ],
  };

  for (i = 0; i < reportData?.data?.length; i++) {
    data.labels.push(reportData.data[i]?.getAssessmentData?.assessmentName.length > 20 ? reportData.data[i]?.getAssessmentData?.assessmentName.substring(0, 17) + '...' : reportData.data[i]?.getAssessmentData?.assessmentName)
    data.datasets[0].data.push(reportData.data[i].percentage)
  }

  return (
    <LineChart
      data={data}
      width={data.labels.length < 3 ? 350 : data.labels.length * 150}
      height={240}
      bezier
      chartConfig={
        {
          backgroundGradientFrom: "#fff",
          backgroundGradientFromOpacity: 0,
          backgroundGradientTo: "#fff",
          backgroundGradientToOpacity: 0.5,
          color: (opacity = 0) => SWATheam.SwaBlack,
          // strokeWidth: 1, // optional, default 3
          barPercentage: 0.5,
          useShadowColorFromDataset: false
        }
      }
    />
  )
}

export default SubjectWiseComHensProgReport

const styles = StyleSheet.create({})