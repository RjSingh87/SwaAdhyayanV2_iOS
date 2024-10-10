import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { PieChart, ProgressChart } from "react-native-chart-kit";
import Loader from '../../../common/Loader';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AcademicProficiency = ({reportData, testType, type}) => {
    let totalPercentage = 0
    if(testType==6 || type=="student"){
        totalPercentage = reportData?.APP?.totalPercentage
    }else{
        totalPercentage = reportData?.data?.totalPercentage
    }
    return (
        <>
        {!reportData.status?
        <Loader/>:
        <ProgressChart
            data={{
                data: [totalPercentage / 100]
            }}
            width={windowWidth}
            height={200}
            strokeWidth={30}
            radius={70}
            chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 2,
                color: (opacity = 0) => totalPercentage < 41 ? `rgba(233, 60, 18, ${opacity * 2})` : totalPercentage >= 41 && totalPercentage <= 60 ? `rgba(0, 154, 255, ${opacity * 2})` : totalPercentage >= 61 && totalPercentage <= 80 ? `rgba(145, 26, 92, ${opacity * 2})` : `rgba(46, 99, 11, ${opacity * 2})`,
            }}
            hideLegend={true}
        />
        }
        </>
    )
}

export default AcademicProficiency

const styles = StyleSheet.create({})