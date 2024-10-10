import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import {BarChart} from "react-native-chart-kit";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MultipleINtelligences = ({reportData, testType, type}) => {
    let nameList = null
    let data = null
    let graphLength = null

    if(testType==6 || type=="student"){
        nameList=reportData.MI.imTypeName
        data = reportData.MI.miPerCent
        graphLength=reportData.MI.imTypeName.length
    }else if(testType==1 || testType==2 || testType==3 || testType==4 || testType==5){
        nameList=reportData.data.imTypeName
        data =  reportData.data.miPerCent
        graphLength=reportData.data.imTypeName.length
    }else{
        nameList=reportData.data.imTypeName
        data =  reportData.data.miPerCent
        graphLength=reportData.data.imTypeName.length
    }

  
    return (
        <BarChart
            data={{
                labels: nameList,
                datasets: [
                    {
                        data: data,
                        colors: [
                            (opacity = 2) => `#a20813`,
                            (opacity = 2) => `#39cb4a`,
                            (opacity = 2) => `#220884`,
                            (opacity = 2) => `#f777ac`,
                            (opacity = 2) => `#c4d800`,
                            (opacity = 2) => `#696767`,
                            (opacity = 2) => `#76d9ff`,
                            (opacity = 2) => `#046f10`,
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
                barPercentage: 0.50
                
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

export default MultipleINtelligences

const styles = StyleSheet.create({})