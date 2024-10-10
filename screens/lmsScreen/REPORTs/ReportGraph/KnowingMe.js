import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, {useEffect} from 'react'
import {BarChart} from "react-native-chart-kit";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const KnowingMe = ({reportData, testType, type}) => {

    let data = null
    let graphLength = null
    if(testType==6 || type=="student"){
        data = reportData.KM.pdCategPercent
        graphLength = reportData.KM.pdCategoryNameList.length
    }else{
        data = reportData.data.pdCategPercent
        graphLength = reportData.data.pdCategoryNameList.length
    }

  return (
    <BarChart
    data={{
        // labels: reportData.legendList,
        datasets: [
            {
                data: data,
                colors: [
                    (opacity = 2) => `#2685cb`,
                    (opacity = 2) => `#4ad95a`,
                    (opacity = 2) => `#fec81b`,
                    (opacity = 2) => `#fd8d14`,
                    (opacity = 2) => `#ce00e6`,
                    (opacity = 2) => `#4b4ad3`,
                    (opacity = 2) => `#fc3026`,
                    (opacity = 2) => `#7db8ff`,
                ]
            }
        ]
    }}
    width={graphLength*100}
    height={200}
    chartConfig={{
        backgroundColor: "#fff",
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 2,
        color: (opacity = 0) => `#000`,
        strokeWidth: 5,
        
    }}
    
    hideLegend={true}
    withCustomBarColorFromData={true}
    flatColor={true}
    showValuesOnTopOfBars={true}
    fromZero={true}
    withInnerLines={false}
    showBarTops={false}
/>
  )
}

export default KnowingMe

const styles = StyleSheet.create({})