import { StyleSheet, Text, View, Dimensions} from 'react-native'
import React from 'react'
import { ProgressChart, PieChart } from 'react-native-chart-kit'
const screenWidth = Dimensions.get("window").width;

const AllSubjectStudentComparisonReport = ({reportData}) => {
  
  const data = [
    {
      population: reportData.data.thisSection.maxMarks,
      color: "#c88cad",
    },
    {
      population: reportData.data.thisSection.minMarks,
      color: "#7fccff",
    },
    {
      population: reportData.data.userMarks.percentage,
      color: "#f49d88",
    },
    {
      population: reportData.data.allSection.maxMarks,
      color: "#94b180",
    },
    {
      population: reportData.data.allSection.minMarks,
      color: "#f1cd87",
    },
  ];
  return (
    <PieChart
    data={data}
    width={screenWidth}
    height={250}
    chartConfig={{
      backgroundGradientFrom: "#fff",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#fff",
      backgroundGradientToOpacity: 1,
      color: (opacity = 1) => `rgba(91, 24, 7, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false // optional
    }}
    accessor={"population"}
    backgroundColor={"transparent"}
    paddingLeft={"15"}
    center={[75, 0]}
    hasLegend={false}
    absolute
  />
  )
}

export default AllSubjectStudentComparisonReport

const styles = StyleSheet.create({})