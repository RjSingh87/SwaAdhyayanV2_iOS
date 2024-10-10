import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { StackedBarChart } from "react-native-chart-kit";
import { SwaTheam } from '../../../../constant/ConstentValue';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MultipleBarGroupGraph = ({reportData, reportSubIconID, testType}) =>{
    const data = {
        labels: [],
        data: [],
        barColors: ["#009aff", "#911a5c", "#2e630b"]
      };
    for(i=0;i<reportData?.data?.length;i++){
        data.labels.push( reportData.data[i].subjectName )
        const tempArray = [];
        for( const val in reportData.data[i].percentage ) {
            tempArray.push( reportData.data[i].percentage[val] );
        }
        data.data.push( tempArray );
    }
      
  return (
    <StackedBarChart
        data={data}
        width={windowWidth}
        height={220}
        chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    decimalPlaces: 2,
                    color: (opacity = 0) => SwaTheam.SwaBlack,
                    strokeWidth: 5,
                    decimalPlaces: 0 

                }}
                withVerticalLabels={true}
/>

  )
}

export default MultipleBarGroupGraph

const styles = StyleSheet.create({})