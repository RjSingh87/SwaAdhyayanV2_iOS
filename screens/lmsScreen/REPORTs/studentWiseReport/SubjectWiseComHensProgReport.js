import { StyleSheet, Text, View, Dimensions  } from 'react-native'
import React from 'react'
import { LineChart } from "react-native-chart-kit";
import { SwaTheam } from '../../../../constant/ConstentValue';

const screenWidth = Dimensions.get("window").width;

const SubjectWiseComHensProgReport = ({reportData, reportSubIconID, testType}) => {

  console.log(JSON.stringify(reportData), 'reportData')
  
  
  const data = {
    labels: [],
    datasets: [
      {
        data: [],
        color: (opacity = 0) => SwaTheam.SwaGreen,
        strokeWidth: 2 // optional
      }
    ],
  };

  for(i=0; i<reportData?.data?.length;i++){
    console.log(reportData.data[i].assessmentName, 'assessmentName ')
    data.labels.push(reportData.data[i].assessmentName.length>20?reportData.data[i].assessmentName.substring(0, 17) + '...':reportData.data[i].assessmentName)
    data.datasets[0].data.push(reportData.data[i].percentage)
  }

  return (
   <LineChart
      data={data}
      width={data.labels.length*150}
      height={240}
      bezier
      chartConfig={
        {
          backgroundGradientFrom: "#fff",
          backgroundGradientFromOpacity: 0,
          backgroundGradientTo: "#fff",
          backgroundGradientToOpacity: 0.5,
          color: (opacity = 0) => SwaTheam.SwaBlack,
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