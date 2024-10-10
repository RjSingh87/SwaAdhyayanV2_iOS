import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect, useContext } from 'react'
import { BarChart } from "react-native-chart-kit";
import Loader from '../../../common/Loader';
import { SwaTheam } from '../../../../constant/ConstentValue';
import { GlobleData } from '../../../../Store';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const ClassWiseReportTypeA = ({ reportData, reportSubIconID, testType}) => {

    console.log(reportData, 'reportData-4545454')
    
    let lables = []
    let data = []
    let tempColors = [];
    color=['#e93c12', '#009aff', '#911a5c', '#2e630b']
    if(reportSubIconID==63 && testType==1){
        
    }else if(reportSubIconID==63 && testType==2){
        for (i=0; i<reportData.data.length; i++){
            lables.push(reportData.data[i].assessmentName.length > 15 ? reportData.data[i].assessmentName.substring(0, 13) + '...' : reportData.data[i].assessmentName)
            let percentage = reportData.data[i].obtainedMarks*100/reportData.data[i].totalMarks
            data.push(percentage)
            if(percentage<=40){
                tempColors.push((opacity = 10) => color[0])
            }else if(percentage<=60){
                tempColors.push((opacity = 10) => color[1])
            }else{
                tempColors.push((opacity = 10) => color[2])
            }
        }
    }else if(reportSubIconID==64 && testType==1){
        for(i=0; i<reportData.data.length; i++){
            lables.push(reportData.data[i].subjectName.length > 15 ? reportData.data[i].subjectName.substring(0, 13) + '...' : reportData.data[i].subjectName)
            let percentage = reportData.data[i].percentage
            data.push(percentage)
            if(percentage<=40){
                tempColors.push((opacity = 10) => color[0])
            }else if(percentage<=60){
                tempColors.push((opacity = 10) => color[1])
            }else{
                tempColors.push((opacity = 10) => color[2])
            }
        }


    }else if(reportSubIconID==64 && testType==2){
        for(i=0; i<reportData.data.length; i++){
            lables.push(reportData.data[i].chapterName.length > 15 ? reportData.data[i].chapterName.substring(0, 13) + '...' : reportData.data[i].subjectName)
            let percentage = reportData.data[i].percentage
            data.push(percentage)
            if(percentage<=40){
                tempColors.push((opacity = 10) => color[0])
            }else if(percentage<=60){
                tempColors.push((opacity = 10) => color[1])
            }else{
                tempColors.push((opacity = 10) => color[2])
            }
        }

    }
    else{
        if(reportData?.data?.percentageData==undefined){
            if(reportData.data.gradesData == undefined){
                for (i = 0; i < reportData.data.length; i++) {
                    lables.push(reportData.data[i].subjectName.length > 15 ? reportData.data[i].subjectName.substring(0, 13) + '...' : reportData.data[i].subjectName)
                    data.push(reportData.data[i].percentage)
                    if(reportData.data[i].percentage<=40){
                        tempColors.push((opacity = 10) => color[0])
                    }else if(reportData.data[i].percentage>40 && reportData.data[i].percentage<=60){
                        tempColors.push((opacity = 10) => color[1])
                    }else{
                        tempColors.push((opacity = 10) => color[2])
                    }
                }
            }else{
                let dataIndex = 0;
                for( const[key,value] of Object.entries(reportData.data.gradesData)){
                    if( dataIndex == 0 || dataIndex == 1 ) {
                        tempColors.push((opacity = 10) => color[0])
                    } else if( dataIndex == 2 || dataIndex == 3 ) {
                        tempColors.push((opacity = 10) => color[1])
                    } else if( dataIndex == 3 || dataIndex == 4 ) {
                        tempColors.push((opacity = 10) => color[2])
                    } else if( dataIndex == 4 || dataIndex == 5 ) {
                        tempColors.push((opacity = 10) => color[4])
                    }            
                    lables.push(key)
                    data.push(value)
                }}
        }else{
            let dataIndex = 0;
            for( const[key,value] of Object.entries(reportData.data.percentageData)){
                if( dataIndex == 0 || dataIndex == 1 ) {
                    tempColors.push((opacity = 10) => color[0])
                } else if( dataIndex == 2 || dataIndex == 3 ) {
                    tempColors.push((opacity = 10) => color[1])
                } else if( dataIndex == 3 || dataIndex == 4 ) {
                    tempColors.push((opacity = 10) => color[2])
                } else if( dataIndex == 4 || dataIndex == 5 ) {
                    tempColors.push((opacity = 10) => color[4])
                }            
                lables.push(key)
                data.push(value)
                dataIndex++
            }
        }
    }

    return (
        <BarChart
        data={{
            labels: lables,
            datasets: [
                {
                    data: data,
                    colors: tempColors
                }
            ]
        }}
        width={lables.length>3?lables.length * 120: 350}
        height={200}
        chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2,
            color: (opacity = 0) => `#000`,
            strokeWidth: 5,
            decimalPlaces: 0 
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

export default ClassWiseReportTypeA

const styles = StyleSheet.create({})