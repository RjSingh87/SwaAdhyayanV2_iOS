import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, {useContext} from 'react'
import {BarChart} from "react-native-chart-kit";
import Loader from '../../../common/Loader';
import { GlobleData } from '../../../../Store';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LearningStyle = ({reportData, testType}) => {
    const {userData} = useContext(GlobleData)
    
    let reportLables = null
    let data = null
    if(testType==6||userData.data.userTypeID == 5){
        reportLables=reportData?.LS?.imData?.avkNames
        data = reportData?.LS?.imData?.avkPercent
    }else{
        reportLables=reportData.data.imData.avkNames
        data = reportData.data.imData.avkPercent
    }
    
    
    
    return (
        <>{!reportData.status?
        <Loader/>:
        <BarChart
            data={{
                labels: reportLables,
                datasets: [
                    {
                        data: data,
                        colors: [
                            (opacity = 10) => `#a20813`,
                            (opacity = 10) => `#39cb4a`,
                            (opacity = 10) => `#220884`,    
                        ]
                    }
                ]
            }}
            width={windowWidth}
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
        }
        </>
    )
}

export default LearningStyle

const styles = StyleSheet.create({})