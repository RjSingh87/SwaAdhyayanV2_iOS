import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import {BarChart} from "react-native-chart-kit";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BrainDominance = ({reportData, testType, type}) => {
    let data = null
    if(testType==6||type=="student"){
        data=[reportData.BD.leftPercentage, reportData.BD.rightPercentage]
    }else{
        data = [reportData.data.leftPercentage, reportData.data.rightPercentage]
    }
    return (
        <BarChart
            data={{
                labels: ["Left Brain", "Right Brain"],
                datasets: [
                    {
                        data: data,
                        colors: [
                            (opacity = 2) => `#268f9e`,
                            (opacity = 2) => `#a5050f`,
                        ]
                    }
                ]
            }}
            width={windowWidth}
            height={250}
            chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 2,
                color: (opacity = 0) => `#000`,
                barPercentage: 1
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

export default BrainDominance

const styles = StyleSheet.create({})